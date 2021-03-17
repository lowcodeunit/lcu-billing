import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
} from '@angular/forms';

import { LCUServiceSettings } from '@lcu/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingPlanOption, UserBillingState } from '../../state/user-billing/user-billing.state';
import { UserBillingStateContext } from '../../state/user-billing/user-billing-state.context';

@Component({
  selector: 'lcu-plan-billing',
  templateUrl: './plan-billing.component.html',
  styleUrls: ['./plan-billing.component.scss'],
  animations: [],
})
export class PlanBillingComponent implements OnInit {
  //  Fields

  /**
   * The redirect URI that the user came from to be redirected to once the payment is complete
   */
  protected redirectUri: any;

  /**
   * The plan lookup that is passed in via params
   */
  // protected planGroupID: any;

  /**
   * The plan ID to pass to stripe
   */
  protected planID: any;

  /**
   * The interval passed in via route params
   */
  // protected planInterval: string;

  protected get stripePublicKey(): string {
    const stateCfg: any = (window as any).LCU.State;

    return stateCfg && stateCfg.Stripe ? stateCfg.Stripe.PublicKey : '';
  }

  //  Properties
  /**
   * The billing form
   */
  public BillingForm: FormGroup;

  /**
   * The header to display in the billing form
   */
  public HeaderName: string;

  /**
   * The text to display when the user enters  cc info for free plan
   */
  public ImportantNoteText: string;

  // public productPlan: any;

  public State: UserBillingState;

  /**
   * The Plan that is displayed on the side
   */
  @Input('selected-plan')
  public SelectedPlan: BillingPlanOption;


  /**
   * Whether or not to show the back button in the plan card
   */
  public ShowBackButton: boolean = true;

  @Output('back-button-clicked')
  public BackButtonClicked: EventEmitter<boolean>;

  /*
  * Text to show in the stripe submit button 
  */
  public SubmitButtonText: string;

  @Output('payment-success')
  public PaymentSuccess: EventEmitter<boolean>;

  /**
   * List of plan Groups
   */

  public PlanGroups: Array<string>;

  /**
   * An array of the intervals to pass to the Interval Toggle
   */
  public Intervals: string[];

  /**
   * Whether or not the user has selected an interval and which interval it is.
   */
  public SelectedInterval: string;

  /**
   * The diferent plans within the plangroup
   */
  public SelectedPlanGroupPlans: BillingPlanOption[];

  @Output('selected-plan-changed')
  public SelectedPlanChanged: EventEmitter<BillingPlanOption>;

  //  Constructor
  constructor(
    protected formBldr: FormBuilder,
    protected userBillStateCtx: UserBillingStateContext,
    protected lcuSettings: LCUServiceSettings,
    protected cdr: ChangeDetectorRef,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    this.PlanGroups = new Array<string>();
    this.ImportantNoteText = "";
    this.SubmitButtonText = "PURCHASE NOW"
    this.BackButtonClicked = new EventEmitter<boolean>();
    this.PaymentSuccess = new EventEmitter<boolean>();
    this.SelectedPlanChanged = new EventEmitter<BillingPlanOption>();
  }

  //  Life Cycle
  public ngOnInit() {
    // this.route.paramMap.subscribe((params) => {
    //   this.planGroupID = params.get('id');
    //   this.planInterval = params.get('interval');
    // });
    this.userBillStateCtx.Context.subscribe((state: any) => {
      this.State = state;

      if (this.State) {
        this.stateChanged();
      }
    });

    this.setupImportantNote();
  }


  //  API methods
  

  public IntervalToggled(plan: BillingPlanOption) {
    this.SelectedPlan = plan;
    this.SelectedPlanChanged.emit(plan);
  }

  /**
   * Back button clicked
   */
  public GoBackClicked(event: any) {
    // console.log("should be going back: ", event)
    // this.router.navigate([event]);
    this.BackButtonClicked.emit(true);
  }

  public HandlePaymentSuccess(event: boolean){
    // console.log("Plan-billing recieved: ", event)
    this.PaymentSuccess.emit(event);
  }
  

  //  Helpers

  protected setupImportantNote(){
    if(this.lcuSettings.State?.ImportantNote){
      this.ImportantNoteText = this.lcuSettings.State?.ImportantNote;
    }
  }
 

  protected stateChanged() {
    // this.findPlan();
    this.determineIntervals();

    this.buildSelectedPlanGroupPlans();

  }
  /**
   * determines the intervals to display in the radio buttons
   */
  protected determineIntervals() {
    if (this.State.Plans) {
      this.Intervals = new Array<string>();
      // this.PlanGroups = new Array<string>();
      this.State.Plans.forEach((plan: BillingPlanOption) => {
        if (!this.PlanGroups.includes(plan.PlanGroup)) {
          this.PlanGroups.push(plan.PlanGroup);
        }
        if (!this.Intervals.includes(plan.Interval)) {
          this.Intervals.push(plan.Interval);
        }
      });

      // console.log('plan groups', this.PlanGroups);
    }
  }
  
  /**
   * Find the plan based on the params passed in via router
   */
  // protected findPlan() {
  //   if (this.planGroupID && this.State.Plans && !this.SelectedPlan) {
  //     this.SelectedPlan = this.State.Plans.find(
  //       (p: BillingPlanOption) =>
  //         p.PlanGroup === this.planGroupID && p.Interval === this.planInterval
  //     );

  //     // if plan doesnt exist
  //     if (!this.SelectedPlan) {
  //       this.router.navigate(['']);
  //     }
  //   }
  // }
  /**
   * Extracts the plans that match the plan group param passed in to display
   *
   * different prices and intervals
   */
  protected buildSelectedPlanGroupPlans() {
    if (!this.SelectedPlanGroupPlans && this.State.Plans) {
      this.SelectedPlanGroupPlans = new Array<BillingPlanOption>();
      this.SelectedPlanGroupPlans = this.State.Plans.filter(
        (plan: BillingPlanOption) =>
          plan.PlanGroup === this.SelectedPlan.PlanGroup
      );
      // console.log("SPGP:", this.SelectedPlanGroupPlans);
    }
  }
}
