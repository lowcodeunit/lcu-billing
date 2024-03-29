import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LCUServiceSettings } from '@lcu/common';
import { UserBillingStateContext } from '../../state/user-billing/user-billing-state.context';
import {
  BillingPlanOption,
  UserBillingState,
} from '../../state/user-billing/user-billing.state';

declare var Stripe: any;

@Component({
  selector: 'lcu-stripe-form',
  templateUrl: './stripe-form.component.html',
  styleUrls: ['./stripe-form.component.scss'],
})
export class StripeFormComponent implements OnInit, AfterViewChecked {
  @ViewChild('cardElement') cardElement: ElementRef;

  /**
   * Stripe card info
   */
  protected stripeCard: any;
  /**
   * Instance of stripe
   */
  protected stripe: any;

  protected get stripePublicKey(): string {
    const stateCfg: any = (window as any).LCU.State;

    return stateCfg && stateCfg.Stripe
      ? stateCfg.Stripe.PublicKey
      : 'pk_test_KnI6QApAae5tFIxuwuoSBFx6';
  }

  protected newPaymentID: string;

  /**
   * The billing form
   */
  public BillingForm: FormGroup;

  /**
   * In order to track if the card has already been changed
   */
  public CardChangeSuccessful: boolean;

  /**
   * The text to display when the user enters  cc info for free plan
   */
  public ImportantNoteText: string;

  public State: UserBillingState;

  /**
   * Error displayed by stripe
   */
  public StripeError: string;

  /**
   * Is credit card info valid
   */
  public StripeValid: boolean;

  /**
   * Whether or not the user has accepted the Terms of Service
   */
  public AcceptedTOS: boolean;
  /**
   * Whether or not the user has accepted the Enterprise Agreement
   */
  public AcceptedEA: boolean;

  public IsSubmitted: boolean;

  @Input('billing-header')
  public BillingHeader: string;

  @Input('is-update-flow')
  public IsUpdateFlow: boolean;

  @Input('selected-plan')
  public SelectedPlan: BillingPlanOption;

  @Input('submit-button-text')
  public SubmitButtonText: string;

  @Output('card-change-success')
  public CardChangeSuccess: EventEmitter<boolean>;

  @Output('payment-successful')
  public PaymentSuccessful: EventEmitter<boolean>;

  //  Constructor
  constructor(
    protected formBldr: FormBuilder,
    protected userBillStateCtx: UserBillingStateContext,
    protected lcuSettings: LCUServiceSettings
  ) {
    this.AcceptedTOS = false;
    this.AcceptedEA = false;
    this.BillingHeader = 'Enter Payment Information';
    this.CardChangeSuccess = new EventEmitter<boolean>();
    this.PaymentSuccessful = new EventEmitter<boolean>();
    this.ImportantNoteText = '';
    this.newPaymentID = '';
    this.SubmitButtonText = 'Submit';
    this.IsSubmitted = false;
    this.CardChangeSuccessful = false;
  }

  public ngOnInit() {
    this.setupForms();
    this.userBillStateCtx.Context.subscribe((state: any) => {
      this.State = state;

      if (this.State) {
        // console.log('State Im interested in: ', this.State);

        this.stateChanged();
      }
    });
  }

  public ngAfterViewChecked(): void {
    this.setupStripe();
  }

  //  API methods

