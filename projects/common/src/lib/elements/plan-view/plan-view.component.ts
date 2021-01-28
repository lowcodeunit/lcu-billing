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
import { LCUElementContext, LcuElementComponent, BaseModeledResponse } from '@lcu/common';
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

  public BillingPlanOptions: (BillingPlanOption & any)[];

  @Input('billing-plan-options-prefix')
  public BillingPlanOptionsPrefix: (BillingPlanOption & any)[];

  @Input('billing-plan-options-suffix')
  public BillingPlanOptionsSuffix: (BillingPlanOption & any)[];

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

    // const link = `https://www.iot-ensemble.com/billing/iot/plan/${plan.PlanGroup}/${plan.Interval}`;

    // window.location.href = link;
  }

  //  Helpers
  protected loadBillingOptions() {
    // tslint:disable-next-line:max-line-length
    this.http.get('https://www.iot-ensemble.com/api/state/usermanagement/ListBillingOptions?licenseType=${this.LiscenseType}').subscribe((result: BaseModeledResponse<BillingPlanOption[]>)=>{
      this.BillingPlanOptions = [
        ...(this.BillingPlanOptionsPrefix || []),
        ...(result.Model || []),
        ...(this.BillingPlanOptionsSuffix || [])
      ]
    });
  }
}
