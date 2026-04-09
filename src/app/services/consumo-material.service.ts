import { Injectable, signal, computed } from '@angular/core';
import { ConsumoMaterial } from '../models/consumo-material.model';

@Injectable({ providedIn: 'root' })
export class ConsumoMaterialService {
  private itens = signal<ConsumoMaterial[]>([]);
  private nextId = signal(1);

  readonly lista = computed(() => this.itens().map((item) => this.calcularCampos(item)));

  adicionar(item: Omit<ConsumoMaterial, 'id'>): void {
    const id = this.nextId();
    this.itens.update((list) => [...list, { ...item, id }]);
    this.nextId.update((n) => n + 1);
  }

  atualizar(id: number, dados: Omit<ConsumoMaterial, 'id'>): void {
    this.itens.update((list) =>
      list.map((item) => (item.id === id ? { ...dados, id } : item))
    );
  }

  remover(id: number): void {
    this.itens.update((list) => list.filter((item) => item.id !== id));
  }

  buscarPorId(id: number): ConsumoMaterial | undefined {
    const item = this.itens().find((i) => i.id === id);
    return item ? this.calcularCampos(item) : undefined;
  }

  private calcularCampos(item: ConsumoMaterial): ConsumoMaterial {
    // Preço Fábrica sem Repasse = Preço Fábrica – (Preço Fábrica * (Repasse / 100))
    const precoFabricaSemRepasse = item.precoFabrica - (item.precoFabrica * (item.repasse / 100));

    // Consumo Médio Diário = Demanda do mês atual / 30
    const consumoMedioDiario = item.demandaMesAtual / 30;

    // Venda Média do Estoque em Consignação = (3meses + 2meses + ultimoMes) / 3
    const vendaMediaEstoqueConsignacao =
      (item.demandaConsignado3Meses + item.demandaConsignado2Meses + item.demandaConsignadoUltimoMes) / 3;

    // Qtde Falta Vender = max(0, Forecast – Demanda do Mês atual)
    const qtdeFaltaVender = Math.max(0, item.forecast - item.demandaMesAtual);

    // Venda Real Projetada = Demanda do Mês atual / (dias úteis do mês * dias úteis faltantes)
    const { diasUteisMes, diasUteisFaltantes } = this.calcularDiasUteis();
    const vendaRealProjetada =
      diasUteisMes > 0 && diasUteisFaltantes > 0
        ? item.demandaMesAtual / (diasUteisMes * diasUteisFaltantes)
        : 0;

    // Variação Forecast/Venda Real = (Demanda do Mês atual / Forecast) * 100, arredondado 2 casas
    const variacaoForecastVendaReal =
      item.forecast > 0
        ? Math.round((item.demandaMesAtual / item.forecast) * 10000) / 100
        : 0;

    // Valor Total Líquido = Proposta * Preço Líquido
    const valorTotalLiquido = item.proposta * item.precoLiquido;

    return {
      ...item,
      precoFabricaSemRepasse,
      consumoMedioDiario,
      vendaMediaEstoqueConsignacao,
      qtdeFaltaVender,
      vendaRealProjetada,
      variacaoForecastVendaReal,
      valorTotalLiquido,
    };
  }

  private calcularDiasUteis(): { diasUteisMes: number; diasUteisFaltantes: number } {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    // Feriados nacionais fixos (mês 0-indexed)
    const feriadosNacionais = [
      { mes: 0, dia: 1 },   // Confraternização Universal
      { mes: 3, dia: 21 },  // Tiradentes
      { mes: 4, dia: 1 },   // Dia do Trabalho
      { mes: 8, dia: 7 },   // Independência
      { mes: 9, dia: 12 },  // Nossa Sra. Aparecida
      { mes: 10, dia: 2 },  // Finados
      { mes: 10, dia: 15 }, // Proclamação da República
      { mes: 11, dia: 25 }, // Natal
    ];

    const ehFeriado = (d: Date): boolean =>
      feriadosNacionais.some((f) => f.mes === d.getMonth() && f.dia === d.getDate());

    const ehDiaUtil = (d: Date): boolean => {
      const dow = d.getDay();
      return dow !== 0 && dow !== 6 && !ehFeriado(d);
    };

    let diasUteisMes = 0;
    let diasUteisFaltantes = 0;

    for (let dia = 1; dia <= ultimoDia; dia++) {
      const d = new Date(ano, mes, dia);
      if (ehDiaUtil(d)) {
        diasUteisMes++;
        if (dia > hoje.getDate()) {
          diasUteisFaltantes++;
        }
      }
    }

    return { diasUteisMes, diasUteisFaltantes };
  }
}
