import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/data',
    pathMatch: 'full'
  },
  {
    path: 'data',
    loadComponent: () => import('./features/data/components/page-wrapper/data-page-wrapper').then(m => m.DataPageWrapper)
  },
  {
    path: 'analysis',
    loadComponent: () => import('./features/analysis/components/analysis/analysis').then(m => m.Analysis)
  },
  {
    path: 'monitor',
    loadComponent: () => import('./features/monitor/components/monitor/monitor').then(m => m.Monitor)
  }
];
