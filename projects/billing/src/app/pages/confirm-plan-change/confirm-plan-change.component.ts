import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  UserBillingStateContext,
  UserBillingState,
  BillingPlanOption,
} from '@lowcodeunit/lcu-billing-common';

@Component({
  selector: 'lcu-confirm-plan-change-page',
  templateUrl: './confirm-plan-change.component.html',
  styleUrls: ['./confirm-plan-change.component.scss']
})
export class ConfirmPlanChangePageComponent implements OnInit {

  public State: UserBillingState;

  public NewPlan: BillingPlanOption;

  public SubmitButtonText: string;

  public Loading: boolean;

  protected planGroupID: string;

  protected planInterval: string;

  constructor(protected userBillStateCtx: UserBillingStateContext,
    protected route: ActivatedRoute,
    protected router: Router) {

      this.SubmitButtonText = "Confirm Upgrade";
     }

  public ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.planGroupID = params.get('id');
      this.planInterval = params.get('interval');
    });
    this.userBillStateCtx.Context.subscribe((state: any) => {
      this.State = state;

      if (this.State) {
        // console.log("Billing State: ", this.State);
        this.stateChanged();
      }
    });

  }

  public GoBackClicked(event: string) {
    console.log("should be going back: ", event)
    this.router.navigate(['upgrade']);
  }

  public UpgradeRequest(event: BillingPlanOption){
    console.log("upgrade to: ", event);
    if(this.State.PaymentStatus.Code ===0){
      this.Loading = true;
      this.userBillStateCtx.ChangeSubscription(this.State?.Username, event.Lookup);
    }
   
  }

  public CardChangeSuccess(event: boolean){
    console.log("Card Change Success: ", event);

   if(event){
    this.router.navigate(['complete', this.NewPlan.Lookup]);

   }

 }

  //HELPERS

  /**
   * Find the plan based on the params passed in via router
   */
   protected findPlan() {
    if (this.planGroupID && this.State?.Plans  && !this.NewPlan) {
      this.NewPlan = this.State?.Plans.find(
        (p: BillingPlanOption) =>
          p.PlanGroup === this.planGroupID && p.Interval === this.planInterval
      );

      console.log("new Plan: ", this.NewPlan)

      // if plan doesnt exist
      if (!this.NewPlan) {
        this.router.navigate(['']);
      }
    }
  }

  protected stateChanged() {
    this.findPlan();
    // this.determineIntervals();

    // this.buildSelectedPlanGroupPlans();
  }

}
