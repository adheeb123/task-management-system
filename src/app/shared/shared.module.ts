import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedTableComponent } from './components/shared-table/shared-table.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { FormFieldComponent } from './components/form-field/form-field.component';

@NgModule({
  declarations: [
    SharedTableComponent,
    StatusBadgeComponent,
    ConfirmationDialogComponent,
    FormFieldComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    SharedTableComponent,
    StatusBadgeComponent,
    ConfirmationDialogComponent,
    FormFieldComponent
  ]
})
export class SharedModule { }