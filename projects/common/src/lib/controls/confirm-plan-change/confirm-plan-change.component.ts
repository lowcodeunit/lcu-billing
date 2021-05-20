import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Status } from '@lcu/common';
import { BillingPlanOption } from '../../state/user-billing/user-billing.state';

@Component({
  selector: 'lcu-confirm-plan-change',
  templateUrl: './confirm-plan-change.component.html',
  styleUrls: ['./confirm-plan-change.component.scss']
})
export class ConfirmPlanChangeComponent implements OnInit {

  public IsReqOptInsChecked: boolean;

  public HeaderText: string;

  @Input('payment-status')
  public PaymentStatus: Status;

  @Input('plan')
  public Plan: BillingPlanOption;

  @Input('submit-button-text')
  public SubmitButtonText: string;

  @Output('go-back-click-event')
  public GoBackClickEvent: EventEmitter<any>;

  @Output('upgrade-confirmed')
  public UpgardeConfirmedEvent: EventEmitter<BillingPlanOption>;

  @Output('payment-success')
  public PaymentSuccess: EventEmitter<boolean>;

  constructor() { 
    this.GoBackClickEvent = new EventEmitter<any>();

    this.PaymentSuccess = new EventEmitter<boolean>();

    this.UpgardeConfirmedEvent = new EventEmitter<BillingPlanOption>();

    this.IsReqOptInsChecked = false;
  }

  ngOnInit(): void {
    this.HeaderText = `By entering your credit card information and clicking the confirmation button below you confirm that you wish to change to the ${this.Plan.Name} plan.`
  }

  public IsButtonDisabled(): boolean{
    if(this.IsReqOptInsChecked && (this.PaymentStatus.Code === 0 || this.PaymentStatus === null)){
      return false;
    }
    else{
      return true;
    }
  }

  public GoBackClicked(event: any){
    this.GoBackClickEvent.emit(event);
  }

  public HandleReqOptInsChange(event: any){
    console.log("reqoptins: ", event);
    this.IsReqOptInsChecked = event.checked;

  }

  public HandlePaymentSuccess(event: boolean){
    console.log("Plan-billing recieved: ", event)
    this.PaymentSuccess.emit(event);
    this.UpgradeNow(this.Plan);
  }

  public UpgradeNow(plan: BillingPlanOption){
    console.log("confirming: ", plan)
    this.UpgardeConfirmedEvent.emit(plan);
  }

}
