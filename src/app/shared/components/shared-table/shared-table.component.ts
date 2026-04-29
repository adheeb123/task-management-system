import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';



@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTableComponent {

}