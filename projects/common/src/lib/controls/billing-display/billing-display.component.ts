import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { emit } from 'process';
import { BillingPlanOption } from '../../state/user-billing/user-billing.state';

@Component({
  selector: 'lcu-billing-display',
  templateUrl: './billing-display.component.html',
  styleUrls: ['./billing-display.component.scss']
})
export class BillingDisplayComponent implements OnChanges, OnInit {
  //  Fields

  //  Properties
  @Output('buy-now')
  public BuyNow: EventEmitter<BillingPlanOption>;

  //@Input('displayed-plans')
  public DisplayedPlans: BillingPlanOption[];

  @Input('featured')
  public FeaturedPlanGroup: string;

  @Input('popular')
  public PopularPlanGroup: string;

  @Input('show-button')
  public ShowButton: boolean;

  @Input('plans')
  public Plans: BillingPlanOption[];

  //  Constructors
  constructor() { 
    this.BuyNow = new EventEmitter();

    this.ShowButton = true;
  }

  //  Life Cycle
  public ngOnChanges(changes: SimpleChanges) {
    if(changes.Plans)
    {
      this.setDisplayedPlans();
    }
  }

  public ngOnInit(): void {
    this.setDisplayedPlans();
  }

  //  API Methods
  public BuyNowClicked(plan: BillingPlanOption) {
    this.BuyNow.emit(plan);
  }

  //  Helpers
  protected setDisplayedPlans(){
    if (this.Plans) {
      this.DisplayedPlans = new Array<BillingPlanOption>();

      this.Plans.forEach((plan: BillingPlanOption) => {
        // so the page only shows 1 card per plan group
        if (
          this.DisplayedPlans.filter((e) => e.PlanGroup === plan.PlanGroup)
            .length === 0
        ) {
          this.DisplayedPlans.push(plan);
        }
      });
    }
  }
}
