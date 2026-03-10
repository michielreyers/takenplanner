import { UniqueIdService } from './uniqueid.service';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface NewTask {
  name: string;
  description: string;
  status: TaskStatus;
}

export interface Task extends NewTask {
  id: string;
  createDate: Date;
  order?: number;
}

const now = new Date();

export const mockTaskList: Task[] = [
  {
    id: UniqueIdService.getId(),
    createDate: now,
    name: 'Project opzetten',
    description: 'een hoop werk',
    status: TaskStatus.DONE,
  },
  {
    id: UniqueIdService.getId(),
    createDate: now,
    name: 'Taken lijst weergeven',
    description: 'een hoop werk',
    status: TaskStatus.IN_PROGRESS,
  },
  {
    id: UniqueIdService.getId(),
    createDate: now,
    name: 'Unit tests maken',
    description: 'ook best veel',
    status: TaskStatus.TODO,
  },
  {
    id: UniqueIdService.getId(),
    createDate: now,
    name: 'End to end tests maken',
    description: 'een hoop werk',
    status: TaskStatus.TODO,
  },
  {
    id: UniqueIdService.getId(),
    createDate: now,
    name: 'Taak kunnen aanmaken',
    description: 'een hoop werk',
    status: TaskStatus.TODO,
  },
  {
    id: UniqueIdService.getId(),
    createDate: now,
    name: 'Taak kunnen slepen',
    description: 'een hoop werk',
    status: TaskStatus.TODO,
  },
];
