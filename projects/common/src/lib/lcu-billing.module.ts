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

@NgModule({
  declarations: [
    LcuComponent,
    LcuDirective,
    PlanCardComponent,
    BillingDisplayComponent,
    LcuBillingPlanViewElementComponent,
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
    AppHostModule,
  ],
  entryComponents: [LcuBillingPlanViewElementComponent],
})
export class LcuBillingModule {
  static forRoot(): ModuleWithProviders<LcuBillingModule> {
    return {
      ngModule: LcuBillingModule,
      providers: [LcuService],
    };
  }
}
