<?php
/**
 * Project-specific helpers — coupled to this project's own page slugs and
 * content structure. Reusable, project-agnostic functions belong in
 * inc/utilities.php instead (safe to lift verbatim into other projects).
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * URL for a hardcoded page link (e.g. the footer column titles).
 *
 * Resolves the slug to a real page and returns its permalink — which
 * Polylang filters to the current language's URL and translated slug, so
 * /services/ becomes /en/services/ or /ar/<arabic-slug>/ automatically.
 * Falls back to home_url() + slug when no such page exists (e.g.
 * world-expo on installs without that page), which at least keeps the
 * link same-origin instead of root-absolute.
 *
 * @param string $slug     Page slug, e.g. 'services'.
 * @param string $fragment Optional anchor without the hash, e.g. 'brands'.
 * @return string
 */
function cb_identityjs2026_page_link( $slug, $fragment = '' ) {
	$page = get_page_by_path( $slug );

	// Translate to the current language — get_page_by_path() itself is not
	// language-aware (EN/AR pages can share the same post_name), so without
	// this the footer always linked to whichever language get_page_by_path()
	// happened to return first.
	if ( $page && function_exists( 'pll_get_post' ) ) {
		$translated_id = pll_get_post( $page->ID );
		if ( $translated_id ) {
			$translated = get_post( $translated_id );
			if ( $translated ) {
				$page = $translated;
			}
		}
	}

	$url  = $page ? get_permalink( $page ) : home_url( '/' . trim( $slug, '/' ) . '/' );

	if ( '' !== $fragment ) {
		$url .= '#' . ltrim( $fragment, '#' );
	}

	return $url;
}
