import { MaterialModule, PipeModule } from '@lcu/common';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LcuBillingModule } from '@lowcodeunit/lcu-billing-common';
import { PagesRoutingModule } from './pages-routing.module';
import { CompleteComponent } from './complete/complete.component';
import { PlansComponent } from './plans/plans.component';
import { BillingComponent } from './billing/billing.component';
import { LcuBillingUpgradeElementComponent } from './upgrade/upgrade.component';
import { ConfirmPlanChangePageComponent } from './confirm-plan-change/confirm-plan-change.component';

@NgModule({
  declarations: [
    BillingComponent, 
    CompleteComponent, 
    PlansComponent, 
    ConfirmPlanChangePageComponent,
    LcuBillingUpgradeElementComponent
  ],
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
  exports: [
    BillingComponent, 
    PlansComponent, 
    CompleteComponent,
    LcuBillingUpgradeElementComponent, 
    ConfirmPlanChangePageComponent
  ],
  providers: [],
  entryComponents: [
    BillingComponent, 
    CompleteComponent, 
    PlansComponent, 
    LcuBillingUpgradeElementComponent,
    ConfirmPlanChangePageComponent
  ],
})
export class PagesModule {}
