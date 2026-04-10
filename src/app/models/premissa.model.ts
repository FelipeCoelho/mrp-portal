export type NivelConfiguracao = 'Material / CD' | 'Material' | 'CD' | 'Fornecedor / CD' | 'Fornecedor' | 'Bandeira GMR / CD' | 'Bandeira GMR' | 'Curva';

export interface Premissa {
  id: number;
  nivel: NivelConfiguracao;
  configuracao: string;
  estSeguranca: number;
  qtdMaxima: number;
  diasEstoque: number;
  consignado: boolean;
  ativo: boolean;
  criadoEm: string;
  criadoPor: string;
}

export const NIVEIS_CONFIGURACAO: NivelConfiguracao[] = [
  'Material / CD', 'Material', 'CD', 'Fornecedor / CD',
  'Fornecedor', 'Bandeira GMR / CD', 'Bandeira GMR', 'Curva',
];

export const MATERIAIS_DISPONIVEIS = [
  { codigo: '100830', nome: 'CLEXANE 40MG 10SP 0,4ML+SIST SEG' },
  { codigo: '101990', nome: 'LASIX C/S AMP 2ML' },
  { codigo: '107528', nome: 'DYSPORT 500 UI CX C/ 1 FR AMP' },
  { codigo: '107904', nome: 'KEYTRUDA 100MG/4ML SOL INJ X 4ML' },
  { codigo: '108130', nome: 'ANSENTRON 8 MG CX AMP 4ML' },
];

export const CDS_DISPONIVEIS = ['DF22', 'ES21', 'ES22', 'PE22', 'RJ24', 'RS21', 'RS23', 'SC21', 'SP26', 'SP27', 'SP28', 'SP34'];
