# Multi-brand tokens & site configuration

How this theme is meant to serve several installs (identity is the only one
actually built right now — see "Status" below) from one shared codebase,
without resurrecting the runtime `!important`-override pattern in
`cb-identitygroup2026`'s `inc/cb-site-tokens.php`. Read this before touching
`src/css/tokens/`, `inc/site-config.php`, or any
`header-{site}.php`/`footer-{site}.php` file.

**Only `identity` exists today.** A second brand/install (GCC or otherwise)
is a conscious, separate decision, not something to add speculatively
because the mechanism supports it — see "Adding a new brand" below for what
that step actually involves when it's actually asked for.

_Written incrementally while this was being built — see git history for the
order things landed in if a commit message references a decision not yet
explained below._

## The model in one sentence

**One theme folder, byte-identical, pushed to every install. The only thing
that differs per install is a single constant in that install's
`wp-config.php`.** Everything else — which CSS loads, which `theme.json`
the block editor sees, which `header-*.php`/`footer-*.php` template runs —
is derived from that one constant at runtime, never from an editable
database value.

Rejected alternative: separate theme checkouts per brand (git subtree/
submodule sync, or independent forks). Works, but requires a human to
remember which of N checkouts to edit and a sync step to propagate fixes —
both are exactly the kind of judgement call this needs to not depend on.
One folder removes the decision: there's only one copy of the code to
exist, so nothing can drift.

Also rejected: the old theme's approach (`cb-identitygroup2026`'s
`cb_site_template_suffix()`) — an ACF options-page field read at runtime,
with per-site token values duplicated as PHP arrays and forced onto the
page via `!important` because WordPress's own generated `theme.json`
`:root{}` block kept winning the cascade otherwise. That field could be
changed by an editor by accident, silently re-skinned the entire site, and
needed 1700+ lines of hand-maintained colour tables. Don't repeat this.

## `CB_SITE` — the one constant

Defined once, per install, in `wp-config.php` (**not** inside the theme
folder — wp-config.php is never touched by a theme push):

```php
define( 'CB_SITE', 'identity' ); // the only value that currently means anything — see "Status"
```

Read via `cb_identityjs2026_get_site()` (`inc/site-config.php`) everywhere
the theme needs to know which install it's running on. That function:

- Returns `CB_SITE` if it's defined **and** a matching
  `src/css/tokens/{value}.css` file exists in the build.
- Otherwise triggers a loud `admin_notice` (never a silent fallback to some
  default brand) — a missing/misspelled constant on a freshly provisioned
  server should be obvious immediately, not discovered later as "why does
  this site look like identity."

**`CB_SITE` answers "which brand/install is this?" — it does NOT answer
"which language/direction is this request?"** Those are genuinely
different axes:

| Axis | Answers | Set by | Changes |
| --- | --- | --- | --- |
| `CB_SITE` | Which brand/install | `wp-config.php` constant | Once, per install, never at runtime |
| Locale / `dir` | Which language, LTR or RTL | Polylang's current-language state | Per request |

Worth recording now even though nothing but `identity` exists yet: when a
future install serves more than one language from a single WordPress
install (Polylang, one DB, multiple locales under one site), that's still
**one** `CB_SITE` value, not one per language — `CB_SITE` answers "which
install," not "which language." Language/direction is a separate,
per-request axis (see "RTL and language direction" below) that doesn't
touch this constant at all. This was a real mistake made and corrected
earlier in this project's history — worth not repeating.

## Adding a new brand

1. Add `src/css/tokens/{brand}.css` — colour/typography/spacing role tokens
   only (see the "Token roles, not token values" rule below). Copy an
   existing brand file as a starting point.
2. `npm run dist` (loops over every file in `src/css/tokens/`, no manual
   registration step).
3. Push the theme folder — same folder as every other install gets.
4. Set `CB_SITE` in that install's `wp-config.php`.

No PHP change, no new build step to write, no other brand's file touched.
That's deliberate — this is the operation meant to be safe to delegate.

If the new brand also needs different header/footer structure (not just
different colours), see "Header/footer per install" below — that's a
separate, smaller step, only needed when the difference is structural.

## Token roles, not token values

Every block's CSS reads colour/typography/spacing exclusively through
role-named custom properties (`--col-heading`, `--fw-heading`, `--fs-h1`) —
never a literal value, never a brand-specific name. See
`identity-global-block-spec.md`'s "Class naming convention" section for the
full reasoning; this theme's token split enforces it structurally:

