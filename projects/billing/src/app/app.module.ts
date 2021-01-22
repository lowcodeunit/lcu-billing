import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { FathymSharedModule, LCUServiceSettings, MaterialModule } from '@lcu/common';
import { LcuBillingModule, UserBillingStateContext } from '@lowcodeunit/lcu-billing-common';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FathymSharedModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    LcuBillingModule
    ],
  providers: [
    UserBillingStateContext,
    {
      provide: LCUServiceSettings,
      useValue: FathymSharedModule.DefaultServiceSettings(environment)
    }
  ],
  bootstrap: [AppComponent],
  exports: [],
  entryComponents: []
})
export class AppModule {}
