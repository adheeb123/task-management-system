import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastService } from 'src/app/core/ngb-toaster/toast.service';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];

  @Output() sort = new EventEmitter<string>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();   // New
  @Output() delete = new EventEmitter<any>(); // New

  onSort(key: string) { this.sort.emit(key); }
  onRowClick(row: any) { this.rowClick.emit(row); }
  constructor(private toastService: ToastService) { }
  onEditClick(event: Event, row: any) {
    event.stopPropagation(); // Prevents rowClick (navigation)
    this.edit.emit(row);
  }

  onDeleteClick(event: Event, row: any) {
    this.toastService.showSuccess('Task deleted  successfully!');
    event.stopPropagation(); // Prevents rowClick (navigation)
    this.delete.emit(row);
  }
}