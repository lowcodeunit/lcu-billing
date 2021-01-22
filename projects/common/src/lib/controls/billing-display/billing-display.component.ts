import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { emit } from 'process';
import { BillingPlanOption } from '../../state/user-billing/user-billing.state';

@Component({
  selector: 'lcu-billing-display',
  templateUrl: './billing-display.component.html',
  styleUrls: ['./billing-display.component.scss']
})
export class BillingDisplayComponent implements OnInit {
  //  Fields

  //  Properties
  @Output('buy-now')
  public BuyNow: EventEmitter<BillingPlanOption>;

  @Input('displayed-plans')
  public DisplayedPlans: BillingPlanOption[];

  @Input('featured')
  public FeaturedPlanGroup: string;

  @Input('popular')
  public PopularPlanGroup: string;

  @Input('show-button')
  public ShowButton: boolean;

  @Input('plan-options')
  public PlanOptions: BillingPlanOption[];

  //  Constructors
  constructor() { 
    this.BuyNow = new EventEmitter();

    this.ShowButton = true;
  }

  //  Life Cycle
  public ngOnInit(): void {
  }

  //  API Methods
  public BuyNowClicked(plan: BillingPlanOption) {
    this.BuyNow.emit(plan);
  }

  //  Helpers
}
