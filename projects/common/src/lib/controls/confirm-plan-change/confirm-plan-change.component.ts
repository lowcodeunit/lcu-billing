import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BillingPlanOption } from '../../state/user-billing/user-billing.state';

@Component({
  selector: 'lcu-confirm-plan-change',
  templateUrl: './confirm-plan-change.component.html',
  styleUrls: ['./confirm-plan-change.component.scss']
})
export class ConfirmPlanChangeComponent implements OnInit {

  public IsReqOptInsChecked: boolean;

  @Input('plan')
  public Plan: BillingPlanOption;

  @Output('go-back-click-event')
  public GoBackClickEvent: EventEmitter<any>;

  @Output('upgrade-confirmed')
  public UpgardeConfirmedEvent: EventEmitter<BillingPlanOption>;

  constructor() { 
    this.GoBackClickEvent = new EventEmitter<any>();

    this.UpgardeConfirmedEvent = new EventEmitter<BillingPlanOption>();

    this.IsReqOptInsChecked = false;
  }

  ngOnInit(): void {
  }

  public GoBackClicked(event: any){
    this.GoBackClickEvent.emit(event);
  }

  public HandleReqOptInsChange(event: any){
    console.log("reqoptins: ", event);
    this.IsReqOptInsChecked = event.checked;

  }

  public UpgradeNow(plan: BillingPlanOption){
    console.log("confirming: ", plan)
    this.UpgardeConfirmedEvent.emit(plan);
  }

}
