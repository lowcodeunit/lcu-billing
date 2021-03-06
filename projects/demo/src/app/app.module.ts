import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FathymSharedModule, LCUServiceSettings, MaterialModule } from '@lcu/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './controls/home/home.component';
import { DocumentationComponent } from './controls/documentation/documentation.component';
import { LcuDocumentationModule } from '@lowcodeunit/lcu-documentation-common';
import { UpgradeComponent } from './controls/upgrade/upgrade.component';
import { environment } from '../environments/environment';
import { UpdateCreditCardComponent } from './controls/update-credit-card/update-credit-card.component';
import { LcuBillingModule } from 'projects/common/src/lib/lcu-billing.module';
import { PlanSignUpComponent } from './controls/plan-sign-up/plan-sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UpgradeComponent,
    PlanSignUpComponent,
    UpdateCreditCardComponent,
    DocumentationComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FathymSharedModule,
    MaterialModule,
    FlexLayoutModule,
    LcuDocumentationModule.forRoot(),
    LcuBillingModule.forRoot()
  ],
  providers: [ 
    {
    provide: LCUServiceSettings,
    useValue: FathymSharedModule.DefaultServiceSettings(environment)
  }],
  bootstrap: [AppComponent],
  exports: [LcuBillingModule]
})
export class AppModule { }
