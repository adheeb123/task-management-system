import { Injectable, TemplateRef } from '@angular/core';

export interface Toast {
  textOrTpl: string | TemplateRef<any>;
  classname?: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  // Generic show method
  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  // Helper for Success
  showSuccess(message: string) {
    this.show(message, { classname: 'bg-success text-light', delay: 3000 });
  }

  // Helper for Errors
  showError(message: string) {
    this.show(message, { classname: 'bg-danger text-light', delay: 5000 });
  }

  // Helper for Warnings
  showWarning(message: string) {
    this.show(message, { classname: 'bg-warning text-dark', delay: 4000 });
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}