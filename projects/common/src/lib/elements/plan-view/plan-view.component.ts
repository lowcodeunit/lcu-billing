import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  Injector,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { LCUElementContext, LcuElementComponent } from '@lcu/common';
import { BillingPlanOption } from '../../state/user-billing/user-billing.state';

export class LcuBillingPlanViewElementState {}

export class LcuBillingPlanViewContext extends LCUElementContext<LcuBillingPlanViewElementState> {}

export const SELECTOR_LCU_BILLING_PLAN_VIEW_ELEMENT =
  'lcu-billing-plan-view-element';

@Component({
  selector: SELECTOR_LCU_BILLING_PLAN_VIEW_ELEMENT,
  templateUrl: './plan-view.component.html',
  styleUrls: ['./plan-view.component.scss'],
})
export class LcuBillingPlanViewElementComponent
  extends LcuElementComponent<LcuBillingPlanViewContext>
  implements OnChanges, OnInit {
  //  Fields
  protected http: HttpClient;

  //  Properties
  @Input('billing-plan-options')
  public BillingPlanOptions: (BillingPlanOption & any)[];

  @Output('buy-now-click')
  public BuyNowClick: EventEmitter<BillingPlanOption>;

  @Input('license-type')
  public LicenseType: string;

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);

    this.BuyNowClick = new EventEmitter();

    this.http = injector.get(HttpClient);
  }

  //  Life Cycle
  public ngOnChanges(changes: SimpleChanges) {
    if (changes.LiscenseType) {
      this.loadBillingOptions();
    }
  }

  public ngOnInit() {
    super.ngOnInit();

    this.loadBillingOptions();
  }

  //  API Methods
  public BuyNowClicked(plan: BillingPlanOption) {
    this.BuyNowClick.emit(plan);

    const link = `https://www.iot-ensemble.com/billing/iot/plan/${plan.PlanGroup}/${plan.Interval}`;

    window.location.href = link;
  }

  //  Helpers
  protected loadBillingOptions() {
    //this.http.get("https://www.iot-ensemble.com/api/state/usermanagement/ListBillingOptions")
    this.BillingPlanOptions = [
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
}
