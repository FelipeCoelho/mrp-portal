import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstadoService } from '../../services/estado.service';
import { Estado, REGIOES } from '../../models/estado.model';

@Component({
  selector: 'app-estado',
  imports: [FormsModule],
  templateUrl: './estado.html',
  styleUrl: './estado.css',
})
export class EstadoComponent {
  private service = inject(EstadoService);

  readonly regioes = REGIOES;
  readonly estados = this.service.lista;
  readonly agrupados = this.service.agrupados;

  filtroRegiao = signal('');

  estadosFiltrados = computed(() => {
    const filtro = this.filtroRegiao();
    return filtro
      ? this.estados().filter((e) => e.regiao === filtro)
      : this.estados();
  });

  editandoId = signal<number | null>(null);
  form = signal({ nome: '', sigla: '', regiao: '' });
  mostrarForm = signal(false);

  novoEstado(): void {
    this.editandoId.set(null);
    this.form.set({ nome: '', sigla: '', regiao: '' });
    this.mostrarForm.set(true);
  }

  editar(estado: Estado): void {
    this.editandoId.set(estado.id);
    this.form.set({ nome: estado.nome, sigla: estado.sigla, regiao: estado.regiao });
    this.mostrarForm.set(true);
  }

  salvar(): void {
    const { nome, sigla, regiao } = this.form();
    if (!nome || !sigla || !regiao) return;

    const id = this.editandoId();
    if (id !== null) {
      this.service.atualizar(id, { nome, sigla, regiao });
    } else {
      this.service.adicionar({ nome, sigla, regiao });
    }
    this.cancelar();
  }

  remover(id: number): void {
    if (confirm('Deseja realmente remover este estado?')) {
      this.service.remover(id);
    }
  }

  cancelar(): void {
    this.mostrarForm.set(false);
    this.editandoId.set(null);
    this.form.set({ nome: '', sigla: '', regiao: '' });
  }

  updateForm(field: 'nome' | 'sigla' | 'regiao', value: string): void {
    this.form.update((f) => ({ ...f, [field]: value }));
  }
}
