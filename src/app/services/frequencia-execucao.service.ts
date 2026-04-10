import { Injectable, signal } from '@angular/core';
import { FrequenciaExecucao } from '../models/frequencia-execucao.model';

@Injectable({ providedIn: 'root' })
export class FrequenciaExecucaoService {
  private configs = signal<FrequenciaExecucao[]>([]);
  private nextId = signal(1);

  readonly lista = this.configs.asReadonly();

  salvar(dados: Omit<FrequenciaExecucao, 'id'>): number {
    const id = this.nextId();
    this.configs.update((list) => [...list, { ...dados, id }]);
    this.nextId.update((n) => n + 1);
    return id;
  }

  atualizar(id: number, dados: Omit<FrequenciaExecucao, 'id'>): void {
    this.configs.update((list) => list.map((c) => (c.id === id ? { ...dados, id } : c)));
  }

  remover(id: number): void {
    this.configs.update((list) => list.filter((c) => c.id !== id));
  }
}
