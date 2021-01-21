import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  UserBillingStateContext,
  UserBillingState,
  NapkinIDESetupStepTypes,
  BillingPlanOption,
} from '@napkin-ide/lcu-napkin-ide-common';
import { LCUServiceSettings } from '@lcu/common';
import { ActivatedRoute, Router } from '@angular/router';

declare var Stripe: any;

@Component({
  selector: 'lcu-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  animations: [],
})
export class BillingComponent implements OnInit, AfterViewChecked {
  //  Fields

  @ViewChild('cardElement') cardElement: ElementRef;
  /**
   * Stripe card info
   */
  protected stripeCard: any;
  /**
   * Instance of stripe
   */
  protected stripe: any;
  /**
   * The redirect URI that the user came from to be redirected to once the payment is complete
   */
  protected redirectUri: any;

  /**
   * The plan lookup that is passed in via params
   */
  protected planGroupID: any;

  /**
   * The plan ID to pass to stripe
   */
  protected planID: any;

  /**
   * The interval passed in via route params
   */
  protected planInterval: string;

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

  // public productPlan: any;

  public State: UserBillingState;

  /**
   * The Plan that is displayed on the side
   */
  public SelectedPlan: BillingPlanOption;

  /**
   * Error displayed by stripe
   */
  public StripeError: string;

  /**
   * Is credit card info valid
   */
  public StripeValid: boolean;

  /**
   * Whether or not to show the back button in the plan card
   */
  public ShowBackButton: boolean = true;

  public NapkinIDESetupStepTypes = NapkinIDESetupStepTypes;

  /**
   * Whether or not the user has accepted the Terms of Service
   */
  public AcceptedTOS: boolean;
  /**
   * Whether or not the user has accepted the Enterprise Agreement
   */
  public AcceptedEA: boolean;

  /**
   * List of plan Groups
   */

  public PlanGroups: Array<string>;

  /**
   * An array of the intervals to pass to the Interval Toggle
   */
  public Intervals: string[];

  // public stripeCardNumber: any;
  // public stripeCardExpiry: any;
  // public stripeCardCvc: any;

  /**
   * Whether or not the user has selected an interval and which interval it is.
   */
  public SelectedInterval: string;

