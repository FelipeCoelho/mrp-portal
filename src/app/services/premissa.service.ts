import { Injectable, signal } from '@angular/core';
import { Premissa } from '../models/premissa.model';

@Injectable({ providedIn: 'root' })
export class PremissaService {
  private premissas = signal<Premissa[]>([]);
  private nextId = signal(1);

  readonly lista = this.premissas.asReadonly();

  adicionar(dados: Omit<Premissa, 'id' | 'ativo' | 'criadoEm' | 'criadoPor'>): number {
    const id = this.nextId();
    const agora = new Date();
    this.premissas.update((list) => [...list, {
      ...dados, id, ativo: true,
      criadoEm: agora.toLocaleDateString('pt-BR'),
      criadoPor: 'Usuário Demo',
    }]);
    this.nextId.update((n) => n + 1);
    return id;
  }

  atualizar(id: number, dados: Partial<Premissa>): void {
    this.premissas.update((list) => list.map((p) => (p.id === id ? { ...p, ...dados } : p)));
  }

  desativar(id: number): void {
    this.premissas.update((list) => list.map((p) => (p.id === id ? { ...p, ativo: false } : p)));
  }
}
