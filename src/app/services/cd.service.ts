import { Injectable, signal } from '@angular/core';
import { CD } from '../models/cd.model';

@Injectable({ providedIn: 'root' })
export class CDService {
  // Simulação de CDs do sistema - em produção viria de uma API
  private cds = signal<CD[]>([
    { id: 1, nome: 'CD São Paulo', habilitadoMRP: true },
    { id: 2, nome: 'CD Rio de Janeiro', habilitadoMRP: true },
    { id: 3, nome: 'CD Belo Horizonte', habilitadoMRP: false },
    { id: 4, nome: 'CD Curitiba', habilitadoMRP: true },
    { id: 5, nome: 'CD Porto Alegre', habilitadoMRP: false },
    { id: 6, nome: 'CD Brasília', habilitadoMRP: true },
    { id: 7, nome: 'CD Salvador', habilitadoMRP: false },
    { id: 8, nome: 'CD Recife', habilitadoMRP: true },
  ]);

  readonly lista = this.cds.asReadonly();

  /**
   * Retorna apenas os CDs habilitados para cálculo de MRP.
   * Conforme requisitos 1.2, 7.1, 7.2, 7.3.
   * 
   * @returns Array de CDs com habilitadoMRP = true
   */
  buscarCDsHabilitados(): CD[] {
    return this.cds().filter(cd => cd.habilitadoMRP);
  }
}
