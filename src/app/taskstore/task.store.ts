import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { mockTaskList, NewTask, Task, TaskStatus } from '../task/task.model';
import { computed } from '@angular/core';
import { UniqueIdService } from '../task/uniqueid.service';

interface TaskStoreState {
  tasks: Task[];
}

const initialState: TaskStoreState = {
  tasks: updateTaskOrders(mockTaskList),
};

export const TaskStore = signalStore(
  withState(initialState),
  withComputed((state) => ({
    tasksToDo: computed(() => state.tasks().filter((task) => task.status === TaskStatus.TODO)),
    tasksInProgress: computed(() =>
      state.tasks().filter((task) => task.status === TaskStatus.IN_PROGRESS),
    ),
    tasksDone: computed(() => state.tasks().filter((task) => task.status === TaskStatus.DONE)),
  })),

  withMethods((state) => ({
    getTask: (taskId: string) => state.tasks().find((task) => task.id === taskId),

    updateTask: (task: Task) => {
      const taskIndex = state.tasks().findIndex((t) => t.id === task.id);
      if (taskIndex === -1) {
        console.error('task no longer exists');
        return;
      } else {
        const tasks = state.tasks().filter((t) => t.id !== task.id);
        patchState(state, { tasks: updateTaskOrders([...tasks, task]) });
      }
    },

    addTask: (task: NewTask) => {
      const newTask: Task = {
        id: UniqueIdService.getId(),
        createDate: new Date(),
        ...task,
      };
      patchState(state, { tasks: updateTaskOrders([...state.tasks(), newTask]) });
    },

    deleteTask: (task: Task) => {
      const tasks = state.tasks().filter((t) => t.id !== task.id);
      patchState(state, { tasks: updateTaskOrders(tasks) });
    },

    moveTask: (taskId: string, targetStatus: TaskStatus, newIndex: number) => {
      const task = state.tasks().find((t) => t.id === taskId);
      const newTask: Task = {
        ...task!,
        status: targetStatus,
        order: newIndex,
      };
      const tasks = state.tasks().filter((t) => t.id !== taskId);
      patchState(state, { tasks: updateTaskOrders([...tasks, newTask]) });
    },
  })),
);

function updateTaskOrders(tasks: Task[]): Task[] {
  const result: Task[] = [];
  for (const [_key, value] of Object.entries(TaskStatus)) {
    result.push(
      ...tasks
        .filter((task) => task.status === value)
        .sort(compareTaskOrder)
        .map((task, index) => ({
          ...task,
          order: index,
        })),
    );
  }
  return result;
}

function compareTaskOrder(task1: Task, task2: Task) {
  // tasks with no order come last (high order)
  const order1 = task1.order ?? Number.MAX_VALUE;
  const order2 = task2.order ?? Number.MAX_VALUE;
  return order1 - order2;
}
