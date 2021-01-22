import { MaterialModule, PipeModule } from '@lcu/common';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BillingComponent } from './billing/billing.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CompleteComponent } from './complete/complete.component';
import { LcuBillingModule } from '@lowcodeunit/lcu-billing-common';
import { PlansComponent } from './plans/plans.component';

@NgModule({
  declarations: [BillingComponent, CompleteComponent, PlansComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    LcuBillingModule,
    PipeModule,
  ],
  exports: [BillingComponent, CompleteComponent, PlansComponent],
  providers: [],
  entryComponents: [BillingComponent, CompleteComponent, PlansComponent],
})
export class PagesModule {}
