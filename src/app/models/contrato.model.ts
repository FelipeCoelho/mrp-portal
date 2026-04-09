export interface ConsumoMensal {
  id: number;
  ano: number;
  mes: number;
  quantidade: number;
}

export interface Rastreabilidade {
  dataCriacao: string;
  horarioCriacao: string;
  usuarioCriacao: string;
  dataAlteracao?: string;
  horarioAlteracao?: string;
  usuarioAlteracao?: string;
}

export interface Contrato {
  id: number;
  inicioVigencia: string;
  fimVigencia: string;
  codigoClienteSap: string;
  codigoMaterialSap: string;
  consumosMensais: ConsumoMensal[];
  rastreabilidade: Rastreabilidade;
}

export const MESES = [
  { valor: 1, nome: 'Janeiro' },
  { valor: 2, nome: 'Fevereiro' },
  { valor: 3, nome: 'Março' },
  { valor: 4, nome: 'Abril' },
  { valor: 5, nome: 'Maio' },
  { valor: 6, nome: 'Junho' },
  { valor: 7, nome: 'Julho' },
  { valor: 8, nome: 'Agosto' },
  { valor: 9, nome: 'Setembro' },
  { valor: 10, nome: 'Outubro' },
  { valor: 11, nome: 'Novembro' },
  { valor: 12, nome: 'Dezembro' },
] as const;
