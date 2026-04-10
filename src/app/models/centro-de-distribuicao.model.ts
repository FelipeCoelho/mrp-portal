export type TipoIdentificacao = 'Abastecido via CD Pulmão' | 'CD Pulmão';
export type TipoPedido = 'Compra' | 'Transferência';

export interface CentroDistribuicao {
  id: number;
  codigo: string;
  tipoIdentificacao: TipoIdentificacao;
  tipoPedido: TipoPedido;
  cdsConsumidor: string[];
  cdsEstoqueAdicional: string[];
  ativo: boolean;
}

export const TIPOS_IDENTIFICACAO: TipoIdentificacao[] = ['Abastecido via CD Pulmão', 'CD Pulmão'];
export const TIPOS_PEDIDO: TipoPedido[] = ['Compra', 'Transferência'];

export const CODIGOS_CD = [
  'DF22', 'ES21', 'ES22', 'PE22', 'RJ24', 'RS21', 'RS23', 'SC21', 'SP26', 'SP27', 'SP28', 'SP34',
];

export const CDS_INICIAIS: CentroDistribuicao[] = [
  { id: 1, codigo: 'DF22', tipoIdentificacao: 'Abastecido via CD Pulmão', tipoPedido: 'Compra', cdsConsumidor: ['ES21'], cdsEstoqueAdicional: ['DF22'], ativo: true },
  { id: 2, codigo: 'ES21', tipoIdentificacao: 'Abastecido via CD Pulmão', tipoPedido: 'Compra', cdsConsumidor: [], cdsEstoqueAdicional: [], ativo: true },
  { id: 3, codigo: 'ES22', tipoIdentificacao: 'Abastecido via CD Pulmão', tipoPedido: 'Compra', cdsConsumidor: [], cdsEstoqueAdicional: [], ativo: true },
  { id: 4, codigo: 'PE22', tipoIdentificacao: 'Abastecido via CD Pulmão', tipoPedido: 'Compra', cdsConsumidor: [], cdsEstoqueAdicional: [], ativo: true },
  { id: 5, codigo: 'RJ24', tipoIdentificacao: 'Abastecido via CD Pulmão', tipoPedido: 'Compra', cdsConsumidor: [], cdsEstoqueAdicional: [], ativo: true },
  { id: 6, codigo: 'RS21', tipoIdentificacao: 'Abastecido via CD Pulmão', tipoPedido: 'Compra', cdsConsumidor: [], cdsEstoqueAdicional: [], ativo: true },
  { id: 7, codigo: 'RS23', tipoIdentificacao: 'Abastecido via CD Pulmão', tipoPedido: 'Compra', cdsConsumidor: [], cdsEstoqueAdicional: [], ativo: true },
  { id: 8, codigo: 'SC21', tipoIdentificacao: 'Abastecido via CD Pulmão', tipoPedido: 'Compra', cdsConsumidor: [], cdsEstoqueAdicional: [], ativo: true },
  { id: 9, codigo: 'SP26', tipoIdentificacao: 'Abastecido via CD Pulmão', tipoPedido: 'Compra', cdsConsumidor: [], cdsEstoqueAdicional: [], ativo: true },
  { id: 10, codigo: 'SP27', tipoIdentificacao: 'Abastecido via CD Pulmão', tipoPedido: 'Compra', cdsConsumidor: [], cdsEstoqueAdicional: [], ativo: true },
  { id: 11, codigo: 'SP28', tipoIdentificacao: 'Abastecido via CD Pulmão', tipoPedido: 'Compra', cdsConsumidor: [], cdsEstoqueAdicional: [], ativo: true },
];
