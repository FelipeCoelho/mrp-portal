export interface MrpLayout {
  id: number;
  nome: string;
  descricao: string;
  tipo: 'pessoal' | 'publico';
  padrao: boolean;
  colunas: string[];
}

export interface MrpColuna {
  id: string;
  nome: string;
  grupo: string;
  descricao: string;
  visivel: boolean;
}

export interface MrpRegistro {
  codigoMaterial: string;
  descricaoMaterial: string;
  codigoCd: string;
  descCd: string;
  codigoFornecedor: string;
  descFornecedor: string;
  bandeiraCmr: string;
  curva: string;
  quantidadeSugerida: number;
  quantidadeProposta: number;
  precoFabricaSemRepasse: number;
  precoLiquido: number;
  precoFabricaSemRepasseEst: number;
  precoLiquidoEst: number;
  qtdReporSemConsignado: number;
  qtdReporComConsignado: number;
  estoqueTotalLivre: number;
  estoqueTotal: number;
  rsEstoqueTotal: number;
  saldoBloqueado: number;
  diasEstoqueLivre: number;
  diasEstoqueConsignacao: number;
  diasEstoqueSimulado: number;
  estoqueProjetadoSemConsig: number;
  diasEstoqueProjetadoSemConsig: number;
  estoqueProjetadoComConsig: number;
  diasEstoqueProjetadoComConsig: number;
  premissaAcatada: string;
  statusEstoqueSegAtual: string;
  statusEstoqueSegProjetada: string;
  qtdMaxEstoqueAtual: string;
  qtdMaxEstoqueProjetada: string;
  riscoFalta30: string;
  riscoFalta60: string;
  leadTimeTotal: number;
  consignado: string;
}

