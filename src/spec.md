# Specification

## Summary
**Goal:** Enrich the template browsing and editing experience by adding curated “top influencer” Instagram handles per category, richer default template content, and more varied template thumbnail designs.

**Planned changes:**
- Add a new frontend data module containing a curated, hard-coded list of top influencers (display name, Instagram handle, category) and show a “Top influencers in <category>” section on TemplateDetailPage when applicable (with handles linking to Instagram).
- Populate each seeded template with non-empty `editableContent` (JSON encoded as bytes) to provide default editor values for title, bio text, social handles, and links; update TemplateEditorPage to load and apply this content with safe fallback on missing/invalid data.
- Introduce multiple visually distinct template thumbnail images and wire seeded templates across categories to use different thumbnails (served as static assets).
- Adjust TemplateCard and template detail layout/typography to better accommodate longer descriptions and the influencer section with consistent spacing and readability in light/dark mode.

**User-visible outcome:** Users can browse templates with varied thumbnail designs, see relevant top influencer Instagram handles by category on template details, and open a template in the editor pre-filled with richer default content (including multiple links and at least one social handle where provided).
