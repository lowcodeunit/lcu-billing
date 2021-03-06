import { Component, Input, OnInit } from '@angular/core';
import {
  BillingPlanOption,
  LcuBillingPlanViewContext,
} from '@lowcodeunit/lcu-billing-common';

@Component({
  selector: 'lcu-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public Context: LcuBillingPlanViewContext;

  public BillingPlanArray: (BillingPlanOption & any)[];

  constructor() {
    this.Context = {
      BillingPlansAPIPath:
        'https://www.iot-ensemble.com/api/state/usermanagement/ListBillingOptions?licenseType=lcu',
      BillingPlanOptions: [
        {
          ContactText: '',
          DiscountedFrom: 0,
          Interval: 'month',
          Lookup: 'price_1HhIDIEoSnTpuGWGokN2x6wq',
          Name: 'IoT - Free ',
          PlanGroup: 'Free',
          Price: 0,
          Priority: 0,
          LicenseType: 'iot',
          Popular: 'true',
          SuccessRedirect: 'https://www.iot-ensemble.com/dashboard',
          Devices: '1',
          DataInterval: '60',
          DataRetention: '259200',
          HeaderName: 'Fathym | IoT Ensemble',
          LicenseName: 'Fathym IoT',
          PlanFeatures:
            'IoT Management|Shared Cloud|1 Device|60 second Data Velocity|3 Days of Data Retention',
          TrialPeriodDays: 0,
        } as any,
        {
          ContactText: 'Contact sales for pricing information',
          DiscountedFrom: '0',
          Interval: 'month',
          Lookup: 'price_1HhIGXEoSnTpuGWGwN29a2zo',
          Name: 'IoT - Enterprise ',
          PlanGroup: 'Enterprise',
          Price: '10',
          Priority: '40',
          LicenseType: 'iot',
          Featured: 'true',
          SuccessRedirect: 'https://www.iot-ensemble.com/dashboard',
          Devices: '50',
          DataInterval: 80,
          DataRetention: '604800',
          HeaderName: 'Fathym | IoT Ensemble',
          LicenseName: 'Fathym IoT',
          PlanFeatures:
            'IoT Management|Private Cloud|Unlimited Devices|30 second Data Velocity|7 Days of Data Retention',
          TrialPeriodDays: 0,
        },
      ],
      State: null,
    };
  }

  public ngOnInit(): void {}

  public BuyNowClick(plan: BillingPlanOption) {
    console.log(plan);
  }
}
