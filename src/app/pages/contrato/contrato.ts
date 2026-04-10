import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContratoService } from '../../services/contrato.service';
import { Contrato, MaterialContrato, ConsumoMensal, MESES } from '../../models/contrato.model';

interface ContratoForm {
  inicioVigencia: string;
  fimVigencia: string;
  codigoClienteSap: string;
}

/** Consumo temporário por material durante o wizard */
interface MaterialConfig {
  codigoMaterial: string;
  consumos: { ano: number; mes: number; quantidade: number }[];
}

const FORM_VAZIO: ContratoForm = { inicioVigencia: '', fimVigencia: '', codigoClienteSap: '' };

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

  // === Listagem ===
  filtroBusca = signal('');
  filtroStatus = signal('');
  visao = signal<'cards' | 'tabela'>('cards');

  contratosFiltrados = computed(() => {
    let lista = this.contratos();
    const busca = this.filtroBusca().toLowerCase().trim();
    const status = this.filtroStatus();
    if (busca) {
      lista = lista.filter((c) => {
        const nome = this.getNomeCliente(c.codigoClienteSap).toLowerCase();
        return nome.includes(busca) || c.codigoClienteSap.toLowerCase().includes(busca);
      });
    }
    if (status === 'ativo') lista = lista.filter((c) => c.ativo);
    else if (status === 'inativo') lista = lista.filter((c) => !c.ativo);
    return lista;
  });

  // === Wizard ===
  editandoId = signal<number | null>(null);
  form = signal<ContratoForm>({ ...FORM_VAZIO });
  mostrarForm = signal(false);
  erros = signal<string[]>([]);
  etapa = signal(1);

  buscaCliente = signal('');
  mostrarDropdownCliente = signal(false);
  clientesFiltrados = computed(() => {
    const t = this.buscaCliente().toLowerCase().trim();
    if (!t) return this.clientesValidos;
    return this.clientesValidos.filter((c) => c.codigo.toLowerCase().includes(t) || c.nome.toLowerCase().includes(t));
  });

  buscaMaterial = signal('');
  materiaisSelecionados = signal<string[]>([]);
  materiaisConfigurados = signal<MaterialConfig[]>([]);

  materiaisFiltrados = computed(() => {
    const t = this.buscaMaterial().toLowerCase().trim();
    if (!t) return this.materiaisValidos;
    return this.materiaisValidos.filter((m) => m.codigo.toLowerCase().includes(t) || m.nome.toLowerCase().includes(t));
  });

  // === Modal: Adicionar materiais (consumo por mês) ===
  mostrarModalMaterial = signal(false);
  materialAtualIndex = signal(0);
  materiaisParaConfigurar = signal<string[]>([]);
  qtdPadrao = signal('');
  consumosMesAtual = signal<{ ano: number; mes: number; quantidade: number }[]>([]);

  materialAtualCodigo = computed(() => {
    const lista = this.materiaisParaConfigurar();
    const idx = this.materialAtualIndex();
    return idx < lista.length ? lista[idx] : '';
  });

  mesesVigencia = computed(() => {
    const f = this.form();
    if (!f.inicioVigencia || !f.fimVigencia) return [];
    const inicio = new Date(f.inicioVigencia);
    const fim = new Date(f.fimVigencia);
    const result: { ano: number; mes: number }[] = [];
    const cur = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
    while (cur <= fim) {
      result.push({ ano: cur.getFullYear(), mes: cur.getMonth() + 1 });
      cur.setMonth(cur.getMonth() + 1);
    }
    return result;
  });

  // === Modal: Revisão ===
  mostrarRevisao = signal(false);

  // === Helpers ===
  getNomeCliente(codigo: string): string {
    return this.clientesValidos.find((c) => c.codigo === codigo)?.nome ?? codigo;
  }

  getNomeMaterial(codigo: string): string {
    return this.materiaisValidos.find((m) => m.codigo === codigo)?.nome ?? codigo;
  }

  getNomeMes(mes: number): string {
    return MESES.find((m) => m.valor === mes)?.nome ?? '';
  }

  getNomeMesCurto(mes: number): string {
    const nomes = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return nomes[mes] ?? '';
  }

  formatarData(d: string): string {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }

  totalConsumosMaterial(mat: MaterialConfig): number {
    return mat.consumos.reduce((s, c) => s + c.quantidade, 0);
  }

  isMaterialSelecionado(codigo: string): boolean {
    return this.materiaisSelecionados().includes(codigo);
  }

  toggleMaterial(codigo: string): void {
    this.materiaisSelecionados.update((l) => l.includes(codigo) ? l.filter((c) => c !== codigo) : [...l, codigo]);
  }

  // === Wizard navigation ===

  novo(): void {
    this.editandoId.set(null);
    this.form.set({ ...FORM_VAZIO });
    this.erros.set([]);
    this.etapa.set(1);
    this.buscaCliente.set('');
    this.buscaMaterial.set('');
    this.mostrarDropdownCliente.set(false);
    this.materiaisSelecionados.set([]);
    this.materiaisConfigurados.set([]);
    this.mostrarForm.set(true);
  }

  editar(contrato: Contrato): void {
    this.editandoId.set(contrato.id);
    this.form.set({
      inicioVigencia: contrato.inicioVigencia,
      fimVigencia: contrato.fimVigencia,
      codigoClienteSap: contrato.codigoClienteSap,
    });
    this.materiaisConfigurados.set(
      contrato.materiais.map((m) => ({
        codigoMaterial: m.codigoMaterial,
        consumos: m.consumosMensais.map((c) => ({ ano: c.ano, mes: c.mes, quantidade: c.quantidade })),
      })),
    );
    this.materiaisSelecionados.set([]);
    this.erros.set([]);
    this.etapa.set(1);
    this.buscaCliente.set('');
    this.buscaMaterial.set('');
    this.mostrarDropdownCliente.set(false);
    this.mostrarForm.set(true);
  }

  cancelar(): void {
    this.mostrarForm.set(false);
    this.editandoId.set(null);
    this.form.set({ ...FORM_VAZIO });
    this.erros.set([]);
    this.etapa.set(1);
    this.materiaisConfigurados.set([]);
    this.materiaisSelecionados.set([]);
  }

  wizardVoltar(): void {
    if (this.etapa() > 1) this.etapaAnterior();
    else this.cancelar();
  }

  proximaEtapa(): void {
    const f = this.form();
    const erros: string[] = [];
    if (!f.codigoClienteSap) erros.push('Selecione um cliente.');
    if (!f.inicioVigencia) erros.push('Data Início é obrigatória.');
    if (!f.fimVigencia) erros.push('Data Fim é obrigatória.');
    if (f.inicioVigencia && f.fimVigencia && new Date(f.fimVigencia) <= new Date(f.inicioVigencia)) {
      erros.push('Data Fim deve ser posterior à Data Início.');
    }
    if (erros.length) { this.erros.set(erros); return; }
    this.erros.set([]);
    this.etapa.set(2);
  }

  etapaAnterior(): void {
    this.erros.set([]);
    this.etapa.set(1);
  }

  selecionarCliente(c: { codigo: string; nome: string }): void {
    this.form.update((f) => ({ ...f, codigoClienteSap: c.codigo }));
    this.buscaCliente.set('');
    this.mostrarDropdownCliente.set(false);
  }

  limparCliente(): void {
    this.form.update((f) => ({ ...f, codigoClienteSap: '' }));
    this.buscaCliente.set('');
  }

  updateForm<K extends keyof ContratoForm>(field: K, value: ContratoForm[K]): void {
    this.form.update((f) => ({ ...f, [field]: value }));
  }

  // === Adicionar materiais (abre modal sequencial) ===

  abrirAdicionarMateriais(): void {
    const selecionados = this.materiaisSelecionados();
    if (selecionados.length === 0) return;
    // Filtrar os que já estão configurados
    const novos = selecionados.filter((c) => !this.materiaisConfigurados().some((m) => m.codigoMaterial === c));
    if (novos.length === 0) {
      this.materiaisSelecionados.set([]);
      return;
    }
    this.materiaisParaConfigurar.set(novos);
    this.materialAtualIndex.set(0);
    this.qtdPadrao.set('');
    this.inicializarConsumosMes();
    this.mostrarModalMaterial.set(true);
  }

  private inicializarConsumosMes(): void {
    this.consumosMesAtual.set(this.mesesVigencia().map((m) => ({ ano: m.ano, mes: m.mes, quantidade: 0 })));
  }

  aplicarQtdPadrao(): void {
    const val = parseFloat(this.qtdPadrao().replace(',', '.'));
    if (isNaN(val)) return;
    this.consumosMesAtual.update((list) => list.map((c) => ({ ...c, quantidade: val })));
  }

  updateConsumoMes(index: number, value: string): void {
    const val = parseFloat(value.replace(',', '.'));
    if (isNaN(val)) return;
    this.consumosMesAtual.update((list) => list.map((c, i) => i === index ? { ...c, quantidade: val } : c));
  }

  proximoMaterial(): void {
    // Salvar material atual
    const codigo = this.materialAtualCodigo();
    const consumos = this.consumosMesAtual();
    this.materiaisConfigurados.update((list) => {
      const existing = list.findIndex((m) => m.codigoMaterial === codigo);
      const entry: MaterialConfig = { codigoMaterial: codigo, consumos: [...consumos] };
      if (existing >= 0) {
        const copy = [...list];
        copy[existing] = entry;
        return copy;
      }
      return [...list, entry];
    });

    const nextIdx = this.materialAtualIndex() + 1;
    if (nextIdx < this.materiaisParaConfigurar().length) {
      this.materialAtualIndex.set(nextIdx);
      this.qtdPadrao.set('');
      this.inicializarConsumosMes();
    } else {
      this.fecharModalMaterial();
    }
  }

  fecharModalMaterial(): void {
    this.mostrarModalMaterial.set(false);
    this.materiaisSelecionados.set([]);
    this.materiaisParaConfigurar.set([]);
  }

  cancelarTudoModal(): void {
    this.fecharModalMaterial();
  }

  editarMaterialConfigurado(codigo: string): void {
    this.materiaisParaConfigurar.set([codigo]);
    this.materialAtualIndex.set(0);
    const existing = this.materiaisConfigurados().find((m) => m.codigoMaterial === codigo);
    if (existing) {
      this.consumosMesAtual.set([...existing.consumos]);
      const first = existing.consumos[0];
      this.qtdPadrao.set(first ? String(first.quantidade) : '');
    } else {
      this.qtdPadrao.set('');
      this.inicializarConsumosMes();
    }
    this.mostrarModalMaterial.set(true);
  }

  removerMaterialConfigurado(codigo: string): void {
    this.materiaisConfigurados.update((list) => list.filter((m) => m.codigoMaterial !== codigo));
  }

  // === Revisão ===

  abrirRevisao(): void {
    if (this.materiaisConfigurados().length === 0) {
      this.erros.set(['Adicione ao menos um material configurado.']);
      return;
    }
    this.erros.set([]);
    this.mostrarRevisao.set(true);
  }

  fecharRevisao(): void {
    this.mostrarRevisao.set(false);
  }

  confirmarESalvar(): void {
    const f = this.form();
    const mats = this.materiaisConfigurados();
    let nextConsumoId = 1;

    const materiais: MaterialContrato[] = mats.map((m) => ({
      codigoMaterial: m.codigoMaterial,
      consumosMensais: m.consumos.map((c) => ({ id: nextConsumoId++, ano: c.ano, mes: c.mes, quantidade: c.quantidade })),
    }));

    const id = this.editandoId();
    if (id !== null) {
      this.service.atualizar(id, {
        inicioVigencia: f.inicioVigencia,
        fimVigencia: f.fimVigencia,
        codigoClienteSap: f.codigoClienteSap,
        materiais,
      });
    } else {
      this.service.adicionar({
        inicioVigencia: f.inicioVigencia,
        fimVigencia: f.fimVigencia,
        codigoClienteSap: f.codigoClienteSap,
        materiais,
      });
    }
    this.fecharRevisao();
    this.cancelar();
  }

  // === Listagem actions ===

  desativar(id: number): void {
    if (confirm('Deseja realmente desativar este contrato?')) {
      this.service.desativar(id);
    }
  }
}
