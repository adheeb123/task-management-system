import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { TaskService } from '../../services/task.service';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { TableColumn } from '../../../../shared/components/shared-table/shared-table.component';
import { TaskView } from 'src/app/core/models/task-view.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit {
  loading = false;
  error = '';
  tasks: TaskView[] = [];
  columns: TableColumn[] = [
    { key: 'title', label: 'Task Title', sortable: true },
    { key: 'assignedUserName', label: 'Assigned To', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    { key: 'actions', label: 'Actions' }
  ];

  vm$ = this.taskService.viewTasks$;
  users$ = this.taskService.users$;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loading = true;
    this.error = '';

    this.taskService.loadInitialData()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          console.log('Initial data:', res);
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to load tasks';
        }
      });
  }

  onSearch(value: string): void {
    this.taskService.setSearch(value);
  }

  onStatusFilter(value: string): void {
    this.taskService.setStatusFilter(value as any);
  }

  onAssigneeFilter(value: string): void {
    this.taskService.setAssigneeFilter(value ? +value : null);
  }

  onSort(column: string): void {
    this.taskService.setSort(column);
  }

  onPageChange(page: number): void {
    this.taskService.setPage(page);
  }

  navigateToDetails(id: number): void {
    this.router.navigate(['/tasks', id]);
  }

  handleEdit(task: any) {
    this.router.navigate(['/tasks/edit', task.id]);
  }

  handleDelete(task: any) {
    if (confirm('Delete this task?')) {
      this.taskService.deleteTask(task.id).subscribe();
    }
  }
}