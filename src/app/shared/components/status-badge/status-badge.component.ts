import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TaskStatus } from 'src/app/core/models/task.model';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadgeComponent {
  @Input() value!: string;
  @Input() type!: 'status' | 'priority';
}
