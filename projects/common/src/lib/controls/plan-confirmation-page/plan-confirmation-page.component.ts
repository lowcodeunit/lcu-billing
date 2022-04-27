import { Component, Input, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { UserBillingStateContext } from '../../state/user-billing/user-billing-state.context';
import { BillingPlanOption, UserBillingState } from '../../state/user-billing/user-billing.state';

@Component({
  selector: 'lcu-plan-confirmation-page',
  templateUrl: './plan-confirmation-page.component.html',
  styleUrls: ['./plan-confirmation-page.component.scss'],
  animations: [],
})
export class PlanConfirmationPageComponent implements OnInit {
  //  Fields

  //  Properties

  // tslint:disable-next-line:no-input-rename
  // @Input('setup-step-types')
  // public SetupStepTypes: NapkinIDESetupStepTypes;
  /**
   * State being passed in to the complete page
   */
  // tslint:disable-next-line:no-input-rename
  // @Input('state')

  public HeaderName: string;

  /**
   * The user billing state to determine payment status
   */
  public State: UserBillingState;

  /**
   * passed in via routes, determines which plan to display in the order summary
   */
  protected planID: string;

  /**
   * The plan based on the id passed in, info to display in order summary
   */
  @Input('selected-plan')
  public SelectedPlan: BillingPlanOption;

  /**
   * the date that is calculated form point in time when
   *
   * this is run to determine when free trial will end
   */
  public FreeTrialEndDate: string;

  /**
   * The Tax (if any) to be collected
   */
  public TaxCollected: number;

  /**
   * The total amount of tax collected
   */
  public TotalTax: string;

  /**
   * The total cost
   */
  public Total: string;

  //  Constructors
  constructor(
    protected userMgr: UserBillingStateContext,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    this.TaxCollected = 0.0;
  }

  //  Life Cycle
  public ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.planID = params.get('id');
    });
    this.userMgr.Context.subscribe((state: UserBillingState) => {
      this.State = state;

      this.stateChanged();
    });
    // if(this.SelectedPlan && this.SelectedPlan.TrialPeriodDays){
    //   this.calcDate();
    // }
  }

  //  API methods

  //  Helpers
  protected stateChanged() {
    // console.log('state success page: ', this.State);
    // avoid error if the user trys to manually navigate to the complete page
    if (!this.State.PaymentStatus) {
      this.router.navigate(['']);
    }
    // console.log("PlanID: ", this.planID); 
    //PurchasedPlanLookup
    if (this.planID && this.State.Plans) {
      this.SelectedPlan = this.State.Plans.find(
        (p: any) => p.Lookup === this.planID
      );
      // console.log('purchased PLAN:', this.SelectedPlan);
    }
    if (this.SelectedPlan) {
      this.calcTotal();
      this.calcTax();
    }
    if (this.SelectedPlan && this.SelectedPlan.TrialPeriodDays) {
      this.calcDate();
    }
  }

  /**
   * Calculates the free trial expiration date from point in time method is run
   */
  protected calcDate() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + this.SelectedPlan.TrialPeriodDays);
    // console.log("end date:", endDate);

    const tempDate = endDate.toString().split(' ');

    // console.log("tempDate:", tempDate);

    this.FreeTrialEndDate = tempDate[1] + ' ' + tempDate[2];
  }

  protected calcTotal() {
    // console.log("total = ", this.TaxCollected + this.SelectedPlan.Price);
    this.Total = (this.TaxCollected + this.SelectedPlan.Price).toFixed(2);
  }

  protected calcTax() {
    this.TotalTax = this.TaxCollected.toFixed(2);
  }
}
