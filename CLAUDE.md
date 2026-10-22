# cb-identityjs2026

Read this in full before touching anything — several decisions here are
deliberate and not obvious from the code alone. If you're about to reach for
Sass, Bootstrap, jQuery, an icon font, or flexbox-for-everything, stop and
re-read the relevant section below first.

**This theme folder is shared, byte-identical, across multiple brand/region
installs** (identity, gcc, and others as they migrate) — see
[MULTI-BRAND.md](MULTI-BRAND.md) before touching `src/css/tokens/`,
`inc/site-config.php`, or any `header-{site}.php`/`footer-{site}.php` file.
That doc, not this one, is the source of truth for how per-brand tokens,
`theme.json`, and structural header/footer differences work.

## What this is

The WordPress theme for the **Identity (identityglobal.com) 2026 site**: a
standalone theme — no parent theme, no framework dependency — with ~27 native
blocks, a case-study/news content model, GSAP/Lenis motion, Polylang-ready
chrome strings, and a multi-brand token system. Only the `identity` brand is
actually built today (see MULTI-BRAND.md).

It started as a fork of the team's base skeleton and still inherits its
architecture rules (documented below), its build system, and its
`setup.sh`/`add_block.sh`/`rm_block.sh` scripts. It replaces an earlier
Understrap (Bootstrap 5 parent/child) workflow; that workflow is still used
for the rare WooCommerce project, which is out of scope here.

**It descends from `cb-skeleton2026`, kept deliberately separate rather than
merged in.** Both share the same CSS/JS/build system — the only difference is
how blocks and site-wide settings are built: `cb-skeleton2026` uses ACF (ACF
Blocks, ACF options page), this one uses native block.json/edit.js/render.php
blocks and a plain Settings API page, with no ACF dependency at all. The
split exists because ACF Blocks stopped reliably saving field edits under WP
7.1's now-mandatory iframed block canvas — ACF's own block-editor JS bridge
only wires up field-change listeners on a block's very first mount and
doesn't re-arm when a block's canvas swaps from its static preview into the
editable form on selection, so typed edits can be silently lost. Native
blocks don't have this problem: field state flows through React's own
`setAttributes()`, which Gutenberg's iframe was built to support correctly.
Both are maintained in parallel on the chance WP reverts or LTS's a pre-7.1
release — if that never happens, this one is likely to become the only one
going forward.

### Provenance: a port of two legacy themes

Most of the site-specific code is ported from `cb-identity2025` and
`cb-identitygroup2026` (the legacy Sass/ACF themes), and comments throughout
cite them. The recurring rule when porting is **"confirmed live beats SCSS
source"**: when the old SCSS and the live identityglobal.com disagree, live
wins. Several tokens in `src/css/tokens/identity.css` are annotated
"confirmed live" or `DISPUTED` for this reason — don't "tidy" values in token
or site CSS without checking the live site. Block behaviour specs referenced
in comments (`identity-global-block-spec.md`) are not stored in this folder.

## The one rule that explains most of the file layout

**Bootstrap-style class names, zero Bootstrap.** `.container`, `.row`,
`.col-6`, `.btn`, `.navbar`, `.d-flex`, etc. all exist and are used exactly
like they'd look in a Bootstrap project — but every one of them is defined
in this theme's own CSS. There is no Bootstrap package, no Bootstrap Sass,
no Bootstrap JS, no Popper. The naming was kept on purpose for muscle-memory
continuity (for the theme author and any devs who've worked in Bootstrap
before) — **do not assume behavioural parity with actual Bootstrap.**
Anything not explicitly implemented here (most Bootstrap components) simply
doesn't exist, no matter how standard it looks.

On top of that generic vocabulary, identity has its own: **`.id-container`**
(the page-width container used by the header, footer, news templates and text
page, alongside plain `.container`), **`.id-button`** (the real button
component, see below), and per-block BEM classes (`.insight-type-grid__card`,
`.content-builder__*`, `.page-header__*`, …).

## Architecture decisions and why

