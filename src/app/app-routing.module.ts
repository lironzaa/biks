import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/data', pathMatch: 'full' },
  {
    path: 'data',
    loadChildren: () => import('./features/data/data.module').then(d => d.DataModule),
  },
  {
    path: 'analysis',
    loadChildren: () => import('./features/analysis/analysis.module').then(a => a.AnalysisModule),
  },
  {
    path: 'monitor',
    loadChildren: () => import('./features/monitor/monitor.module').then(m => m.MonitorModule),
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
