import { Component, inject } from '@angular/core';
import { TaskStore } from '../taskstore/task.store';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { NewTask, Task, TaskStatus } from './task.model';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskDialogComponent } from './taskdialog/taskdialog.component';

@Component({
  selector: 'mr-task',
  imports: [MatCardModule, MatDialogModule],
  template: '',
})
export class TaskModal {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly taskStore = inject(TaskStore);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  constructor() {
    this.activeRoute.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const taskId = params.get('taskId') ?? '';

      if (taskId === 'new') {
        this.makeNewTask();
        return;
      }

      const task = this.taskStore.getTask(taskId);
      if (task) {
        this.editTask(task);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  private makeNewTask(): void {
    const newTask: NewTask = {
      name: '',
      description: '',
      status: TaskStatus.TODO,
    };
    this.openTaskDialog(newTask);
  }

  private editTask(task: Task): void {
    this.openTaskDialog(task);
  }

  private openTaskDialog(task: Task | NewTask) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.height = '700px';
    dialogConfig.width = '2000px';
    dialogConfig.data = { task };

    let dialogRef = this.dialog.open(TaskDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      switch (result?.action) {
        case 'save':
          this.taskStore.updateTask(result.task);
          break;

        case 'create':
          this.taskStore.addTask(result.task);
          break;

        case 'delete':
          this.taskStore.deleteTask(result.task);
          break;

        default:
          // cancel or backdrop click
          break;
      }

      this.router.navigate(['/']);
    });
  }
}
