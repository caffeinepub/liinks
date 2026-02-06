import Array "mo:core/Array";
import Blob "mo:core/Blob";
import List "mo:core/List";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
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
  type OtpCode = Text;
  type PhoneNumber = Text;
  type OtpId = Text;

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

  public type OtpRequest = {
    phoneNumber : PhoneNumber;
    otpCode : OtpCode;
    createdTime : Int;
    verified : Bool;
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
  let pendingSubscriptions = Map.empty<UserId, TemporarySubscription>();
  let confirmedSubscriptions = Map.empty<UserId, SubscriptionRecord>();

  // OTP (One-Time-Password) Storage (new)
  let activeOtps = Map.empty<OtpId, OtpRequest>();

  // Helper functions
  func generateTemplateId(name : Text, timestamp : Time.Time) : TemplateId {
    name.concat(timestamp.toText());
  };

  func generateShareId(userId : UserId, templateId : TemplateId) : ShareId {
    userId.toText().concat("_").concat(templateId);
  };

  func generateOtpId(principal : Principal, phoneNumber : PhoneNumber) : OtpId {
    principal.toText().concat(phoneNumber);
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

  public query ({ caller }) func isPhoneVerified() : async Bool {
    let phoneVerifications = getVerifiedPhoneNumbersByPrincipal(caller);
    phoneVerifications.size() > 0;
  };

  public query ({ caller }) func getVerifiedPhoneNumbers() : async [Text] {
    getVerifiedPhoneNumbersByPrincipal(caller).toArray();
  };

  func getVerifiedPhoneNumbersByPrincipal(_principal : Principal) : List.List<Text> {
    let verifiedPhones = List.empty<Text>();
    for ((_, req) in activeOtps.entries()) {
      if (req.verified) {
        verifiedPhones.add(req.phoneNumber);
      };
    };
    verifiedPhones;
  };

  public shared ({ caller }) func requestOtp(phoneNumber : PhoneNumber, otpCode : Text) : async () {
    if (phoneNumber.size() < 5) {
      Runtime.trap("Invalid phone number, must be at least 5 characters");
    };
    if (otpCode.size() == 0) {
      Runtime.trap("Invalid OTP code, must be at least 6 digits");
    };

    let otpId = generateOtpId(caller, phoneNumber);
    let otpRequest : OtpRequest = {
      phoneNumber;
      otpCode;
      createdTime = Time.now();
      verified = false;
    };
    activeOtps.add(otpId, otpRequest);
  };

  public shared ({ caller }) func verifyPhoneNumber(phoneNumber : PhoneNumber, otpCode : OtpCode) : async () {
    let otpId = generateOtpId(caller, phoneNumber);
    switch (activeOtps.get(otpId)) {
      case (null) { Runtime.trap("OTP request not found for phone number.") };
      case (?req) {
        // check if a records as not verified
        if (not req.verified) {
          // check OTP for correctness
          if (req.otpCode != otpCode) {
            Runtime.trap("Invalid OTP code. Please try again.");
          };
          let updatedRequest = {
            req with
            verified = true;
          };
          activeOtps.add(otpId, updatedRequest);
        } else {
          Runtime.trap("Phone number already verified");
        };
      };
    };
  };

  public shared ({ caller }) func registerProfile(firstName : Text, lastName : Text, email : Text, phoneNumber : Text) : async () {
    // Anonymous users cannot register
    if (caller.toText() == "2vxsx-fae") {
      Runtime.trap("Anonymous users cannot register");
    };

    let otpId = generateOtpId(caller, phoneNumber);
    switch (activeOtps.get(otpId)) {
      case (null) { Runtime.trap("Phone number not verified") };
      case (?req) {
        if (not req.verified) {
          Runtime.trap("Phone number not verified");
        };
      };
    };

    // if already registered, skip, error
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

    // Automatically upgrade #guest to #user after successful registration
    AccessControl.assignRole(accessControlState, caller, caller, #user);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    // Check if user is registered (has a profile)
    // A registered user should be able to access their profile
    if (not userProfiles.containsKey(caller)) {
      Runtime.trap("Profile not found. Please register first");
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
    // Check if user is registered (has a profile)
    if (not userProfiles.containsKey(caller)) {
      Runtime.trap("Profile not found. Please register first");
    };
    if (profile.userId != caller) {
      Runtime.trap("Unauthorized: Can only save your own profile");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getAllTemplates() : async [Template] {
    // Publicly accessible - no authorization check required
    // All users including guests can browse templates
    let dynamicTemplates = templates.values().toArray();
    dynamicTemplates.concat(systemTemplates);
  };

  public query ({ caller }) func getTemplatesByCategory(category : Category) : async [Template] {
    // Publicly accessible - no authorization check required
    // All users including guests can browse templates by category
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

  public shared ({ caller }) func initiateSubscription(tier : SubscriptionTier, duration : Time.Time, paymentReference : Text) : async () {
    // Verify user profile exists (registered users only)
    if (not userProfiles.containsKey(caller)) {
      Runtime.trap("Profile not found. Please register first");
    };

    // Store temporary subscription details for the user
    let tempSubscription : TemporarySubscription = {
      userId = caller;
      tier;
      duration;
      paymentReference;
      initiatedAt = Time.now();
    };
    pendingSubscriptions.add(caller, tempSubscription);
  };

  public shared ({ caller }) func confirmSubscription() : async () {
    // Verify user profile exists (registered users only)
    if (not userProfiles.containsKey(caller)) {
      Runtime.trap("Profile not found. Please register first");
    };

    let tempSubscription = switch (pendingSubscriptions.get(caller)) {
      case (null) {
        Runtime.trap("No pending subscription found. Please initiate a subscription first");
      };
      case (?temp) { temp };
    };

    let profile = switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Profile not found. Please register first");
      };
      case (?profile) { profile };
    };

    let subscriptionRecord : SubscriptionRecord = {
      tier = tempSubscription.tier;
      duration = tempSubscription.duration;
      paymentReference = tempSubscription.paymentReference;
      confirmedAt = Time.now();
    };
    confirmedSubscriptions.add(caller, subscriptionRecord);

    let updatedProfile = {
      profile with
      subscription = ?tempSubscription.tier;
      subscriptionExpiry = ?tempSubscription.duration;
    };
    userProfiles.add(caller, updatedProfile);

    // Remove the temporary subscription after successful confirmation
    pendingSubscriptions.remove(caller);
  };

  public query ({ caller }) func hasActiveSubscription() : async Bool {
    // Verify user profile exists (registered users only)
    if (not userProfiles.containsKey(caller)) {
      Runtime.trap("Profile not found. Please register first");
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
    // Verify user profile exists (registered users only)
    if (not userProfiles.containsKey(caller)) {
      Runtime.trap("Profile not found. Please register first");
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
    // Verify user profile exists (registered users only)
    if (not userProfiles.containsKey(caller)) {
      Runtime.trap("Profile not found. Please register first");
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
    if (not AccessControl.isAdmin(accessControlState, caller)) {
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
    // Publicly accessible - no authorization check required
    // All users including guests can view famous influencers as part of template browsing
    switch (famousInfluencers.get(category)) {
      case (?list) { list.toArray() };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getSharedBio(shareId : ShareId) : async ?BioPage {
    // Publicly accessible - no authorization check required
    // Shared bios are publicly accessible to anyone including guests
    sharedBios.get(shareId);
  };
};
