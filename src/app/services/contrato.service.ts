import { Injectable, signal } from '@angular/core';
import { Contrato, ConsumoMensal, Rastreabilidade } from '../models/contrato.model';

@Injectable({ providedIn: 'root' })
export class ContratoService {
  private contratos = signal<Contrato[]>([]);
  private nextId = signal(1);
  private nextConsumoId = signal(1);

  readonly lista = this.contratos.asReadonly();

  // Simulação de clientes válidos SAP/TOVS
  readonly clientesValidos = [
    { codigo: 'CLI001', nome: 'Cliente Alpha' },
    { codigo: 'CLI002', nome: 'Cliente Beta' },
    { codigo: 'CLI003', nome: 'Cliente Gamma' },
    { codigo: 'CLI004', nome: 'Cliente Delta' },
    { codigo: 'CLI005', nome: 'Cliente Epsilon' },
  ];

  // Simulação de materiais válidos SAP/KRAFT
  readonly materiaisValidos = [
    { codigo: 'MAT001', nome: 'Material A' },
    { codigo: 'MAT002', nome: 'Material B' },
    { codigo: 'MAT003', nome: 'Material C' },
    { codigo: 'MAT004', nome: 'Material D' },
    { codigo: 'MAT005', nome: 'Material E' },
  ];

  validarCliente(codigo: string): boolean {
    return this.clientesValidos.some((c) => c.codigo === codigo);
  }

  validarMaterial(codigo: string): boolean {
    return this.materiaisValidos.some((m) => m.codigo === codigo);
  }

  validarVigenciaMaior3Meses(inicio: string, fim: string): boolean {
    const dtInicio = new Date(inicio);
    const dtFim = new Date(fim);
    const limite = new Date(dtInicio);
    limite.setMonth(limite.getMonth() + 3);
    return dtFim > limite;
  }

  private criarRastreabilidade(): Rastreabilidade {
    const agora = new Date();
    return {
      dataCriacao: agora.toLocaleDateString('pt-BR'),
      horarioCriacao: agora.toLocaleTimeString('pt-BR'),
      usuarioCriacao: 'Usuário Logado',
    };
  }

  private atualizarRastreabilidade(rastreabilidade: Rastreabilidade): Rastreabilidade {
    const agora = new Date();
    return {
      ...rastreabilidade,
      dataAlteracao: agora.toLocaleDateString('pt-BR'),
      horarioAlteracao: agora.toLocaleTimeString('pt-BR'),
      usuarioAlteracao: 'Usuário Logado',
    };
  }

  adicionar(dados: Omit<Contrato, 'id' | 'consumosMensais' | 'rastreabilidade'>): number {
    const id = this.nextId();
    const contrato: Contrato = {
      ...dados,
      id,
      consumosMensais: [],
      rastreabilidade: this.criarRastreabilidade(),
    };
    this.contratos.update((list) => [...list, contrato]);
    this.nextId.update((n) => n + 1);
    return id;
  }

  atualizar(id: number, dados: Omit<Contrato, 'id' | 'consumosMensais' | 'rastreabilidade'>): void {
    this.contratos.update((list) =>
      list.map((c) =>
        c.id === id
          ? { ...c, ...dados, rastreabilidade: this.atualizarRastreabilidade(c.rastreabilidade) }
          : c
      )
    );
  }

  remover(id: number): void {
    this.contratos.update((list) => list.filter((c) => c.id !== id));
  }

  buscarPorId(id: number): Contrato | undefined {
    return this.contratos().find((c) => c.id === id);
  }

  // Consumos mensais
  adicionarConsumo(contratoId: number, dados: Omit<ConsumoMensal, 'id'>): void {
    const consumoId = this.nextConsumoId();
    this.contratos.update((list) =>
      list.map((c) =>
        c.id === contratoId
          ? {
              ...c,
              consumosMensais: [...c.consumosMensais, { ...dados, id: consumoId }],
              rastreabilidade: this.atualizarRastreabilidade(c.rastreabilidade),
            }
          : c
      )
    );
    this.nextConsumoId.update((n) => n + 1);
  }

  removerConsumo(contratoId: number, consumoId: number): void {
    this.contratos.update((list) =>
      list.map((c) =>
        c.id === contratoId
          ? {
              ...c,
              consumosMensais: c.consumosMensais.filter((cm) => cm.id !== consumoId),
              rastreabilidade: this.atualizarRastreabilidade(c.rastreabilidade),
            }
          : c
      )
    );
  }
}
