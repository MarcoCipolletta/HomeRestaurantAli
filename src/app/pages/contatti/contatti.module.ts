import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';

import { ContattiRoutingModule } from './contatti-routing.module';
import { ContattiComponent } from './contatti.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';
import { SharedPopupModule } from '../../shared/shared-popup/shared-popup.module';

@NgModule({
  declarations: [ContattiComponent],
  imports: [
    CommonModule,
    ContattiRoutingModule,
    GoogleMapsModule,
    FormsModule,
    SharedPopupModule,
    NgbToastModule,
    NgTemplateOutlet,
  ],
})
export class ContattiModule {}
