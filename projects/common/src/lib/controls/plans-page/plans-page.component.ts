import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { UserBillingStateContext } from '../../state/user-billing/user-billing-state.context';
import { BillingPlanOption, UserBillingState } from '../../state/user-billing/user-billing.state';

@Component({
  selector: 'lcu-plans-page',
  templateUrl: './plans-page.component.html',
  styleUrls: ['./plans-page.component.scss'],
})
export class PlansPageComponent implements OnInit {
  public State: any;
  /**
   * boolean value to display button on the plan card
   */
  public ShowButton: boolean;

  /**
   * list of plans to display on the page excluding duplicate plan with different billing cycles
   */
  public DisplayedPlans: Array<BillingPlanOption>;

  @Output('selected-plan')
  public SelectedPlan: EventEmitter<BillingPlanOption>;

  constructor(
    protected userBillStateCtx: UserBillingStateContext,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    this.ShowButton = true;
    this.SelectedPlan = new EventEmitter<BillingPlanOption>();
    // this.ShowToggle = true;
  }

  public ngOnInit() {
    this.userBillStateCtx.Context.subscribe((state: UserBillingState) => {
      this.State = state;

      // console.log('Users Billing State: ', this.State);

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

    this.SelectedPlan.emit(plan);

    // this.router.navigate(['plan', plan.PlanGroup, plan.Interval]);


  }
  /**
   * runs when state returns
   */
  protected stateChanged(): void {
    // console.log('state plan page = ', this.State);

    if (this.State.Plans) {
      this.DisplayedPlans = new Array<BillingPlanOption>();
      this.State.Plans.forEach((plan: BillingPlanOption) => {
        // so the page only shows 1 card per plan group
        if (
          this.DisplayedPlans.filter((e) => e.PlanGroup === plan.PlanGroup)
            .length === 0
        ) {
          this.DisplayedPlans.push(plan);
        }
      });
    }
  }
}
