export interface Estado {
  id: number;
  nome: string;
  sigla: string;
  regiao: string;
}

export const REGIOES = [
  'Norte',
  'Nordeste',
  'Centro-Oeste',
  'Sudeste',
  'Sul',
] as const;

export type Regiao = (typeof REGIOES)[number];

export const ESTADOS_INICIAIS: Estado[] = [
  // Norte
  { id: 1, nome: 'Acre', sigla: 'AC', regiao: 'Norte' },
  { id: 2, nome: 'Amapá', sigla: 'AP', regiao: 'Norte' },
  { id: 3, nome: 'Amazonas', sigla: 'AM', regiao: 'Norte' },
  { id: 4, nome: 'Pará', sigla: 'PA', regiao: 'Norte' },
  { id: 5, nome: 'Rondônia', sigla: 'RO', regiao: 'Norte' },
  { id: 6, nome: 'Roraima', sigla: 'RR', regiao: 'Norte' },
  { id: 7, nome: 'Tocantins', sigla: 'TO', regiao: 'Norte' },
  // Nordeste
  { id: 8, nome: 'Alagoas', sigla: 'AL', regiao: 'Nordeste' },
  { id: 9, nome: 'Bahia', sigla: 'BA', regiao: 'Nordeste' },
  { id: 10, nome: 'Ceará', sigla: 'CE', regiao: 'Nordeste' },
  { id: 11, nome: 'Maranhão', sigla: 'MA', regiao: 'Nordeste' },
  { id: 12, nome: 'Paraíba', sigla: 'PB', regiao: 'Nordeste' },
  { id: 13, nome: 'Pernambuco', sigla: 'PE', regiao: 'Nordeste' },
  { id: 14, nome: 'Piauí', sigla: 'PI', regiao: 'Nordeste' },
  { id: 15, nome: 'Rio Grande do Norte', sigla: 'RN', regiao: 'Nordeste' },
  { id: 16, nome: 'Sergipe', sigla: 'SE', regiao: 'Nordeste' },
  // Centro-Oeste
  { id: 17, nome: 'Distrito Federal', sigla: 'DF', regiao: 'Centro-Oeste' },
  { id: 18, nome: 'Goiás', sigla: 'GO', regiao: 'Centro-Oeste' },
  { id: 19, nome: 'Mato Grosso', sigla: 'MT', regiao: 'Centro-Oeste' },
  { id: 20, nome: 'Mato Grosso do Sul', sigla: 'MS', regiao: 'Centro-Oeste' },
  // Sudeste
  { id: 21, nome: 'Espírito Santo', sigla: 'ES', regiao: 'Sudeste' },
  { id: 22, nome: 'Minas Gerais', sigla: 'MG', regiao: 'Sudeste' },
  { id: 23, nome: 'Rio de Janeiro', sigla: 'RJ', regiao: 'Sudeste' },
  { id: 24, nome: 'São Paulo', sigla: 'SP', regiao: 'Sudeste' },
  // Sul
  { id: 25, nome: 'Paraná', sigla: 'PR', regiao: 'Sul' },
  { id: 26, nome: 'Rio Grande do Sul', sigla: 'RS', regiao: 'Sul' },
  { id: 27, nome: 'Santa Catarina', sigla: 'SC', regiao: 'Sul' },
];