export const GRUPOS_COLUNAS: { grupo: string; colunas: MrpColuna[] }[] = [
  {
    grupo: 'Dados de Materiais',
    colunas: [
      { id: 'codigoMaterial', nome: 'Código Material', grupo: 'Dados de Materiais', descricao: 'Código do material', visivel: true },
      { id: 'descricaoMaterial', nome: 'Descrição Material', grupo: 'Dados de Materiais', descricao: 'Descrição do material', visivel: true },
      { id: 'codigoFornecedor', nome: 'Código Fornecedor', grupo: 'Dados de Materiais', descricao: 'Código do fornecedor', visivel: true },
      { id: 'descFornecedor', nome: 'Desc. Fornecedor', grupo: 'Dados de Materiais', descricao: 'Descrição do fornecedor', visivel: true },
      { id: 'codigoMaterial2', nome: 'Código Material', grupo: 'Dados de Materiais', descricao: 'Código do material', visivel: true },
    ],
  },
  {
    grupo: 'Dados do CD',
    colunas: [
      { id: 'codigoCd', nome: 'Código CD', grupo: 'Dados do CD', descricao: 'Código do CD', visivel: true },
      { id: 'descCd', nome: 'Descrição CD', grupo: 'Dados do CD', descricao: 'Descrição do CD', visivel: true },
      { id: 'bandeiraCmr', nome: 'Bandeira CMR', grupo: 'Dados do CD', descricao: 'Bandeira CMR', visivel: true },
      { id: 'curva', nome: 'Curva', grupo: 'Dados do CD', descricao: 'Curva ABC', visivel: true },
    ],
  },
  {
    grupo: 'Cálculos MRP',
    colunas: [
      { id: 'quantidadeSugerida', nome: 'Quantidade Sugerida', grupo: 'Cálculos MRP', descricao: 'Quantidade sugerida pelo MRP', visivel: true },
      { id: 'quantidadeProposta', nome: 'Quantidade Proposta', grupo: 'Cálculos MRP', descricao: 'Quantidade proposta', visivel: true },
    ],
  },
  {
    grupo: 'Cálculo - Estoque do Material',
    colunas: [
      { id: 'precoFabricaSemRepasse', nome: 'Preço Fábrica sem Repasse', grupo: 'Cálculo - Estoque do Material', descricao: 'Preço Fábrica - (Preço Fábrica * (Repasse/100))', visivel: true },
      { id: 'precoLiquido', nome: 'Preço Líquido', grupo: 'Cálculo - Estoque do Material', descricao: 'Preço Fábrica sem Repasse - descontos', visivel: true },
      { id: 'qtdReporSemConsignado', nome: 'Qtd a Repor Sugerida MRP sem C...', grupo: 'Cálculo - Estoque do Material', descricao: '((Forecast * (Dias Estoque+30)/30) - Saldo Consignação)', visivel: true },
      { id: 'qtdReporComConsignado', nome: 'Qtd a Repor Sugerida MRP c/ Con...', grupo: 'Cálculo - Estoque do Material', descricao: '((Forecast * (Dias Estoque+30)/30) + Saldo Consignação)', visivel: true },
      { id: 'estoqueTotalLivre', nome: 'Estoque Total Livre', grupo: 'Cálculo - Estoque do Material', descricao: 'Qtd Estoque Livre + Qtd CQ + Saldo Consignação', visivel: true },
      { id: 'estoqueTotal', nome: 'Estoque Total', grupo: 'Cálculo - Estoque do Material', descricao: 'Soma de todos os saldos', visivel: true },
      { id: 'rsEstoqueTotal', nome: 'R$ Estoque Total', grupo: 'Cálculo - Estoque do Material', descricao: 'Estoque Total * Preço Líquido', visivel: true },
      { id: 'saldoBloqueado', nome: 'Saldo Bloqueado', grupo: 'Cálculo - Estoque do Material', descricao: 'Reserva do cliente * Consumo Venda Média Diária', visivel: true },
      { id: 'diasEstoqueLivre', nome: 'Dias de Estoque Livre', grupo: 'Cálculo - Estoque do Material', descricao: '(Qtd Estoque Livre + Qtd CQ) / (Forecast/30)', visivel: true },
      { id: 'diasEstoqueConsignacao', nome: 'Dias de Estoque c/ Consignação', grupo: 'Cálculo - Estoque do Material', descricao: 'Estoque Total / (Forecast/30)', visivel: true },
      { id: 'diasEstoqueSimulado', nome: 'Dias Estoque Simulado', grupo: 'Cálculo - Estoque do Material', descricao: 'Estoque completo / (Forecast/30)', visivel: true },
      { id: 'estoqueProjetadoSemConsig', nome: 'Estoque Projetado sem Consignado', grupo: 'Cálculo - Estoque do Material', descricao: 'Estoque + Pendências + Qtd Repor - Falta Vender', visivel: true },
      { id: 'diasEstoqueProjetadoSemConsig', nome: 'Dias Estoque Projetado sem Consignado', grupo: 'Cálculo - Estoque do Material', descricao: 'Estoque Projetado / (Forecast/30)', visivel: true },
      { id: 'estoqueProjetadoComConsig', nome: 'Estoque Projetado c/ Consignado', grupo: 'Cálculo - Estoque do Material', descricao: 'Estoque + Pendências + Qtd Repor c/ Consig - Falta Vender', visivel: true },
      { id: 'diasEstoqueProjetadoComConsig', nome: 'Dias Estoque Projetado c/ Consignado', grupo: 'Cálculo - Estoque do Material', descricao: 'Estoque Projetado c/ Consig / (Forecast/30)', visivel: true },
      { id: 'premissaAcatada', nome: 'Qual Premissa o MRP Acatou', grupo: 'Cálculo - Estoque do Material', descricao: 'Sequência: Material/CD, Material, CD, Fornecedor/CD...', visivel: true },
      { id: 'statusEstoqueSegAtual', nome: 'Status Estoque de Segurança Atual', grupo: 'Cálculo - Estoque do Material', descricao: 'Se Estoque Total Livre < Estoque Segurança', visivel: true },
      { id: 'statusEstoqueSegProjetada', nome: 'Status Estoque de Segurança Projetada', grupo: 'Cálculo - Estoque do Material', descricao: 'Se Estoque Projetado < Estoque Segurança', visivel: true },
      { id: 'qtdMaxEstoqueAtual', nome: 'Quantidade Máxima de Estoque Atual', grupo: 'Cálculo - Estoque do Material', descricao: 'Se Estoque Total Livre > Qtd Máxima', visivel: true },
      { id: 'qtdMaxEstoqueProjetada', nome: 'Quantidade Máxima de Estoque Projetada', grupo: 'Cálculo - Estoque do Material', descricao: 'Se Estoque Projetado > Qtd Máxima', visivel: true },
      { id: 'riscoFalta30', nome: 'Risco de Falta de Estoque em 30 dias', grupo: 'Cálculo - Estoque do Material', descricao: 'Se Dias Estoque c/ Consignação < 30 então Alto', visivel: true },
      { id: 'riscoFalta60', nome: 'Risco de Falta de Estoque em 60 dias', grupo: 'Cálculo - Estoque do Material', descricao: 'Se Dias Estoque c/ Consignação < 60 então Alto', visivel: true },
      { id: 'leadTimeTotal', nome: 'Lead-Time Total', grupo: 'Cálculo - Estoque do Material', descricao: 'Lead Time Externo + Lead Time Interno', visivel: true },
    ],
  },
];

export const TODAS_COLUNAS: MrpColuna[] = GRUPOS_COLUNAS.flatMap((g) => g.colunas);
