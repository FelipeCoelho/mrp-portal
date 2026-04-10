export interface FrequenciaExecucao {
  id: number;
  cdsSelecionados: string[];
  categoriaMaterial: string;
  periodicidade: string;
  dataInicial: string;
  dataFinal: string;
  suspenderSabados: boolean;
  suspenderDomingos: boolean;
  suspenderFeriados: boolean;
}

export const CATEGORIAS_MATERIAL = [
  'Oncológicos',
  'Antibióticos',
  'Anti-inflamatórios',
  'Analgésicos',
  'Imunobiológicos',
  'Hemoderivados',
];

export const PERIODICIDADES = ['Único', 'Diário', 'Semanal', 'Quinzenal', 'Mensal'];

export interface CDOption {
  codigo: string;
  nome: string;
}

export const CDS_DISPONIVEIS: CDOption[] = [
  { codigo: 'DF22', nome: 'CD Brasília' },
  { codigo: 'ES21', nome: 'CD Vitória' },
  { codigo: 'ES22', nome: 'CD Cariacica' },
  { codigo: 'PE22', nome: 'CD Recife' },
  { codigo: 'RJ24', nome: 'CD Rio de Janeiro' },
  { codigo: 'RS21', nome: 'CD Porto Alegre' },
  { codigo: 'RS23', nome: 'CD Caxias do Sul' },
  { codigo: 'SC21', nome: 'CD Florianópolis' },
  { codigo: 'SP26', nome: 'CD São Paulo' },
  { codigo: 'SP27', nome: 'CD Campinas' },
  { codigo: 'SP28', nome: 'CD Santos' },
];
