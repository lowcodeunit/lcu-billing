import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { UserBillingStateContext } from '../../state/user-billing/user-billing-state.context';
import { BillingPlanOption, UserBillingState } from '../../state/user-billing/user-billing.state';

export class LcuBillingPlanSignUpElementState {}

export class LcuBillingPlanSignUpContext extends LCUElementContext<UserBillingState> {
  public LicenseType: string;
}

export const SELECTOR_LCU_BILLING_PLAN_SIGN_UP_ELEMENT = 'lcu-billing-plan-sign-up-element';

@Component({
  selector: SELECTOR_LCU_BILLING_PLAN_SIGN_UP_ELEMENT,
  templateUrl: './plan-sign-up.component.html',
  styleUrls: ['./plan-sign-up.component.scss']
})
export class LcuBillingPlanSignUpElementComponent extends LcuElementComponent<LcuBillingPlanSignUpContext> implements OnInit {
  //  Fields

  //  Properties

  public SelectedPlan: BillingPlanOption;

  public ShowConfirmationPage: boolean;

  //  Constructors
  constructor(protected injector: Injector,
              protected userBillStateCtx: UserBillingStateContext,) {
    super(injector);
    this.SelectedPlan = null;
    this.ShowConfirmationPage = false;
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();

    this.userBillStateCtx.Context.subscribe((state: any) => {
      this.Context.State = state;
  
      if (this.Context.State) {
        this.stateChanged();
      }
  
    });
    this.userBillStateCtx.$Refresh({licenseType: this.Context.LicenseType})
  }

  //  API Methods

  public HandleBackButtonClick(event: boolean){
    this.SelectedPlan = null;
  }

  public HandleSelectedPlanChange(event: BillingPlanOption){
    this.SelectedPlan = event;
  }

  public HandleSuccessfulPayment(event: boolean){
    console.log("show confirmation page: ", event);
    this.ShowConfirmationPage = event;
  }

  public PlanSelected(event: BillingPlanOption){
    this.SelectedPlan = event;
  }

  //  Helpers
  protected stateChanged(){
    console.log("CONTEXT PLAN SIGN UP: ", this.Context)
  }
}
