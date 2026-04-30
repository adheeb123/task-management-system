import { NgModule } from '@angular/core';
import { TasksRoutingModule } from './tasks-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { TaskFormComponent } from './pages/task-form/task-form.component';
import { ToastsContainer } from 'src/app/core/ngb-toaster/toast-container.component';

@NgModule({
  declarations: [
    TaskListComponent,
    TaskFormComponent,
    TaskDetailsComponent
  ],
  imports: [
    SharedModule,
    TasksRoutingModule,
    ToastsContainer
  ]
})
export class TasksModule {}