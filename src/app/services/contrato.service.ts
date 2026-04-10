import { Injectable, signal } from '@angular/core';
import { Contrato, MaterialContrato, Rastreabilidade } from '../models/contrato.model';

@Injectable({ providedIn: 'root' })
export class ContratoService {
  private contratos = signal<Contrato[]>([]);
  private nextId = signal(1);

  readonly lista = this.contratos.asReadonly();

  readonly clientesValidos = [
    { codigo: 'CLI001', nome: 'Empresa ABC Ltda' },
    { codigo: 'CLI002', nome: 'Centro Oncológico Prontobaby' },
    { codigo: 'CLI003', nome: 'Hospital São Lucas' },
    { codigo: 'CLI004', nome: 'Clínica Vida Nova' },
    { codigo: 'CLI005', nome: 'Farmácia Central' },
  ];

  readonly materiaisValidos = [
    { codigo: '100830', nome: 'CLEXANE 40MG 10SP 0,4ML+SIST SEG' },
    { codigo: '101990', nome: 'LASIX C/S AMP 2ML' },
    { codigo: '107528', nome: 'DYSPORT 500 UI CX C/ 1 FR AMP' },
    { codigo: '107904', nome: 'KEYTRUDA 100MG/4ML SOL INJ X 4ML' },
    { codigo: '108130', nome: 'ANSENTRON 8 MG CX AMP 4ML' },
    { codigo: '109200', nome: 'AVASTIN 400MG/16ML SOL INJ' },
    { codigo: '110050', nome: 'HERCEPTIN 440MG PO LIOF INJ' },
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
      usuarioCriacao: 'Usuário Demo',
    };
  }

  private atualizarRastreabilidade(r: Rastreabilidade): Rastreabilidade {
    const agora = new Date();
    return {
      ...r,
      dataAlteracao: agora.toLocaleDateString('pt-BR'),
      horarioAlteracao: agora.toLocaleTimeString('pt-BR'),
      usuarioAlteracao: 'Usuário Demo',
    };
  }

  adicionar(dados: {
    inicioVigencia: string;
    fimVigencia: string;
    codigoClienteSap: string;
    materiais: MaterialContrato[];
  }): number {
    const id = this.nextId();
    const contrato: Contrato = {
      id,
      inicioVigencia: dados.inicioVigencia,
      fimVigencia: dados.fimVigencia,
      codigoClienteSap: dados.codigoClienteSap,
      materiais: dados.materiais,
      ativo: true,
      rastreabilidade: this.criarRastreabilidade(),
    };
    this.contratos.update((list) => [...list, contrato]);
    this.nextId.update((n) => n + 1);
    return id;
  }

  atualizar(id: number, dados: {
    inicioVigencia: string;
    fimVigencia: string;
    codigoClienteSap: string;
    materiais: MaterialContrato[];
  }): void {
    this.contratos.update((list) =>
      list.map((c) =>
        c.id === id
          ? { ...c, ...dados, rastreabilidade: this.atualizarRastreabilidade(c.rastreabilidade) }
          : c,
      ),
    );
  }

  desativar(id: number): void {
    this.contratos.update((list) =>
      list.map((c) =>
        c.id === id
          ? { ...c, ativo: false, rastreabilidade: this.atualizarRastreabilidade(c.rastreabilidade) }
          : c,
      ),
    );
  }

  remover(id: number): void {
    this.contratos.update((list) => list.filter((c) => c.id !== id));
  }

  buscarPorId(id: number): Contrato | undefined {
    return this.contratos().find((c) => c.id === id);
  }
}
