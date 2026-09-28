<?php
/**
 * Polylang string registration — fixed site chrome text (not editor
 * content), translated via wp-admin's Languages → Strings Translation, not
 * the gettext .pot/.po/.mo pipeline. See identity-global-block-spec.md's
 * "Internationalisation (Polylang)" section for why: this project's fixed
 * UI labels go through pll_register_string()/pll__(), editor-entered
 * content goes through real post/block fields instead.
 *
 * function_exists()-guarded throughout: Polylang is only active on
 * multilingual installs (GCC), but this file is shared theme-wide, so it
 * must not fatal on installs that don't have the plugin at all.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register every fixed-chrome string that needs translation. Add to this
 * list as new hardcoded strings are found — see the block spec's own
 * hardcoded-copy audit table for the known ones.
 *
 * @return void
 */
function cb_identityjs2026_register_pll_strings() {
	if ( ! function_exists( 'pll_register_string' ) ) {
		return;
	}

	// Media Panel — video hero's unmute/mute toggle button.
	pll_register_string( 'Media Panel: Unmute', 'Unmute', 'cb-identityjs2026' );
	pll_register_string( 'Media Panel: Mute', 'Mute', 'cb-identityjs2026' );

	// Footer (footer-identity.php) — hardcoded column titles and colophon.
	// Rendered via cb_identityjs2026_pll_string(), not esc_html_e(), so they
	// resolve through Strings Translation on multilingual installs.
	foreach ( array(
		'Services',
		'Work',
		'World Expo',
		'Innovation Lab',
		'About',
		'News',
		'Our Brands',
		'Locations',
		'Legal & info',
		'Identity Events Management Ltd, Registered Number - 04217845 | VAT Number - GB 813 0913 60',
	) as $string ) {
		pll_register_string( 'Footer: ' . $string, $string, 'cb-identityjs2026' );
	}

	// Templates + blocks — fixed front-end chrome (not editor content, which
	// Polylang translates via posts instead). Each call site renders these
	// through cb_identityjs2026_pll_string() with esc_html()/esc_attr().
	// Curly apostrophes are literal here — the old hardcoded templates used
	// &#8217; entities, which can't survive a Strings Translation round-trip.
	foreach ( array(
		'News, insights, and perspectives',
		'Creating news and leading conversations that shape our industry',
		'Insights',
		'Press',
		'Insights & Perspectives',
		'Experience changes everything. Here’s how we’re shaping what’s next.',
		'Press & media',
		'Press, news & media',
		'Insights & perspectives',
		'Recent News',
		'Recent Insights',
		'Recent Perspectives',
		'Page not found',
		'The page you’re looking for doesn’t exist.',
		'Identity homepage',
		'Home',
		'Our work',
		'Where experience changes everything',
		'Filter by:',
		'All Services',
		'Reset',
		'Logo marquee',
	) as $string ) {
		pll_register_string( $string, $string, 'cb-identityjs2026' );
	}
}
add_action( 'init', 'cb_identityjs2026_register_pll_strings' );

/**
 * pll__() wrapper that falls back to the raw string when Polylang isn't
 * active — every call site would otherwise need its own function_exists()
 * check.
 *
 * @param string $string Original (English) string, as registered above.
 * @return string
 */
function cb_identityjs2026_pll_string( $string ) {
	return function_exists( 'pll__' ) ? pll__( $string ) : $string;
}
