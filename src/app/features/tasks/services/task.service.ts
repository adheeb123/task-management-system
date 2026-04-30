import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, forkJoin, map, Observable, tap } from 'rxjs';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { User } from '../../../core/models/user.model';
import { Activity } from '../../../core/models/activity.model';
import { environment } from 'environments/environment';

type SortDirection = 'asc' | 'desc';

@Injectable({
  providedIn: 'root'
})
// This service will handle task management and task listing, including sorting and filtering, using the ng-bootstrap framework.

export class TaskService {
  // environment url
  private apiUrl = environment.apiUrl;

  // using subject for managing tasks
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private usersSubject = new BehaviorSubject<User[]>([]);
  private selectedTaskSubject = new BehaviorSubject<Task | null>(null);

  private searchSubject = new BehaviorSubject<string>('');
  private assigneeFilterSubject = new BehaviorSubject<number | null>(null);
  private statusFilterSubject = new BehaviorSubject<TaskStatus | ''>('');
  private sortFieldSubject = new BehaviorSubject<string>('createdDate');
  private sortDirectionSubject = new BehaviorSubject<SortDirection>('asc');
  private pageSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(5);

  tasks$ = this.tasksSubject.asObservable();
  users$ = this.usersSubject.asObservable();
  selectedSubject$ = this.selectedTaskSubject.asObservable();

  search$ = this.searchSubject.asObservable();
  assigneeFilter$ = this.assigneeFilterSubject.asObservable();
  statusFilter$ = this.statusFilterSubject.asObservable();
  sortField$ = this.sortFieldSubject.asObservable();
  sortDirection$ = this.sortDirectionSubject.asObservable();
  page$ = this.pageSubject.asObservable();
  pageSize$ = this.pageSizeSubject.asObservable();

  viewTasks$ = combineLatest([
    this.tasks$,
    this.users$,
    this.search$,
    this.assigneeFilter$,
    this.statusFilter$,
    this.sortField$,
    this.sortDirection$,
    this.page$,
    this.pageSize$
  ]).pipe(
    map(([tasks, users, search, assigneeId, status, sortField, sortDirection, page, pageSize]) => {
      let filtered = [...tasks];

      if (search.trim()) {
        const s = search.toLowerCase();
        filtered = filtered.filter(task => task.title.toLowerCase().includes(s));
      }

      if (assigneeId !== null) {
        filtered = filtered.filter(task => task.assignedTo === assigneeId);
      }

      if (status) {
        filtered = filtered.filter(task => task.status === status);
      }

      filtered = filtered.sort((a: any, b: any) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      const total = filtered.length;
      const start = (page - 1) * pageSize;
      const paged = filtered.slice(start, start + pageSize);

      return {
        data: paged.map(task => ({
          ...task,
          assignedUserName: users.find(u => u.id === task.assignedTo)?.name || '-'
        })),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      };
    })
  );

  constructor(private http: HttpClient) { }

  loadInitialData(): Observable<any> {
    return forkJoin({
      tasks: this.http.get<Task[]>(`${this.apiUrl}/tasks`),
      users: this.http.get<User[]>(`${this.apiUrl}/users`)
    }).pipe(
      tap(({ tasks, users }) => {
        this.tasksSubject.next(tasks);
        this.usersSubject.next(users);
      })
    );
  }

  selectTask(taskId: number) {
    const task = this.tasksSubject.value.find(t => t.id === taskId) || null;
    this.selectedTaskSubject.next(task);
  }

  // this method for searching
  setSearch(value: string) {
    this.searchSubject.next(value);
    this.pageSubject.next(1);
  }


  setAssigneeFilter(value: number | null) {
    this.assigneeFilterSubject.next(value);
    this.pageSubject.next(1);
  }

  setStatusFilter(value: TaskStatus | '') {
    this.statusFilterSubject.next(value);
    this.pageSubject.next(1);
  }

  setSort(field: string) {
    const currentField = this.sortFieldSubject.value;
    const currentDirection = this.sortDirectionSubject.value;

    if (currentField === field) {
      this.sortDirectionSubject.next(currentDirection === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortFieldSubject.next(field);
      this.sortDirectionSubject.next('asc');
    }
  }

  setPage(page: number) {
    this.pageSubject.next(page);
  }

  getTaskById(id: number): Observable<Task | undefined> {
    return this.tasks$.pipe(map(tasks => tasks.find(task => task.id === id)));
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.users$.pipe(map(users => users.find(user => user.id === id)));
  }

  createTask(payload: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, payload).pipe(
      tap(newTask => {
        this.tasksSubject.next([...this.tasksSubject.value, newTask]);
      })
    );
  }
  updateTask(id: number, payload: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, payload).pipe(
      tap(updatedTask => {
        const updated = this.tasksSubject.value.map(task =>
          task.id === id ? updatedTask : task
        );
        this.tasksSubject.next(updated);
        this.selectedTaskSubject.next(updatedTask);
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`).pipe(
      tap(() => {
        this.tasksSubject.next(this.tasksSubject.value.filter(t => t.id !== id));
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getActivitiesByTask(taskId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/activities?taskId=${taskId}`);
  }

}