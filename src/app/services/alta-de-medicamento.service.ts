import { Injectable, signal, computed } from '@angular/core';
import { AltaMedicamento } from '../models/alta-de-medicamento.model';

@Injectable({ providedIn: 'root' })
export class AltaDeMedicamentoService {
  private itens = signal<AltaMedicamento[]>([]);
  private nextId = signal(1);

  readonly lista = this.itens.asReadonly();

  readonly materiaisDisponiveis = [
    { codigo: '100830', nome: 'CLEXANE 40MG 10SP 0,4ML+SIST SEG' },
    { codigo: '101990', nome: 'LASIX C/S AMP 2ML' },
    { codigo: '107528', nome: 'DYSPORT 500 UI CX C/ 1 FR AMP' },
    { codigo: '107904', nome: 'KEYTRUDA 100MG/4ML SOL INJ X 4ML' },
    { codigo: '108130', nome: 'ANSENTRON 8 MG CX AMP 4ML' },
    { codigo: '109200', nome: 'AVASTIN 400MG/16ML SOL INJ' },
    { codigo: '110050', nome: 'HERCEPTIN 440MG PO LIOF INJ' },
  ];

  readonly niveis = ['Nível 1', 'Nível 2', 'Nível 3', 'Nível 4', 'Nível 5'];

  adicionar(dados: Omit<AltaMedicamento, 'id'>): void {
    const id = this.nextId();
    this.itens.update((list) => [...list, { ...dados, id }]);
    this.nextId.update((n) => n + 1);
  }

  atualizar(id: number, dados: Omit<AltaMedicamento, 'id'>): void {
    this.itens.update((list) => list.map((i) => (i.id === id ? { ...dados, id } : i)));
  }

  remover(id: number): void {
    this.itens.update((list) => list.filter((i) => i.id !== id));
  }
}
