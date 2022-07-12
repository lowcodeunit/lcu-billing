import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent, Status } from '@lcu/common';
import { UserBillingStateContext } from '../../state/user-billing/user-billing-state.context';
import { BillingPlanOption, UserBillingState } from '../../state/user-billing/user-billing.state';

export class LcuBillingUpgradeContext extends LCUElementContext<UserBillingState> {

  public LicenseType: string;

}

export const SELECTOR_LCU_BILLING_UPGRADE_ELEMENT = 'lcu-billing-upgrade-element';

@Component({
  selector: SELECTOR_LCU_BILLING_UPGRADE_ELEMENT,
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss']
})
export class LcuBillingUpgradeElementComponent extends LcuElementComponent<LcuBillingUpgradeContext> implements OnInit {
  //  Fields

  protected userBillStateCtx: UserBillingStateContext;



  //  Properties

  public BillingHeader: string;

  public BillingPlanOptionsSorted: BillingPlanOption[];

  //the plans the user currently has access to

  // public UsersPlans: Array<BillingPlanOption>;

  /**
   * whether or not to display the confirmation screen
   */
  public IsConfirming: boolean;

  public NewPlan: BillingPlanOption;

  public Loading: boolean;

  public PaymentInfoNeedsUpdate: boolean;

  public ShowConfirmationPage: boolean;

  public SubmitButtonText: string; 

  public PaymentInfoValid: boolean;

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);

    // this.http = injector.get(HttpClient);

    this.IsConfirming = false;

    this.userBillStateCtx = injector.get(UserBillingStateContext);

    // this.UsersPlans = new Array<BillingPlanOption>();

    this.BillingHeader = "Please Update Your Credit Card on File";

    this.ShowConfirmationPage = false;

    this.SubmitButtonText = "Confirm Upgrade";
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

        // if (!this.connectedToStateSub) {
      // this.connectedToStateSub = 
      this.userBillStateCtx.ConnectedToState.subscribe(
        (status: Status) => {
          if (status.Code === 0)
           {                
            this.userBillStateCtx.$Refresh({
              licenseType: this.Context.LicenseType,
            });
          }
        }
      );
    // }
    // this.userBillStateCtx.$Refresh({licenseType: this.Context.LicenseType});
  }

  //  API Methods

  public CardChangeSuccess(event: boolean){
     console.log("Card Change Success: ", event)

    this.PaymentInfoValid = event;
  }

  public ChangePlan(event: BillingPlanOption){
    this.IsConfirming = true;
    this.NewPlan = event;
  }

  public GoBackClickEvent(event: any){
    this.IsConfirming = false;
  }

  // public UpgradeRequest(event: BillingPlanOption){
  //   console.log("upgrade to: ", event);
  //   if(this.Context.State.PaymentStatus.Code ===0){
  //     this.Loading = true;
  //     this.userBillStateCtx.ChangeSubscription(this.Context.State.Username, event.Lookup);
  //   }
   
  // }

  //  Helpers

  protected determineUsersPlans(){
      this.Context.State.ExistingLicenseTypes.forEach(licType =>{

        this.BillingPlanOptionsSorted.forEach(plan => {
          if(plan.Lookup === licType.Details.Lookup){
            plan.UserHasAccess = true;
          }
        })
      })

  }

  protected determinePlanChangeSuccess(){
    this.Context.State.ExistingLicenseTypes.forEach(licType =>{
      if(licType.Details.Lookup === this.NewPlan.Lookup){
        this.ShowConfirmationPage = true;
        this.IsConfirming = false;
      }

    })
  }

  protected sortBillingOptions(){
    this.BillingPlanOptionsSorted = this.Context.State.Plans;
    this.BillingPlanOptionsSorted.sort((a, b) =>
            a.Priority < b.Priority ? -1 : a.Priority > b.Priority ? 1 : 0
          );
  }


  protected stateChanged(){

    console.log("CONTEXT:",this.Context);

    this.Loading = this.Context.State.Loading;

    if(this.Context.State.Plans){
      this.sortBillingOptions();
    }

    if(this.Context.State.ExistingLicenseTypes && this.BillingPlanOptionsSorted){
      this.determineUsersPlans();
    }

    if(this.Context.State.ExistingLicenseTypes && this.NewPlan){
      this.determinePlanChangeSuccess();
    }

    



  }
}
