# Specification

## Summary
**Goal:** Fix the subscription checkout so payments reliably activate Premium/Pro for registered users, and add clear INR payment options for Razorpay, Google Pay (GPay), and PhonePe (including UPI deep links).

**Planned changes:**
- Fix backend subscription purchase/authorization flow so newly signed-up users can successfully call subscription APIs without erroneous “unauthorized” traps, while unregistered users receive a clear “registration required” error.
- Update Checkout UI to present selectable payment methods for INR subscriptions: Razorpay, Google Pay (GPay), and PhonePe, with method-specific instructions/CTA in English.
- Add UPI intent/deep-link generation for GPay and PhonePe using the configured receiver UPI ID and the selected plan amount (₹199 Premium, ₹499 Pro), with graceful fallback to copy-to-clipboard when the app cannot be opened.
- Require and submit a non-empty payment reference/transaction ID during confirmation, and persist it in the backend as part of the subscription activation record (including a safe conditional migration if schema/state changes are needed).

**User-visible outcome:** After signup, users can complete checkout, choose Razorpay/GPay/PhonePe, follow guided payment steps (including opening UPI apps when available), enter a transaction reference, and then see Premium/Pro unlock reliably after confirmation.
