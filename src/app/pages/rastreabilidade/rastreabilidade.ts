import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RastreabilidadeService } from '../../services/rastreabilidade.service';
import { Rastreabilidade } from '../../models/rastreabilidade.model';

interface RastreabilidadeForm {
  descricao: string;
}

const FORM_VAZIO: RastreabilidadeForm = { descricao: '' };

@Component({
  selector: 'app-rastreabilidade',
  imports: [FormsModule],
  templateUrl: './rastreabilidade.html',
  styleUrl: './rastreabilidade.css',
})
export class RastreabilidadeComponent {
  private service = inject(RastreabilidadeService);

  readonly registros = this.service.lista;

  editandoId = signal<number | null>(null);
  form = signal<RastreabilidadeForm>({ ...FORM_VAZIO });
  mostrarForm = signal(false);
  erros = signal<string[]>([]);

  novo(): void {
    this.editandoId.set(null);
    this.form.set({ ...FORM_VAZIO });
    this.erros.set([]);
    this.mostrarForm.set(true);
  }

  editar(registro: Rastreabilidade): void {
    this.editandoId.set(registro.id);
    this.form.set({ descricao: registro.descricao });
    this.erros.set([]);
    this.mostrarForm.set(true);
  }

  salvar(): void {
    const f = this.form();
    const erros: string[] = [];

    if (!f.descricao.trim()) {
      erros.push('Descrição é obrigatória.');
    }

    if (erros.length > 0) {
      this.erros.set(erros);
      return;
    }

    const id = this.editandoId();
    if (id !== null) {
      this.service.atualizar(id, f.descricao.trim());
    } else {
      this.service.adicionar(f.descricao.trim());
    }
    this.cancelar();
  }

  remover(id: number): void {
    if (confirm('Deseja realmente remover este registro?')) {
      this.service.remover(id);
    }
  }

  cancelar(): void {
    this.mostrarForm.set(false);
    this.editandoId.set(null);
    this.form.set({ ...FORM_VAZIO });
    this.erros.set([]);
  }

  updateForm(field: keyof RastreabilidadeForm, value: string): void {
    this.form.update((f) => ({ ...f, [field]: value }));
  }
}
