import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContratoService } from '../../services/contrato.service';
import { Contrato, MESES } from '../../models/contrato.model';

interface ContratoForm {
  inicioVigencia: string;
  fimVigencia: string;
  codigoClienteSap: string;
  codigoMaterialSap: string;
}

interface ConsumoForm {
  ano: number | null;
  mes: number | null;
  quantidade: number | null;
}

const FORM_VAZIO: ContratoForm = {
  inicioVigencia: '',
  fimVigencia: '',
  codigoClienteSap: '',
  codigoMaterialSap: '',
};

const CONSUMO_FORM_VAZIO: ConsumoForm = { ano: null, mes: null, quantidade: null };

@Component({
  selector: 'app-contrato',
  imports: [FormsModule],
  templateUrl: './contrato.html',
  styleUrl: './contrato.css',
})
export class ContratoComponent {
  private service = inject(ContratoService);

  readonly contratos = this.service.lista;
  readonly meses = MESES;
  readonly clientesValidos = this.service.clientesValidos;
  readonly materiaisValidos = this.service.materiaisValidos;

  editandoId = signal<number | null>(null);
  form = signal<ContratoForm>({ ...FORM_VAZIO });
  mostrarForm = signal(false);
  erros = signal<string[]>([]);

  // Sub-tela de consumos
  contratoSelecionadoId = signal<number | null>(null);
  consumoForm = signal<ConsumoForm>({ ...CONSUMO_FORM_VAZIO });
  mostrarConsumos = signal(false);

  contratoSelecionado = () => {
    const id = this.contratoSelecionadoId();
    return id !== null ? this.service.buscarPorId(id) : undefined;
  };

  novo(): void {
    this.editandoId.set(null);
    this.form.set({ ...FORM_VAZIO });
    this.erros.set([]);
    this.mostrarForm.set(true);
  }

  editar(contrato: Contrato): void {
    this.editandoId.set(contrato.id);
    this.form.set({
      inicioVigencia: contrato.inicioVigencia,
      fimVigencia: contrato.fimVigencia,
      codigoClienteSap: contrato.codigoClienteSap,
      codigoMaterialSap: contrato.codigoMaterialSap,
    });
    this.erros.set([]);
    this.mostrarForm.set(true);
  }

  salvar(): void {
    const f = this.form();
    const erros: string[] = [];

    if (!f.inicioVigencia) erros.push('Início da Vigência é obrigatório.');
    if (!f.fimVigencia) erros.push('Fim da Vigência é obrigatório.');

    if (f.inicioVigencia && isNaN(Date.parse(f.inicioVigencia))) {
      erros.push('Início da Vigência não é uma data válida.');
    }
    if (f.fimVigencia && isNaN(Date.parse(f.fimVigencia))) {
      erros.push('Fim da Vigência não é uma data válida.');
    }

    if (f.inicioVigencia && f.fimVigencia && new Date(f.fimVigencia) <= new Date(f.inicioVigencia)) {
      erros.push('Fim da Vigência deve ser posterior ao Início da Vigência.');
    }

    if (!f.codigoClienteSap) {
      erros.push('Código do Cliente SAP/TOVS é obrigatório.');
    } else if (!this.service.validarCliente(f.codigoClienteSap)) {
      erros.push('Código do Cliente SAP/TOVS inválido.');
    }

    if (!f.codigoMaterialSap) {
      erros.push('Código do Material SAP/KRAFT é obrigatório.');
    } else if (!this.service.validarMaterial(f.codigoMaterialSap)) {
      erros.push('Código do Material SAP/KRAFT inválido.');
    }

    if (erros.length > 0) {
      this.erros.set(erros);
      return;
    }

    // Validação de vigência > 3 meses
    if (this.service.validarVigenciaMaior3Meses(f.inicioVigencia, f.fimVigencia)) {
      if (!confirm('Data Fim da Vigência maior de 3 Meses. Deseja continuar?')) {
        return;
      }
    }

    const dados = {
      inicioVigencia: f.inicioVigencia,
      fimVigencia: f.fimVigencia,
      codigoClienteSap: f.codigoClienteSap,
      codigoMaterialSap: f.codigoMaterialSap,
    };

    const id = this.editandoId();
    if (id !== null) {
      this.service.atualizar(id, dados);
    } else {
      const novoId = this.service.adicionar(dados);
      this.abrirConsumos(novoId);
    }
    this.cancelar();
  }

  remover(id: number): void {
    if (confirm('Deseja realmente remover este contrato?')) {
      this.service.remover(id);
      if (this.contratoSelecionadoId() === id) {
        this.fecharConsumos();
      }
    }
  }

  cancelar(): void {
    this.mostrarForm.set(false);
    this.editandoId.set(null);
    this.form.set({ ...FORM_VAZIO });
    this.erros.set([]);
  }

  updateForm<K extends keyof ContratoForm>(field: K, value: ContratoForm[K]): void {
    this.form.update((f) => ({ ...f, [field]: value }));
  }

  // Sub-tela consumos
  abrirConsumos(contratoId: number): void {
    this.contratoSelecionadoId.set(contratoId);
    this.consumoForm.set({ ...CONSUMO_FORM_VAZIO });
    this.mostrarConsumos.set(true);
  }

  fecharConsumos(): void {
    this.mostrarConsumos.set(false);
    this.contratoSelecionadoId.set(null);
    this.consumoForm.set({ ...CONSUMO_FORM_VAZIO });
  }

  adicionarConsumo(): void {
    const f = this.consumoForm();
    const contratoId = this.contratoSelecionadoId();
    if (contratoId === null || !f.ano || !f.mes || !f.quantidade) return;

    this.service.adicionarConsumo(contratoId, {
      ano: f.ano,
      mes: f.mes,
      quantidade: f.quantidade,
    });
    this.consumoForm.set({ ...CONSUMO_FORM_VAZIO });
  }

  removerConsumo(consumoId: number): void {
    const contratoId = this.contratoSelecionadoId();
    if (contratoId === null) return;
    this.service.removerConsumo(contratoId, consumoId);
  }

  getNomeMes(mes: number): string {
    return MESES.find((m) => m.valor === mes)?.nome ?? '';
  }

  updateConsumoForm<K extends keyof ConsumoForm>(field: K, value: ConsumoForm[K]): void {
    this.consumoForm.update((f) => ({ ...f, [field]: value }));
  }

  getNomeCliente(codigo: string): string {
    return this.clientesValidos.find((c) => c.codigo === codigo)?.nome ?? codigo;
  }

  getNomeMaterial(codigo: string): string {
    return this.materiaisValidos.find((m) => m.codigo === codigo)?.nome ?? codigo;
  }
}
