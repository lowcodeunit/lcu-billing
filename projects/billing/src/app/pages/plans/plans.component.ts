import { Component, OnInit } from '@angular/core';
import {
  UserBillingStateContext,
  BillingPlanOption,
} from '@lowcodeunit/lcu-billing-common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserBillingState } from 'projects/common/src/lcu.api';
import { LCUServiceSettings } from '@lcu/common';

@Component({
  selector: 'lcu-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
  /**
   * list of plans to display on the page excluding duplicate plan with different billing cycles
   */
  public DisplayedPlans: Array<BillingPlanOption>;

  /**
   * boolean value to display button on the plan card
   */
  public ShowButton: boolean;

  public State: UserBillingState;

  public get StaticPlans(): BillingPlanOption[] {
    return this.settings.State.BillingPlanOptions || [];
  }

  constructor(
    protected userBillStateCtx: UserBillingStateContext,
    protected route: ActivatedRoute,
    protected router: Router,
    protected settings: LCUServiceSettings
  ) {
    this.ShowButton = true;
    // this.ShowToggle = true;
  }

  public ngOnInit() {
    this.userBillStateCtx.Context.subscribe((state: UserBillingState) => {
      this.State = state;

      console.log('Users Billing State: ', this.State);

      if (this.State) {
        this.stateChanged();
      }
    });
  }
  /**
   * called based on the event returned from the plan card and then routes to the
   *
   * billing component with the delected plan group
   *
   */
  public BuyNowClicked(plan: BillingPlanOption) {
    // console.log('Buy Now Clicked:', plan);

    // if (!plan.SuccessRedirect.startsWith('=>')) {
      this.router.navigate(['plan', plan.PlanGroup, plan.Interval]);
    // } else {
    //   window.location.href = plan.SuccessRedirect;
    // }
  }

  protected loadBillingOptions(): void {
    if (this.State) {
      this.DisplayedPlans = [...(this.State.Plans || []), ...this.StaticPlans];

      this.DisplayedPlans = this.DisplayedPlans.sort((a, b) =>
        a.Priority < b.Priority ? -1 : a.Priority > b.Priority ? 1 : 0
      );
    }
  }

  /**
   * runs when state returns
   */
  protected stateChanged(): void {
    this.loadBillingOptions();
  }
}
