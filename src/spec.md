# Specification

## Summary
**Goal:** Add phone-number OTP verification (no email verification) as a required gate for signup/profile registration and for accessing registered-user flows.

**Planned changes:**
- Add backend canister methods to request an OTP for a phone number, verify an OTP, and query the caller’s phone-verification status (stored per Internet Identity principal, with OTP invalidation and expiry handling).
- Enforce backend gating so `registerProfile(...)` and other registered-user flows fail with clear, deterministic errors when the caller is not phone-verified and/or not registered.
- Update the Signup UI to collect phone number, request OTP, accept OTP input, and only enable profile creation after successful OTP verification (English copy + clear error states).
- Add/adjust routing guard behavior so authenticated but unregistered users can complete phone verification and then finish registration without getting stuck in redirects (consistent with existing RequireAuth/RequireRegistered pattern).
- Add React Query hooks wired to the backend actor for OTP request, OTP verify, and verification-status checks to support the UI flow cleanly.
- Display an in-app fallback message after OTP request explaining OTP delivery limitations (no SMS integration) and how the user can obtain the OTP in the current environment.

**User-visible outcome:** Users sign in with Internet Identity, then must verify a phone number via OTP before they can complete signup (profile registration) and access features that require a registered/verified account; the app provides clear, English guidance and errors for invalid/expired/missing OTPs and for unverified access attempts.
