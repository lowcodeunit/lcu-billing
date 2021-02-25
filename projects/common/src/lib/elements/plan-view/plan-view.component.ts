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
import {
  LCUElementContext,
  LcuElementComponent,
  BaseModeledResponse,
  LCUServiceSettings,
} from '@lcu/common';
import { BillingPlanOption } from '../../state/user-billing/user-billing.state';

export class LcuBillingPlanViewElementState {}

export class LcuBillingPlanViewContext extends LCUElementContext<LcuBillingPlanViewElementState> {
  public BillingPlansAPIPath: string;

  public BillingPlanOptions: BillingPlanOption[];
}

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
  public BillingPlanOptionsSorted: BillingPlanOption[];

  @Output('buy-now-click')
  public BuyNowClick: EventEmitter<BillingPlanOption>;

  public Loading: boolean;

  //  Constructors
  constructor(protected injector: Injector) {
    super(injector);

    this.BuyNowClick = new EventEmitter();

    this.http = injector.get(HttpClient);

    this.Loading = true;
  }

  //  Life Cycle
  public ngOnChanges(changes: SimpleChanges) {
    console.log(changes);

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
  }

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
}
