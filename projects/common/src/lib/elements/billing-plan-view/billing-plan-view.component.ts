import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';

export class LcuBillingBillingPlanViewElementState {}

export class LcuBillingBillingPlanViewContext extends LCUElementContext<LcuBillingBillingPlanViewElementState> {}

export const SELECTOR_LCU_BILLING_BILLING_PLAN_VIEW_ELEMENT = 'lcu-billing-billing-plan-view-element';

@Component({
  selector: SELECTOR_LCU_BILLING_BILLING_PLAN_VIEW_ELEMENT,
  templateUrl: './billing-plan-view.component.html',
  styleUrls: ['./billing-plan-view.component.scss']
})
export class LcuBillingBillingPlanViewElementComponent extends LcuElementComponent<LcuBillingBillingPlanViewContext> implements OnInit {
  //  Fields

  //  Properties

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();
  }

  //  API Methods

  //  Helpers
}
