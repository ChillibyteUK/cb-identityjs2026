// generate-theme-json.js
// Node.js script to parse CSS custom-property tokens and generate one
// theme.json per brand for the WordPress block editor.
//
// Usage:
//   npm run generate-theme-json
//
// Loops over every src/css/tokens/{brand}.css file (see read-tokens.js —
// local @import statements, for a brand file that reuses another brand's
// values wholesale, are resolved first) and writes theme-{brand}.json
// alongside the theme's
// top-level theme.json for each one. inc/site-config.php's
// wp_theme_json_data_theme filter picks the right one at runtime based on
// the CB_SITE constant. theme.json itself (no suffix) is also written, as a
// copy of DEFAULT_BRAND's data — WordPress requires a theme.json to exist
// on disk regardless of what the runtime filter later swaps in (e.g. before
// CB_SITE is ever read, or if the filter isn't active for some reason).
//
// Looks for, per brand file:
// - Color variables: --col-* (excluding aliases like --col-primary that just
//   point at another color — only "real" palette colors get listed)
// - Font size variables: --fs-*

const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');
const { readTokensFromFile } = require('./read-tokens');

const tokensDir = path.join(__dirname, '../css/tokens');
const themeRoot = path.join(__dirname, '../..');
const DEFAULT_BRAND = 'identity';

// WordPress core always adds a generic `has-text-color` marker class to any
// block with text-colour support, no matter which palette colour was
// picked — normally a no-op class with no rule of its own. If a palette
// slug is *also* literally "text", core's own preset-CSS generator emits a
// real `.has-text-color { color: var(--wp--preset--color--text) !important; }`
// rule that collides with its own marker class — confirmed live (2026-09-22):
// both end up on the block element, both !important + equal specificity, so
// the alphabetically-later one (here, the colliding text rule) wins the
// cascade tie regardless of which colour was actually selected, silently
// breaking every other colour choice. Renaming just this one slug for the
// editor-facing palette sidesteps the collision without touching the
// --col-text custom property itself (used throughout block/site CSS).
const RESERVED_SLUGS = { text: 'body-text' };

function buildThemeJson(tokens) {
	// Palette colors: --col-{slug} whose value is a literal color, not a
	// var() alias (aliases would just be a duplicate palette entry).
	const colors = Object.entries(tokens)
		.filter(([key, value]) => key.startsWith('col-') && !value.startsWith('var('))
		.map(([key, value]) => {
			const rawSlug = key.replace('col-', '');
			const slug = RESERVED_SLUGS[rawSlug] || rawSlug;
			return { name: slug, slug, color: value };
		});

	const fontSizes = Object.entries(tokens)
		.filter(([key]) => key.startsWith('fs-'))
		.map(([key, value]) => {
			const slug = key.replace('fs-', '');
			return { name: slug, slug, size: value };
		});

	return {
		version: 2,
		settings: {
			appearanceTools: true,
			color: {
				defaultPalette: false,
				palette: colors.map((color) => ({ ...color, origin: 'theme' })),
			},
			typography: { fontSizes },
		},
	};
}

function main() {
	if (!fs.existsSync(tokensDir)) {
		console.error('Brand tokens directory not found:', tokensDir);
		process.exit(1);
	}

	// Leading-underscore files (e.g. _identity-palette.css) are partials —
	// pulled in via another brand file's own @import, not a brand of their
	// own (same convention Sass partials use). Excluding them here stops
	// this loop generating a spurious theme-{partial-name}.json.
	const brandFiles = fg.sync(['*.css', '!_*.css'], { cwd: tokensDir }).sort();
	if (brandFiles.length === 0) {
		console.error('No brand token files found in', tokensDir);
		process.exit(1);
	}

	let defaultJson = null;

	for (const file of brandFiles) {
		const brand = path.basename(file, '.css');
		const tokens = readTokensFromFile(path.join(tokensDir, file));
		const themeJson = buildThemeJson(tokens);
		fs.writeFileSync(path.join(themeRoot, `theme-${brand}.json`), JSON.stringify(themeJson, null, 2));
		console.log(`Generated theme-${brand}.json`);
		if (brand === DEFAULT_BRAND) {
			defaultJson = themeJson;
		}
	}

	if (!defaultJson) {
		console.error(
			`DEFAULT_BRAND '${DEFAULT_BRAND}' has no matching file in ${tokensDir} — update DEFAULT_BRAND in this script or add the file.`
		);
		process.exit(1);
	}

	fs.writeFileSync(path.join(themeRoot, 'theme.json'), JSON.stringify(defaultJson, null, 2));
	console.log(`Generated theme.json (copy of theme-${DEFAULT_BRAND}.json — the on-disk fallback)`);
}

main();