  /**
   * The diferent plans within the plangroup
   */
  public SelectedPlanGroupPlans: BillingPlanOption[];

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
    this.AcceptedTOS = false;
    this.AcceptedEA = false;
  }

  //  Life Cycle
  public ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.planGroupID = params.get('id');
      this.planInterval = params.get('interval');
    });
    this.setupForms();
    this.userBillStateCtx.Context.subscribe((state: any) => {
      this.State = state;

      if (this.State) {
        this.stateChanged();
      }
    });
  }

  public ngAfterViewChecked(): void {
    this.setupStripe();
  }

  //  API methods
  /**
   * called when user submits form
   * @param event
   */
  public SubmitBilling(event: Event) {
    this.State.Loading = true;

    event.preventDefault();

    this.stripe
      .createPaymentMethod({
        type: 'card',
        // cardExpiry: this.stripeCardExpiry,
        // cardNumber: this.stripeCardNumber,
        // cardCvc: this.stripeCardCvc,
        card: this.stripeCard,
        billing_details: {
          email: this.State.Username,
        },
      })
      .then((result: any) => {
        this.handleStripePaymentMethodCreated(result);
      });
    // this.userBillStateCtx.ResetState(this.SelectedPlan.LicenseType.Lookup)
  }

  public IntervalToggled(plan: BillingPlanOption) {
    this.SelectedPlan = plan;
  }
  /**
   * Toggles planid and plan card to the selected plan
   * @param toggleSelected
   */
  // public ToggleChanged(toggleSelected: any): void {
  // false === Annually
  // true === Monthly
  // console.log("toggle changed: ", toggleSelected);
  //   this.State.Plans.forEach((plan: BillingPlanOption) => {
  //     if (
  //       this.SelectedPlan.PlanGroup === plan.PlanGroup &&
  //       plan.Interval === toggleSelected.value
  //     ) {
  //       this.SelectedPlan = plan;
  //       this.planID = this.SelectedPlan.Lookup;
  //       // console.log("Toggled to: ", this.SelectedPlan);
  //     }
  //   });
  // }

  /**
   * Back button clicked
   */
  public GoBackClicked(event: any) {
    // console.log("should be going back: ", event)
    this.router.navigate([event]);
  }
  /**
   * determines if user has accepted the Terms of service  and enterprise agreement from the check boxes
   */
  public ReqOptsChanged(event: any) {
    // console.log('TOS & EA: ', event);
    this.AcceptedTOS = event.checked;
    this.AcceptedEA = event.checked;
  }
  /**
   * determines if user has accepted the Enterprise agreement from the check boxes
   */
  // public EAChanged(event: any) {
  //   // console.log('EA: ', event);
  //   this.AcceptedEA = event.checked;
  // }
  /**
   * Determines if user has entered all fields and wether or not to show button
   */
  public IsButtonDisabled(): boolean {
    // console.log("TERMS = ", this.AcceptedEA, this.AcceptedTOS)
    if (
      this.AcceptedEA &&
      this.AcceptedTOS &&
      this.StripeValid &&
      this.BillingForm.value.userName
    ) {
      return false;
    } else {
      return true;
    }
  }

  //  Helpers
  /**
   * Checks to see if card has error
   */
  protected handleCardChanged(event: any) {
    // console.log('Error = ', event);
    if (event.error) {
      this.StripeError = event.error.message;
      this.StripeValid = false;
    } else if (event.complete === true) {
      this.StripeError = '';

      this.StripeValid = true;
    } else {
      this.StripeValid = false;
    }
  }
  /**
   * Handles the stripe once user has confirmed payment
   */
  protected handleStripePaymentMethodCreated(result: any) {
    // console.log('payment result: ', result.error);
    if (result.error) {
      this.StripeError = result.error;
    } else {
      this.StripeError = '';
      // console.log('Billing Form: ', this.BillingForm);
      this.userBillStateCtx.CompletePayment(
        result.paymentMethod.id,
        this.BillingForm.value.userName,
        this.SelectedPlan.Lookup,
        this.SelectedPlan.TrialPeriodDays
      );
    }
  }
  /**
   * Sets up Billing form
   */
  protected setupForms() {
    this.BillingForm = this.formBldr.group({
      prodPlan: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
    });

    this.StripeValid = false;
  }
  /**
   * Sets up the stripe credit card input and styles
   */
  protected setupStripe() {
    if (!this.stripe) {
      // Your Stripe public key
      this.stripe = Stripe(this.stripePublicKey);
      // this.setupStripeElements();
      const elements = this.stripe.elements();

      this.stripeCard = elements.create('card', {
        style: {
          base: {
            iconColor: '#c7c7c7',
            color: '#c7c7c7',
            fontWeight: 600,
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',

            ':focus': {
              color: '#c7c7c7',
            },

            '::placeholder': {
              color: '#c7c7c7',
            },

            ':focus::placeholder': {
              color: '#c7c7c7',
            },
          },
          invalid: {
            color: '#FA755A',
            ':focus': {
              color: '#FA755A',
            },
          },
          '::placeholder': {
            color: 'grey',
          },
        },
      });
      this.stripeCard.mount(document.getElementById('card-element'));

      this.stripeCard.addEventListener('change', (event: any) =>
        this.handleCardChanged(event)
      );

      //     this.stripeCardNumber.addEventListener('change', (event: any) =>
      //     this.handleCardChanged(event)
      //   );

      // this.stripeCardExpiry.addEventListener('change', (event: any) =>
      //     this.handleCardChanged(event)
      //   );

      //   this.stripeCardCvc.addEventListener('change', (event: any) =>
      //     this.handleCardChanged(event)
      //   );
    }
  }

  // protected setupStripeElements():void{
  //   const elements = this.stripe.elements();
  //   var elementStyles = {
  //     base: {
  //       color: 'black',
  //       fontWeight: 600,
  //       fontFamily: 'Arial, sans-serif',
  //       fontSize: '16px',
  //       fontSmoothing: 'antialiased',

  //       ':focus': {
  //         color: 'black',
  //       },

  //       '::placeholder': {
  //         color: 'grey',
  //       },

  //       ':focus::placeholder': {
  //         color: 'black',
  //       },
  //     },
  //     invalid: {
  //       color: '#FA755A',
  //       ':focus': {
  //         color: '#FA755A',
  //       },
  //       '::placeholder': {
  //         color: 'grey',
  //       },
  //     },
  //   };

  //   var elementClasses = {
  //     focus: 'focus',
  //     empty: 'empty',
  //     invalid: 'invalid',
  //   };

  //   this.stripeCardNumber = elements.create('cardNumber', {
  //     style: elementStyles,
  //     classes: elementClasses,
  //   });
  //   this.stripeCardNumber.mount('#card-number');

  //   this.stripeCardExpiry = elements.create('cardExpiry', {
  //     style: elementStyles,
  //     classes: elementClasses,
  //   });
  //   this.stripeCardExpiry.mount('#card-expiry');

  //   this.stripeCardCvc = elements.create('cardCvc', {
  //     style: elementStyles,
  //     classes: elementClasses,
  //   });
  //   this.stripeCardCvc.mount('#card-cvc');
  // }

  protected stateChanged() {
    this.findPlan();
    this.determineIntervals();

    // this.determineCheckboxes();
    // console.log('state: ', this.State);
    // console.log("selected plan: ", this.SelectedPlan)
    // console.log("planID =", this.planID);
    // if a plan has been passed in via param set the selected plan accordingly

    this.buildSelectedPlanGroupPlans();

    // use change detection to prevent ExpressionChangedAfterItHasBeenCheckedError, when
    // using *ngIf with external form properties
    // this.cdr.detectChanges();
    this.determinePaymentStatus();
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
   * Whether or not to display the Terms of service or the Enterprise agreement
   */
  protected determineCheckboxes() {
    if (this.State.RequiredOptIns) {
      if (!this.State.RequiredOptIns.includes('ToS')) {
        this.AcceptedTOS = true;
      }
      if (!this.State.RequiredOptIns.includes('EA')) {
        this.AcceptedEA = true;
      }
    }
  }
  /**
   * Find the plan based on the params passed in via router
   */
  protected findPlan() {
    if (this.planGroupID && this.State.Plans && !this.SelectedPlan) {
      this.SelectedPlan = this.State.Plans.find(
        (p: BillingPlanOption) =>
          p.PlanGroup === this.planGroupID && p.Interval === this.planInterval
      );

      // if plan doesnt exist
      if (!this.SelectedPlan) {
        this.router.navigate(['']);
      }
    }
  }
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
  /**
   * Determines the payment status of the user
   */
  protected determinePaymentStatus() {
    console.log('Payment Status = ', this.State.PaymentStatus);
    if (this.State.PaymentStatus) {
      // console.log('Payment Status', this.State.PaymentStatus);
      if (this.State.PaymentStatus.Code === 101) {
        this.stripe
          .confirmCardPayment('requires_action')
          .then(function (result: any) {
            if (result.error) {
              // Display error message in  UI.
              this.StripeError = this.State.PaymentStatus.Message;

              // The card was declined (i.e. insufficient funds, card has expired, etc)
            } else {
              // Show a success message to your customer
              this.paymentSuccess();
            }
          });
      } else if (this.State.PaymentStatus.Code === 1) {
        // this.StripeError = this.State.PaymentStatus.Message;
        this.StripeError =
          'There has been an issue processing the card you provided, please ensure you entered the information properly or try a different card.';
      } else if (this.State.PaymentStatus.Code === 0) {
        this.paymentSuccess();
      } else {
        // TODO: What to do in case of other errors
      }
    }
  }

  /**
   * When the payment returns Successfully
   */
  protected paymentSuccess(): void {
    // console.log("selected plan on pay:", this.SelectedPlan)
    // this.router.navigate([this.SelectedPlan.Lookup, 'complete']);
    // console.log("LicenseType", this.SelectedPlan.LicenseType)
    this.router.navigate(['complete', this.State.PurchasedPlanLookup]);
  }
}
