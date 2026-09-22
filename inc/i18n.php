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
