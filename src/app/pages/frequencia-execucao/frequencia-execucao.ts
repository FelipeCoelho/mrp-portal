import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FrequenciaExecucaoService } from '../../services/frequencia-execucao.service';
import {
  CDS_DISPONIVEIS,
  CATEGORIAS_MATERIAL,
  PERIODICIDADES,
} from '../../models/frequencia-execucao.model';

@Component({
  selector: 'app-frequencia-execucao',
  imports: [FormsModule],
  templateUrl: './frequencia-execucao.html',
  styleUrl: './frequencia-execucao.css',
})
export class FrequenciaExecucaoComponent {
  private service = inject(FrequenciaExecucaoService);

  readonly cdsDisponiveis = CDS_DISPONIVEIS;
  readonly categorias = CATEGORIAS_MATERIAL;
  readonly periodicidades = PERIODICIDADES;

  cdsSelecionados = signal<string[]>([]);
  categoriaMaterial = signal('');
  periodicidade = signal('Diário');
  dataInicial = signal('');
  dataFinal = signal('');
  suspenderSabados = signal(true);
  suspenderDomingos = signal(true);
  suspenderFeriados = signal(true);
  erros = signal<string[]>([]);
  salvoComSucesso = signal(false);

  toggleCd(codigo: string): void {
    this.cdsSelecionados.update((l) =>
      l.includes(codigo) ? l.filter((c) => c !== codigo) : [...l, codigo],
    );
  }

  isCdSelecionado(codigo: string): boolean {
    return this.cdsSelecionados().includes(codigo);
  }

  salvar(): void {
    const erros: string[] = [];
    if (this.cdsSelecionados().length === 0) erros.push('Selecione ao menos um Centro de Distribuição.');
    if (!this.categoriaMaterial()) erros.push('Categoria de Materiais é obrigatória.');
    if (!this.periodicidade()) erros.push('Periodicidade é obrigatória.');
    if (!this.dataInicial()) erros.push('Data Inicial da Execução é obrigatória.');

    if (this.dataInicial() && this.dataFinal() && new Date(this.dataFinal()) < new Date(this.dataInicial())) {
      erros.push('Data Final deve ser posterior à Data Inicial.');
    }

    if (this.periodicidade() === 'Único' && this.dataFinal() && this.dataFinal() !== this.dataInicial()) {
      erros.push('Para execução única, as datas devem ser iguais.');
    }

    if (erros.length) { this.erros.set(erros); this.salvoComSucesso.set(false); return; }

    this.service.salvar({
      cdsSelecionados: [...this.cdsSelecionados()],
      categoriaMaterial: this.categoriaMaterial(),
      periodicidade: this.periodicidade(),
      dataInicial: this.dataInicial(),
      dataFinal: this.dataFinal(),
      suspenderSabados: this.suspenderSabados(),
      suspenderDomingos: this.suspenderDomingos(),
      suspenderFeriados: this.suspenderFeriados(),
    });

    this.erros.set([]);
    this.salvoComSucesso.set(true);
    setTimeout(() => this.salvoComSucesso.set(false), 4000);
  }
}
