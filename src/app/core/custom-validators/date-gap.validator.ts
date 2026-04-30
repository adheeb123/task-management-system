import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateGapValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const start = control.get('startDate')?.value;
  const end = control.get('dueDate')?.value;

  // If fields are empty, don't return errors (let Validators.required handle that)
  if (!start || !end) return null;

  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();

  // Calculate difference in days
  const diffInDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

  // If gap is less than 2 days, return error object
  return diffInDays < 2 ? { gapTooSmall: true } : null;
};