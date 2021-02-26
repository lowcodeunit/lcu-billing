import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent, BaseModeledResponse } from '@lcu/common';
import { UserBillingStateContext } from '../../state/user-billing/user-billing-state.context';
import { BillingPlanOption, UserBillingState } from '../../state/user-billing/user-billing.state';

export class LcuBillingUpgradeContext extends LCUElementContext<UserBillingState> {

  public BillingPlansAPIPath: string;

  public BillingPlanOptions: BillingPlanOption[];

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

  protected http: HttpClient;


  //  Properties

  public BillingPlanOptionsSorted: BillingPlanOption[];

  public Loading: boolean;

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);
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

  //  Helpers
  protected loadBillingOptions() {
    if (this.Context) {
      this.http.get(this.Context.BillingPlansAPIPath).subscribe(
        (result: BaseModeledResponse<BillingPlanOption[]>) => {
          console.log(this.Context?.BillingPlanOptions);

          this.BillingPlanOptionsSorted = [
            ...(this.Context.BillingPlanOptions || []),
            ...(result.Model || []),
          ];
          this.BillingPlanOptionsSorted.sort((a, b) =>
            a.Priority < b.Priority ? -1 : a.Priority > b.Priority ? 1 : 0
          );
          this.Loading = false;
        },
        (error) => {
          console.error('HTTP error ', error);
          this.Loading = false;
        }
      );
    }
  }


  protected stateChanged(){

    console.log("STATE:",this.Context.State)

  }
}
