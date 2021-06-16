import { Component, OnInit, Injector, ElementRef, ViewChild } from '@angular/core';
import { LCUElementContext, LcuElementComponent, LCUServiceSettings, Status } from '@lcu/common';
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

  @ViewChild('cardElement') cardElement: ElementRef;

  public BillingHeader: string;

  public State: UserBillingState;

  public SubmitButtonText: string;

  public IsSuccess: boolean;

  //  Properties

  //  Constructor
 constructor(
  protected injector: Injector,
  protected userBillStateCtx: UserBillingStateContext,
  protected lcuSettings: LCUServiceSettings,
) {
  super(injector);
  this.userBillStateCtx = injector.get(UserBillingStateContext);
  this.SubmitButtonText = "UPDATE"
  this.BillingHeader = "Update Payment Information"
  this.IsSuccess = false;
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
  this.userBillStateCtx.ConnectedToState.subscribe(
    (status: Status) => {
      if (status.Code === 0)
       {
        debugger;                
        this.userBillStateCtx.$Refresh({
          licenseType: this.Context.LicenseType,
        });
      }
    }
  );
  // this.userBillStateCtx.$Refresh({licenseType: this.Context.LicenseType});
}

  //  API methods

  public CardChangeSuccess(event: boolean){
    this.IsSuccess = event;
  }

  
  //  Helpers
 
 

  protected stateChanged() {
    console.log("STATE: ", this.Context.State);
  }
}
 

