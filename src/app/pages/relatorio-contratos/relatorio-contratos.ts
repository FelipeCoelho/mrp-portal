import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ContratoRelatorio {
  clienteCodigo: string;
  clienteNome: string;
  materialCodigo: string;
  materialNome: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  ano: number;
  mes: number;
  quantidade: number;
  status: string;
  criadoEm: string;
}

interface Filtros {
  vigenciaInicio: string;
  vigenciaFim: string;
  codigoCliente: string;
  nomeCliente: string;
  codigoMaterial: string;
  nomeMaterial: string;
  ano: string;
  mes: string;
  statusContrato: string;
  usuarioCriacao: string;
  usuarioAlteracao: string;
}

const FILTROS_VAZIO: Filtros = {
  vigenciaInicio: '', vigenciaFim: '',
  codigoCliente: '', nomeCliente: '',
  codigoMaterial: '', nomeMaterial: '',
  ano: '', mes: '', statusContrato: '',
  usuarioCriacao: '', usuarioAlteracao: '',
};

@Component({
  selector: 'app-relatorio-contratos',
  imports: [FormsModule, DecimalPipe, RouterLink],
  templateUrl: './relatorio-contratos.html',
  styleUrl: './relatorio-contratos.css',
})
export class RelatorioContratosComponent {
  mostrarFiltros = signal(false);
  filtros = signal<Filtros>({ ...FILTROS_VAZIO });

  dados = signal<ContratoRelatorio[]>([
    { clienteCodigo: 'CLI001', clienteNome: 'Empresa ABC Ltda', materialCodigo: '100830', materialNome: 'CLEXANE 40MG 10SP 0,4ML+SIST SEG', vigenciaInicio: '08/04/2026', vigenciaFim: '13/05/2026', ano: 2026, mes: 4, quantidade: 200, status: 'Ativo', criadoEm: '09/04/2026' },
    { clienteCodigo: 'CLI001', clienteNome: 'Empresa ABC Ltda', materialCodigo: '100830', materialNome: 'CLEXANE 40MG 10SP 0,4ML+SIST SEG', vigenciaInicio: '08/04/2026', vigenciaFim: '13/05/2026', ano: 2026, mes: 5, quantidade: 200, status: 'Ativo', criadoEm: '09/04/2026' },
    { clienteCodigo: 'CLI001', clienteNome: 'Empresa ABC Ltda', materialCodigo: '108130', materialNome: 'ANSENTRON 8 MG CX AMP 4ML', vigenciaInicio: '08/04/2026', vigenciaFim: '13/05/2026', ano: 2026, mes: 4, quantidade: 100, status: 'Ativo', criadoEm: '09/04/2026' },
    { clienteCodigo: 'CLI001', clienteNome: 'Empresa ABC Ltda', materialCodigo: '108130', materialNome: 'ANSENTRON 8 MG CX AMP 4ML', vigenciaInicio: '08/04/2026', vigenciaFim: '13/05/2026', ano: 2026, mes: 5, quantidade: 100, status: 'Ativo', criadoEm: '09/04/2026' },
    { clienteCodigo: 'CLI002', clienteNome: 'Centro Oncológico Prontobaby', materialCodigo: '100830', materialNome: 'CLEXANE 40MG 10SP 0,4ML+SIST SEG', vigenciaInicio: '31/03/2026', vigenciaFim: '29/04/2026', ano: 2026, mes: 4, quantidade: 0.05, status: 'Ativo', criadoEm: '09/04/2026' },
  ]);

  dadosFiltrados = computed(() => {
    const f = this.filtros();
    let lista = this.dados();
    if (f.codigoCliente) lista = lista.filter((d) => d.clienteCodigo.toLowerCase().includes(f.codigoCliente.toLowerCase()));
    if (f.nomeCliente) lista = lista.filter((d) => d.clienteNome.toLowerCase().includes(f.nomeCliente.toLowerCase()));
    if (f.codigoMaterial) lista = lista.filter((d) => d.materialCodigo.toLowerCase().includes(f.codigoMaterial.toLowerCase()));
    if (f.nomeMaterial) lista = lista.filter((d) => d.materialNome.toLowerCase().includes(f.nomeMaterial.toLowerCase()));
    if (f.ano) lista = lista.filter((d) => d.ano === parseInt(f.ano, 10));
    if (f.mes) lista = lista.filter((d) => d.mes === parseInt(f.mes, 10));
    if (f.statusContrato && f.statusContrato !== 'Todos') lista = lista.filter((d) => d.status === f.statusContrato);
    return lista;
  });

  toggleFiltros(): void { this.mostrarFiltros.update((v) => !v); }

  updateFiltro<K extends keyof Filtros>(field: K, value: Filtros[K]): void {
    this.filtros.update((f) => ({ ...f, [field]: value }));
  }

  limparFiltros(): void { this.filtros.set({ ...FILTROS_VAZIO }); }

  exportarCSV(): void {
    const dados = this.dadosFiltrados();
    const headers = ['CLIENTE', 'MATERIAL', 'VIGÊNCIA', 'ANO', 'MÊS', 'QUANTIDADE', 'STATUS', 'CRIADO EM'];
    const rows = dados.map((d) => [
      `${d.clienteCodigo} - ${d.clienteNome}`,
      `${d.materialCodigo} - ${d.materialNome}`,
      `${d.vigenciaInicio} até ${d.vigenciaFim}`,
      d.ano, d.mes, d.quantidade, d.status, d.criadoEm,
    ].join(';'));
    const csv = [headers.join(';'), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio_contratos.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
