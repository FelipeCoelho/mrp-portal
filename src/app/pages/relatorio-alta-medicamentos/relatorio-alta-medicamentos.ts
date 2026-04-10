import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface AltaRelatorio {
  codigoMaterial: string;
  descricaoMaterial: string;
  nivelAlta: string;
  dataCriacao: string;
  horarioCriacao: string;
  usuarioCriacao: string;
  dataAlteracao: string;
  horarioAlteracao: string;
  usuarioAlteracao: string;
}

interface Filtros {
  codigoMaterial: string;
  descricaoMaterial: string;
  nivel: string;
  dataCriacaoDe: string;
  dataCriacaoAte: string;
  usuarioCriacao: string;
  usuarioAlteracao: string;
}

const FILTROS_VAZIO: Filtros = {
  codigoMaterial: '', descricaoMaterial: '', nivel: '',
  dataCriacaoDe: '', dataCriacaoAte: '',
  usuarioCriacao: '', usuarioAlteracao: '',
};

@Component({
  selector: 'app-relatorio-alta-medicamentos',
  imports: [FormsModule, RouterLink],
  templateUrl: './relatorio-alta-medicamentos.html',
  styleUrl: './relatorio-alta-medicamentos.css',
})
export class RelatorioAltaMedicamentosComponent {
  readonly niveis = ['Nível 1', 'Nível 2', 'Nível 3'];

  mostrarFiltros = signal(false);
  filtros = signal<Filtros>({ ...FILTROS_VAZIO });

  dados = signal<AltaRelatorio[]>([
    { codigoMaterial: '100830', descricaoMaterial: 'CLEXANE 40MG 10SP 0,4ML+SIST SEG', nivelAlta: 'Nível 2', dataCriacao: '09/04/2026', horarioCriacao: '18:56:41', usuarioCriacao: 'Usuário Demo', dataAlteracao: '09/04/2026', horarioAlteracao: '18:58:28', usuarioAlteracao: 'Usuário Demo' },
    { codigoMaterial: '107904', descricaoMaterial: 'KEYTRUDA 100MG/4ML SOL INJ X 4ML', nivelAlta: 'Nível 1', dataCriacao: '09/04/2026', horarioCriacao: '18:04:09', usuarioCriacao: 'Usuário Demo', dataAlteracao: '09/04/2026', horarioAlteracao: '18:04:09', usuarioAlteracao: 'Usuário Demo' },
  ]);

  dadosFiltrados = computed(() => {
    const f = this.filtros();
    let lista = this.dados();
    if (f.codigoMaterial) lista = lista.filter((d) => d.codigoMaterial.includes(f.codigoMaterial));
    if (f.descricaoMaterial) lista = lista.filter((d) => d.descricaoMaterial.toLowerCase().includes(f.descricaoMaterial.toLowerCase()));
    if (f.nivel) lista = lista.filter((d) => d.nivelAlta === f.nivel);
    if (f.usuarioCriacao) lista = lista.filter((d) => d.usuarioCriacao.toLowerCase().includes(f.usuarioCriacao.toLowerCase()));
    if (f.usuarioAlteracao) lista = lista.filter((d) => d.usuarioAlteracao.toLowerCase().includes(f.usuarioAlteracao.toLowerCase()));
    return lista;
  });

  toggleFiltros(): void { this.mostrarFiltros.update((v) => !v); }
  updateFiltro<K extends keyof Filtros>(field: K, value: Filtros[K]): void { this.filtros.update((f) => ({ ...f, [field]: value })); }
  limparFiltros(): void { this.filtros.set({ ...FILTROS_VAZIO }); }

  exportarCSV(): void {
    const dados = this.dadosFiltrados();
    const headers = ['CÓDIGO DO MATERIAL', 'DESCRIÇÃO DO MATERIAL', 'NÍVEL DE ALTA', 'DATA DA CRIAÇÃO', 'HORÁRIO DA CRIAÇÃO', 'USUÁRIO DA CRIAÇÃO', 'DATA DA ALTERAÇÃO', 'HORÁRIO DA ALTERAÇÃO', 'USUÁRIO DA ALTERAÇÃO'];
    const rows = dados.map((d) => [d.codigoMaterial, d.descricaoMaterial, d.nivelAlta, d.dataCriacao, d.horarioCriacao, d.usuarioCriacao, d.dataAlteracao, d.horarioAlteracao, d.usuarioAlteracao].join(';'));
    const csv = [headers.join(';'), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'relatorio_alta_medicamentos.csv'; a.click();
    URL.revokeObjectURL(url);
  }
}
