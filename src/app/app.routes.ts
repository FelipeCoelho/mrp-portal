import { Routes } from '@angular/router';
import { EstadoComponent } from './pages/estado/estado';
import { ConsumoMaterialComponent } from './pages/consumo-material/consumo-material';
import { ContratoComponent } from './pages/contrato/contrato';
import { RastreabilidadeComponent } from './pages/rastreabilidade/rastreabilidade';

export const routes: Routes = [
  { path: '', redirectTo: 'estados', pathMatch: 'full' },
  { path: 'estados', component: EstadoComponent },
  { path: 'consumo-materiais', component: ConsumoMaterialComponent },
  { path: 'contratos', component: ContratoComponent },
  { path: 'rastreabilidade', component: RastreabilidadeComponent },
];
