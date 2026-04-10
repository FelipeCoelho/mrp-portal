import { Injectable, signal } from '@angular/core';
import { MrpLayout, MrpRegistro, TODAS_COLUNAS } from '../models/calculo-mrp.model';

@Injectable({ providedIn: 'root' })
export class CalculoMrpService {
  private nextId = signal(2);

  layouts = signal<MrpLayout[]>([
    {
      id: 1,
      nome: 'Teste Junior',
      descricao: 'Layout padrão para análise MRP',
      tipo: 'pessoal',
      padrao: true,
      colunas: TODAS_COLUNAS.map((c) => c.id),
    },
  ]);

  layoutAtivo = signal<MrpLayout | null>(null);

  registros = signal<MrpRegistro[]>([
    {
      codigoMaterial: '100234', descricaoMaterial: 'CLEXANE 40MG SOL INJ 0,4ML',
      codigoCd: 'SP34', descCd: 'CD Campinas', codigoFornecedor: 'F001', descFornecedor: 'Sanofi',
      bandeiraCmr: 'Bandeira A', curva: 'A', quantidadeSugerida: 150, quantidadeProposta: 150,
      precoFabricaSemRepasse: 45.30, precoLiquido: 38.50, precoFabricaSemRepasseEst: 44.80, precoLiquidoEst: 37.90,
      qtdReporSemConsignado: 120, qtdReporComConsignado: 180, estoqueTotalLivre: 500, estoqueTotal: 650,
      rsEstoqueTotal: 25025.00, saldoBloqueado: 30, diasEstoqueLivre: 22, diasEstoqueConsignacao: 35,
      diasEstoqueSimulado: 40, estoqueProjetadoSemConsig: 620, diasEstoqueProjetadoSemConsig: 28,
      estoqueProjetadoComConsig: 800, diasEstoqueProjetadoComConsig: 36,
      premissaAcatada: 'Material/CD', statusEstoqueSegAtual: 'OK', statusEstoqueSegProjetada: 'OK',
      qtdMaxEstoqueAtual: 'Dentro', qtdMaxEstoqueProjetada: 'Dentro',
      riscoFalta30: 'Baixo', riscoFalta60: 'Baixo', leadTimeTotal: 15, consignado: 'Não',
    },
    {
      codigoMaterial: '100567', descricaoMaterial: 'LASIX 20MG/2ML SOL INJ',
      codigoCd: 'RJ12', descCd: 'CD Rio de Janeiro', codigoFornecedor: 'F002', descFornecedor: 'Sanofi',
      bandeiraCmr: 'Bandeira B', curva: 'B', quantidadeSugerida: 300, quantidadeProposta: 280,
      precoFabricaSemRepasse: 12.80, precoLiquido: 10.50, precoFabricaSemRepasseEst: 12.50, precoLiquidoEst: 10.20,
      qtdReporSemConsignado: 250, qtdReporComConsignado: 320, estoqueTotalLivre: 1200, estoqueTotal: 1400,
      rsEstoqueTotal: 14700.00, saldoBloqueado: 50, diasEstoqueLivre: 45, diasEstoqueConsignacao: 55,
      diasEstoqueSimulado: 60, estoqueProjetadoSemConsig: 1450, diasEstoqueProjetadoSemConsig: 50,
      estoqueProjetadoComConsig: 1720, diasEstoqueProjetadoComConsig: 58,
      premissaAcatada: 'CD', statusEstoqueSegAtual: 'OK', statusEstoqueSegProjetada: 'OK',
      qtdMaxEstoqueAtual: 'Dentro', qtdMaxEstoqueProjetada: 'Dentro',
      riscoFalta30: 'Baixo', riscoFalta60: 'Baixo', leadTimeTotal: 10, consignado: 'Sim',
    },
    {
      codigoMaterial: '107904', descricaoMaterial: 'DYSPORT 500U PO LIOF INJ',
      codigoCd: 'SP34', descCd: 'CD Campinas', codigoFornecedor: 'F003', descFornecedor: 'Ipsen',
      bandeiraCmr: 'Bandeira A', curva: 'A', quantidadeSugerida: 50, quantidadeProposta: 50,
      precoFabricaSemRepasse: 1850.00, precoLiquido: 1620.00, precoFabricaSemRepasseEst: 1840.00, precoLiquidoEst: 1610.00,
      qtdReporSemConsignado: 40, qtdReporComConsignado: 55, estoqueTotalLivre: 80, estoqueTotal: 95,
      rsEstoqueTotal: 153900.00, saldoBloqueado: 5, diasEstoqueLivre: 18, diasEstoqueConsignacao: 22,
      diasEstoqueSimulado: 25, estoqueProjetadoSemConsig: 120, diasEstoqueProjetadoSemConsig: 27,
      estoqueProjetadoComConsig: 150, diasEstoqueProjetadoComConsig: 34,
      premissaAcatada: 'Material/CD', statusEstoqueSegAtual: 'Abaixo', statusEstoqueSegProjetada: 'OK',
      qtdMaxEstoqueAtual: 'Dentro', qtdMaxEstoqueProjetada: 'Dentro',
      riscoFalta30: 'Alto', riscoFalta60: 'Alto', leadTimeTotal: 25, consignado: 'Não',
    },
    {
      codigoMaterial: '108001', descricaoMaterial: 'KEYTRUDA 100MG/4ML SOL INJ',
      codigoCd: 'MG05', descCd: 'CD Belo Horizonte', codigoFornecedor: 'F004', descFornecedor: 'MSD',
      bandeiraCmr: 'Bandeira C', curva: 'A', quantidadeSugerida: 20, quantidadeProposta: 20,
      precoFabricaSemRepasse: 12500.00, precoLiquido: 11200.00, precoFabricaSemRepasseEst: 12480.00, precoLiquidoEst: 11180.00,
      qtdReporSemConsignado: 15, qtdReporComConsignado: 22, estoqueTotalLivre: 35, estoqueTotal: 42,
      rsEstoqueTotal: 470400.00, saldoBloqueado: 2, diasEstoqueLivre: 30, diasEstoqueConsignacao: 38,
      diasEstoqueSimulado: 42, estoqueProjetadoSemConsig: 50, diasEstoqueProjetadoSemConsig: 43,
      estoqueProjetadoComConsig: 62, diasEstoqueProjetadoComConsig: 53,
      premissaAcatada: 'Fornecedor/CD', statusEstoqueSegAtual: 'OK', statusEstoqueSegProjetada: 'OK',
      qtdMaxEstoqueAtual: 'Dentro', qtdMaxEstoqueProjetada: 'Acima',
      riscoFalta30: 'Baixo', riscoFalta60: 'Médio', leadTimeTotal: 30, consignado: 'Não',
    },
    {
      codigoMaterial: '108120', descricaoMaterial: 'ANSENTRON 8MG/4ML SOL INJ',
      codigoCd: 'SP34', descCd: 'CD Campinas', codigoFornecedor: 'F005', descFornecedor: 'Blau Farmacêutica',
      bandeiraCmr: 'Bandeira A', curva: 'B', quantidadeSugerida: 400, quantidadeProposta: 380,
      precoFabricaSemRepasse: 28.50, precoLiquido: 24.00, precoFabricaSemRepasseEst: 28.20, precoLiquidoEst: 23.70,
      qtdReporSemConsignado: 350, qtdReporComConsignado: 420, estoqueTotalLivre: 900, estoqueTotal: 1050,
      rsEstoqueTotal: 25200.00, saldoBloqueado: 40, diasEstoqueLivre: 32, diasEstoqueConsignacao: 42,
      diasEstoqueSimulado: 48, estoqueProjetadoSemConsig: 1250, diasEstoqueProjetadoSemConsig: 45,
      estoqueProjetadoComConsig: 1470, diasEstoqueProjetadoComConsig: 52,
      premissaAcatada: 'Material', statusEstoqueSegAtual: 'OK', statusEstoqueSegProjetada: 'OK',
      qtdMaxEstoqueAtual: 'Dentro', qtdMaxEstoqueProjetada: 'Dentro',
      riscoFalta30: 'Baixo', riscoFalta60: 'Baixo', leadTimeTotal: 8, consignado: 'Sim',
    },
    {
      codigoMaterial: '108250', descricaoMaterial: 'AVASTIN 400MG/16ML SOL INJ',
      codigoCd: 'RJ12', descCd: 'CD Rio de Janeiro', codigoFornecedor: 'F006', descFornecedor: 'Roche',
      bandeiraCmr: 'Bandeira B', curva: 'A', quantidadeSugerida: 30, quantidadeProposta: 30,
      precoFabricaSemRepasse: 4800.00, precoLiquido: 4200.00, precoFabricaSemRepasseEst: 4780.00, precoLiquidoEst: 4180.00,
      qtdReporSemConsignado: 25, qtdReporComConsignado: 35, estoqueTotalLivre: 60, estoqueTotal: 72,
      rsEstoqueTotal: 302400.00, saldoBloqueado: 3, diasEstoqueLivre: 25, diasEstoqueConsignacao: 32,
      diasEstoqueSimulado: 36, estoqueProjetadoSemConsig: 85, diasEstoqueProjetadoSemConsig: 35,
      estoqueProjetadoComConsig: 107, diasEstoqueProjetadoComConsig: 44,
      premissaAcatada: 'Fornecedor', statusEstoqueSegAtual: 'OK', statusEstoqueSegProjetada: 'OK',
      qtdMaxEstoqueAtual: 'Dentro', qtdMaxEstoqueProjetada: 'Dentro',
      riscoFalta30: 'Médio', riscoFalta60: 'Baixo', leadTimeTotal: 20, consignado: 'Não',
    },
    {
      codigoMaterial: '108400', descricaoMaterial: 'HERCEPTIN 440MG PO LIOF INJ',
      codigoCd: 'MG05', descCd: 'CD Belo Horizonte', codigoFornecedor: 'F006', descFornecedor: 'Roche',
      bandeiraCmr: 'Bandeira C', curva: 'A', quantidadeSugerida: 15, quantidadeProposta: 15,
      precoFabricaSemRepasse: 8900.00, precoLiquido: 7800.00, precoFabricaSemRepasseEst: 8880.00, precoLiquidoEst: 7780.00,
      qtdReporSemConsignado: 12, qtdReporComConsignado: 18, estoqueTotalLivre: 28, estoqueTotal: 33,
      rsEstoqueTotal: 257400.00, saldoBloqueado: 2, diasEstoqueLivre: 20, diasEstoqueConsignacao: 28,
      diasEstoqueSimulado: 32, estoqueProjetadoSemConsig: 40, diasEstoqueProjetadoSemConsig: 29,
      estoqueProjetadoComConsig: 51, diasEstoqueProjetadoComConsig: 37,
      premissaAcatada: 'Material/CD', statusEstoqueSegAtual: 'Abaixo', statusEstoqueSegProjetada: 'OK',
      qtdMaxEstoqueAtual: 'Dentro', qtdMaxEstoqueProjetada: 'Dentro',
      riscoFalta30: 'Alto', riscoFalta60: 'Médio', leadTimeTotal: 22, consignado: 'Não',
    },
    {
      codigoMaterial: '108550', descricaoMaterial: 'OPDIVO 100MG/10ML SOL INJ',
      codigoCd: 'SP34', descCd: 'CD Campinas', codigoFornecedor: 'F007', descFornecedor: 'Bristol-Myers Squibb',
      bandeiraCmr: 'Bandeira A', curva: 'A', quantidadeSugerida: 25, quantidadeProposta: 22,
      precoFabricaSemRepasse: 9500.00, precoLiquido: 8400.00, precoFabricaSemRepasseEst: 9480.00, precoLiquidoEst: 8380.00,
      qtdReporSemConsignado: 20, qtdReporComConsignado: 28, estoqueTotalLivre: 45, estoqueTotal: 55,
      rsEstoqueTotal: 462000.00, saldoBloqueado: 3, diasEstoqueLivre: 24, diasEstoqueConsignacao: 30,
      diasEstoqueSimulado: 34, estoqueProjetadoSemConsig: 65, diasEstoqueProjetadoSemConsig: 35,
      estoqueProjetadoComConsig: 83, diasEstoqueProjetadoComConsig: 45,
      premissaAcatada: 'CD', statusEstoqueSegAtual: 'OK', statusEstoqueSegProjetada: 'OK',
      qtdMaxEstoqueAtual: 'Dentro', qtdMaxEstoqueProjetada: 'Dentro',
      riscoFalta30: 'Baixo', riscoFalta60: 'Baixo', leadTimeTotal: 18, consignado: 'Sim',
    },
    {
      codigoMaterial: '108700', descricaoMaterial: 'REVLIMID 25MG CAPS',
      codigoCd: 'RJ12', descCd: 'CD Rio de Janeiro', codigoFornecedor: 'F008', descFornecedor: 'Celgene',
      bandeiraCmr: 'Bandeira B', curva: 'B', quantidadeSugerida: 60, quantidadeProposta: 55,
      precoFabricaSemRepasse: 3200.00, precoLiquido: 2850.00, precoFabricaSemRepasseEst: 3180.00, precoLiquidoEst: 2830.00,
      qtdReporSemConsignado: 50, qtdReporComConsignado: 65, estoqueTotalLivre: 110, estoqueTotal: 130,
      rsEstoqueTotal: 370500.00, saldoBloqueado: 8, diasEstoqueLivre: 35, diasEstoqueConsignacao: 45,
      diasEstoqueSimulado: 50, estoqueProjetadoSemConsig: 160, diasEstoqueProjetadoSemConsig: 52,
      estoqueProjetadoComConsig: 195, diasEstoqueProjetadoComConsig: 63,
      premissaAcatada: 'Bandeira GMR', statusEstoqueSegAtual: 'OK', statusEstoqueSegProjetada: 'OK',
      qtdMaxEstoqueAtual: 'Dentro', qtdMaxEstoqueProjetada: 'Acima',
      riscoFalta30: 'Baixo', riscoFalta60: 'Baixo', leadTimeTotal: 12, consignado: 'Não',
    },
  ]);

