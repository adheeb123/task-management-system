import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, of, combineLatest, map } from 'rxjs';
import { TaskService } from '../../services/task.service';


@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailsComponent {


  taskId = Number(this.route.snapshot.paramMap.get('id'));

  vm$ = this.taskService.getTaskById(this.taskId).pipe(
    switchMap(task => {
      if (!task) return of(null);
      return combineLatest([
        of(task),
        this.taskService.getUserById(task.assignedTo)
      ]);
    }),
    map(result => {
      if (!result) return null;
      const [task, user] = result;
      return {
        task,
        user,
        history: [
          'Task created',
          'Assigned to employee',
          'Status updated'
        ]
      };
    })
  );

  constructor(private route: ActivatedRoute, private taskService: TaskService) { }

}