import { UserBillingState } from './user-billing.state';
import { StateContext } from '@lcu/common';
import { Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserBillingStateContext extends StateContext<UserBillingState> {
  //  Fields
  protected get licenseType(): string {
    const stateCfg: any = (window as any).LCU.State;

    return stateCfg ? stateCfg.LicenseType : '';
  }

  //  Properties

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);
  }

  //  API Methods
  public ChangeSubscription(
    customerName: string,
    plan: string,
  ) {
    this.Execute({
      Arguments: {
        CustomerName: customerName,
        Plan: plan,
      },
      Type: 'ChangeSubscription',
    });
  }

  public CompletePayment(
    methodId: string,
    customerName: string,
    plan: string,
    trialPeriodDays: number
  ) {
    this.Execute({
      Arguments: {
        CustomerName: customerName,
        MethodID: methodId,
        Plan: plan,
        TrialPeriodDays: trialPeriodDays,
      },
      Type: 'CompletePayment',
    });
  }

  public ResetState(licenseType: string) {
    this.Execute({
      Arguments: { LicenseType: licenseType },
      Type: 'ResetStateCheck',
    });
  }

  //  Helpers
  protected callRefresh() {}

  protected defaultValue() {
    return { Loading: true } as UserBillingState;
  }

  protected loadStateKey(): string {
    return `billing-${this.licenseType}`;
  }

  protected loadStateName(): string {
    return 'usermanagement';
  }
}
