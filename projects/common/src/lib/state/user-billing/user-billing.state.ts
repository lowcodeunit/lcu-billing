import { Status } from '@lcu/common';

export class UserBillingState {
  public CustomerName?: string;

  public ExistingLicenseTypes?: Array<LicenseAccessToken>; 

  public FeaturedPlanGroup?: string;

  public Loading?: boolean;

  public LicenseType?: LicenseTypeDetails;

  public NextBillingDate?: Date;

  public PaymentMethodID?: string;

  public PaymentStatus?: Status;

  public Plans?: BillingPlanOption[];

  public PopularPlanGroup?: string;

  public RequiredOptIns?: string[];

  public Status?: Status;

  public Username?: string;

  public PurchasedPlanLookup?: string;

  public SuccessRedirect? : string;

}

export class BillingPlanOption {
  public ContactText?: string;

  public DataApps?: number;

  public Description?: string;

  public DataFlows?: number;

  public DiscountedFrom?: string;

  public HeaderName?: string;

  public Interval?: string;

  public LCUs?: number;

  public Lookup?: string;

  public LicenseName?: string;

  public LicenseType?: string;

  public Name?: string;

  public PlanGroup?: string;

  public Price?: number;

  public Priority?: number;

  public PlanFeatures?: string;

  public TrialPeriodDays?: number;

  public PointQueries?: string;

  public UserHasAccess?: boolean;
}

// export class StripeSubscriptionDetails{
//   public BillingPeriodStart: Date;

//   public BillingPeriodEnd: Date;

//   public BillingStatus: string;

//   public CollectionMethod: string;

//   public SubscriptionCreated: Date;

//   public CustomerId: string;

//   public SubscriptionId: string;
// }

export class LicenseTypeDetails {
  public Lookup: string; // Would contain the actual license type value 'LCU' or 'forecast' or whatever else comes down the line

  public Name: string;  //  Use this value for display the license type name to a user
}

export class LicenseAccessToken{

        public AccessStartDate: Date;

        public Details: any;

        public ExpirationDate: Date;

        public EnterpriseOverride: boolean;

        public IsLocked: boolean;

        public IsReset: boolean;

        public Lookup: string;

        public TrialPeriodDays: number;

        public Username: string;
}
