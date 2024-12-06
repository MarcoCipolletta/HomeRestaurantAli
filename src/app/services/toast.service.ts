import { Injectable, TemplateRef } from '@angular/core';

export interface Toast {
  template: TemplateRef<any>;
  classname?: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast: Toast | null = null;

  show(toast: Toast) {
    this.toast = toast;
  }

  remove() {
    this.toast = null;
  }

  // clear() {
  //   this.toasts.splice(0, this.toasts.length);
  // }
}
