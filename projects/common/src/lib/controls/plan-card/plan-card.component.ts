import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserBillingStateContext } from '../../state/user-billing/user-billing-state.context';
import { BillingPlanOption } from '../../state/user-billing/user-billing.state';

@Component({
  selector: 'lcu-plan-card',
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.scss'],
})
export class PlanCardComponent implements OnInit {
  /**
   * The Displayed plans from the state
   */
  @Input('displayed-plans') DisplayedPlans: BillingPlanOption[];

  /**
   * The Featured Plan group to display the **Most Popular tag**
   */

  @Input('featured-plan-group') FeaturedPlanGroup: string;

  /**
   * The Popular plan group to display the **Most Popular tag**
   */
  @Input('popular-plan-group') PopularPlanGroup: string;

  /**
   * an array of the intervals to display in the toggle
   */
  // @Input('intervals') Intervals: string[];

  /**
   * The plan to be displayed
   */
  @Input('plan') Plan: BillingPlanOption;

  /**
   * The plan groups to key off of the indexes
   */
  // @Input('plan-groups') PlanGroups: Array<string>;

  /**
   * The plans coming back from the state to display the different prices
   */
  @Input('all-plans') AllPlans: Array<BillingPlanOption>;

  /**
   * Whether or not to display the buy now button (Button for plan page only)
   */
  @Input('show-button') ShowButton: boolean;

  /**
   * Whether or not to show the back button
   */
  @Input('show-back-button') ShowBackButton: boolean;
  /**
   * Whether or not to display the toggle button
   */
  // @Input('show-toggle') ShowToggle: boolean;

  /**
   * Event emitted when the button has been clicked
   */
  @Output('buy-now-clicked') BuyNowClicked: EventEmitter<any>;

  /**
   * Event emitted when the toggle has been toggled
   */
  @Output('interval-toggled') IntervalToggled: EventEmitter<BillingPlanOption>;

  /**
   * Event emitted when back button clicked
   */
  @Output('go-back-clicked') GoBackClicked: EventEmitter<any>;

  /**
   * The price of the other plan that is not displayed
   */
  public OtherIntervalPrice: any;

  /**
   * The other plan to display in the price section
   */
  public OtherPlan: BillingPlanOption;

  /**
   * The features of the plan to display in the list in the card
   */
  public PlanFeatures: string[];

  /**
   * The plan groups used in logic
   */
  public PlanGroups: Array<string>;

  /**
   * Whether or not the Interval toggle is checked or not
   */
  public ToggleChecked: boolean;

  constructor() {
    this.BuyNowClicked = new EventEmitter<any>();
    this.IntervalToggled = new EventEmitter<BillingPlanOption>();
    this.GoBackClicked = new EventEmitter<any>();
  }

  ngOnInit() {
    // console.log('All plans: ',this.AllPlans);
    // this.getOtherIntervalPrice();
    this.getIntervalValue();
  }
  ngOnChanges() {
    this.determinePlanGroups();
    this.getOtherIntervalPrice(this.Plan);
    this.extractPlanFeatures();
  }
  /**
   *
   * Passes the selected plan back to the plans component to determine which plan to display
   *
   * in the billing component
   */
  public BuyNow(plan: any) {
    // console.log("Plan selected from plan page: ", plan);
    this.BuyNowClicked.emit(plan);
    // console.log("plan passed = ", plan)
  }

  public IntervalSelected(interval: string) {
    this.ToggleChanged(interval);
    this.IntervalToggled.emit(this.Plan);

    this.getOtherIntervalPrice(this.Plan);
  }

  public DeterminePlanFeatIndex(index: any) {
    if (index < this.PlanFeatures.length - 1) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Toggles planid and plan card to the selected plan
   * @param toggleSelected
   */
  public ToggleChanged(toggleSelected: any): void {
    let intervalSelected: string;

    if (toggleSelected.checked === true) {
      intervalSelected = 'year';
    } else {
      intervalSelected = 'month';
    }
    //  console.log("toggle changed: ", toggleSelected);
    this.AllPlans.forEach((plan: BillingPlanOption) => {
      if (
        this.Plan.PlanGroup === plan.PlanGroup &&
        plan.Interval === intervalSelected
      ) {
        this.Plan = plan;
        //  this.planID = this.SelectedPlan.Lookup;
        //  console.log("Toggled to: ", this.Plan);
      }
    });
  }

  public GoBack() {
    this.GoBackClicked.emit(this.Plan.LicenseType);
  }

  protected getOtherIntervalPrice(selectedPlan: BillingPlanOption) {
    // console.log("selected plan = ", selectedPlan);
    let temp = this.AllPlans.filter(
      (plan) =>
        plan.Interval !== selectedPlan.Interval &&
        plan.PlanGroup === selectedPlan.PlanGroup
    );
    this.OtherPlan = temp[0];
    // console.log("Other plan interval:", this.OtherPlan);
    if (this.OtherPlan) {
      this.OtherIntervalPrice = this.OtherPlan.Price;
    }
  }

  protected extractPlanFeatures() {
    if (this.Plan.PlanFeatures) {
      this.PlanFeatures = this.Plan.PlanFeatures.split('|');
    }
    // console.log("Plan feats = ", this.PlanFeatures)
  }

  protected determinePlanGroups() {
    if (this.AllPlans) {
      this.PlanGroups = new Array<string>();
      // this.Intervals = new Array<string>();

      this.AllPlans.forEach((plan: BillingPlanOption) => {
        if (!this.PlanGroups.includes(plan.PlanGroup)) {
          this.PlanGroups.push(plan.PlanGroup);
        }
        // if(!this.Intervals.includes(plan.Interval)){
        //   this.Intervals.push(plan.Interval);
        // }
      });

      // console.log('plan groups', this.PlanGroups);
    }
  }

  protected getIntervalValue() {
    if (this.Plan.Interval === 'year') {
      this.ToggleChecked = true;
    } else {
      this.ToggleChecked = false;
    }
  }
}
