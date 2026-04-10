import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalculoMrpService } from '../../services/calculo-mrp.service';
import { MrpLayout, MrpColuna, MrpRegistro, GRUPOS_COLUNAS, TODAS_COLUNAS } from '../../models/calculo-mrp.model';

@Component({
  selector: 'app-calculo-mrp',
  imports: [FormsModule],
  templateUrl: './calculo-mrp.html',
  styleUrl: './calculo-mrp.css',
})
export class CalculoMrpComponent {
  readonly service = inject(CalculoMrpService);
  readonly gruposColunas = GRUPOS_COLUNAS;
  readonly todasColunas = TODAS_COLUNAS;

  /* UI state signals */
  mostrarFiltros = signal(false);
  mostrarLayoutModal = signal(false);
  mostrarCriarLayout = signal(false);
  mostrarConfigurarColunas = signal(false);
  mostrarSalvarLayout = signal(false);
  filtroBusca = signal('');
  visao = signal<'materialCd' | 'material'>('materialCd');

  /* Layout creation wizard */
  criarEtapa = signal(1);
  criarAPartirModelo = signal(false);
  novoLayoutNome = signal('');
  novoLayoutDescricao = signal('');
  novoLayoutTipo = signal<'pessoal' | 'publico'>('pessoal');
  novoLayoutPadrao = signal(false);

  /* Column configuration */
  colunasDisponiveis = signal<MrpColuna[]>(TODAS_COLUNAS.map((c) => ({ ...c })));
  colunasOrdenadas = signal<MrpColuna[]>(TODAS_COLUNAS.filter((c) => c.visivel).map((c) => ({ ...c })));
  gruposExpandidos = signal<Record<string, boolean>>(
    GRUPOS_COLUNAS.reduce((acc, g) => ({ ...acc, [g.grupo]: true }), {} as Record<string, boolean>),
  );
  buscaColuna = signal('');

  /* Save layout modal */
  salvarAbaSelecionada = signal<'atualizar' | 'novo'>('atualizar');
  salvarNome = signal('');
  salvarDescricao = signal('');
  salvarTipo = signal<'pessoal' | 'publico'>('pessoal');
  salvarPadrao = signal(false);

  /* Filters */
  filtroAreaMrp = signal('');
  filtroCds = signal<string[]>([]);
  filtroTipoFornecedor = signal<string[]>([]);
  filtroMateriais = signal<string[]>([]);
  filtroBandeira = signal('');
  filtroFornecedores = signal<string[]>([]);
  filtroConsignadoSim = signal(false);
  filtroConsignadoNao = signal(false);
  filtroCurvas = signal<string[]>([]);
  filtroLoteCompra = signal('');
  filtroSaldoFornecedor = signal<string[]>([]);
  filtroBuscaMaterial = signal('');
  filtroBuscaFornecedor = signal('');

  /* Selection */
  registrosSelecionados = signal<Set<string>>(new Set());
  todosSelecionados = signal(false);

  /* Drag state */
  dragIndex = signal<number | null>(null);

  /* Computed */
  colunasFiltradasConfig = computed(() => {
    const busca = this.buscaColuna().toLowerCase();
    if (!busca) return this.gruposColunas;
    return this.gruposColunas
      .map((g) => ({
        ...g,
        colunas: g.colunas.filter((c) => c.nome.toLowerCase().includes(busca) || c.id.toLowerCase().includes(busca)),
      }))
      .filter((g) => g.colunas.length > 0);
  });

  totalColunasSelec = computed(() => this.colunasOrdenadas().length);

  registrosFiltrados = computed(() => {
    const busca = this.filtroBusca().toLowerCase();
    let lista = this.service.registros();
    if (busca) {
      lista = lista.filter(
        (r) =>
          r.codigoMaterial.toLowerCase().includes(busca) ||
          r.descricaoMaterial.toLowerCase().includes(busca) ||
          r.codigoFornecedor.toLowerCase().includes(busca) ||
          r.descFornecedor.toLowerCase().includes(busca),
      );
    }
    if (this.filtroConsignadoSim() && !this.filtroConsignadoNao()) {
      lista = lista.filter((r) => r.consignado === 'Sim');
    } else if (this.filtroConsignadoNao() && !this.filtroConsignadoSim()) {
      lista = lista.filter((r) => r.consignado !== 'Sim');
    }
    if (this.filtroCurvas().length > 0) {
      lista = lista.filter((r) => this.filtroCurvas().includes(r.curva));
    }
    return lista;
  });

  hasChanges = computed(() => {
    const ativo = this.service.layoutAtivo();
    if (!ativo) return false;
    const colunasAtuais = this.colunasOrdenadas().map((c) => c.id);
    return JSON.stringify(colunasAtuais) !== JSON.stringify(ativo.colunas);
  });

  /* Layout modal actions */
  abrirLayoutModal(): void {
    this.mostrarLayoutModal.set(true);
  }

  fecharLayoutModal(): void {
    this.mostrarLayoutModal.set(false);
  }

