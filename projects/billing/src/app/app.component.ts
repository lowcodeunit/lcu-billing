import { Component, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ToggleThemeUtil, Status } from '@lcu/common';
import {
  ActivatedRoute,
  Router,
  ActivationEnd,
  ActivatedRouteSnapshot,
} from '@angular/router';
import {
  UserBillingStateContext,
  UserBillingState,
} from '@lowcodeunit/lcu-billing-common';
import { PagesRoutingModule } from './pages/pages-routing.module';
import { combineLatest, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'lcu-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  protected connectedToStateSub: Subscription;

  protected get licenseType(): string {
    const stateCfg: any = (window as any).LCU.State;

    return stateCfg ? stateCfg.LicenseType : '';
  }

  protected routerEventSub: Subscription;

  /**
   * The Selected theme colors
   */
  public SelectedTheme: string;
  /**
   * The path to return to in case user selects back button from plan page
   */
  public RedirectUri: string;
  /**
   * The billing state
   */
  public State: UserBillingState;
  /**
   * whether or not to display the back button in the toolbar
   */
  // public ShowBackButton: boolean;

  constructor(
    protected overlayContainer: OverlayContainer,
    protected route: ActivatedRoute,
    protected router: Router,
    protected userBillState: UserBillingStateContext
  ) {
    this.route.queryParams.subscribe((params) => {
      this.RedirectUri = params.redirectUri; // Set redirectUri to some local property on the component
    });

    // this.router.events.subscribe((path) => {
    //   // console.log('path = ', path);
    //   this.determineBackButtonVisibility();
    // });
  }

  public ngOnInit(): void {
    this.userBillState.Context.subscribe((state: any) => {
      this.State = state;
      this.stateChanged();
    });
    this.resetTheme();
  }

  /**
   * Component loaded when routes change
   *
   * @param evt router event
   */
  public OnActivate(evt: Event): void {
    // this.routeChanged();
  }

  // public LogoutClicked(){
  //   window.location.replace("/.oauth/logout");
  // }

  /**
   * Called when the toolbar back button has been clicked
   */
  // public BackButtonClicked() {
  //   // console.log("route", this.router.url);
  //   const planReg = new RegExp('(/plan/*)');
  //   const completeReg = new RegExp('(/complete/*)');

  //   if (this.router.url === '/') {
  //     this.router.navigate([this.RedirectUri]);
  //   }
  //   if (planReg.test(this.router.url) || completeReg.test(this.router.url)) {
  //     this.router.navigate(['']);
  //   }
  // }
  /**
   * Reset material theme
   */
  protected resetTheme(): void {
    this.changeTheme('ivy-light-theme');
  }

  /**
   * Toggle through Fathym themes
   *
   * @param val theme type
   */
  protected changeTheme(val: string): void {
    this.SelectedTheme = val;

    const element: HTMLElement = this.overlayContainer.getContainerElement();
    const classList: DOMTokenList = element.classList;

    const toggleTheme: ToggleThemeUtil = new ToggleThemeUtil();
    classList.add(ToggleThemeUtil.Toggle(element.classList, val));
  }

  /**
   * Called when state changes
   */
  protected stateChanged() {
    // console.log('Billing App State Changed', this.State);
    // this.determineBackButtonVisibility();

    if (!this.routerEventSub) {
      this.routerEventSub = this.router.events
        .pipe(
          filter((e) => {
            return e instanceof ActivationEnd;
          }),
          map((e) => {
            return e instanceof ActivationEnd ? e.snapshot : {};
          })
        )
        .subscribe((snapshot: ActivatedRouteSnapshot) => {
          const args = {
            licenseType: this.licenseType,
            ...snapshot.queryParams,
            ...snapshot.params,
          };

          if (!this.connectedToStateSub) {
            this.connectedToStateSub = this.userBillState.ConnectedToState.subscribe(
              (status: Status) => {
                if (
                  status.Code === 0 &&
                  (!this.State.LicenseType ||
                    this.State.LicenseType.Lookup !== args.licenseType)
                ) {
                  this.userBillState.$Refresh(args);
                }
              }
            );
          }
        });
    }
  }
  /**
   * Determines if the back button should be visible or not
   */
  // protected determineBackButtonVisibility() {
  //   // regex works in online test but does not work in browser...
  //   // let routePathRegEx = new RegExp('(\/\w+\/\w+)');
  //   const planReg = new RegExp('(/plan/*)');
  //   const completeReg = new RegExp('(/complete/*)');
  //   // console.log("router url =","'" + this.router.url+"'")
  //   // console.log("? = ", routePathRegEx.test(this.router.url))
  //   if (
  //     planReg.test(this.router.url) ||
  //     completeReg.test(this.router.url) ||
  //     this.RedirectUri
  //   ) {
  //     this.ShowBackButton = true;
  //     // console.log("show back =", this.ShowBackButton)
  //   } else {
  //     this.ShowBackButton = false;
  //   }
  // }
}
