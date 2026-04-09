import { Component, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ConsumoMaterialService } from '../../services/consumo-material.service';
import { ConsumoMaterial } from '../../models/consumo-material.model';

interface FormData {
  descricao: string;
  precoFabrica: number | null;
  repasse: number | null;
  demandaMesAtual: number | null;
  demandaConsignado3Meses: number | null;
  demandaConsignado2Meses: number | null;
  demandaConsignadoUltimoMes: number | null;
  forecast: number | null;
  proposta: number | null;
  precoLiquido: number | null;
}

const FORM_VAZIO: FormData = {
  descricao: '',
  precoFabrica: null,
  repasse: null,
  demandaMesAtual: null,
  demandaConsignado3Meses: null,
  demandaConsignado2Meses: null,
  demandaConsignadoUltimoMes: null,
  forecast: null,
  proposta: null,
  precoLiquido: null,
};

@Component({
  selector: 'app-consumo-material',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './consumo-material.html',
  styleUrl: './consumo-material.css',
})
export class ConsumoMaterialComponent {
  private service = inject(ConsumoMaterialService);

  readonly itens = this.service.lista;
  editandoId = signal<number | null>(null);
  form = signal<FormData>({ ...FORM_VAZIO });
  mostrarForm = signal(false);

  novo(): void {
    this.editandoId.set(null);
    this.form.set({ ...FORM_VAZIO });
    this.mostrarForm.set(true);
  }

  editar(item: ConsumoMaterial): void {
    this.editandoId.set(item.id);
    this.form.set({
      descricao: item.descricao,
      precoFabrica: item.precoFabrica,
      repasse: item.repasse,
      demandaMesAtual: item.demandaMesAtual,
      demandaConsignado3Meses: item.demandaConsignado3Meses,
      demandaConsignado2Meses: item.demandaConsignado2Meses,
      demandaConsignadoUltimoMes: item.demandaConsignadoUltimoMes,
      forecast: item.forecast,
      proposta: item.proposta,
      precoLiquido: item.precoLiquido,
    });
    this.mostrarForm.set(true);
  }

  salvar(): void {
    const f = this.form();
    if (!f.descricao || f.precoFabrica == null) return;

    const dados = {
      descricao: f.descricao,
      precoFabrica: f.precoFabrica ?? 0,
      repasse: f.repasse ?? 0,
      demandaMesAtual: f.demandaMesAtual ?? 0,
      demandaConsignado3Meses: f.demandaConsignado3Meses ?? 0,
      demandaConsignado2Meses: f.demandaConsignado2Meses ?? 0,
      demandaConsignadoUltimoMes: f.demandaConsignadoUltimoMes ?? 0,
      forecast: f.forecast ?? 0,
      proposta: f.proposta ?? 0,
      precoLiquido: f.precoLiquido ?? 0,
    } as Omit<ConsumoMaterial, 'id'>;

    const id = this.editandoId();
    if (id !== null) {
      this.service.atualizar(id, dados);
    } else {
      this.service.adicionar(dados);
    }
    this.cancelar();
  }

  remover(id: number): void {
    if (confirm('Deseja realmente remover este item?')) {
      this.service.remover(id);
    }
  }

  cancelar(): void {
    this.mostrarForm.set(false);
    this.editandoId.set(null);
    this.form.set({ ...FORM_VAZIO });
  }

  updateForm<K extends keyof FormData>(field: K, value: FormData[K]): void {
    this.form.update((f) => ({ ...f, [field]: value }));
  }
}
