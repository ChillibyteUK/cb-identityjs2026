<?php
/**
 * Multi-brand site configuration. See MULTI-BRAND.md for the full design
 * rationale — this file is the runtime half of it.
 *
 * One theme folder is pushed, byte-identical, to every install. The ONLY
 * thing that differs per install is the CB_SITE constant, defined once in
 * that install's wp-config.php:
 *
 *   define( 'CB_SITE', 'identity' ); // the only value that currently means anything — see MULTI-BRAND.md's "Status"
 *
 * Deliberately a wp-config.php constant, not an ACF/options-page field —
 * see MULTI-BRAND.md's "Rejected alternative" section for why
 * cb-identitygroup2026's ACF-field approach (editable, could drift per
 * request) isn't repeated here.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * Returns the current install's brand/site slug, or null if CB_SITE isn't
 * defined or doesn't match a real brand tokens file. Never guesses/falls
 * back to a default brand — see cb_identityjs2026_site_config_notice().
 *
 * @return string|null
 */
function cb_identityjs2026_get_site() {
	static $site = null;
	static $resolved = false;

	if ( $resolved ) {
		return $site;
	}
	$resolved = true;

	if ( ! defined( 'CB_SITE' ) ) {
		return null;
	}

	if ( ! in_array( CB_SITE, cb_identityjs2026_get_available_sites(), true ) ) {
		return null;
	}

	$site = CB_SITE;
	return $site;
}

/**
 * Every brand with a real tokens file — i.e. every valid value CB_SITE can
 * take. Derived from disk, not hand-maintained, so adding a new brand's
 * tokens/{brand}.css file is enough on its own; nothing here needs editing.
 *
 * @return string[]
 */
function cb_identityjs2026_get_available_sites() {
	static $sites = null;
	if ( null !== $sites ) {
		return $sites;
	}

	$sites = array();
	foreach ( glob( CB_IDENTITYJS2026_DIR . '/src/css/tokens/*.css' ) as $file ) {
		$sites[] = basename( $file, '.css' );
	}
	return $sites;
}

/**
 * Loud, visible failure if CB_SITE is missing or invalid — never a silent
 * fallback to some default brand. A misconfigured/missing constant on a
 * freshly provisioned server needs to be obvious immediately, not
 * discovered later as "why does this look like the wrong brand."
 *
 * @return void
 */
function cb_identityjs2026_site_config_notice() {
	if ( null !== cb_identityjs2026_get_site() ) {
		return;
	}

	$available = implode( ', ', cb_identityjs2026_get_available_sites() );
	$message   = defined( 'CB_SITE' )
		? sprintf( 'CB_SITE is set to "%s", which has no matching src/css/tokens/ file.', esc_html( CB_SITE ) )
		: 'CB_SITE is not defined in wp-config.php.';

	printf(
		'<div class="notice notice-error"><p><strong>cb-identityjs2026:</strong> %s Available: %s. This install will not load any brand tokens or brand-specific templates until this is fixed.</p></div>',
		esc_html( $message ),
		esc_html( $available )
	);
}
add_action( 'admin_notices', 'cb_identityjs2026_site_config_notice' );

/**
 * Swaps in the current brand's generated theme-{site}.json wholesale, so
 * the block editor's colour/font-size panels match that install rather than
 * whatever theme.json shipped on disk as the DEFAULT_BRAND fallback (see
 * src/build/generate-theme-json.js). Uses wp_theme_json_data_theme, the
 * real WordPress API for this (added 6.1) — reading a fully-formed,
 * machine-generated file per brand, not editing the palette array in place,
 * is deliberate: see MULTI-BRAND.md for the bug that array-surgery approach
 * caused in the old theme.
 *
 * @param WP_Theme_JSON_Data $theme_json Theme JSON data object.
 * @return WP_Theme_JSON_Data
 */
function cb_identityjs2026_filter_theme_json( $theme_json ) {
	$site = cb_identityjs2026_get_site();
	if ( null === $site ) {
		return $theme_json;
	}

	$file = CB_IDENTITYJS2026_DIR . "/theme-{$site}.json";
	if ( ! file_exists( $file ) ) {
		return $theme_json;
	}

	$brand_data = json_decode( file_get_contents( $file ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
	if ( ! is_array( $brand_data ) ) {
		return $theme_json;
	}

	return $theme_json->update_with( $brand_data );
}
add_filter( 'wp_theme_json_data_theme', 'cb_identityjs2026_filter_theme_json' );
