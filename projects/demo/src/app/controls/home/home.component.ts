import { Component, Input, OnInit } from '@angular/core';
import { BillingPlanOption } from 'projects/common/src/lib/state/user-billing/user-billing.state';


@Component({
  selector: 'lcu-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public BillingPlanArray: (BillingPlanOption & any)[];

  constructor() {
    this.BillingPlanArray = [
      {
        Description: '',
        DiscountedFrom: '30',
        Interval: 'month',
        Lookup: 'price_1HhIDIEoSnTpuGWGokN2x6wq',
        Name: 'IoT - Starter ',
        PlanGroup: 'starter',
        Price: 20,
        Priority: '20',
        LicenseType: 'iot',
        Popular: 'true',
        SuccessRedirect: 'https://www.iot-ensemble.com/dashboard',
        Devices: '10',
        DataInterval: '60',
        DataRetention: '259200',
        HeaderName: 'Fathym | IoT Ensemble',
        LicenseName: 'Fathym IoT',
        PlanFeatures:
          'IoT Management|Shared Cloud|10 Devices|60 second Data Velocity|3 Days of Data Retention',
        TrialPeriodDays: 0,
      },
      {
        Description: '',
        DiscountedFrom: '300',
        Interval: 'year',
        Lookup: 'price_1HhIDIEoSnTpuGWGTUDzu18s',
        Name: 'IoT - Starter ',
        PlanGroup: 'starter',
        Price: 200,
        Priority: '20',
        LicenseType: 'iot',
        Popular: 'true',
        SuccessRedirect: 'https://www.iot-ensemble.com/dashboard',
        Devices: '10',
        DataInterval: '60',
        DataRetention: '259200',
        HeaderName: 'Fathym | IoT Ensemble',
        LicenseName: 'Fathym IoT',
        PlanFeatures:
          'IoT Management|Shared Cloud|10 Devices|60 second Data Velocity|3 Days of Data Retention',
        TrialPeriodDays: 0,
      },
      {
        Description: '',
        DiscountedFrom: '100',
        Interval: 'month',
        Lookup: 'price_1HhIGXEoSnTpuGWGwN29a2zo',
        Name: 'IoT - Pro ',
        PlanGroup: 'pro',
        Price: 70,
        Priority: '30',
        LicenseType: 'iot',
        Featured: 'true',
        SuccessRedirect: 'https://www.iot-ensemble.com/dashboard',
        Devices: '50',
        DataInterval: '30',
        DataRetention: '604800',
        HeaderName: 'Fathym | IoT Ensemble',
        LicenseName: 'Fathym IoT',
        PlanFeatures:
          'IoT Management|Shared Cloud|50 Devices|30 second Data Velocity|7 Days of Data Retention',
        TrialPeriodDays: 0,
      },
      {
        Description: '',
        DiscountedFrom: '1000',
        Interval: 'year',
        Lookup: 'price_1HhIGXEoSnTpuGWGMLhRZtbK',
        Name: 'IoT - Pro ',
        PlanGroup: 'pro',
        Price: 700,
        Priority: '30',
        LicenseType: 'iot',
        Featured: 'true',
        SuccessRedirect: 'https://www.iot-ensemble.com/dashboard',
        Devices: '50',
        DataInterval: '30',
        DataRetention: '604800',
        HeaderName: 'Fathym | IoT Ensemble',
        LicenseName: 'Fathym IoT',
        PlanFeatures:
          'IoT Management|Shared Cloud|50 Devices|30 second Data Velocity|7 Days of Data Retention',
        TrialPeriodDays: 0,
      },
    ];
   }

  public ngOnInit(): void { }

}
