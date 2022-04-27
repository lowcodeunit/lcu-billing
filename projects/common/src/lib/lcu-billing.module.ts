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
import { LcuBillingUpdateCreditCardElementComponent } from './elements/update-credit-card/update-credit-card.component';
import { LcuBillingUpgradeElementComponent } from './elements/upgrade/upgrade.component';
import { LcuBillingPlanSignUpElementComponent } from './elements/plan-sign-up/plan-sign-up.component';
import { AppHostModule } from '@lowcodeunit/app-host-common';
import { StripeFormComponent } from './controls/stripe-form/stripe-form.component';
import { ConfirmPlanChangeComponent } from './controls/confirm-plan-change/confirm-plan-change.component';
import { RequiredOptInsComponent } from './controls/required-opt-ins/required-opt-ins.component';
import { PlanConfirmationPageComponent } from './controls/plan-confirmation-page/plan-confirmation-page.component';
import { PlanBillingComponent } from './controls/plan-billing/plan-billing.component';
import { PlansPageComponent } from './controls/plans-page/plans-page.component';

@NgModule({
  declarations: [
    LcuComponent,
    LcuDirective,
    PlanCardComponent,
    BillingDisplayComponent,
    LcuBillingPlanViewElementComponent,
    LcuBillingUpgradeElementComponent,
    LcuBillingUpdateCreditCardElementComponent,
    LcuBillingPlanSignUpElementComponent,
    StripeFormComponent,
    ConfirmPlanChangeComponent,
    RequiredOptInsComponent,
    PlanConfirmationPageComponent,
    PlanBillingComponent,
    PlansPageComponent
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
    LcuBillingPlanSignUpElementComponent,
    AppHostModule,
    StripeFormComponent,
    ConfirmPlanChangeComponent,
    RequiredOptInsComponent,
    PlanConfirmationPageComponent,
    PlanBillingComponent,
    PlansPageComponent
  ],
  entryComponents: [
    LcuBillingPlanViewElementComponent, 
    LcuBillingUpgradeElementComponent, 
    LcuBillingUpdateCreditCardElementComponent, 
    LcuBillingPlanSignUpElementComponent,
    StripeFormComponent, 
    ConfirmPlanChangeComponent, 
    RequiredOptInsComponent, 
    PlanConfirmationPageComponent, 
    PlanBillingComponent,
    PlansPageComponent,
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
