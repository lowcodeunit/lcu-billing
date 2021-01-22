import { Component, Input, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';

export class LcuBillingPlanViewElementState {}

export class LcuBillingPlanViewContext extends LCUElementContext<LcuBillingPlanViewElementState> {}

export const SELECTOR_LCU_BILLING_PLAN_VIEW_ELEMENT = 'lcu-billing-plan-view-element';

@Component({
  selector: SELECTOR_LCU_BILLING_PLAN_VIEW_ELEMENT,
  templateUrl: './plan-view.component.html',
  styleUrls: ['./plan-view.component.scss']
})
export class LcuBillingPlanViewElementComponent extends LcuElementComponent<LcuBillingPlanViewContext> implements OnInit {
  //  Fields

  //  Properties
  @Input('plan-group')
  public PlanGroup: string;

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
