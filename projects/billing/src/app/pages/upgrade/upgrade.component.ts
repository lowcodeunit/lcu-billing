import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LCUElementContext, LcuElementComponent, Status, LCUServiceSettings } from '@lcu/common';
import {
  UserBillingStateContext,
  UserBillingState,
  BillingPlanOption,
} from '@lowcodeunit/lcu-billing-common';

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

  /**
   * list of plans to display on the page excluding duplicate plan with different billing cycles
   */
   public DisplayedPlans: Array<BillingPlanOption>;

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

  public State: UserBillingState;

  public ShowButton: boolean;

  public get StaticPlans(): BillingPlanOption[] {
    return this.settings.State.BillingPlanOptions || [];
  }

  //  Constructors
  constructor(
    protected injector: Injector, 
    protected settings: LCUServiceSettings, 
    protected route: ActivatedRoute,
    protected router: Router) {
    super(injector);

    // this.http = injector.get(HttpClient);

    this.IsConfirming = false;

    this.userBillStateCtx = injector.get(UserBillingStateContext);

    
    this.ShowButton = true;
    // this.UsersPlans = new Array<BillingPlanOption>();

    this.BillingHeader = "Please Update Your Credit Card on File";

    this.ShowConfirmationPage = false;

    this.SubmitButtonText = "Confirm Upgrade";
  }

  //  Life Cycle
  public ngOnInit() {
    super.ngOnInit();

    this.userBillStateCtx.Context.subscribe((state: any) => {
      this.State = state;

      if (this.State) {
        this.stateChanged();
      }
    });

      //   if (!this.connectedToStateSub) {
      // this.connectedToStateSub = 
      // this.userBillStateCtx.ConnectedToState.subscribe(
      //   (status: Status) => {
      //     if (status.Code === 0)
      //      {                
      //       this.userBillStateCtx.$Refresh({
      //         licenseType: this.Context.LicenseType,
      //       });
      //     }
      //   }
      // );
    // }
    // this.userBillStateCtx.$Refresh({licenseType: this.Context.LicenseType});
  }

  //  API Methods

  public CardChangeSuccess(event: boolean){
     console.log("Card Change Success: ", event)

    this.PaymentInfoValid = event;
  }

  /**
   * called based on the event returned from the plan card and then routes to the
   *
   * billing component with the delected plan group
   *
   */
   public UpgradeClicked(plan: BillingPlanOption) {
    // console.log('Buy Now Clicked:', plan);

    // if (!plan.SuccessRedirect.startsWith('=>')) {
    this.router.navigate(['confirm-change', plan.PlanGroup, plan.Interval]);
    // } else {
    //   window.location.href = plan.SuccessRedirect;
    // }
  }

  public ChangePlan(event: BillingPlanOption){
    this.IsConfirming = true;
    this.NewPlan = event;
  }

  // public GoBackClickEvent(event: any){
  //   this.IsConfirming = false;
  // }

  // public UpgradeRequest(event: BillingPlanOption){
  //   console.log("upgrade to: ", event);
  //   if(this.State.PaymentStatus.Code ===0){
  //     this.Loading = true;
  //     this.userBillStateCtx.ChangeSubscription(this.State.Username, event.Lookup);
  //   }
   
  // }

  //  Helpers

  // protected determineUsersPlans(){
  //     this.Context.State.ExistingLicenseTypes.forEach((licType: any) =>{

  //       this.BillingPlanOptionsSorted.forEach(plan => {
  //         if(plan.Lookup === licType.Details.Lookup){
  //           plan.UserHasAccess = true;
  //         }
  //       })
  //     })

  // }

  // protected determinePlanChangeSuccess(){
  //   this.Context.State.ExistingLicenseTypes.forEach((licType: any) =>{
  //     if(licType.Details.Lookup === this.NewPlan.Lookup){
  //       this.ShowConfirmationPage = true;
  //       this.IsConfirming = false;
  //     }

  //   })
  // }

  protected loadBillingOptions(): void {
    if (this.State) {
      this.DisplayedPlans = [...(this.State.Plans || []), ...this.StaticPlans];

      this.DisplayedPlans = this.DisplayedPlans.sort((a, b) =>
        a.Priority < b.Priority ? -1 : a.Priority > b.Priority ? 1 : 0
      );
    }
  }

  // protected sortBillingOptions(){
  //   this.BillingPlanOptionsSorted = this.Context.State.Plans;
  //   this.BillingPlanOptionsSorted.sort((a, b) =>
  //           a.Priority < b.Priority ? -1 : a.Priority > b.Priority ? 1 : 0
  //         );
  // }


  protected stateChanged(){

    console.log("State: ", this.State);

    this.loadBillingOptions();

  }
}
