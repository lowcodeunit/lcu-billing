import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
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

  public BillingPlanOptionsSorted: BillingPlanOption[];

  /**
   * whether or not to display the confirmation screen
   */
  public IsConfirming: boolean;

  public NewPlan: BillingPlanOption;

  public Loading: boolean;

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);

    // this.http = injector.get(HttpClient);

    this.IsConfirming = false;

    this.userBillStateCtx = injector.get(UserBillingStateContext);
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
    this.userBillStateCtx.$Refresh({licenseType: this.Context.LicenseType});
  }

  //  API Methods

  public ChangePlan(event: BillingPlanOption){
    console.log("Change plan to: ", event)
    this.IsConfirming = true;
    this.NewPlan = event;
  }

  public GoBackClickEvent(event: any){
    this.IsConfirming = false;
  }

  public UpgradeRequest(event: BillingPlanOption){
    console.log("upgrade to: ", event);
    this.Loading = true;
    this.userBillStateCtx.ChangeSubscription(this.Context.State.Username, event.Lookup);
  }

  //  Helpers

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

    


  }
}
