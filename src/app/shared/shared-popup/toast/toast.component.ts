import { Component, inject, TemplateRef } from '@angular/core';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  toastSvc = inject(ToastService);

  ngOnDestroy(): void {
    this.toastSvc.toast = null;
  }
}