- **No Sass.** Native CSS nesting (browsers handle it natively at this
  project's browser baseline — see below) replaces the one thing Sass was
  doing that mattered. Don't add Sass back in "just for tokens" or "just for
  mixins" — there was a deliberate decision to not need a preprocessor at
  all here.
- **CSS Grid, not flexbox, for layout.** `.row`/`.col-*` are Grid-based (see
  "How the grid actually works" below) — this was chosen over flexbox
  because the person building this genuinely prefers Grid's mental model,
  and it sets up cleanly for `subgrid`. `.navbar` itself is flexbox — a
  single-row toolbar is a legitimate flex use case; Grid isn't a mandate for
  every layout, just the default for anything row/column/page-structure
  shaped.
- **Design tokens are CSS custom properties**, not Sass variables. Shared
  structural tokens live in `src/css/tokens.css`; per-brand role tokens live
  in `src/css/tokens/{brand}.css` (see MULTI-BRAND.md). Block CSS reads
  colour/type/spacing only through role-named properties (`--col-heading`,
  `--fs-h1`, …), never literals. `src/build/generate-theme-json.js` reads the
  tokens to produce `theme.json`/`theme-{brand}.json`, which is what makes
  colour and font-size options appear in the Gutenberg editor. (It renames the
  palette slug `text` to `body-text` — WP's own `has-text-color` marker class
  collides with a `text` slug and silently breaks every colour choice. Don't
  rename it back.)
- **Breakpoints are the one exception to "tokens live in CSS."** A CSS
  custom property can't be read inside an `@media` condition, so breakpoints
  live in `src/build/tokens.config.js` (sm 576, md 768, lg 992, xl 1200, xxl
  1400). `src/css/nav.css` hardcodes the `lg` breakpoint (992px) directly in
  a plain `@media` query for the same reason, in a comment noting it must
  stay in sync with that file. If you change a breakpoint, grep for the old
  pixel value across `src/css/*.css` — there is no single source of truth
  enforced by tooling, only by convention.
- **No jQuery, no Bootstrap JS, no npm JS dependencies in the bundle.** The
  theme's own front-end JS is vanilla modules bundled by Rollup (see "Front-end
  JavaScript"). Three third-party libraries — GSAP + ScrollTrigger and Lenis —
  are **vendored by hand** into `js/vendor/` and enqueued as separate scripts
  rather than bundled or loaded from a CDN. `src/js/dialog.js` wires up the
  native `<dialog>` element (`showModal()`/`close()`) as the modal solution.
- **No icon font.** Icons are inline SVG (see `header.php`'s nav toggle button
  for the pattern; `get_icon()` reads `img/icons/*.svg`). Don't add Font
  Awesome or similar back in.
- **Buttons and cards have no generic framework opinion.** `.btn` in
  `src/css/forms.css` is a bare minimal base. Identity's real button is
  `.id-button` (same file): a coloured `::before` backdrop behind the label.
  Don't build out a generic, opinionated button/card system without being
  asked. Because `::before` never renders on `<input>`, `inc/gravity-forms.php`
  swaps Gravity Forms' submit input for a real `<button class="id-button">`.
- **Tables and accordions are real but opt-in.** `src/css/tables.css` and
  `src/css/accordion.css` are genuinely styled but not imported by default in
  `src/css/theme.css` — uncomment the `@import` if a project needs one.
- **Deliberately absent, don't add back without being asked:** sidebars/
  widget areas, comments, tags, author archives, a generic `archive.php`,
  `search.php`. All confirmed rare-to-never in real usage across ~40
  projects/year. (`category-insights.php` and `category-news.php` are
  specific, deliberate category archives for identity's news design, not a
  generic `archive.php` — see "Templates".)
- **Site-Wide Settings is core.** See "Site-Wide Settings" below.
- **Native blocks, not ACF.** Each block is a directory under `blocks/{slug}/`:
  `block.json` (name/title/attributes/supports), `src/index.js` +
  `src/edit.js` (the editing UI — React, using WordPress's own field
  components), and `render.php` (front-end template, reading `$attributes`
  directly — no `get_field()`, there's no ACF to call). `inc/blocks.php` globs
  `blocks/*/block.json` and registers every one automatically — no per-block
  PHP registration code. Fields never render as a click-to-reveal preview or
  get shunted into the sidebar — they're just always-live inputs in the
  canvas, because that's how native blocks work.

## Browser support baseline

Modern evergreen only — see `.browserslistrc` (last 2 versions of Chrome/
Firefox/Safari/Edge, no IE11). This is why CSS Grid, `subgrid` (used as
progressive enhancement via `@supports`, not depended on), `clamp()`,
native `<dialog>`, `:has()`, and CSS nesting are all used without fallback
layers. Don't add polyfills or fallback CSS for older browsers unless
explicitly asked — it would be working against a deliberate decision.

## How the grid actually works

`.row { display: grid; grid-template-columns: repeat(var(--grid-columns), 1fr); }`
and `.col-N { grid-column: span N; }` — `--grid-columns` defaults to 12
(`src/css/tokens.css`). **The span number is only meaningful relative to
whatever `grid-template-columns` its own `.row` ancestor has.** You cannot
mix "some children spanning against a 12-col row" with "other children
spanning against a 5-col row" inside the *same* `.row` — a `.col-*` class is
not portable across different column-count contexts.

If a project needs a genuinely different column count (the theme author's
example: five equal columns), don't repurpose `.col-*` classes for it.
`.grid` (`src/css/layout.css`) is the built solution: `display: grid;
grid-template-columns: repeat(auto-fit, minmax(var(--grid-min), 1fr));`
— no column count is declared at all, the browser fits as many as the
minimum item width (`--grid-min`, default `16rem` in `tokens.css`)
allows, and reflows automatically as the viewport changes. Tune it per
instance with an inline `style="--grid-min: 10rem"` rather than adding
a new class per layout.

This is deliberately *not* a replacement for `.row`/`.col-*` — use `.row`
when you need deliberate, exact spans (page structure); use `.grid`
when items just need to be "roughly N up, however many fit" (card grids,
feature lists). A row-modifier approach (overriding `--grid-columns` for one
specific `.row` with its own `.col-*-of-5`-style classes) was considered and
rejected in favour of `.grid` for this use case — more bookkeeping for
less benefit when the real need is "N similar items," not exact spans.

Nested `.row`s use `subgrid` for their columns where the browser supports it
(`@supports (grid-template-columns: subgrid)` in `src/css/layout.css`),
falling back to their own independent 12-column grid otherwise.

Utility classes (`utilities.css`, generated from `tokens.config.js`) are
responsive by default and include display, flex direction/wrap,
justify/align, logical `text-start/center/end`, `fw-*` (from the `--fw-*`
tokens), `w-25/50/75/100/auto`, `order-0…12`, and the spacing scale
(0–6) for gap/margin/padding. Margin/padding utilities are logical
(`.ms-`/`.me-`/`.ps-`/`.pe-`) so they flip under `dir="rtl"`.

## CSS layers and load order

Compiled CSS loads in this order (`inc/enqueue.php`, mirrored for the editor
iframe in `inc/editor.php`):

1. `css/theme.min.css` — brand-agnostic: tokens.css defaults, base, typography,
   layout, nav, footer, text-page, forms, generated utilities, generated
   block CSS.
2. `css/tokens/{CB_SITE}.min.css` — that brand's `:root` role tokens.
3. `css/site/{CB_SITE}.min.css` — optional structural per-brand overrides that
   can't be expressed as tokens (identity's header/nav, footer, news/single
   templates, the `@font-face` declarations).

The order is deliberate and was shipped backwards once — see MULTI-BRAND.md.
`src/css/editor.css` is separate: it styles the block-editor UI itself
(including the repeater field) and loads only in the editor.

## Fonts

`fonts/` holds only Suisse Intl (Light, Regular, Book, Semibold woff2),
declared in `src/css/site/identity.css`. Semibold is registered as weight
**600**, not the legacy theme's mislabelled 500, so `var(--fw-semibold)`
matches it exactly. `inc/head-tags.php` preloads every `fonts/*.woff2`
automatically; only add font files that a token actually references.

## Front-end JavaScript

`src/js/theme.js` is the Rollup entry. It runs each init through `safeInit()`
so one thrown error (e.g. a GSAP internal) can't stop the rest. Every module
is self-guarding — a no-op when its markup or its library is absent — so it's
safe to run on every page regardless of brand or template.

- **Navigation:** `nav-toggle.js` (mobile collapse), `nav-dropdown.js`
  (click-to-open dropdowns, Escape/outside-click close),
  `nav-scroll-background.js` (adds `.scrolled` to `#masthead` past 50px).
- **Dialog:** `dialog.js` — `data-dialog-target` buttons for native `<dialog>`.
- **Motion (GSAP/ScrollTrigger):** `logo-clip-animate.js` (header logo reveal),
  `footer-logo-animate.js`, `title-bar-reveal-animate.js` (the shared
  three-bar title timeline used by Home Intro and Page Header's animated title;
  `home-intro-animate.js` is now only a shim), `scroll-animate.js`
  (`data-animate="fade-up"` — the project's AOS replacement),
  `feature-overlay-parallax.js`, `hero-parallax.js` (`data-hero-parallax` → `--hero-parallax-y`, used by About Hero and Page Header's Plain variant; `.hero-animate` is the matching page-load fade-in, CSS only), `content-builder.js` (background parallax +
  image heights), `stat-count-up.js` (`data-stat-target`).
- **Work Index:** `work-index.js` — per-block-instance service filter and hover-video mount (scoped, so several instances can share a page).
- **Smooth scroll:** `lenis-init.js`, ported verbatim from the live site's own
  init.
- **Debugging:** `terser.config.json` sets `drop_console: true`, so
  `console.*` never ships. Use `recordInitError()` (`record-init-error.js`),
  which writes to `window.__cbInitErrors` for inspection in devtools.

**Vendored libraries** live in `js/vendor/` (committed): `gsap.min.js` and
`ScrollTrigger.min.js` (3.12.5), `lenis.min.js` + `lenis.css` (1.3.11).
`cb_identityjs2026_enqueue_vendor()` in `inc/enqueue.php` enqueues them, and
`theme.min.js` depends on the `gsap`, `gsap-scrolltrigger` and `lenis`
handles. They aren't tracked in `package.json`, so note the upstream URL and
version in a comment at the call site when vendoring a new one.

**Admin-only JS** (`js/tabs.js`, `js/gallery-field.js`, `js/repeater-field.js`)
powers the Site-Wide Settings page and is plain files enqueued only there —
not part of the Rollup bundle.

## Site-Wide Settings

`inc/options.php` — a plain Settings API page (no ACF), storing one
serialized array option (`cb_identityjs2026_site_settings`), menu
"Site-Wide Settings" for `edit_posts`. It's a **tabbed** page (generic
`[data-tabs]` pattern in `js/tabs.js`). Field types: text/email/url,
`textarea`, `code`, `checkbox`, `gallery` (fixed multi-image list),
`repeater` (structured rows), and `cta_select`.

Current fields: email, phone, LinkedIn and Instagram URLs; GA and GTM IDs;
Google/Bing verification codes; three raw script slots (head, body-open,
body-close) with a "logged-out visitors only" switch — printed unescaped by
design; a `logos` gallery (feeds the Logo Marquee block's site-wide source);
a `ctas` repeater (id, title, content, link URL/text, new tab, background,
image); three CTA selectors (`cta_index`, `cta_category_insights`,
`cta_category_news`) used by the news templates; and a placeholder
`example_repeater` to rename or replace per project.

Read values with `cb_identityjs2026_get_setting( $key )`,
`get_repeater_setting()`, `get_gallery_setting()` and `get_cta( $id )`.

GA/GTM (and, optionally, the custom script slots) only fire for logged-out
visitors (`inc/head-tags.php`) so the team's own traffic doesn't skew
analytics — a real gap in the older `lc-iology2025` theme, fixed here from
the start. GTM's noscript fallback sits on `wp_body_open`, where Google's
docs say it belongs. The SVG icon-upload tab the ACF version had is
deliberately not ported — deferred to a future plugin. `get_icon()` /
`get_icon_choices()` (`inc/utilities.php`) work as before; drop an `.svg`
into `img/icons/` by hand.

## Templates

- **`page.php`** renders `the_content()` with **no wrapping container** — each
  block sets its own width (most opt into `.container`/`.id-container`; Media
  Panel's `fullWidth`/`fullBleed` deliberately don't). Wrapping everything
  here would cap every block at `--container-max-width`, a bug that shipped
  once already.
- **`header.php`/`footer.php`** are generic fallbacks. Every template calls
  `get_header( cb_identityjs2026_get_site() )`, so on identity
  **`header-identity.php`** (fixed-top, no dropdowns, inline-SVG logo with
  clip-reveal animation) and **`footer-identity.php`** (5 columns built from
  the six `footer_menu_*` nav locations in `inc/setup.php`, with column titles
  linked via `cb_identityjs2026_page_link()`, which is Polylang-aware) run
  instead. Footer menu contents are assigned in wp-admin. `footer-identity.php`
  was ported from the live DOM, which had diverged from the legacy source file
  — trust the live site.
- **News:** `index.php` (the `page_for_posts` page) shows a hero plus two
  capped 3-card grids (Insights + Perspectives, then News).
  `category-insights.php` and `category-news.php` list every post in their
  category, picked up automatically by WP's `category-{slug}` hierarchy, each
  linking across to the other. All card grids use the 3/6/3/6/3/3/12 span
  cycle in `inc/news-templates.php`, which the Post Grid block also uses. The
  hero intro text comes from the Posts page's own content, and each template
  ends with a `render_block()` of the `cta` block using the matching
  Site-Wide Settings CTA selector.
- **`single.php`** (posts): colour scheme by category (`post-press` for press,
  `post-insight` for insights/perspectives), a recent-posts section excluding
  the current post, and a closing CTA.
- **`page-templates/text-page.php`** ("Text Page"): classic WYSIWYG
  legal/policy layout (title bar + `the_content()`), no blocks.
- **`404.php`** is minimal.
- `<main id="main">` is opened in the header and closed in the footer; the
  templates above only render what goes inside it (`text-page.php` is the one
  that writes its own `<main>`).

## Content model

- **CPT `case_study`** (`inc/posttypes.php`): rewrite slug `work`, no archive,
  supports title/editor/thumbnail/revisions. A `template_include` filter
  serves `page.php` for singles of any CPT lacking its own `single-*.php`, so
  block-built CPT pages don't get `single.php`'s auto `<h1>`/date. Regular
  `post`s still use `single.php`.
- **Taxonomies** (`inc/taxonomies.php`): `person` (posts only, slug `people`),
  and `theme`, `service`, `region` (posts + case studies, no front-end
  rewrite). The legacy default-`theme`-term auto-assignment is deliberately
  not ported (it was specific to a different brand).
- Case-study card helpers (`inc/case-study.php`) find the Case Study Hero
  block inside a post's content to get its subtitle/Vimeo hover video,
  falling back to a trimmed excerpt; shared by Work Index and Case Study Grid.
- `[service_parents]` links to `/work/?service={slug}`, but the Work Index
  block filters client-side only and doesn't read `?service=` on load — a
  known gap, not yet fixed.

## Internationalisation (Polylang)

Fixed front-end chrome (footer titles, 404 text, news headings, Media Panel's
mute/unmute, …) is registered in `inc/i18n.php` with `pll_register_string()`
and rendered through `cb_identityjs2026_pll_string( 'English text' )` plus
`esc_html()`/`esc_attr()`. The wrapper falls back to the raw string when
Polylang isn't active, so shared code never fatals. **Any new hardcoded
front-end string must be added to the list in
`cb_identityjs2026_register_pll_strings()`** — use literal curly quotes there,
not entities, which can't survive a Strings Translation round trip.
Editor-entered content is translated as posts, not strings. A multilingual
(Arabic/RTL) install is anticipated but nothing has been verified against it;
see MULTI-BRAND.md.

## Blocks

28 native blocks under `blocks/`: about-hero (ported from the legacy `cb-about-hero`: full-viewport hero, title between two rules, intro, optional parallax background + 60% overlay image, translucent Content band using `--col-overlay-colour`; dark only), brand-grid, case-study-grid (Grid mode filters by `selectedServices`/`selectedThemes`/`selectedRegions` — AND across taxonomies; Auto mode matches the page's own terms, or its slug to a term slug, in theme/service/region), case-study-hero (optional Title field overrides the post title as the h1),
child-page-nav, contact-directory, contact-form (Gravity Forms shortcode),
content-builder (rows of many module types, optional background parallax; a `divider` module draws a full-width line in the section line colour; rows have Padding Top/Bottom radio groups of 0 / 1.5 / 3 / 5 rem (`paddingTop`/`paddingBottom`; legacy `hasPaddingTop`/`hasPaddingBottom` booleans map to 1.5 / 3, and new rows default to 3 / 3); the `empty` module takes a decimal-rem `emptyHeight`, default 0),
cta (picks a Site-Wide Settings CTA), detail-list, faq (feeds the aggregated
FAQPage schema), feature-overlay, file-list, home-intro, innovation-header,
leadership, logo-marquee (site-wide or per-block logos), media-panel
(image or Vimeo; `fullWidth`/`fullBleed`/`heroMode`), page-header (animated
title, secondary-panel variants; `headerVariant: 'plain'` reproduces the legacy CB Plain Hero — dark, full-bleed ruled h1, 8-of-12 intro, optional parallax background with a bigger title), page-header-alt, post-grid (`filterGroups`:
several taxonomies at once, OR within a group, AND across groups), push-panel,
section-title, service-grid, stat-block (count-up), testimonial, and
work-index (client-side service filter; editable `title` (h1) and `subtitle` (h2), a Display `all`/`curated` choice — curated is a hand-picked ordered list via `PostTypeMultiPicker`, with no auto hero and a filter limited to services present in the list).

Conventions: each block has `block.json`, `src/{index,edit}.js`, `render.php`
and a committed `build/`; its CSS goes in `src/blocks/{slug}.css`. Use the
`[block_usage_table]` shortcode to see where a block is used before removing
it with `rm_block.sh`.

**Editor behaviour** (`inc/blocks.php`, `inc/editor.php`):
- The editor iframe loads the real compiled front-end CSS plus brand tokens,
  for full parity.
- The inserter is pruned: core embed/theme/widget categories and several core
  blocks (cover, gallery, video, details, …), Yoast blocks, Openverse and the
  block directory are removed. Remaining non-theme blocks are regrouped into a
  single "Gutenberg" category; theme blocks sit in a category named after the
  text domain (never `theme` — core's own `theme` category is disallowed here
  and would hide them).
- `core/paragraph`, `heading`, `list` and `separator` get a render callback
  that wraps output in `.container`.
- A global **"Lede" RichText format** lives in `blocks/_editor-formats/`. It's
  a format, not a block (no `block.json`), so `inc/editor.php` enqueues it
  explicitly.
- The CTA block's choices are passed to its editor script as
  `window.cbIdentityJs2026Ctas`. Always `array_values()` them: non-sequential
  repeater keys would otherwise JSON-encode as an object and break `.map()`.

## Shortcodes and utilities

Shortcodes: `[contact_email]` (antispambot mailto from settings),
`[social_icons]`, `[cb_button url text target]` (a lone `.id-button` link),
`[spc 1]` (fixed-height spacer in rem, for Content Builder text modules),
`[service_parents]`, `[block_usage_table]` (QA).

`inc/utilities.php` is project-agnostic and safe to lift into other projects
(`parse_phone`, `pluralise`, `estimate_reading_time_in_minutes`,
`get_icon`/`get_icon_choices`, FAQ and Review JSON-LD queues that output once
in `wp_footer`, breadcrumb helpers). Project-coupled helpers (e.g.
`cb_identityjs2026_page_link()`) go in `inc/helpers.php`.

**Vimeo embeds** are always built with `cb_identityjs2026_vimeo_src( $id, $hash, $mode )` —
never hand-assemble a `player.vimeo.com` URL in a block. `background` mode
(case-study hero, Media Panel hero mode, card hover previews) sends
`background=1` plus explicit `autoplay/muted/loop`: profiled videos get the
chromeless player, un-profiled ones ignore `background` and fall back to an
autoplaying muted loop with Vimeo's own controls, so no editor toggle is
needed. `controls=0` is deliberately omitted so un-profiled videos keep Vimeo's native
controls as the fallback. Sound control on hero videos is the shared Mute/Unmute button
(`cb_identityjs2026_video_unmute_button()` in `inc/helpers.php`,
`src/js/video-unmute.js`, `src/blocks/video-unmute.css`), which works via the
Vimeo Player API and sits at the bottom right of the frame.

## File layout

```
style.css              Theme header — no `Template:` line, this is standalone
functions.php           Requires inc/*.php, nothing else
inc/
  i18n.php              Polylang string registration + cb_identityjs2026_pll_string()
  site-config.php       CB_SITE resolution + theme-{brand}.json swap — see MULTI-BRAND.md
  setup.php             add_theme_support, register_nav_menus (primary, footer, six footer_menu_* locations)
  enqueue.php           Enqueues theme/tokens/site CSS, vendored libs, theme.min.js — filemtime-versioned
  class-cb-identity-js-2026-nav-walker.php  Lightweight Walker_Nav_Menu — nav-link/dropdown-menu classes
  blocks.php            Globs blocks/*/block.json and registers each; inserter pruning; core-block container wrap
  editor.php            Editor styles, editor tweaks, Lede format enqueue, CTA choices localised to the CTA block
  options.php           Site-Wide Settings page + cb_identityjs2026_get_setting() and friends
  social-icons.php      [social_icons]
  head-tags.php         Font preload + GA/GTM (logged-out only) + verification + custom script slots
  block-usage.php       [block_usage_table] QA shortcode
  utilities.php         Project-agnostic helpers, [contact_email], schema queues, breadcrumbs
  helpers.php           Project-specific helpers: cb_identityjs2026_page_link(), cb_identityjs2026_vimeo_src() (the ONLY place Vimeo embed URLs are built — modes background/player; see its docblock)
  posttypes.php         case_study CPT + CPT-singles-use-page.php filter
  taxonomies.php        person, theme, service, region
  news-templates.php    Insight-card renderers + span cycle (index, category-*, Post Grid)
  case-study.php        Case-study card helpers (Work Index, Case Study Grid)
  service-parents.php   [service_parents]
  button-shortcode.php  [cb_button]
  spacer-shortcode.php  [spc]
  gravity-forms.php     gform_submit_button -> real <button class="id-button">
header.php / footer.php           Generic fallbacks for installs without a brand-specific file
header-identity.php / footer-identity.php   Identity's header and footer (loaded via CB_SITE)
index.php / single.php / category-insights.php / category-news.php   News design (see Templates)
page.php / 404.php / page-templates/text-page.php
blocks/                 One directory per block (add_block.sh scaffolds here)
  {slug}/
    block.json          Name/title/attributes/supports — "editorScript": "file:./build/index.js", "render": "file:./render.php"
    src/index.js        registerBlockType(), imports edit.js + block.json
    src/edit.js         The editing UI — React, WordPress's own field components
    render.php          Front-end template — reads $attributes directly, no get_field()
    build/              GENERATED by wp-scripts, committed — do not hand-edit
  _editor-formats/      The global Lede RichText format. Not a block; enqueued by inc/editor.php.
  _shared/              Reusable React components any block's edit.js can import — NOT a block,
                        not registered by inc/blocks.php, just bundled into whichever block imports
                        it. add_block.sh doesn't know these exist; wire them into a generated
                        edit.js by hand.
    RepeaterField.js    Generic repeater UI for a block attribute holding an array of row objects —
                        ACF repeater's native-blocks equivalent. Deliberately one array attribute on
                        a single block edited through this component, not an InnerBlocks/child-block
                        pattern (a parent block's save() needs an InnerBlocks.Content placeholder or
                        new rows silently fail to persist, and any wrapper save() adds becomes literal
                        $content in the dynamic block's render.php, breaking CSS that assumes children
                        are direct flex/grid children — real bugs hit once already). Takes `label`,
                        `value` (rows array), `onChange`, `fields` ([ { name, label, type: 'text'|
                        'textarea'|'image'|'file'|'link', help, mimeTypes, linkTarget } ]), `emptyRow`,
                        and `layout` ('row', default — sub-fields side by side with shared column
                        headers; or 'column' — stacked, each with its own visible label). Renders its
                        own add/move/remove controls. CSS in src/css/editor.css
                        (.cb-identityjs2026-repeater-field*).
    PostTypePicker.js   Generic single-post picker — the equivalent of ACF's single `post_object`.
                        Search-as-you-type via ComboboxControl backed by @wordpress/core-data.
                        Takes `label`, `postType`, `value` (post ID or 0), `onChange( id )`, `help`.
    PostTypeMultiPicker.js  Ordered multi-post picker — the equivalent of ACF's `relationship` field.
                        A search-as-you-type combobox adds posts to an attribute holding an array of IDs;
                        a list below reorders/removes them (array order is display order). Reuses
                        RepeaterField's row CSS. Takes `label`, `addLabel`, `postType`, `value` (ID array),
                        `onChange( ids )`, `help`. Used by Work Index's curated mode.
    EditorBlockShell.js Collapsible wrapper (title bar + open/closed toggle) for a block's edit UI,
                        persisting open state per block-instance in localStorage so pages with many
                        blocks stay scannable.
fonts/                  Suisse Intl woff2 — preloaded automatically, no registration step
img/, img/icons/        Theme images; img/icons/*.svg feed get_icon()
js/                     COMPILED theme.js/theme.min.js (+ maps), plus plain admin scripts
                        (tabs.js, gallery-field.js, repeater-field.js) and vendor/ (GSAP, ScrollTrigger, Lenis)
css/                    COMPILED: theme.min.css, editor.min.css, tokens/{brand}.min.css, site/{brand}.min.css
src/
  css/                  Theme-wide CSS. theme.css is the @import entry point.
    tokens.css          Shared structural tokens (weights scale, spacing, radii, layout, --nav-height)
    tokens/             Per-brand role tokens: {brand}.css (+ _identity-palette.css; underscore = import-only)
    site/               Optional per-brand structural overrides: {brand}.css
    base.css            Reboot-equivalent element reset
    typography.css      Type styles
    layout.css          .container / .row / .grid / subgrid
    nav.css             .navbar, mobile toggle, dropdown submenus
    footer.css          Currently empty — footer styling lives in site/identity.css
    text-page.css       Text Page template styling
    forms.css           Minimal form base, .btn, .id-button
    tables.css          Opt-in, not imported by default
    accordion.css       Opt-in, not imported by default
    editor.css          Block-editor UI styles (editor only)
    utilities.css       GENERATED — do not hand-edit, see generate-utilities.js
    blocks.css          GENERATED — concatenation of src/blocks/*.css
  blocks/               Block-specific CSS: {block-slug}.css. add_block.sh does NOT create it;
                        drop one in and it's picked up on the next build (glob, alphabetical).
  js/                   Front-end modules — see "Front-end JavaScript"
  build/
    tokens.config.js    Breakpoints + utility/grid definitions — source of truth for generate-utilities.js
    read-tokens.js      Shared token reader (resolves one level of local @import)
    generate-utilities.js  Generates src/css/utilities.css and src/css/blocks.css
    generate-theme-json.js Generates theme.json + theme-{brand}.json from the tokens
    postcss.config.js   postcss-import + postcss-nesting + autoprefixer
    rollup.config.js / babel.config.js / terser.config.json / banner.js
                        JS bundling — no nodeResolve/commonjs, there are no npm JS deps to bundle
    browser-sync.config.js
theme.json, theme-{brand}.json   GENERATED — do not hand-edit
webpack.config.js       Extends wp-scripts so each block compiles to blocks/{slug}/build/index.js
add_block.sh            Prompts for a block name, then each field's name and type (text/textarea/
                        richtext/image/url/link/number/select/checkbox), generating block.json
                        attributes, the matching src/edit.js control, and a render.php stub. Not
                        supported: repeater, gallery, relationship, post_object, file — add by hand
                        (see _shared/). Doesn't create a CSS file. Run `npm run blocks:build` afterward.
rm_block.sh             Removes blocks/{slug} and src/blocks/{slug}.css if present. No registration to undo.
setup.sh                Inherited bootstrap for starting a NEW project from this codebase — renames every
                        cb-identityjs2026 / CB Identity JS 2026 / cb_identityjs2026_ / CB_Identity_JS_2026_
                        reference and resets git to one commit. Not updated for the current feature set;
                        check it before relying on it. See README.md.
MULTI-BRAND.md          How CB_SITE, per-brand tokens, theme.json and header/footer files work
```

Compiled `css/`, `js/` and each block's `build/` are committed, not
gitignored (`.gitignore` covers only `node_modules` and a top-level `/vendor`).
This working copy currently has no `.git` directory. Both `package-lock.json`
and `pnpm-lock.yaml` exist; the documented command is `pnpm install`.

## Build commands

```
pnpm install
npm run watch        # rebuild theme-wide CSS/JS on save (also runs blocks:start)
npm run watch-bs     # same + browser-sync live reload, proxies localhost/
npm run blocks:build # one-off compile of every blocks/*/src/index.js
npm run blocks:start # watch mode for block JS, wp-scripts' own watcher
npm run dist         # one-off full build: css + js + blocks:build, run in parallel
npm run generate-theme-json
./add_block.sh
```

`npm run css` = `generate-utilities.js` (writes `utilities.css` + `blocks.css`)
→ PostCSS (`postcss-import`, `postcss-nesting`, `autoprefixer`) → minify →
`css-tokens` (each `src/css/tokens/*.css` not starting with `_` →
`css/tokens/{brand}.min.css`) → `css-site` (`src/css/site/*.css` →
`css/site/`) → `generate-theme-json`. `npm run js` = rollup (bundles
`src/js/theme.js`) → terser. Both are the theme-wide build, entirely separate
from blocks — they don't touch or know about `blocks/*/src/`.
`watch-run-theme-json` regenerates `theme.json` when tokens change.

`npm run blocks:build`/`blocks:start` run `@wordpress/scripts` (`wp-scripts`)
against `webpack.config.js`, which globs `blocks/*/src/index.js` and compiles
each one to `blocks/{slug}/build/index.js` — co-located with that block's own
`block.json`, not wp-scripts' single top-level `build/` default.
**`webpack.config.js` explicitly disables webpack's `output.clean`** — the
default config cleans `output.path` before every build, and since
`output.path` here is the shared `blocks/` directory (so `[name]/build/...`
resolves per block), an enabled clean would wipe every block's
`block.json`/`render.php`/`src/` alongside the compiled output. Don't remove
that `clean: false` without replacing it with something that can't do that.

## Working conventions

- Compiled `css/`/`js/` output is committed to git, as are each block's
  `build/` and `js/vendor/` — same convention as the Understrap-based themes
  this replaced.
- No ACF anywhere in this theme — see `cb-skeleton2026` if a project
  specifically needs ACF instead of native blocks.
- New hardcoded front-end strings go through `cb_identityjs2026_pll_string()`
  and get registered in `inc/i18n.php`.
- Logical CSS properties only (`inset-inline`, `padding-inline-start`,
  `text-align: start`) — never physical left/right — so RTL works when a
  multilingual install arrives.
- Don't build anything for a second brand, or add `header-{site}.php` /
  `footer-{site}.php` files, without being asked — see MULTI-BRAND.md.
