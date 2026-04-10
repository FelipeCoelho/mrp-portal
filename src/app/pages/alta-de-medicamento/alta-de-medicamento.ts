import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AltaDeMedicamentoService } from '../../services/alta-de-medicamento.service';
import { AltaMedicamento } from '../../models/alta-de-medicamento.model';

interface AltaForm {
  codigoMaterial: string;
  nivel: string;
}

const FORM_VAZIO: AltaForm = { codigoMaterial: '', nivel: '' };

@Component({
  selector: 'app-alta-de-medicamentos',
  imports: [FormsModule],
  templateUrl: './alta-de-medicamento.html',
  styleUrl: './alta-de-medicamento.css',
})
export class AltaDeMedicamentoComponent {
  private service = inject(AltaDeMedicamentoService);

  readonly itens = this.service.lista;
  readonly materiaisDisponiveis = this.service.materiaisDisponiveis;
  readonly niveis = this.service.niveis;

  filtroBusca = signal('');

  itensFiltrados = computed(() => {
    const busca = this.filtroBusca().toLowerCase().trim();
    if (!busca) return this.itens();
    return this.itens().filter(
      (i) =>
        i.codigoMaterial.toLowerCase().includes(busca) ||
        i.nomeMaterial.toLowerCase().includes(busca),
    );
  });

  editandoId = signal<number | null>(null);
  form = signal<AltaForm>({ ...FORM_VAZIO });
  mostrarForm = signal(false);
  erros = signal<string[]>([]);

  novo(): void {
    this.editandoId.set(null);
    this.form.set({ ...FORM_VAZIO });
    this.erros.set([]);
    this.mostrarForm.set(true);
  }

  editar(item: AltaMedicamento): void {
    this.editandoId.set(item.id);
    this.form.set({ codigoMaterial: item.codigoMaterial, nivel: item.nivel });
    this.erros.set([]);
    this.mostrarForm.set(true);
  }

  salvar(): void {
    const f = this.form();
    const erros: string[] = [];
    if (!f.codigoMaterial) erros.push('Selecione um material.');
    if (!f.nivel) erros.push('Selecione um nível.');
    if (erros.length) { this.erros.set(erros); return; }

    const mat = this.materiaisDisponiveis.find((m) => m.codigo === f.codigoMaterial);
    const dados: Omit<AltaMedicamento, 'id'> = {
      codigoMaterial: f.codigoMaterial,
      nomeMaterial: mat ? `${mat.codigo} - ${mat.nome}` : f.codigoMaterial,
      nivel: f.nivel,
    };

    const id = this.editandoId();
    if (id !== null) {
      this.service.atualizar(id, dados);
    } else {
      this.service.adicionar(dados);
    }
    this.cancelar();
  }

  remover(id: number): void {
    if (confirm('Deseja realmente remover esta alta?')) {
      this.service.remover(id);
    }
  }

  cancelar(): void {
    this.mostrarForm.set(false);
    this.editandoId.set(null);
    this.form.set({ ...FORM_VAZIO });
    this.erros.set([]);
  }

  updateForm<K extends keyof AltaForm>(field: K, value: AltaForm[K]): void {
    this.form.update((f) => ({ ...f, [field]: value }));
  }

  // === Upload em Massa ===
  mostrarUpload = signal(false);
  arquivoSelecionado = signal<File | null>(null);

  abrirUpload(): void {
    this.arquivoSelecionado.set(null);
    this.mostrarUpload.set(true);
  }

  fecharUpload(): void {
    this.mostrarUpload.set(false);
    this.arquivoSelecionado.set(null);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.arquivoSelecionado.set(input.files[0]);
    }
  }

  baixarModelo(): void {
    // Simula download de modelo
    const csv = 'CODIGO_MATERIAL;NIVEL\n100830;Nível 1\n107904;Nível 2';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_alta_medicamentos.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  fazerUpload(): void {
    const arquivo = this.arquivoSelecionado();
    if (!arquivo) {
      alert('Selecione um arquivo antes de fazer o upload.');
      return;
    }
    // Simula processamento do arquivo
    alert(`Arquivo "${arquivo.name}" enviado com sucesso. Os registros serão processados.`);
    this.fecharUpload();
  }
}
