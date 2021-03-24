import {
    UserManagementState,
    UserTypes
  } from './user-management.state';
  import { StateContext } from '@lcu/common';
  import { Injectable, Injector } from '@angular/core';
  
  @Injectable({
    providedIn: 'root'
  })
  export class UserManagementStateContext extends StateContext<
    UserManagementState
  > {
    //  Properties
  
    //  Constructors
    constructor(protected injector: Injector) {
      super(injector);
    }
  
    //  API Methods
    public BootOrganization() {
      this.Execute({
        Arguments: {},
        Type: 'BootOrganization'
      });
    }
  
  
    public ListLicenses(){
      console.log("calling list licenses")
      this.Execute({
        Arguments:{},
        Type: 'ListLicenses'
      })
    }
  
  
  
    public SetPaymentMethod(methodId: string) {
      this.Execute({
        Arguments: {
          MethodID: methodId
        },
        Type: 'SetPaymentMethod'
      });
    }
  
    public SetUserType(userType: UserTypes) {
      this.Execute({
        Arguments: {
          UserType: userType
        },
        Type: 'SetUserType'
      });
    }
  
  
    public CancelSubscription(reason: string) {
      this.Execute({
        Arguments: {
          CancellationReason: reason
        },
        Type: 'CancelSubscription'
      });
    }
  
    //  Helpers
    protected defaultValue() {
      return { Loading: true } as UserManagementState;
    }
  
    protected loadStateKey(): string {
      return 'init';
    }
  
    protected loadStateName(): string {
      return 'usermanagement';
    }
  }
  