  abrirCriarLayout(): void {
    this.mostrarLayoutModal.set(false);
    this.criarEtapa.set(1);
    this.novoLayoutNome.set('');
    this.novoLayoutDescricao.set('');
    this.novoLayoutTipo.set('pessoal');
    this.novoLayoutPadrao.set(false);
    this.criarAPartirModelo.set(false);
    this.mostrarCriarLayout.set(true);
  }

  fecharCriarLayout(): void {
    this.mostrarCriarLayout.set(false);
  }

  proximaEtapa(): void {
    if (!this.novoLayoutNome()) return;
    this.criarEtapa.set(2);
    this.colunasDisponiveis.set(TODAS_COLUNAS.map((c) => ({ ...c })));
    this.colunasOrdenadas.set(TODAS_COLUNAS.filter((c) => c.visivel).map((c) => ({ ...c })));
  }

  voltarEtapa(): void {
    this.criarEtapa.set(1);
  }

  salvarNovoLayout(): void {
    const colunas = this.colunasOrdenadas().map((c) => c.id);
    this.service.adicionarLayout({
      nome: this.novoLayoutNome(),
      descricao: this.novoLayoutDescricao(),
      tipo: this.novoLayoutTipo(),
      padrao: this.novoLayoutPadrao(),
      colunas,
    });
    this.mostrarCriarLayout.set(false);
  }

  /* Column configuration */
  abrirConfigurarColunas(): void {
    const ativo = this.service.layoutAtivo();
    if (ativo) {
      const cols = ativo.colunas
        .map((id) => TODAS_COLUNAS.find((c) => c.id === id))
        .filter((c): c is MrpColuna => !!c);
      this.colunasOrdenadas.set(cols.map((c) => ({ ...c })));
    }
    this.mostrarConfigurarColunas.set(true);
  }

  fecharConfigurarColunas(): void {
    this.mostrarConfigurarColunas.set(false);
  }

  toggleGrupo(grupo: string): void {
    this.gruposExpandidos.update((g) => ({ ...g, [grupo]: !g[grupo] }));
  }

  isGrupoExpandido(grupo: string): boolean {
    return this.gruposExpandidos()[grupo] ?? false;
  }

  isColunaSelecionada(id: string): boolean {
    return this.colunasOrdenadas().some((c) => c.id === id);
  }

  toggleColuna(coluna: MrpColuna): void {
    if (this.isColunaSelecionada(coluna.id)) {
      this.colunasOrdenadas.update((list) => list.filter((c) => c.id !== coluna.id));
    } else {
      this.colunasOrdenadas.update((list) => [...list, { ...coluna }]);
    }
  }

  marcarTodosGrupo(grupo: { grupo: string; colunas: MrpColuna[] }): void {
    const ids = grupo.colunas.map((c) => c.id);
    const jaTemTodos = ids.every((id) => this.isColunaSelecionada(id));
    if (jaTemTodos) {
      this.colunasOrdenadas.update((list) => list.filter((c) => !ids.includes(c.id)));
    } else {
      const novas = grupo.colunas.filter((c) => !this.isColunaSelecionada(c.id));
      this.colunasOrdenadas.update((list) => [...list, ...novas.map((c) => ({ ...c }))]);
    }
  }

  removerColunaOrdenada(index: number): void {
    this.colunasOrdenadas.update((list) => list.filter((_, i) => i !== index));
  }

  salvarConfigColunas(): void {
    const ativo = this.service.layoutAtivo();
    if (ativo) {
      this.service.salvarLayout(ativo.id, { colunas: this.colunasOrdenadas().map((c) => c.id) });
    }
    this.mostrarConfigurarColunas.set(false);
  }

