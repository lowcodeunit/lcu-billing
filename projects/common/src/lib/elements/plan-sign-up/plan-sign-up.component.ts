import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
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

  public UserHasLicenseType: boolean;

  @Output('change-subscription-event')
  public ChangeSubscriptionEvent: EventEmitter<any>;

  //  Constructors
  constructor(protected injector: Injector,
              protected userBillStateCtx: UserBillingStateContext,) {
    super(injector);
    this.SelectedPlan = null;
    this.ShowConfirmationPage = false;
    this.UserHasLicenseType = false;
    this.ChangeSubscriptionEvent = new EventEmitter<any>();
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

  public ChangeSubscription(){
    this.ChangeSubscriptionEvent.emit(true);
  }

  public HandleBackButtonClick(event: boolean){
    this.SelectedPlan = null;
  }

  public HandleSelectedPlanChange(event: BillingPlanOption){
    this.SelectedPlan = event;
  }

  public HandleSuccessfulPayment(event: boolean){
    this.ShowConfirmationPage = event;
  }

  public PlanSelected(event: BillingPlanOption){
    this.SelectedPlan = event;
  }

  //  Helpers

  protected determineExistingLicenseType(){
    this.Context.State.ExistingLicenseTypes.forEach(licType =>{
      if(this.Context.LicenseType === licType.Details.LicenseType){
        this.UserHasLicenseType = true;
      }
    })

  }


  protected stateChanged(){
    console.log("CONTEXT PLAN SIGN UP: ", this.Context)

    if(this.Context.State.ExistingLicenseTypes && !this.ShowConfirmationPage){
      this.determineExistingLicenseType();
    }
  }
}
