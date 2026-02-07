# Specification

## Summary
**Goal:** Unblock signup/registration and ensure the Create & Share (Save & Share Bio Page) flow surfaces clear, actionable errors when prerequisites are missing.

**Planned changes:**
- Backend: Adjust registration/default-role assignment so non-admin users can successfully complete `registerProfile` and receive the default role without triggering “Only admins can assign user role”.
- Frontend: Improve signup/registration error handling to show clear English messages (including backend error text when available), avoid stuck loading states, and provide next steps (retry, verify phone, or contact admin for configuration issues).
- Frontend: Make Create & Share fail loudly with actionable guidance when the user is not logged in, not registered, or phone is not verified, including directing the user to the appropriate signup/verification route.

**User-visible outcome:** Users can complete signup without admin-related role errors, and both registration and Save & Share provide visible, English, actionable messages (with retry/navigation) instead of silently failing or getting stuck.
