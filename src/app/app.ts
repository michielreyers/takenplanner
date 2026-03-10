import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { TaskStore } from './taskstore/task.store';
import { MatButtonModule } from '@angular/material/button';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { TaskStatus } from './task/task.model';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class TaskBoardApp {
  private readonly taskStore = inject(TaskStore);

  protected taskLists = [
    { title: 'To Do', tasks: this.taskStore.tasksToDo, status: TaskStatus.TODO },
    { title: 'In Progress', tasks: this.taskStore.tasksInProgress, status: TaskStatus.IN_PROGRESS },
    { title: 'Done', tasks: this.taskStore.tasksDone, status: TaskStatus.DONE },
  ];

  protected onTaskDrop(event: any): void {
    const targetStatus = event.container.data.status;
    const originalStatus = event.previousContainer.data.status;
    const originalIndex = event.previousIndex;
    const targetIndex = event.currentIndex;
    const taskId = event.item.data.id;
    let newIndex =
      originalStatus === targetStatus && targetIndex > originalIndex
        ? targetIndex + 0.5
        : targetIndex - 0.5;

    this.taskStore.moveTask(taskId, targetStatus, newIndex);
  }
}