  constructor() {
    this.layoutAtivo.set(this.layouts()[0]);
  }

  adicionarLayout(layout: Omit<MrpLayout, 'id'>): MrpLayout {
    const id = this.nextId();
    const novo: MrpLayout = { ...layout, id };
    this.layouts.update((list) => [...list, novo]);
    this.nextId.update((n) => n + 1);
    return novo;
  }

  removerLayout(id: number): void {
    this.layouts.update((list) => list.filter((l) => l.id !== id));
    if (this.layoutAtivo()?.id === id) {
      this.layoutAtivo.set(this.layouts()[0] ?? null);
    }
  }

  duplicarLayout(id: number): MrpLayout | null {
    const original = this.layouts().find((l) => l.id === id);
    if (!original) return null;
    return this.adicionarLayout({
      nome: original.nome + ' (cópia)',
      descricao: original.descricao,
      tipo: original.tipo,
      padrao: false,
      colunas: [...original.colunas],
    });
  }

  setLayoutAtivo(id: number): void {
    const layout = this.layouts().find((l) => l.id === id);
    if (layout) this.layoutAtivo.set(layout);
  }

  salvarLayout(id: number, dados: Partial<MrpLayout>): void {
    this.layouts.update((list) =>
      list.map((l) => (l.id === id ? { ...l, ...dados } : l)),
    );
    if (this.layoutAtivo()?.id === id) {
      const atualizado = this.layouts().find((l) => l.id === id);
      if (atualizado) this.layoutAtivo.set(atualizado);
    }
  }
}
