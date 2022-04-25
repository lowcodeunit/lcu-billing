import { UserBillingState } from './user-billing.state';
import { StateContext, Status } from '@lcu/common';
import { Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserBillingStateContext extends StateContext<UserBillingState> {
  //  Fields
  protected get licenseType(): string {
    const stateCfg: any = (window as any).LCU.State;

    return stateCfg ? stateCfg.LicenseType : 'fathym';
  }

  //  Properties

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);
  }

  //  API Methods
  public CancelSubscription(customerName: string, plan: string) {
    this.Execute({
      Arguments: {
        CustomerName: customerName,
        Plan: plan,
      },
      Type: 'CancelSubscription',
    });
  }

  public ChangeSubscription(customerName: string, plan: string) {
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
  ): Promise<object> {
    return this.Execute({
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

  public UpdatePaymentInfo(customerName: string, paymentId: string) {
    this.Execute({
      Arguments: {
        CustomerName: customerName,
        MethodID: paymentId,
      },
      Type: 'UpdatePaymentInfo',
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
    return 'billing';
  }
}
