import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { Task } from '../../../core/models/task.model';
import { User } from '../../../core/models/user.model';
import { Activity } from '../../../core/models/activity.model';
import { TaskView } from '../../../core/models/task-view.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`);
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/tasks/${id}`);
  }

  createTask(payload: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, payload);
  }

  updateTask(id: number, payload: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, payload);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  getActivitiesByTask(taskId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/activities?taskId=${taskId}`);
  }

  getTaskListView(): Observable<TaskView[]> {
    return forkJoin({
      tasks: this.getTasks(),
      users: this.getUsers()
    }).pipe(
      map(({ tasks, users }) =>
        tasks.map(task => ({
          ...task,
          assignedUserName: users.find(user => user.id === task.assignedTo)?.name || 'Unknown'
        }))
      )
    );
  }

  getTaskDetails(id: number) {
    return this.getTask(id).pipe(
      map(task => task)
    );
  }
}