- **`src/css/tokens.css`** — shared, structural, identical across every
  brand: the raw `--fw-400/600/700` weight scale (feeds `.fw-400` etc.
  utility classes only), the spacing scale, radii/shadows/motion, layout
  (`--container-max-width`, `--grid-columns`), `--nav-height`. Nothing here
  should ever need a different value for a different brand — if it does,
  it's a role token and belongs in the next bullet instead.
- **`src/css/tokens/{brand}.css`** — the values a brand actually varies:
  colour palette, font family/sizes/weights/line-heights, `--space-section`/
  `--space-gap`. This is the *only* file a brand's designer/dev should ever
  need to touch.

Both load as `:root { ... }` blocks — the brand file loads after the shared
one (see "Enqueue order" below), so its values simply apply; no
`!important`, no PHP array, no runtime override logic. CSS custom
properties resolve at used-value time, so the *same* compiled
`css/theme.min.css` (blocks, utilities, layout — all written as `var(--x)`
references) is correct for every brand without ever being rebuilt per
brand. Only the small tokens stylesheet actually differs per install.

### A real gotcha: `url()` inside a token value

A relative `url()` inside a custom property resolves against the
stylesheet where the `var()` is *consumed*, not the stylesheet where the
custom property is *declared* — this is spec behaviour, not a bug, but it's
easy to get backwards. `--img-child-page-nav-bg` (Child Page Nav's per-brand
background image) is declared in `src/css/tokens/identity.css`
(`css/tokens/identity.css` once built — two directories deep) but consumed
via `background-image: var(--img-child-page-nav-bg)` in
`src/blocks/child-page-nav.css`, which bundles into `css/theme.min.css`
(one directory deep). So the path has to be written relative to
`css/theme.min.css`'s location (`../img/...`), not to
`css/tokens/identity.css`'s own location (which would look like
`../../img/...` and silently resolve one level too high, e.g. into
`wp-content/themes/img/...` instead of the theme's own `img/`). Any future
per-brand image token needs the same check: trace where it's actually
*used* (almost always `src/blocks/*.css`, bundled to `css/theme.min.css`,
one level deep), not where it's declared.

## Build output

`npm run dist` now produces, per brand file present in `src/css/tokens/`:

- `css/tokens/{brand}.min.css` — that brand's compiled `:root{}` block.
- `theme-{brand}.json` — that brand's colour palette + font sizes for the
  block editor (generated by `src/build/generate-theme-json.js`, which now
  loops over every brand file instead of reading one `tokens.css`).
- `theme.json` (no suffix) — a copy of the `identity` brand's
  `theme-{brand}.json`, written last, as the on-disk fallback WordPress
  needs regardless of what the runtime filter later swaps in. **Never
  hand-edit `theme.json` directly** — it's overwritten by the next build.

`css/theme.min.css`, `css/editor.min.css`, `css/utilities.css`,
`css/blocks.css` are unchanged in structure — built once, brand-agnostic,
because they only ever reference tokens via `var()`.

## Enqueue order (`inc/enqueue.php`)

1. `css/theme.min.css` first.
2. `css/tokens/{CB_SITE}.min.css` last.

