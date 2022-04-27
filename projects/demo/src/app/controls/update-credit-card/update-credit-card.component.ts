import { Component, OnInit } from '@angular/core';
import { LcuBillingUpdateCreditCardContext } from 'projects/common/src/lib/elements/update-credit-card/update-credit-card.component';


@Component({
  selector: 'lcu-update-credit-card',
  templateUrl: './update-credit-card.component.html',
  styleUrls: ['./update-credit-card.component.scss'],
})
export class UpdateCreditCardComponent implements OnInit {
  public Context: LcuBillingUpdateCreditCardContext;

  constructor() {
    this.Context = {
      LicenseType: 'iot',
      State: {}
    };
  }

  public ngOnInit(): void {}

}
