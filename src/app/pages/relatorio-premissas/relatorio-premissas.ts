import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Premissa {
  material: string;
  materialDesc: string;
  cd: string;
  cdNome: string;
  fornecedor: string;
  bandeiraCmr: string;
  curva: string;
  qtdEstoqueSeg: number;
  qtdMaxima: number;
  diasEstoque: number;
  consignado: string;
  criadoEm: string;
  criadoPor: string;
  alteradoEm: string;
  alteradoPor: string;
}

interface Filtros {
  tiposNivel: string[];
  materialDe: string;
  materialAte: string;
  cdDe: string;
  cdAte: string;
  fornecedorDe: string;
  fornecedorAte: string;
  bandeiraCmr: string;
  curva: string;
  dataCriacaoDe: string;
  dataCriacaoAte: string;
  usuarioCriacao: string;
  consignado: string;
}

const FILTROS_VAZIO: Filtros = {
  tiposNivel: [],
  materialDe: '', materialAte: '',
  cdDe: '', cdAte: '',
  fornecedorDe: '', fornecedorAte: '',
  bandeiraCmr: '', curva: '',
  dataCriacaoDe: '', dataCriacaoAte: '',
  usuarioCriacao: '', consignado: '',
};

const TIPOS_NIVEL = [
  'Material / CD', 'Material', 'CD', 'Fornecedor / CD',
  'Fornecedor', 'Bandeira GMR / CD', 'Bandeira GMR', 'Curva',
];

@Component({
  selector: 'app-relatorio-premissas',
  imports: [FormsModule, RouterLink],
  templateUrl: './relatorio-premissas.html',
  styleUrl: './relatorio-premissas.css',
})
export class RelatorioPremissasComponent {
  readonly tiposNivel = TIPOS_NIVEL;
  readonly bandeiras = ['Bandeira A', 'Bandeira B', 'Bandeira C'];
  readonly curvas = ['A', 'B', 'C', 'D'];

  mostrarFiltros = signal(false);
  filtros = signal<Filtros>({ ...FILTROS_VAZIO });

  dados = signal<Premissa[]>([
    {
      material: '107904', materialDesc: 'KEYTRUDA 100MG/4ML SOL INJ X 4ML',
      cd: 'SP34', cdNome: 'CD Campinas',
      fornecedor: '-', bandeiraCmr: '-', curva: '-',
      qtdEstoqueSeg: 100, qtdMaxima: 500, diasEstoque: 30,
      consignado: 'Sim',
      criadoEm: '09/04/2026\n16:23:07', criadoPor: 'fcd78373-c8c9-44ad-8932-013208495c6f',
      alteradoEm: '09/04/2026\n16:23:07', alteradoPor: 'fcd78373-c8c9-44ad-8932-013208495c6f',
    },
  ]);

  dadosFiltrados = computed(() => {
    const f = this.filtros();
    let lista = this.dados();

    if (f.materialDe) lista = lista.filter((d) => d.material >= f.materialDe);
    if (f.materialAte) lista = lista.filter((d) => d.material <= f.materialAte);
    if (f.cdDe) lista = lista.filter((d) => d.cd >= f.cdDe.toUpperCase());
    if (f.cdAte) lista = lista.filter((d) => d.cd <= f.cdAte.toUpperCase());
    if (f.consignado === 'Sim') lista = lista.filter((d) => d.consignado === 'Sim');
    else if (f.consignado === 'Não') lista = lista.filter((d) => d.consignado !== 'Sim');

    return lista;
  });

  toggleFiltros(): void {
    this.mostrarFiltros.update((v) => !v);
  }

  toggleTipoNivel(tipo: string): void {
    this.filtros.update((f) => {
      const list = f.tiposNivel.includes(tipo)
        ? f.tiposNivel.filter((t) => t !== tipo)
        : [...f.tiposNivel, tipo];
      return { ...f, tiposNivel: list };
    });
  }

  isTipoNivelSelecionado(tipo: string): boolean {
    return this.filtros().tiposNivel.includes(tipo);
  }

  updateFiltro<K extends keyof Filtros>(field: K, value: Filtros[K]): void {
    this.filtros.update((f) => ({ ...f, [field]: value }));
  }

  limparFiltros(): void {
    this.filtros.set({ ...FILTROS_VAZIO });
  }

  exportarCSV(): void {
    const dados = this.dadosFiltrados();
    const headers = ['MATERIAL', 'CD', 'FORNECEDOR', 'BANDEIRA CMR', 'CURVA', 'QTD ESTOQUE SEG.', 'QTD MÁXIMA', 'DIAS ESTOQUE', 'CONSIGNADO', 'CRIADO EM', 'CRIADO POR', 'ALTERADO EM', 'ALTERADO POR'];
    const rows = dados.map((d) => [
      `${d.material} - ${d.materialDesc}`, `${d.cd} - ${d.cdNome}`,
      d.fornecedor, d.bandeiraCmr, d.curva,
      d.qtdEstoqueSeg, d.qtdMaxima, d.diasEstoque, d.consignado,
      d.criadoEm.replace('\n', ' '), d.criadoPor,
      d.alteradoEm.replace('\n', ' '), d.alteradoPor,
    ].join(';'));

    const csv = [headers.join(';'), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio_premissas.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