  /* Drag and drop for column order */
  onDragStart(index: number): void {
    this.dragIndex.set(index);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(targetIndex: number): void {
    const from = this.dragIndex();
    if (from === null || from === targetIndex) return;
    this.colunasOrdenadas.update((list) => {
      const copy = [...list];
      const [item] = copy.splice(from, 1);
      copy.splice(targetIndex, 0, item);
      return copy;
    });
    this.dragIndex.set(null);
  }

  /* Save layout modal */
  abrirSalvarLayout(): void {
    const ativo = this.service.layoutAtivo();
    if (ativo) {
      this.salvarNome.set(ativo.nome);
      this.salvarDescricao.set(ativo.descricao);
      this.salvarTipo.set(ativo.tipo);
      this.salvarPadrao.set(ativo.padrao);
    }
    this.salvarAbaSelecionada.set('atualizar');
    this.mostrarSalvarLayout.set(true);
  }

  fecharSalvarLayout(): void {
    this.mostrarSalvarLayout.set(false);
  }

  salvarLayoutAtualizar(): void {
    const ativo = this.service.layoutAtivo();
    if (ativo) {
      this.service.salvarLayout(ativo.id, {
        nome: this.salvarNome(),
        descricao: this.salvarDescricao(),
        tipo: this.salvarTipo(),
        padrao: this.salvarPadrao(),
        colunas: this.colunasOrdenadas().map((c) => c.id),
      });
    }
    this.mostrarSalvarLayout.set(false);
  }

  salvarLayoutComoNovo(): void {
    const colunas = this.colunasOrdenadas().map((c) => c.id);
    this.service.adicionarLayout({
      nome: this.salvarNome(),
      descricao: this.salvarDescricao(),
      tipo: this.salvarTipo(),
      padrao: this.salvarPadrao(),
      colunas,
    });
    this.mostrarSalvarLayout.set(false);
  }

  /* Filters */
  toggleFiltros(): void {
    this.mostrarFiltros.update((v) => !v);
  }

  toggleCheckboxList(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  toggleFiltroCd(cd: string): void {
    this.filtroCds.update((l) => this.toggleCheckboxList(l, cd));
  }

  toggleFiltroTipoFornecedor(tipo: string): void {
    this.filtroTipoFornecedor.update((l) => this.toggleCheckboxList(l, tipo));
  }

  toggleFiltroMaterial(mat: string): void {
    this.filtroMateriais.update((l) => this.toggleCheckboxList(l, mat));
  }

  toggleFiltroFornecedor(forn: string): void {
    this.filtroFornecedores.update((l) => this.toggleCheckboxList(l, forn));
  }

  toggleFiltroCurva(curva: string): void {
    this.filtroCurvas.update((l) => this.toggleCheckboxList(l, curva));
  }

  limparFiltros(): void {
    this.filtroAreaMrp.set('');
    this.filtroCds.set([]);
    this.filtroTipoFornecedor.set([]);
    this.filtroMateriais.set([]);
    this.filtroBandeira.set('');
    this.filtroFornecedores.set([]);
    this.filtroConsignadoSim.set(false);
    this.filtroConsignadoNao.set(false);
    this.filtroCurvas.set([]);
    this.filtroLoteCompra.set('');
    this.filtroSaldoFornecedor.set([]);
  }

  /* Selection */
  toggleSelecionarTodos(): void {
    if (this.todosSelecionados()) {
      this.registrosSelecionados.set(new Set());
      this.todosSelecionados.set(false);
    } else {
      const todos = new Set(this.registrosFiltrados().map((r) => r.codigoMaterial));
      this.registrosSelecionados.set(todos);
      this.todosSelecionados.set(true);
    }
  }

  toggleSelecionarRegistro(codigo: string): void {
    this.registrosSelecionados.update((set) => {
      const novo = new Set(set);
      if (novo.has(codigo)) novo.delete(codigo);
      else novo.add(codigo);
      return novo;
    });
  }

  isRegistroSelecionado(codigo: string): boolean {
    return this.registrosSelecionados().has(codigo);
  }

  /* Visão toggle */
  setVisao(v: 'materialCd' | 'material'): void {
    this.visao.set(v);
  }

  /* Export */
  exportarCSV(): void {
    const dados = this.registrosFiltrados();
    const headers = ['Código Material', 'Descrição Material', 'Código CD', 'Desc CD', 'Fornecedor', 'Curva', 'Qtd Sugerida', 'Qtd Proposta', 'Estoque Total', 'R$ Estoque Total'];
    const rows = dados.map((d) =>
      [d.codigoMaterial, d.descricaoMaterial, d.codigoCd, d.descCd, d.descFornecedor, d.curva, d.quantidadeSugerida, d.quantidadeProposta, d.estoqueTotal, d.rsEstoqueTotal].join(';'),
    );
    const csv = [headers.join(';'), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calculo_mrp.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  /* Helpers */
  getColunaValor(registro: MrpRegistro, colunaId: string): string | number {
    return (registro as unknown as Record<string, string | number>)[colunaId] ?? '';
  }

  getColunaNome(id: string): string {
    return TODAS_COLUNAS.find((c) => c.id === id)?.nome ?? id;
  }

  materiaisDisponiveis = computed(() => {
    const busca = this.filtroBuscaMaterial().toLowerCase();
    const mats = [...new Set(this.service.registros().map((r) => r.codigoMaterial + ' - ' + r.descricaoMaterial))];
    return busca ? mats.filter((m) => m.toLowerCase().includes(busca)) : mats;
  });

  fornecedoresDisponiveis = computed(() => {
    const busca = this.filtroBuscaFornecedor().toLowerCase();
    const forns = [...new Set(this.service.registros().map((r) => r.codigoFornecedor + ' - ' + r.descFornecedor))];
    return busca ? forns.filter((f) => f.toLowerCase().includes(busca)) : forns;
  });

  cdsDisponiveis = ['SP34 - CD Campinas', 'RJ12 - CD Rio de Janeiro', 'MG05 - CD Belo Horizonte'];
  tiposFornecedor = ['Nacional', 'Internacional', 'Distribuidor'];
  curvasDisponiveis = ['A', 'B', 'C', 'D'];
  saldosFornecedor = ['Com Saldo', 'Sem Saldo', 'Parcial'];
}
