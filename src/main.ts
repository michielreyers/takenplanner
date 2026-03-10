import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { TaskBoardApp } from './app/app';

bootstrapApplication(TaskBoardApp, appConfig)
  .catch((err) => console.error(err));
