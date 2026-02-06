import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type PhoneNumber = Text;
  type OtpCode = Text;
  type OtpId = Text;

  public type OtpRequest = {
    phoneNumber : PhoneNumber;
    otpCode : OtpCode;
    createdTime : Int;
    verified : Bool;
  };

  // Only new addition
  type NewActor = {
    activeOtps : Map.Map<OtpId, OtpRequest>;
  };

  // Add default-initialized new store
  public func run(old : {}) : NewActor {
    { activeOtps = Map.empty<OtpId, OtpRequest>() };
  };
};
