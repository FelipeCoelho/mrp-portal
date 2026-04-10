import { Routes } from '@angular/router';
import { CentroDeDistribuicaoComponent } from './pages/centro-de-distribuicao/centro-de-distribuicao';
import { AltaDeMedicamentoComponent } from './pages/alta-de-medicamento/alta-de-medicamento';
import { ContratoComponent } from './pages/contrato/contrato';
import { FrequenciaExecucaoComponent } from './pages/frequencia-execucao/frequencia-execucao';
import { RelatoriosComponent } from './pages/relatorios/relatorios';
import { RelatorioPremissasComponent } from './pages/relatorio-premissas/relatorio-premissas';
import { RelatorioContratosComponent } from './pages/relatorio-contratos/relatorio-contratos';
import { RelatorioAltaMedicamentosComponent } from './pages/relatorio-alta-medicamentos/relatorio-alta-medicamentos';
import { RelatorioMrpComponent } from './pages/relatorio-mrp/relatorio-mrp';
import { CalculoMrpComponent } from './pages/calculo-mrp/calculo-mrp';
import { PremissasComponent } from './pages/premissas/premissas';

export const routes: Routes = [
  { path: '', redirectTo: 'centros-de-distribuicao', pathMatch: 'full' },
  { path: 'calculo-mrp', component: CalculoMrpComponent },
  { path: 'premissas-reabastecimento', component: PremissasComponent },
  { path: 'centros-de-distribuicao', component: CentroDeDistribuicaoComponent },
  { path: 'alta-de-medicamentos', component: AltaDeMedicamentoComponent },
  { path: 'contratos', component: ContratoComponent },
  { path: 'frequencia-execucao', component: FrequenciaExecucaoComponent },
  { path: 'relatorios', component: RelatoriosComponent },
  { path: 'relatorios/premissas', component: RelatorioPremissasComponent },
  { path: 'relatorios/contratos', component: RelatorioContratosComponent },
  { path: 'relatorios/alta-medicamentos', component: RelatorioAltaMedicamentosComponent },
  { path: 'relatorios/mrp', component: RelatorioMrpComponent },
];
