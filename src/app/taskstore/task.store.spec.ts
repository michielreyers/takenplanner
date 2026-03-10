import { TaskStore } from './task.store';
import { Task, TaskStatus, NewTask } from '../task/task.model';

describe('TaskStore', () => {
  let store: InstanceType<typeof TaskStore>;

  beforeEach(() => {
    store = new TaskStore();
  });

  describe('computed properties', () => {
    it('should filter tasks by TODO status', () => {
      const todoTasks = store.tasksToDo();
      expect(todoTasks.length).toBeGreaterThan(0);
      expect(todoTasks.every((task) => task.status === TaskStatus.TODO)).toBe(true);
    });

    it('should filter tasks by IN_PROGRESS status', () => {
      const inProgressTasks = store.tasksInProgress();
      expect(inProgressTasks.length).toBeGreaterThan(0);
      expect(inProgressTasks.every((task) => task.status === TaskStatus.IN_PROGRESS)).toBe(true);
    });

    it('should filter tasks by DONE status', () => {
      const doneTasks = store.tasksDone();
      expect(doneTasks.length).toBeGreaterThan(0);
      expect(doneTasks.every((task) => task.status === TaskStatus.DONE)).toBe(true);
    });
  });

  describe('getTask', () => {
    it('should return a task by id', () => {
      const tasks = store.tasks();
      const firstTask = tasks[0];
      expect(firstTask.id).toBeDefined();
      const foundTask = store.getTask(firstTask.id);
      expect(foundTask).toEqual(firstTask);
    });

    it('should return undefined for non-existent task id', () => {
      const foundTask = store.getTask('non-existent-id');
      expect(foundTask).toBeUndefined();
    });
  });

  describe('addTask', () => {
    it('should add a new task to the store', () => {
      const initialCount = store.tasks().length;
      const newTask: NewTask = {
        name: 'New Task',
        description: 'Test',
        status: TaskStatus.TODO,
      };
      store.addTask(newTask);
      expect(store.tasks().length).toBe(initialCount + 1);
      expect(store.tasks().some((t) => t.name === 'New Task')).toBe(true);
    });

    it('should assign a unique id to new task', () => {
      const newTask: NewTask = {
        name: 'Task',
        description: 'Test',
        status: TaskStatus.TODO,
      };
      store.addTask(newTask);
      const addedTask = store.tasks().find((t) => t.name === 'Task');
      expect(addedTask?.id).toBeDefined();
      expect(typeof addedTask?.id).toBe('string');
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', () => {
      const task = store.tasks()[0];
      const updatedTask: Task = {
        ...task,
        name: 'Updated Title',
      };
      store.updateTask(updatedTask);
      const foundTask = store.getTask(task.id);
      expect(foundTask?.name).toBe('Updated Title');
    });

    it('should not update non-existent task', () => {
      const nonExistentTask: Task = {
        id: 'non-existent',
        name: 'Test',
        description: '',
        status: TaskStatus.TODO,
        order: 0,
        createDate: new Date(),
      };
      const initialCount = store.tasks().length;
      store.updateTask(nonExistentTask);
      expect(store.tasks().length).toBe(initialCount);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task from the store', () => {
      const tasksCount = store.tasks().length;
      const taskToDelete = store.tasks()[0];
      store.deleteTask(taskToDelete);
      expect(store.tasks().length).toBe(tasksCount - 1);
      expect(store.getTask(taskToDelete.id)).toBeUndefined();
    });
  });

  describe('moveTask', () => {
    it('should update task order when moving down in the same column column', () => {
      expect(mapTaskToName(store.tasksToDo())).toEqual([
        'Unit tests',
        'End to end tests',
        'Taak aanmaken',
        'Taak verslepen',
      ]);
      const task = store.tasksToDo()[0];
      store.moveTask(task.id, TaskStatus.TODO, 3.5);
      expect(mapTaskToName(store.tasksToDo())).toEqual([
        'End to end tests',
        'Taak aanmaken',
        'Taak verslepen',
        'Unit tests',
      ]);
    });

    it('should update task order when moving up in the same column column', () => {
      expect(mapTaskToName(store.tasksToDo())).toEqual([
        'Unit tests',
        'End to end tests',
        'Taak aanmaken',
        'Taak verslepen',
      ]);
      const task = store.tasksToDo()[2];
      store.moveTask(task.id, TaskStatus.TODO, -0.5);
      expect(mapTaskToName(store.tasksToDo())).toEqual([
        'Taak aanmaken',
        'Unit tests',
        'End to end tests',
        'Taak verslepen',
      ]);
    });
    it('should move task to a different status', () => {
      expect(mapTaskToName(store.tasksToDo())).toEqual([
        'Unit tests',
        'End to end tests',
        'Taak aanmaken',
        'Taak verslepen',
      ]);
      const task = store.tasksToDo()[0];
      store.moveTask(task.id, TaskStatus.DONE, 3);
      const movedTask = store.getTask(task.id);
      expect(movedTask?.order).toBe(1);
      expect(movedTask?.status).toBe(TaskStatus.DONE);
      expect(mapTaskToName(store.tasksToDo())).toEqual([
        'End to end tests',
        'Taak aanmaken',
        'Taak verslepen',
      ]);
      expect(mapTaskToName(store.tasksDone())).toContain('Unit tests');
    });
  });
});

function mapTaskToName(tasks: Task[]): string[] {
  return tasks.map((t) => t.name);
}
