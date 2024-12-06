import { NgModule } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ToastComponent } from './toast/toast.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ToastComponent],
  imports: [CommonModule, NgbToastModule, NgTemplateOutlet],
  exports: [ToastComponent],
})
export class SharedPopupModule {}
