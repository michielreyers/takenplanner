import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { TaskStore } from './taskstore/task.store';

export const appConfig: ApplicationConfig = {
  providers: [TaskStore, provideBrowserGlobalErrorListeners(), provideRouter(routes)],
};
