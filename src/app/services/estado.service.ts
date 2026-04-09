import { Injectable, signal, computed } from '@angular/core';
import { Estado, ESTADOS_INICIAIS } from '../models/estado.model';

@Injectable({ providedIn: 'root' })
export class EstadoService {
  private estados = signal<Estado[]>([...ESTADOS_INICIAIS]);
  private nextId = signal(ESTADOS_INICIAIS.length + 1);

  readonly lista = this.estados.asReadonly();

  readonly agrupados = computed(() => {
    const map = new Map<string, Estado[]>();
    for (const e of this.estados()) {
      const arr = map.get(e.regiao) ?? [];
      arr.push(e);
      map.set(e.regiao, arr);
    }
    return map;
  });

  adicionar(estado: Omit<Estado, 'id'>): void {
    const id = this.nextId();
    this.estados.update((list) => [...list, { ...estado, id }]);
    this.nextId.update((n) => n + 1);
  }

  atualizar(id: number, dados: Omit<Estado, 'id'>): void {
    this.estados.update((list) =>
      list.map((e) => (e.id === id ? { ...dados, id } : e))
    );
  }

  remover(id: number): void {
    this.estados.update((list) => list.filter((e) => e.id !== id));
  }

  buscarPorId(id: number): Estado | undefined {
    return this.estados().find((e) => e.id === id);
  }
}
