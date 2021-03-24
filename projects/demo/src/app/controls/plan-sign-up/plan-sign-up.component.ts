import { Component, OnInit } from '@angular/core';
import { LcuBillingPlanSignUpContext } from 'projects/common/src/lib/elements/plan-sign-up/plan-sign-up.component';


@Component({
  selector: 'lcu-plan-sign-up',
  templateUrl: './plan-sign-up.component.html',
  styleUrls: ['./plan-sign-up.component.scss'],
})
export class PlanSignUpComponent implements OnInit {
  public Context: LcuBillingPlanSignUpContext;

  constructor() {
    this.Context = {
        LicenseType: 'forecast',
        State: {}
    };
  }

  public ngOnInit(): void {}

}
