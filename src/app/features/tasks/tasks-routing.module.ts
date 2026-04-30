// tasks-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskFormComponent } from './pages/task-form/task-form.component';
import { authGuard } from 'src/app/core/auth/auth.gaurd';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';



const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard], 
    children: [
      { path: '', component: TaskListComponent },
      { path: 'add', component: TaskFormComponent },
      { path: 'edit/:id', component: TaskFormComponent },
      { path: ':id', component: TaskDetailsComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }