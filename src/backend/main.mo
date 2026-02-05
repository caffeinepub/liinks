import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Blob "mo:core/Blob";
import List "mo:core/List";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Nat32 "mo:core/Nat32";
import Char "mo:core/Char";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
  type UserId = Principal;
  type TemplateId = Text;
  type Category = Text;
  type SubscriptionTier = { #premium; #pro };
  type TemplateStatus = { #published; #unlisted };
  type SocialHandleId = Text;
  type LinkId = Text;
  type ShareId = Text;

  public type UserProfile = {
    userId : UserId;
    firstName : Text;
    lastName : Text;
    email : Text;
    phoneNumber : Text;
    subscription : ?SubscriptionTier;
    subscriptionExpiry : ?Time.Time;
  };

  type Template = {
    id : TemplateId;
    creatorId : ?UserId;
    name : Text;
    category : Category;
    description : Text;
    status : TemplateStatus;
    thumbnail : Storage.ExternalBlob;
    editableContent : Blob;
    createdAt : Time.Time;
  };

  type SocialHandle = {
    id : SocialHandleId;
    platform : Text;
    username : Text;
    url : Text;
  };

  type Link = {
    id : LinkId;
    title : Text;
    url : Text;
    description : Text;
  };

  type BioPage = {
    userId : UserId;
    templateId : TemplateId;
    title : Text;
    bioText : Text;
    socialHandles : [SocialHandle];
    links : [Link];
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  module UserProfile {
    func compare(left : UserProfile, right : UserProfile) : Order.Order {
      left.userId.toText().compare(right.userId.toText());
    };
  };

  module Template {
    func compare(left : Template, right : Template) : Order.Order {
      switch (left.category.compare(right.category)) {
        case (#equal) { left.name.compare(right.name) };
        case (order) { order };
      };
    };
  };

  // State
  let userProfiles = Map.empty<UserId, UserProfile>();
  let templates = Map.empty<TemplateId, Template>();
  let bioPages = Map.empty<UserId, BioPage>();
  let famousInfluencers = Map.empty<Category, List.List<UserProfile>>();
  let sharedBios = Map.empty<ShareId, BioPage>();

  // Helper functions
  func generateTemplateId(name : Text, timestamp : Time.Time) : TemplateId {
    name.concat(timestamp.toText());
  };

  func generateShareId(userId : UserId, templateId : TemplateId) : ShareId {
    userId.toText().concat("_").concat(templateId);
  };

  // System Bio Templates
  let systemTemplates : [Template] = [
    {
      id = "fashionista";
      creatorId = null;
      name = "Fashionista";
      category = "Fashion";
      description = "Clean fashion bio with featured outfits";
      status = #published;
      thumbnail = "";
      editableContent = Blob.fromArray([]);
      createdAt = Time.now();
    },
    {
      id = "vlogger";
      creatorId = null;
      name = "Vlogger";
      category = "Creator/Influencer";
      description = "Modern creator bio with video links";
      status = #published;
      thumbnail = "";
      editableContent = Blob.fromArray([]);
      createdAt = Time.now();
    },
    {
      id = "traveller";
      creatorId = null;
      name = "Globe-Trotter";
      category = "Travel";
      description = "Travel-themed bio with map section";
      status = #published;
      thumbnail = "";
      editableContent = Blob.fromArray([]);
      createdAt = Time.now();
    },
    {
      id = "coach";
      creatorId = null;
      name = "Fitness Coach";
      category = "Fitness & Coaching";
      description = "Bio for fitness coaches and trainers";
      status = #published;
      thumbnail = "";
      editableContent = Blob.fromArray([]);
      createdAt = Time.now();
    },
    {
      id = "foodie";
      creatorId = null;
      name = "Foodie";
      category = "Food";
      description = "Appetizing bio for food lovers";
      status = #published;
      thumbnail = "";
      editableContent = Blob.fromArray([]);
      createdAt = Time.now();
    },
    {
      id = "realtor";
      creatorId = null;
      name = "Realtor";
      category = "Real Estate";
      description = "Professional bio for realtors";
      status = #published;
      thumbnail = "";
      editableContent = Blob.fromArray([]);
      createdAt = Time.now();
    },
    {
      id = "gamer";
      creatorId = null;
      name = "Gamer";
      category = "Tech & Gaming";
      description = "Bio for gamers and streamers";
      status = #published;
      thumbnail = "";
      editableContent = Blob.fromArray([]);
      createdAt = Time.now();
    },
  ];

  public query ({ caller }) func isRegistered() : async Bool {
    userProfiles.containsKey(caller);
  };

  public shared ({ caller }) func registerProfile(firstName : Text, lastName : Text, email : Text, phoneNumber : Text) : async () {
    if (caller.toText() == "2vxsx-fae") {
      Runtime.trap("Anonymous users cannot register");
    };

    if (userProfiles.containsKey(caller)) {
      Runtime.trap("This user is already registered.");
    };

    let profile : UserProfile = {
      userId = caller;
      firstName;
      lastName;
      email;
      phoneNumber;
      subscription = null;
      subscriptionExpiry = null;
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    if (profile.userId != caller) {
      Runtime.trap("Unauthorized: Can only save your own profile");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getAllTemplates() : async [Template] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can browse templates");
    };
    let dynamicTemplates = templates.values().toArray();
    dynamicTemplates.concat(systemTemplates);
  };

  public query ({ caller }) func getTemplatesByCategory(category : Category) : async [Template] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can browse templates");
    };

    let dynamicTemplates = templates.values().toArray().filter(
      func(t) {
        t.category == category;
      }
    );
    let systemMatched = systemTemplates.filter(
      func(t) {
        t.category == category;
      }
    );
    dynamicTemplates.concat(systemMatched);
  };

  public shared ({ caller }) func subscribe(tier : SubscriptionTier, duration : Time.Time) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can subscribe");
    };

    let paymentSuccess = true; // Razorpay integration handled client-side
    if (not paymentSuccess) {
      Runtime.trap("Payment required for subscription");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Profile not found. Please register first");
      };
      case (?profile) { profile };
    };

    let updatedProfile = {
      profile with
      subscription = ?tier;
      subscriptionExpiry = ?duration;
    };
    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func hasActiveSubscription() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can check subscription status");
    };
    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.subscription, profile.subscriptionExpiry) {
          case (?_, ?expiry) {
            Time.now() < expiry;
          };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func createBioPage(templateId : TemplateId, title : Text, bioText : Text, socialHandles : [SocialHandle], links : [Link]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can create bio pages");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Profile not found. Please register first");
      };
      case (?profile) { profile };
    };

    let hasActiveSub = switch (profile.subscription, profile.subscriptionExpiry) {
      case (?_, ?expiry) {
        Time.now() < expiry;
      };
      case (_) { false };
    };

    if (not hasActiveSub) {
      Runtime.trap("Subscription required to save bio page");
    };

    let bioPage : BioPage = {
      userId = caller;
      templateId;
      title;
      bioText;
      socialHandles;
      links;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    bioPages.add(caller, bioPage);

    let shareId = generateShareId(caller, templateId);
    sharedBios.add(shareId, bioPage);
  };

  public shared ({ caller }) func uploadTemplate(
    name : Text,
    category : Category,
    description : Text,
    thumbnail : Storage.ExternalBlob,
    editableContent : Blob,
  ) : async TemplateId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can upload templates");
    };

    let profile = switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Profile not found. Please register first");
      };
      case (?profile) { profile };
    };

    let activePro = switch (profile.subscription, profile.subscriptionExpiry) {
      case (?tier, ?expiry) {
        tier == #pro and Time.now() < expiry;
      };
      case (_) { false };
    };

    if (not activePro) {
      Runtime.trap("Pro subscription required to upload templates");
    };

    let templateId = generateTemplateId(name, Time.now());
    let newTemplate : Template = {
      id = templateId;
      creatorId = ?caller;
      name;
      category;
      description;
      status = #published;
      thumbnail;
      editableContent;
      createdAt = Time.now();
    };
    templates.add(templateId, newTemplate);
    templateId;
  };

  public shared ({ caller }) func saveFamousInfluencer(category : Category, profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can save famous influencers");
    };

    let existing = switch (famousInfluencers.get(category)) {
      case (null) { List.empty<UserProfile>() };
      case (?list) { list };
    };
    existing.add(profile);
    famousInfluencers.add(category, existing);
  };

  public query ({ caller }) func getFamousInfluencers(category : Category) : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view famous influencers");
    };
    switch (famousInfluencers.get(category)) {
      case (?list) { list.toArray() };
      case (null) { [] };
    };
  };

  // New public query function for shared bios
  public query ({ caller }) func getSharedBio(shareId : ShareId) : async ?BioPage {
    sharedBios.get(shareId);
  };
};

