import { Component, OnInit, Injector } from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { UserBillingStateContext } from '../../state/user-billing/user-billing-state.context';
import { UserBillingState } from '../../state/user-billing/user-billing.state';

export class LcuBillingUpdateCreditCardContext extends LCUElementContext<UserBillingState> {

  public LicenseType: string;
}

export const SELECTOR_LCU_BILLING_UPDATE_CREDIT_CARD_ELEMENT = 'lcu-billing-update-credit-card-element';

@Component({
  selector: SELECTOR_LCU_BILLING_UPDATE_CREDIT_CARD_ELEMENT,
  templateUrl: './update-credit-card.component.html',
  styleUrls: ['./update-credit-card.component.scss']
})
export class LcuBillingUpdateCreditCardElementComponent extends LcuElementComponent<LcuBillingUpdateCreditCardContext> implements OnInit {
  //  Fields

  protected userBillStateCtx: UserBillingStateContext;

  //  Properties

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
  protected stateChanged(){
    console.log("STATE: ", this.Context.State);
  }
}
