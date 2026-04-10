import { Injectable, signal } from '@angular/core';
import { CentroDistribuicao, CDS_INICIAIS } from '../models/centro-de-distribuicao.model';

@Injectable({ providedIn: 'root' })
export class CentroDeDistribuicaoService {
  private cds = signal<CentroDistribuicao[]>([...CDS_INICIAIS]);
  private nextId = signal(CDS_INICIAIS.length + 1);

  readonly lista = this.cds.asReadonly();

  adicionar(dados: Omit<CentroDistribuicao, 'id'>): void {
    const id = this.nextId();
    this.cds.update((list) => [...list, { ...dados, id }]);
    this.nextId.update((n) => n + 1);
  }

  atualizar(id: number, dados: Omit<CentroDistribuicao, 'id'>): void {
    this.cds.update((list) => list.map((c) => (c.id === id ? { ...dados, id } : c)));
  }

  desativar(id: number): void {
    this.cds.update((list) => list.map((c) => (c.id === id ? { ...c, ativo: false } : c)));
  }
}
