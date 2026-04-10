import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CentroDeDistribuicaoService } from '../../services/centro-de-distribuicao.service';
import {
  CentroDistribuicao,
  TIPOS_IDENTIFICACAO,
  TIPOS_PEDIDO,
  CODIGOS_CD,
  TipoIdentificacao,
  TipoPedido,
} from '../../models/centro-de-distribuicao.model';

interface CDForm {
  codigo: string;
  tipoPedido: TipoPedido | '';
  tipoIdentificacao: TipoIdentificacao | '';
}

const FORM_VAZIO: CDForm = { codigo: '', tipoPedido: '', tipoIdentificacao: '' };

@Component({
  selector: 'app-centro-de-distribuicao',
  imports: [FormsModule],
  templateUrl: './centro-de-distribuicao.html',
  styleUrl: './centro-de-distribuicao.css',
})
export class CentroDeDistribuicaoComponent {
  private service = inject(CentroDeDistribuicaoService);

  readonly cds = this.service.lista;
  readonly tiposIdentificacao = TIPOS_IDENTIFICACAO;
  readonly tiposPedido = TIPOS_PEDIDO;
  readonly codigosCd = CODIGOS_CD;

  filtroCodigo = signal('');
  filtroTipo = signal('');
  filtroStatus = signal('');
  visao = signal<'cards' | 'tabela'>('cards');

  cdsFiltrados = computed(() => {
    let lista = this.cds();
    const codigo = this.filtroCodigo().toLowerCase().trim();
    const tipo = this.filtroTipo();
    const status = this.filtroStatus();
    if (codigo) lista = lista.filter((c) => c.codigo.toLowerCase().includes(codigo));
    if (tipo) lista = lista.filter((c) => c.tipoIdentificacao === tipo);
    if (status === 'ativo') lista = lista.filter((c) => c.ativo);
    else if (status === 'inativo') lista = lista.filter((c) => !c.ativo);
    return lista;
  });

  // Form state
  editandoId = signal<number | null>(null);
  form = signal<CDForm>({ ...FORM_VAZIO });
  mostrarForm = signal(false);
  erros = signal<string[]>([]);
  cdsConsumidorSelecionados = signal<string[]>([]);
  cdsEstoqueSelecionados = signal<string[]>([]);

  novo(): void {
    this.editandoId.set(null);
    this.form.set({ ...FORM_VAZIO });
    this.erros.set([]);
    this.cdsConsumidorSelecionados.set([]);
    this.cdsEstoqueSelecionados.set([]);
    this.mostrarForm.set(true);
  }

  editar(cd: CentroDistribuicao): void {
    this.editandoId.set(cd.id);
    this.form.set({ codigo: cd.codigo, tipoPedido: cd.tipoPedido, tipoIdentificacao: cd.tipoIdentificacao });
    this.cdsConsumidorSelecionados.set([...cd.cdsConsumidor]);
    this.cdsEstoqueSelecionados.set([...cd.cdsEstoqueAdicional]);
    this.erros.set([]);
    this.mostrarForm.set(true);
  }

  salvar(): void {
    const f = this.form();
    const erros: string[] = [];
    if (!f.codigo) erros.push('Código CD é obrigatório.');
    if (!f.tipoPedido) erros.push('Tipo de Pedido é obrigatório.');
    if (!f.tipoIdentificacao) erros.push('Identificação do CD é obrigatória.');
    if (this.cdsConsumidorSelecionados().length === 0) erros.push('Selecione ao menos um CD Consumidor.');
    if (this.cdsEstoqueSelecionados().length === 0) erros.push('Selecione ao menos um CD Estoque Adicional.');
    if (erros.length) { this.erros.set(erros); return; }

    const dados: Omit<CentroDistribuicao, 'id'> = {
      codigo: f.codigo,
      tipoPedido: f.tipoPedido as TipoPedido,
      tipoIdentificacao: f.tipoIdentificacao as TipoIdentificacao,
      cdsConsumidor: [...this.cdsConsumidorSelecionados()],
      cdsEstoqueAdicional: [...this.cdsEstoqueSelecionados()],
      ativo: true,
    };

    const id = this.editandoId();
    if (id !== null) {
      const existing = this.cds().find((c) => c.id === id);
      this.service.atualizar(id, { ...dados, ativo: existing?.ativo ?? true });
    } else {
      this.service.adicionar(dados);
    }
    this.cancelar();
  }

  desativar(id: number): void {
    if (confirm('Deseja realmente desativar este CD?')) {
      this.service.desativar(id);
    }
  }

  cancelar(): void {
    this.mostrarForm.set(false);
    this.editandoId.set(null);
    this.form.set({ ...FORM_VAZIO });
    this.erros.set([]);
    this.cdsConsumidorSelecionados.set([]);
    this.cdsEstoqueSelecionados.set([]);
  }

  updateForm<K extends keyof CDForm>(field: K, value: CDForm[K]): void {
    this.form.update((f) => ({ ...f, [field]: value }));
  }

  toggleCdConsumidor(codigo: string): void {
    this.cdsConsumidorSelecionados.update((l) =>
      l.includes(codigo) ? l.filter((c) => c !== codigo) : [...l, codigo],
    );
  }

  toggleCdEstoque(codigo: string): void {
    this.cdsEstoqueSelecionados.update((l) =>
      l.includes(codigo) ? l.filter((c) => c !== codigo) : [...l, codigo],
    );
  }

  isCdConsumidor(codigo: string): boolean {
    return this.cdsConsumidorSelecionados().includes(codigo);
  }

  isCdEstoque(codigo: string): boolean {
    return this.cdsEstoqueSelecionados().includes(codigo);
  }
}
