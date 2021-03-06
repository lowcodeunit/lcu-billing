import { LcuBillingPlanSignUpElementComponent } from '@lowcodeunit/lcu-billing-common';
import { SELECTOR_LCU_BILLING_PLAN_SIGN_UP_ELEMENT } from '@lowcodeunit/lcu-billing-common';
import { LcuBillingUpdateCreditCardElementComponent } from '@lowcodeunit/lcu-billing-common';
import { SELECTOR_LCU_BILLING_UPDATE_CREDIT_CARD_ELEMENT } from '@lowcodeunit/lcu-billing-common';
import { LcuBillingUpgradeElementComponent } from '@lowcodeunit/lcu-billing-common';
import { SELECTOR_LCU_BILLING_UPGRADE_ELEMENT } from '@lowcodeunit/lcu-billing-common';
import { DoBootstrap } from '@angular/core';
import { Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { LcuBillingPlanViewElementComponent } from '@lowcodeunit/lcu-billing-common';
import { SELECTOR_LCU_BILLING_PLAN_VIEW_ELEMENT } from '@lowcodeunit/lcu-billing-common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FathymSharedModule, LCUServiceSettings } from '@lcu/common';
import { environment } from '../environments/environment';
import { LcuBillingModule } from '@lowcodeunit/lcu-billing-common';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FathymSharedModule,
    LcuBillingModule.forRoot()
  ],
  providers: [
    {
      provide: LCUServiceSettings,
      useValue: FathymSharedModule.DefaultServiceSettings(environment)
    }
  ],
  exports: [LcuBillingModule]
})
export class AppModule implements DoBootstrap {
	constructor(protected injector: Injector) {}

	public ngDoBootstrap() {
		const billingPlanView = createCustomElement(LcuBillingPlanViewElementComponent, { injector: this.injector });

		customElements.define(SELECTOR_LCU_BILLING_PLAN_VIEW_ELEMENT, billingPlanView);
	
		const upgrade = createCustomElement(LcuBillingUpgradeElementComponent, { injector: this.injector });

		customElements.define(SELECTOR_LCU_BILLING_UPGRADE_ELEMENT, upgrade);
	
		const updateCreditCard = createCustomElement(LcuBillingUpdateCreditCardElementComponent, { injector: this.injector });

		customElements.define(SELECTOR_LCU_BILLING_UPDATE_CREDIT_CARD_ELEMENT, updateCreditCard);
	
		const planSignUp = createCustomElement(LcuBillingPlanSignUpElementComponent, { injector: this.injector });

		customElements.define(SELECTOR_LCU_BILLING_PLAN_SIGN_UP_ELEMENT, planSignUp);
	}
}
