import { Injectable, signal } from '@angular/core';
import { Rastreabilidade } from '../models/rastreabilidade.model';

@Injectable({ providedIn: 'root' })
export class RastreabilidadeService {
  private registros = signal<Rastreabilidade[]>([]);
  private nextId = signal(1);

  readonly lista = this.registros.asReadonly();

  private getUsuarioLogado(): string {
    return 'Usuário Logado';
  }

  adicionar(descricao: string): void {
    const agora = new Date();
    const registro: Rastreabilidade = {
      id: this.nextId(),
      descricao,
      dataCriacao: agora.toLocaleDateString('pt-BR'),
      horarioCriacao: agora.toLocaleTimeString('pt-BR'),
      usuarioCriacao: this.getUsuarioLogado(),
    };
    this.registros.update((list) => [...list, registro]);
    this.nextId.update((n) => n + 1);
  }

  atualizar(id: number, descricao: string): void {
    const agora = new Date();
    this.registros.update((list) =>
      list.map((r) =>
        r.id === id
          ? {
              ...r,
              descricao,
              dataAlteracao: agora.toLocaleDateString('pt-BR'),
              horarioAlteracao: agora.toLocaleTimeString('pt-BR'),
              usuarioAlteracao: this.getUsuarioLogado(),
            }
          : r
      )
    );
  }

  remover(id: number): void {
    this.registros.update((list) => list.filter((r) => r.id !== id));
  }

  buscarPorId(id: number): Rastreabilidade | undefined {
    return this.registros().find((r) => r.id === id);
  }
}
