import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PremissaService } from '../../services/premissa.service';
import { Premissa, NIVEIS_CONFIGURACAO, MATERIAIS_DISPONIVEIS, CDS_DISPONIVEIS, NivelConfiguracao } from '../../models/premissa.model';

interface PremissaForm {
  nivel: NivelConfiguracao | '';
  material: string;
  cd: string;
  estSeguranca: number | null;
  qtdMaxima: number | null;
  diasEstoque: number | null;
  consignado: boolean;
}

const FORM_VAZIO: PremissaForm = { nivel: '', material: '', cd: '', estSeguranca: null, qtdMaxima: null, diasEstoque: null, consignado: false };

@Component({
  selector: 'app-premissas',
  imports: [FormsModule],
  templateUrl: './premissas.html',
  styleUrl: './premissas.css',
})
export class PremissasComponent {
  private service = inject(PremissaService);

  readonly premissas = this.service.lista;
  readonly niveis = NIVEIS_CONFIGURACAO;
  readonly materiais = MATERIAIS_DISPONIVEIS;
  readonly cds = CDS_DISPONIVEIS;

  filtroBusca = signal('');
  filtroNivel = signal('');
  filtroStatus = signal('');
  visao = signal<'cards' | 'tabela'>('tabela');

  mostrarForm = signal(false);
  form = signal<PremissaForm>({ ...FORM_VAZIO });
  editandoId = signal<number | null>(null);
  erros = signal<string[]>([]);

  premissasFiltradas = computed(() => {
    let lista = this.premissas();
    const busca = this.filtroBusca().toLowerCase().trim();
    const nivel = this.filtroNivel();
    const status = this.filtroStatus();
    if (busca) lista = lista.filter((p) => p.configuracao.toLowerCase().includes(busca) || p.nivel.toLowerCase().includes(busca));
    if (nivel) lista = lista.filter((p) => p.nivel === nivel);
    if (status === 'ativo') lista = lista.filter((p) => p.ativo);
    else if (status === 'inativo') lista = lista.filter((p) => !p.ativo);
    return lista;
  });

  // Campos dinâmicos baseados no nível
  mostrarMaterial = computed(() => {
    const n = this.form().nivel;
    return n === 'Material / CD' || n === 'Material';
  });

  mostrarCd = computed(() => {
    const n = this.form().nivel;
    return n === 'Material / CD' || n === 'CD' || n === 'Fornecedor / CD' || n === 'Bandeira GMR / CD';
  });

  novo(): void {
    this.editandoId.set(null);
    this.form.set({ ...FORM_VAZIO });
    this.erros.set([]);
    this.mostrarForm.set(true);
  }

  editar(p: Premissa): void {
    this.editandoId.set(p.id);
    const parts = p.configuracao.split(' / ');
    this.form.set({
      nivel: p.nivel,
      material: parts[0] ?? '',
      cd: parts[1] ?? parts[0] ?? '',
      estSeguranca: p.estSeguranca,
      qtdMaxima: p.qtdMaxima,
      diasEstoque: p.diasEstoque,
      consignado: p.consignado,
    });
    this.erros.set([]);
    this.mostrarForm.set(true);
  }

  cancelar(): void {
    this.mostrarForm.set(false);
    this.editandoId.set(null);
    this.form.set({ ...FORM_VAZIO });
    this.erros.set([]);
  }

  salvar(): void {
    const f = this.form();
    const erros: string[] = [];
    if (!f.nivel) erros.push('Nível de Configuração é obrigatório.');
    if (this.mostrarMaterial() && !f.material) erros.push('Material é obrigatório.');
    if (this.mostrarCd() && !f.cd) erros.push('Centro de Distribuição é obrigatório.');
    if (f.estSeguranca == null) erros.push('Estoque de Segurança é obrigatório.');
    if (f.qtdMaxima == null) erros.push('Quantidade Máxima é obrigatória.');
    if (f.diasEstoque == null) erros.push('Dias de Estoque é obrigatório.');
    if (erros.length) { this.erros.set(erros); return; }

    let config = '';
    if (this.mostrarMaterial() && this.mostrarCd()) config = `${f.material} / ${f.cd}`;
    else if (this.mostrarMaterial()) config = f.material;
    else if (this.mostrarCd()) config = f.cd;
    else config = f.nivel;

    const dados = {
      nivel: f.nivel as NivelConfiguracao,
      configuracao: config,
      estSeguranca: f.estSeguranca!,
      qtdMaxima: f.qtdMaxima!,
      diasEstoque: f.diasEstoque!,
      consignado: f.consignado,
    };

    const id = this.editandoId();
    if (id !== null) {
      this.service.atualizar(id, dados);
    } else {
      this.service.adicionar(dados);
    }
    this.cancelar();
  }

  desativar(id: number): void {
    if (confirm('Deseja realmente desativar esta premissa?')) {
      this.service.desativar(id);
    }
  }

  updateForm<K extends keyof PremissaForm>(field: K, value: PremissaForm[K]): void {
    this.form.update((f) => ({ ...f, [field]: value }));
  }
}
