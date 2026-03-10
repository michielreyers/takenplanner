import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewTask, Task, TaskStatus } from '../task.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'mr-task-dialog',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    DatePipe,
  ],
  templateUrl: './taskdialog.component.html',
  styleUrl: './taskdialog.component.scss',
})
export class TaskDialogComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialogData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef: MatDialogRef<any> = inject(MatDialogRef);

  protected readonly TaskStatus = TaskStatus;
  protected readonly newTask: boolean = !this.dialogData.task.id;

  protected taskform: FormGroup = this.getForm(this.dialogData.task);
  protected creationDate: Date | undefined = this.dialogData.task.createDate;

  protected getForm(task: Task | NewTask): FormGroup {
    return this.fb.group({
      name: this.fb.control<string>(task.name, [Validators.minLength(5)]),
      description: this.fb.control<string>(task.description),
      status: this.fb.control<string>(task.status.toString()),
    });
  }

  protected save(): void {
    if (this.newTask) {
      this.dialogRef.close({ ...this.dialogData, action: 'create', task: this.taskform.value });
    } else {
      const task = {
        ...this.dialogData.task,
        ...this.taskform.value,
      };
      this.dialogRef.close({ ...this.dialogData, action: 'save', task });
    }
  }

  protected cancel(): void {
    this.dialogRef.close({ ...this.dialogData, action: 'cancel' });
  }

  protected delete(): void {
    this.dialogRef.close({ ...this.dialogData, action: 'delete' });
  }
}