This is the opposite of the intuitive order, and got shipped backwards
once already (found live on idgcc.local: `--col-bg` was resolving to the
generic white default, not identity's `#0d0d0c`). `theme.css` itself
`@import`s `tokens.css`, so the generic `:root` defaults are baked into
`theme.min.css`. Cascade order for `:root { --x: ... }` at equal
specificity is "last one wins," so if the brand file loads first,
`theme.min.css`'s bundled generic values load after it and silently
clobber every override. The brand stylesheet has to load last.

Same ordering in the block editor (`inc/editor.php`'s `add_editor_style()`
array — `theme.min.css`/`editor.min.css` first, brand tokens last).

## `theme.json` per brand (`inc/site-config.php`)

WordPress reads exactly one `theme.json` per theme — there's no built-in
per-request swap. `inc/site-config.php` hooks `wp_theme_json_data_theme`
(the real WordPress API for this, added in 6.1) and hands back the current
`CB_SITE`'s `theme-{brand}.json` file wholesale. This is why the old
theme's `cb_filter_editor_theme_json()` had to do careful array surgery
(and once shipped a bug that wiped 48 of 59 palette colours by replacing
the array instead of merging it) — reading a real, fully-formed,
machine-generated file per brand avoids that class of bug entirely; there's
no partial-merge step to get wrong.

## Header/footer per install

Structural differences (not just colour/type) go here — a genuinely
different nav pattern, a language switcher that only one install needs, a
different logo mark. This is a much smaller, more deliberate list than
"every brand gets its own copy" — most installs use the shared
`header.php`/`footer.php` unchanged.

Uses WordPress's own `get_header( $name )` / `get_footer( $name )`
mechanism, which already does exactly the fallback this needs
(`locate_template( [ "header-{$name}.php", "header.php" ] )` under the
hood — core, not custom code): every top-level template calls
`get_header( cb_identityjs2026_get_site() )` /
`get_footer( cb_identityjs2026_get_site() )` instead of the bare call. If
`header-{CB_SITE}.php` doesn't exist, WordPress silently falls back to the
shared `header.php` — so creating a brand-specific file is opt-in per
install, never a required step when onboarding a new brand whose header
doesn't actually need to differ.

### RTL and language direction — not a `header-{site}.php` concern

Recorded here for when a multilingual install is actually built: a
language/direction split within one install does **not** live as two
template variants, and does **not** touch `CB_SITE`. It would be resolved
*inside* that install's one `header-{site}.php`, per request, from
Polylang's current-language state — `<html lang dir>` from
`pll_current_language()`/`is_rtl()`, layout mirroring handled for free by
logical CSS properties (not a second stylesheet or a `[dir="rtl"]` override
block per component), and a language switcher as ordinary Polylang-aware
PHP, not a brand toggle. `CB_SITE` would only decide which structural
template loads at all — never which language is being served.

**Fixed as part of this work:** `src/css/base.css`, `nav.css`, and the
utility-class generator (`tokens.config.js`/`generate-utilities.js`) used
physical `left`/`right`/`padding-left`/`text-align: left` in several places
— all converted to logical properties (`inset-inline`, `padding-inline-start`,
`text-align: start`, `.ms-`/`.me-`/`.ps-`/`.pe-` utilities now genuinely
logical, not just named that way). This was a real, pre-existing gap
relative to R7.5 — not something specific to GCC, since it affects every
install's markup, but it only mattered once GCC's `dir="rtl"` was on the
table to test against.

**Still genuinely untested:** none of this has been checked against real
rendered RTL output — there's no Arabic content and no Polylang install
anywhere in this environment. Treat the logical-properties conversion as
"structurally correct on paper," not "RTL-verified" — that verification is
real work for whenever a multilingual install actually exists to test it
against.

## Status

Only `identity` exists. What's built and verified against it (`npm run
dist` runs clean end to end, PHP lints clean):

| Piece | Status |
| --- | --- |
| `CB_SITE` resolution, admin-notice guard | Built (`inc/site-config.php`) |
| Multi-brand `tokens.css` / `theme-{brand}.json` build mechanism | Built, verified against `identity` only |
| `wp_theme_json_data_theme` swap | Built, not yet verified against a real running wp-admin (no WordPress install driving this theme in this environment) |
| Enqueue order (theme.min.css before tokens), editor iframe parity | Built and fixed live — was backwards initially, see "Enqueue order" above |
| Logical CSS properties (RTL foundation, R7.5) | Built, **not RTL-verified** — see "Still genuinely untested" above; this was a general fix, not GCC-specific, since it touches every install's shared CSS |
| `header.php`/`footer.php` → `header-{site}.php`/`footer-{site}.php` dispatch mechanism | Built, using core `get_header( $name )`; no non-default `header-*.php`/`footer-*.php` file exists for any brand yet |

**Explicitly not built:** anything specific to a second brand or install —
no `header-gcc.php`, no GCC token file, no language switcher, no
non-mirroring (R7.6) convention. Those were built once already in this
project's history and then deliberately removed, because they got built
ahead of an explicit decision to start that work. Don't recreate them
without being asked.

## Files this system owns — don't hand-edit

- `theme.json` and every `theme-{brand}.json` — generated, overwritten on
  every `npm run generate-theme-json` / `npm run dist`.
- `css/tokens/{brand}.min.css` — generated from `src/css/tokens/{brand}.css`.
- `src/css/utilities.css`, `src/css/blocks.css` — unrelated to this system,
  already documented as generated in `CLAUDE.md`.
