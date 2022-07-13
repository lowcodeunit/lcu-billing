import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserBillingStateContext } from '../../state/user-billing/user-billing-state.context';
import { BillingPlanOption } from '../../state/user-billing/user-billing.state';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'lcu-plan-card',
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.scss'],
})
export class PlanCardComponent implements OnInit {
  /**
   * The Displayed plans from the state
   */
  @Input('displayed-plans')
  public DisplayedPlans: BillingPlanOption[];

  /**
   * The Featured Plan group to display the **Most Popular tag**
   */

  @Input('featured-plan-group')
  public FeaturedPlanGroup: string;

  /**
   * Determines if the buy now text should say buy now or upgrade
   */
  @Input('is-upgrade')
  public IsUpgrade: boolean;

  /**
   * The Popular plan group to display the **Most Popular tag**
   */
  @Input('popular-plan-group')
  public PopularPlanGroup: string;

  /**
   * an array of the intervals to display in the toggle
   */
  // @Input('intervals') Intervals: string[];

  /**
   * The plan to be displayed
   */
  @Input('plan')
  public Plan: BillingPlanOption;

  /**
   * The plan groups to key off of the indexes
   */
  // @Input('plan-groups') PlanGroups: Array<string>;

  /**
   * The plans coming back from the state to display the different prices
   */
  @Input('all-plans')
  public AllPlans: Array<BillingPlanOption>;

  /**
   * Whether or not to display the buy now button (Button for plan page only)
   */
  @Input('show-button')
  public ShowButton: boolean;

  /**
   * Whether or not to show the back button
   */
  @Input('show-back-button')
  public ShowBackButton: boolean;

  // @Input('users-plans')
  // public UsersPlans: Array<BillingPlanOption>;
  /**
   * Whether or not to display the toggle button
   */
  // @Input('show-toggle') ShowToggle: boolean;

  /**
   * Event emitted when the button has been clicked
   */
  @Output('buy-now-clicked')
  public BuyNowClicked: EventEmitter<any>;

  /**
   * Event emitted when the toggle has been toggled
   */
  @Output('interval-toggled')
  public IntervalToggled: EventEmitter<BillingPlanOption>;

  /**
   * Event emitted when back button clicked
   */
  @Output('go-back-clicked')
  public GoBackClicked: EventEmitter<any>;

  /**
   * The text to display in the buy now button
   */
  public BuyNowText: string;

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

  constructor(protected sanitizer: DomSanitizer) {
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
    this.determineBuyNowText();
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
    this.determineBuyNowText();

    this.getOtherIntervalPrice(this.Plan);
  }

  public DeterminePlanFeatIndex(index: any) {
    if (index < this.PlanFeatures.length - 1) {
      return true;
    } else {
      return false;
    }
  }

  public SafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
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
    if (this.AllPlans) {
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
  }

  protected extractPlanFeatures() {
    if (this.Plan.PlanFeatures) {
      this.PlanFeatures = this.Plan.PlanFeatures.split('|');
    }
    // console.log("Plan feats = ", this.PlanFeatures)
  }

  protected determineBuyNowText() {
    if (this.IsUpgrade) {
      this.BuyNowText = 'Change Plan';
    } else {
      this.BuyNowText = 'Buy Now';
      this.IsUpgrade = false;
    }

    if(this.Plan?.UserHasAccess){
      this.BuyNowText = 'Current Plan';
    }
    // console.log("buy nw text: ", this.BuyNowText)
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
