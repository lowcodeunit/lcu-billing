import { Component, OnInit } from '@angular/core';
import { LcuBillingUpgradeContext } from 'projects/common/src/lib/elements/upgrade/upgrade.component';


@Component({
  selector: 'lcu-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss'],
})
export class UpgradeComponent implements OnInit {
  public Context: LcuBillingUpgradeContext;

  constructor() {
    this.Context = {
        LicenseType: 'forecast',
        State: {}
    };
  }

  public ngOnInit(): void {}

}
