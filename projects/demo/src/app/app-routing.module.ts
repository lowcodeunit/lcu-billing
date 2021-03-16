import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './controls/home/home.component';
import { DocumentationComponent } from './controls/documentation/documentation.component';
import { UpgradeComponent } from './controls/upgrade/upgrade.component';
import { UpdateCreditCardComponent } from './controls/update-credit-card/update-credit-card.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'upgrade', component: UpgradeComponent },
  { path: 'update', component: UpdateCreditCardComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'documentation', component: DocumentationComponent }
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
