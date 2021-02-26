import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LCUServiceSettings } from '@lcu/common';
import { UserBillingStateContext } from '../../state/user-billing/user-billing-state.context';
import { UserBillingState } from '../../state/user-billing/user-billing.state';

declare var Stripe: any;

@Component({
  selector: 'lcu-stripe-form',
  templateUrl: './stripe-form.component.html',
  styleUrls: ['./stripe-form.component.scss']
})
export class StripeFormComponent implements OnInit {

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

    return stateCfg && stateCfg.Stripe ? stateCfg.Stripe.PublicKey : '';
  }

  /**
   * The billing form
   */
  public BillingForm: FormGroup;

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

 //  Constructor
 constructor(
  protected formBldr: FormBuilder,
  protected userBillStateCtx: UserBillingStateContext,
  protected lcuSettings: LCUServiceSettings,
) {
  this.AcceptedTOS = false;
  this.AcceptedEA = false;
  this.ImportantNoteText = "";
}

  ngOnInit(): void {
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

  /**
   * determines if user has accepted the Terms of service  and enterprise agreement from the check boxes
   */
  public ReqOptsChanged(event: any) {
    // console.log('TOS & EA: ', event);
    this.AcceptedTOS = event.checked;
    this.AcceptedEA = event.checked;
  }

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
      //TODO handle payment method changed
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

  protected setupImportantNote(){
    if(this.lcuSettings.State?.ImportantNote){
      this.ImportantNoteText = this.lcuSettings.State?.ImportantNote;
    }
  }

  /**
   * Sets up the stripe credit card input and styles
   */
  protected setupStripe() {
    console.log("getting called stripe key: ", this.stripePublicKey)
    if (!this.stripe) {
      // Your Stripe public key
      this.stripe = Stripe(this.stripePublicKey);
      console.log("stripe: ", this.stripe)
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
    // this.router.navigate(['complete', this.State.PurchasedPlanLookup]);
  }


  protected stateChanged() {
    
    this.determinePaymentStatus();
  }

}
