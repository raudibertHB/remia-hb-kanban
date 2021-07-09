import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'task',
        data: { pageTitle: 'kanbanApp.task.home.title' },
        loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
      },
      {
        path: 'developer',
        data: { pageTitle: 'kanbanApp.developer.home.title' },
        loadChildren: () => import('./developer/developer.module').then(m => m.DeveloperModule),
      },
      {
        path: 'column',
        data: { pageTitle: 'kanbanApp.column.home.title' },
        loadChildren: () => import('./column/column.module').then(m => m.ColumnModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
