import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { TaskStatus, TaskPriority } from 'src/app/core/models/task.model';
import { TaskService } from '../../services/task.service';
import { dateGapValidator } from 'src/app/core/custom-validators/date-gap.validator';
import { ToastService } from 'src/app/core/ngb-toaster/toast.service';



@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent implements OnInit, OnDestroy {
  taskForm!: FormGroup;
  isEditMode = false;
  taskId: number | null = null;
  users: User[] = [];
  private destroy$ = new Subject<void>();

  // Dropdown Options
  priorities: TaskPriority[] = ['High', 'Medium', 'Low'];
  statuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService, // Inject your new service
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // 1. Load users for the dropdown
    this.taskService.users$
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => this.users = users);

    // 2. Check if we are in Edit Mode via Route Params
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.loadTaskForEdit(this.taskId);
      }
    });
  }

  private initForm() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      assignedTo: [null, Validators.required],
      priority: ['Medium', Validators.required],
      status: ['Pending', Validators.required],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required],
    }, {
      // This is where cross-field validators go
      validators: [dateGapValidator]
    });
  }

  private loadTaskForEdit(id: number) {
    this.taskService.getTaskById(id).subscribe(task => {
      if (task) {
        // Create a copy and format dates for the HTML input
        const formattedTask = {
          ...task,
          startDate: task.startDate ? task.startDate.split('T')[0] : '',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
        };

        this.taskForm.patchValue(formattedTask);

      }
    });
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      this.showValidationError();
      return;
    }

    const taskData = this.prepareTaskData();

    // Choose the operation (Create or Update)
    const operation$ = (this.isEditMode && this.taskId)
      ? this.taskService.updateTask(this.taskId, taskData)
      : this.taskService.createTask(taskData);

    // Single subscription to handle the toast and navigation
    operation$.subscribe({
      next: () => this.onSuccess(this.isEditMode ? 'updated' : 'created'),
      error: () => this.toastService.showError('An error occurred while saving the task.')
    });
  }

  onDelete() {
    // 1. Guard Clause: Early exit if no ID or user cancels
    if (!this.taskId || !confirm('Are you sure you want to delete this task?')) {
      return;
    }

    // 2. Perform the delete operation
    this.taskService.deleteTask(this.taskId).subscribe({
      next: () => {
        // Show the success toast
        this.toastService.showSuccess('Task deleted successfully!');

        // Navigate back to the task list
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        // Show an error toast if the API fails
        this.toastService.showError('Could not delete the task. Please try again.');
        console.error('Delete error:', err);
      }
    });
  }

  /** 
   * Optimized Helper Methods 
   */

  private prepareTaskData() {
    return {
      ...this.taskForm.value,
      assignedTo: Number(this.taskForm.value.assignedTo),
      createdDate: this.isEditMode ? this.taskForm.value.createdDate : new Date().toISOString()
    };
  }

  private showValidationError() {
    this.taskForm.markAllAsTouched();
    const message = this.taskForm.hasError('gapTooSmall')
      ? 'Due Date must be at least 2 days after the Start Date.'
      : 'Please fix the errors in the form.';
    this.toastService.showError(message);
  }

  private onSuccess(action: string) {
    this.toastService.showSuccess(`Task ${action} successfully!`);
    this.router.navigate(['/tasks']);
  }

  onCancel() {
    this.router.navigate(['/tasks']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}