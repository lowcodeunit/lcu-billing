import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FathymSharedModule, MaterialModule } from '@lcu/common';
import { LcuService } from './services/lcu.service';
import { BillingDisplayComponent } from './controls/billing-display/billing-display.component';
import { LcuComponent } from './controls/lcu/lcu.component';
import { LcuDirective } from './directives/lcu.directive';
import { PlanCardComponent } from './controls/plan-card/plan-card.component';
import { LcuBillingPlanViewElementComponent } from './elements/plan-view/plan-view.component';
import { AppHostModule } from '@lowcodeunit/app-host-common';
import { StripeFormComponent } from './controls/stripe-form/stripe-form.component';
import { LcuBillingUpgradeElementComponent } from './elements/upgrade/upgrade.component';
import { LcuBillingUpdateCreditCardElementComponent } from './elements/update-credit-card/update-credit-card.component';
import { ConfirmPlanChangeComponent } from './controls/confirm-plan-change/confirm-plan-change.component';
import { RequiredOptInsComponent } from './controls/required-opt-ins/required-opt-ins.component';

@NgModule({
  declarations: [
    LcuComponent,
    LcuDirective,
    PlanCardComponent,
    BillingDisplayComponent,
    LcuBillingPlanViewElementComponent,
    LcuBillingUpgradeElementComponent,
    LcuBillingUpdateCreditCardElementComponent,
    StripeFormComponent,
    ConfirmPlanChangeComponent,
    RequiredOptInsComponent,
  ],
  imports: [
    FathymSharedModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    AppHostModule,
  ],
  exports: [
    LcuComponent,
    LcuDirective,
    PlanCardComponent,
    BillingDisplayComponent,
    LcuBillingPlanViewElementComponent,
    LcuBillingUpgradeElementComponent,
    LcuBillingUpdateCreditCardElementComponent,
    AppHostModule,
    StripeFormComponent,
    ConfirmPlanChangeComponent,
    RequiredOptInsComponent,
  ],
  entryComponents: [
    LcuBillingPlanViewElementComponent, 
    LcuBillingUpgradeElementComponent, 
    LcuBillingUpdateCreditCardElementComponent, 
    StripeFormComponent, ConfirmPlanChangeComponent, RequiredOptInsComponent
  ],
})
export class LcuBillingModule {
  static forRoot(): ModuleWithProviders<LcuBillingModule> {
    return {
      ngModule: LcuBillingModule,
      providers: [LcuService],
    };
  }
}
