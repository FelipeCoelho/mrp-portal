import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface MrpAlteracao {
  material: string;
  cd: string;
  fornecedor: string;
  qtdSugeridaMrp: number;
  qtdPropostaAnterior: number;
  novaQtdProposta: number;
  diferenca: number;
  motivo: string;
  dataHoraAlteracao: string;
  usuario: string;
}

interface Filtros {
  codigoMaterial: string;
  descricaoMaterial: string;
  codigoCd: string;
  codigoFornecedor: string;
  dataAlteracaoDe: string;
  dataAlteracaoAte: string;
  usuarioAlteracao: string;
  motivoAlteracao: string;
}

const FILTROS_VAZIO: Filtros = {
  codigoMaterial: '', descricaoMaterial: '', codigoCd: '',
  codigoFornecedor: '', dataAlteracaoDe: '', dataAlteracaoAte: '',
  usuarioAlteracao: '', motivoAlteracao: '',
};

@Component({
  selector: 'app-relatorio-mrp',
  imports: [FormsModule, RouterLink],
  templateUrl: './relatorio-mrp.html',
  styleUrl: './relatorio-mrp.css',
})
export class RelatorioMrpComponent {
  readonly motivos = ['Ajuste manual', 'Correção de estoque', 'Solicitação do cliente', 'Erro de cálculo'];

  mostrarFiltros = signal(false);
  filtros = signal<Filtros>({ ...FILTROS_VAZIO });
  dados = signal<MrpAlteracao[]>([]);

  dadosFiltrados = computed(() => {
    const f = this.filtros();
    let lista = this.dados();
    if (f.codigoMaterial) lista = lista.filter((d) => d.material.toLowerCase().includes(f.codigoMaterial.toLowerCase()));
    if (f.codigoCd) lista = lista.filter((d) => d.cd.toLowerCase().includes(f.codigoCd.toLowerCase()));
    if (f.codigoFornecedor) lista = lista.filter((d) => d.fornecedor.toLowerCase().includes(f.codigoFornecedor.toLowerCase()));
    if (f.motivoAlteracao && f.motivoAlteracao !== 'Todas') lista = lista.filter((d) => d.motivo === f.motivoAlteracao);
    return lista;
  });

  toggleFiltros(): void { this.mostrarFiltros.update((v) => !v); }
  updateFiltro<K extends keyof Filtros>(field: K, value: Filtros[K]): void { this.filtros.update((f) => ({ ...f, [field]: value })); }
  limparFiltros(): void { this.filtros.set({ ...FILTROS_VAZIO }); }

  exportarCSV(): void {
    const dados = this.dadosFiltrados();
    const headers = ['MATERIAL', 'CD', 'FORNECEDOR', 'QTD SUGERIDA MRP', 'QTD PROPOSTA ANTERIOR', 'NOVA QTD PROPOSTA', 'DIFERENÇA', 'MOTIVO', 'DATA/HORA ALTERAÇÃO', 'USUÁRIO'];
    const rows = dados.map((d) => [d.material, d.cd, d.fornecedor, d.qtdSugeridaMrp, d.qtdPropostaAnterior, d.novaQtdProposta, d.diferenca, d.motivo, d.dataHoraAlteracao, d.usuario].join(';'));
    const csv = [headers.join(';'), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'relatorio_mrp_sugestao_alteracao.csv'; a.click();
    URL.revokeObjectURL(url);
  }
}
