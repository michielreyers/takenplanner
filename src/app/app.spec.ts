import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskBoardApp } from './app';
import { TaskStore } from './taskstore/task.store';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { Router } from '@angular/router';

describe('App', () => {
  let fixture: ComponentFixture<TaskBoardApp>;
  let app: TaskBoardApp;
  let compiled: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskBoardApp],
      providers: [TaskStore, provideRouter(routes)],
    }).compileComponents();
    fixture = TestBed.createComponent(TaskBoardApp);
    app = fixture.componentInstance;
    await fixture.whenStable();
    compiled = fixture.nativeElement as HTMLElement;
  });

  it('should render title', async () => {
    expect(compiled.querySelector('h1')?.textContent).toContain('Taken');
  });

  it('should render 6 tasks', async () => {
    expect(compiled.querySelectorAll('.task').length).toBe(6);
  });

  it('should open the task modal for an existing task', async () => {
    const taskLink = compiled.querySelector('a[href*=mrid-2]') as HTMLAnchorElement;
    expect(taskLink?.textContent).toContain('Unit tests');

    const router = TestBed.inject(Router);
    taskLink.click();
    await fixture.whenStable();
    expect(router.url).toContain('/task/mrid-2');
  });

  it('should open the task modal for a new task', async () => {
    const newButton = compiled.querySelector('#header button') as HTMLAnchorElement;
    expect(newButton?.textContent).toContain('Nieuwe Taak');

    const router = TestBed.inject(Router);
    newButton.click();
    await fixture.whenStable();
    expect(router.url).toContain('/task/new');
  });
});
