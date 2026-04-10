import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface Relatorio {
  titulo: string;
  descricao: string;
  rota: string | null;
}

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.css',
})
export class RelatoriosComponent {
  private router = inject(Router);

  readonly relatorios: Relatorio[] = [
    {
      titulo: 'Relatório de Premissas',
      descricao: 'Listagem de premissas de reabastecimento com rastreabilidade',
      rota: '/relatorios/premissas',
    },
    {
      titulo: 'Relatório de Contratos',
      descricao: 'Contratos com clientes incluindo metas de consumo mensal',
      rota: '/relatorios/contratos',
    },
    {
      titulo: 'Relatório de Alta de Medicamentos',
      descricao: 'Materiais classificados nos níveis de alta de medicamentos',
      rota: '/relatorios/alta-medicamentos',
    },
    {
      titulo: 'Relatório MRP - Sugestão x Alteração',
      descricao: 'Análise de alterações nas quantidades propostas pelo MRP',
      rota: '/relatorios/mrp',
    },
  ];

  abrirRelatorio(relatorio: Relatorio): void {
    if (relatorio.rota) {
      this.router.navigate([relatorio.rota]);
    } else {
      alert(`"${relatorio.titulo}" em desenvolvimento.`);
    }
  }
}
