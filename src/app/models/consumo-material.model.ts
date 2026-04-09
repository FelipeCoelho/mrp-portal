export interface ConsumoMaterial {
  id: number;
  descricao: string;
  precoFabrica: number;
  repasse: number;
  demandaMesAtual: number;
  demandaConsignado3Meses: number;
  demandaConsignado2Meses: number;
  demandaConsignadoUltimoMes: number;
  forecast: number;
  proposta: number;
  precoLiquido: number;

  // Campos calculados (readonly na interface, calculados no service)
  precoFabricaSemRepasse?: number;
  consumoMedioDiario?: number;
  vendaMediaEstoqueConsignacao?: number;
  qtdeFaltaVender?: number;
  vendaRealProjetada?: number;
  variacaoForecastVendaReal?: number;
  valorTotalLiquido?: number;
}
