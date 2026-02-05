# Specification

## Summary
**Goal:** Unblock template browsing/viewing for all users (including guests) and remove subscription/paywall gating from the template copy/customize flow.

**Planned changes:**
- Make Template Gallery (/templates) and Template Detail (/templates/$templateId) render template content while logged out, using existing seed templates as a fallback when backend fetch fails or is unauthorized.
- Remove frontend subscription gating from the template editor flow (un-guard /editor/$templateId), update CTAs to avoid routing to pricing based on subscription, and remove subscription-required messaging/badges in template-related pages and header.
- Remove backend subscription enforcement from saving/customizing templates (createBioPage) so registered users can save without an active subscription.
- Make backend template listing endpoints publicly accessible (getAllTemplates, getTemplatesByCategory) so anonymous callers can fetch templates without trapping.

**User-visible outcome:** Anyone (including guests) can browse and view templates, and logged-in users can copy/customize and save templates without being blocked by subscription checks.
