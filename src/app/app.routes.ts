import { Routes } from '@angular/router';
import { TaskModal } from './task/task-modal.component';

export const routes: Routes = [
  {
    path: 'task/:taskId',
    component: TaskModal,
  },
];