  /**
   * Determines if user has entered all fields and wether or not to show button
   */
  public IsButtonDisabled(): boolean {
    // console.log("TERMS = ", this.AcceptedEA, this.AcceptedTOS, this.StripeValid, this.BillingForm.value.userName)
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

  /**
   * determines if user has accepted the Terms of service  and enterprise agreement from the check boxes
   */
  public ReqOptsChanged(event: any) {
    this.AcceptedEA = event.checked;
    this.AcceptedTOS = event.checked;
    // this.ReqOptInsChanged.emit(event);
  }

  /**
   * called when user submits form
   * @param event
   */
  public SubmitBilling(event: Event) {
    this.State.Loading = true;

    // this.State.PaymentStatus = null;

    this.IsSubmitted = true;
    // console.log('Setting is submitted to true')

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
    console.log('payment result: ', result);
    if (result.error) {
      this.StripeError = result.error;
    } else {
      this.StripeError = '';
      console.log("Selected Plan: ", this.SelectedPlan)
      console.log("is update: ", this.IsUpdateFlow)

      if (this.SelectedPlan && !this.IsUpdateFlow) {
        console.log("new purchase");
        this.userBillStateCtx
          .CompletePayment(
            result.paymentMethod.id,
            this.BillingForm.value.userName,
            this.SelectedPlan.Lookup,
            this.SelectedPlan.TrialPeriodDays
          )
          .then((result: any) => {
            console.log('complete payment result: ', result);
            console.log('State: ', this.State);
            if (result.body.code === 0 && this.State.PaymentStatus.Code === 0) {
              this.PaymentSuccessful.emit(true);
            } else if (
              result.body.code === 0 &&
              this.State.PaymentStatus.Code !== 0
            ) {
              this.StripeError =
                'There has been an issue with the card you provided. Try a different payment method, or contact your bank for more information.';
            }
          });
      }
      else if (this.SelectedPlan && this.IsUpdateFlow) {
        // console.log("is upgrade flow")
      
        this.userBillStateCtx.ChangeSubscription(
          result.paymentMethod.id,
          this.BillingForm.value.userName,
          this.SelectedPlan.Lookup,
          this.SelectedPlan.TrialPeriodDays)
          .then((result: any) => {
            console.log('change subscription result: ', result);
            console.log('State: ', this.State);
            // 
            if (result.body.code === 0 && this.State.PaymentStatus.Code === 0) {
              this.CardChangeSuccess.emit(true);
            } else if (
              result.body.code !== 0 
            ) {
              this.StripeError =
                'There has been an issue with the card you provided. Try a different payment method, or contact your bank for more information.';
            }
            else if(
              this.State.PaymentStatus.Code !== 0
            ){
              this.StripeError =
                'There is an issue with your account, please contact our support.';
            }
          });
      }

      //TODO handle payment method changed
      // else if (this.IsUpdateFlow && result.paymentMethod.id) {
      //   this.newPaymentID = result.paymentMethod.id;
      //   this.userBillStateCtx.UpdatePaymentInfo(
      //     this.BillingForm.value.userName,
      //     result.paymentMethod.id
      //   );
      // }
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

  protected setupImportantNote() {
    if (this.lcuSettings.State?.ImportantNote) {
      this.ImportantNoteText = this.lcuSettings.State?.ImportantNote;
    }
  }

  /**
   * Sets up the stripe credit card input and styles
   */
  protected setupStripe() {
    // console.log("stripe public key: ", this.stripePublicKey)
    if (!this.stripe) {
      // Your Stripe public key
      this.stripe = Stripe(this.stripePublicKey);
      // console.log("stripe: ", this.stripe)
      const elements = this.stripe.elements();

      this.stripeCard = elements.create('card', {
        style: {
          base: {
            iconColor: '#282D35',
            color: '#282D35',
            fontWeight: 600,
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',

            ':focus': {
              color: '#282D35',
            },

            '::placeholder': {
              color: '#282D35',
            },

            ':focus::placeholder': {
              color: '#282D35',
            },
          },
          invalid: {
            color: '#FA755A',
            ':focus': {
              color: '#FA755A',
            },
          },
          '::placeholder': {
            color: '282D35',
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

  protected determineCardChangeSuccess() {
    if (this.newPaymentID === this.State.PaymentMethodID) {
      this.CardChangeSuccessful = true;
      this.CardChangeSuccess.emit(this.CardChangeSuccessful);
    } else {
      //TODO
    }
  }

  /**
   * Determines the payment status of the user
   */
  protected determinePaymentStatus() {
    console.log('Payment Status = ', this.State.PaymentStatus);
    if (this.State.PaymentStatus) {
      if (this.State.PaymentStatus.Code === 0) {
        this.paymentSuccess();
      }

      //Note: Previously, we were checking the payment status, but that's already being accounted for in the state api. We were also missing some parameters
      //which was causing an error. That error was then causing the process to break and not return the state correctly
    }
  }

  /**
   * When the payment returns Successfully
   */
  protected paymentSuccess(): void {
    console.log('Payment successful');

    this.PaymentSuccessful.emit(true);
  }

  protected stateChanged() {
    this.determinePaymentStatus();

    if (this.IsUpdateFlow && this.CardChangeSuccessful === false) {
      this.determineCardChangeSuccess();
    }
    // console.log('Is submitted: ', this.IsSubmitted)

    if (this.IsSubmitted === false) {
      this.StripeError = null;
    }
  }
}
