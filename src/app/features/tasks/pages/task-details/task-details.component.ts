import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailsComponent implements OnInit {
 

  constructor(
   
  ) {}

  ngOnInit(): void {
   
  }

 
}