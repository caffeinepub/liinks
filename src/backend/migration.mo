import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  // Types
  type UserId = Principal;
  type SubscriptionTier = { #premium; #pro };

  type UserProfile = {
    userId : UserId;
    firstName : Text;
    lastName : Text;
    email : Text;
    phoneNumber : Text;
    subscription : ?SubscriptionTier;
    subscriptionExpiry : ?Time.Time;
  };

  type OldActor = {
    userProfiles : Map.Map<UserId, UserProfile>;
  };

  type SubscriptionRecord = {
    tier : SubscriptionTier;
    duration : Time.Time;
    paymentReference : Text;
    confirmedAt : Time.Time;
  };

  type TemporarySubscription = {
    userId : UserId;
    tier : SubscriptionTier;
    duration : Time.Time;
    paymentReference : Text;
    initiatedAt : Time.Time;
  };

  type NewActor = {
    userProfiles : Map.Map<UserId, UserProfile>;
    pendingSubscriptions : Map.Map<UserId, TemporarySubscription>;
    confirmedSubscriptions : Map.Map<UserId, SubscriptionRecord>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      pendingSubscriptions = Map.empty<UserId, TemporarySubscription>();
      confirmedSubscriptions = Map.empty<UserId, SubscriptionRecord>();
    };
  };
};
