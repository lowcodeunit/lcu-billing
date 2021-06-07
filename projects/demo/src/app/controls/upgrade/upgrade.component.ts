import { Component, OnInit } from '@angular/core';
import { LCUServiceSettings } from '@lcu/common';
import { LcuBillingUpgradeContext } from 'projects/common/src/lib/elements/upgrade/upgrade.component';


@Component({
  selector: 'lcu-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.scss'],
})
export class UpgradeComponent implements OnInit {
  public Context: LcuBillingUpgradeContext;

  constructor(protected settings: LCUServiceSettings) {
    this.Context = {
        LicenseType: settings.State.LicenseType,
        State: {}
    };
  }

  public ngOnInit(): void {}

}
