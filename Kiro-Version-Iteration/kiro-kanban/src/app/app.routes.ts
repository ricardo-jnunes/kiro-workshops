import { Routes } from '@angular/router';
import { KanbanPlaceholderComponent } from './adapters/components/kanban-placeholder/kanban-placeholder.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'kanban',
    pathMatch: 'full',
  },
  {
    path: 'kanban',
    component: KanbanPlaceholderComponent,
    title: 'Kanban',
  },
  {
    path: '**',
    redirectTo: 'kanban',
  },
];
