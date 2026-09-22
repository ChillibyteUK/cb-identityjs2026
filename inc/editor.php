<?php
/**
 * Block editor tweaks. Standing per-theme convention for this user — not
 * covered by the lcp-blog-options plugin (which handles comments/tags/emoji
 * site-wide, but not this).
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * Load the theme's actual compiled stylesheet into the block editor iframe
 * (fonts, colours, every block's real CSS — full parity with the frontend,
 * not a hand-picked subset), plus a small editor-only stylesheet on top
 * that contains top-level blocks to a page-width column instead of
 * full-bleed. add_editor_style() accepts an array — order matters, since
 * css/editor.css references var(--container-max-width), which only
 * resolves because theme.min.css's :root block loads first in the same
 * iframe document. Relies on the 'editor-styles' support already added in
 * inc/setup.php.
 *
 * @return void
 */
function cb_identityjs2026_add_editor_styles() {
	// theme.min.css first, brand tokens last — same ordering as
	// inc/enqueue.php on the frontend, and for the same reason:
	// theme.min.css bundles tokens.css's generic :root defaults, so the
	// brand override has to load after it to win the cascade. See
	// MULTI-BRAND.md.
	$styles = array( 'css/theme.min.css', 'css/editor.min.css' );

	$site = cb_identityjs2026_get_site();
	if ( null !== $site && file_exists( CB_IDENTITYJS2026_DIR . "/css/tokens/{$site}.min.css" ) ) {
		$styles[] = "css/tokens/{$site}.min.css";
	}

	add_editor_style( $styles );
}
add_action( 'after_setup_theme', 'cb_identityjs2026_add_editor_styles' );

/**
 * Disable the block editor's fullscreen mode by default.
 *
 * @return void
 */
// phpcs:disable
function cb_identityjs2026_disable_editor_fullscreen_by_default() {
	$script = "jQuery( window ).load(function() { const isFullscreenMode = wp.data.select( 'core/edit-post' ).isFeatureActive( 'fullscreenMode' ); if ( isFullscreenMode ) { wp.data.dispatch( 'core/edit-post' ).toggleFeature( 'fullscreenMode' ); } });";
	wp_add_inline_script( 'wp-blocks', $script );
}
add_action( 'enqueue_block_editor_assets', 'cb_identityjs2026_disable_editor_fullscreen_by_default' );
// phpcs:enable

/**
 * Disable the block inserter's extra Media/Openverse panel.
 *
 * This theme keeps the editor pared back and does not use WordPress's stock
 * remote media suggestions.
 *
 * @param array $settings Block editor settings.
 * @return array
 */
function cb_identityjs2026_disable_openverse_media_category( $settings ) {
	$settings['enableOpenverseMediaCategory'] = false;

	return $settings;
}
add_filter( 'block_editor_settings_all', 'cb_identityjs2026_disable_openverse_media_category' );

/**
 * Remove the block directory upsell from the inserter.
 *
 * This keeps clients out of WordPress's install-more-blocks prompt.
 *
 * @return void
 */
function cb_identityjs2026_disable_block_directory_inserter() {
	remove_action( 'enqueue_block_editor_assets', 'wp_enqueue_editor_block_directory_assets' );
}
add_action( 'after_setup_theme', 'cb_identityjs2026_disable_block_directory_inserter' );

/**
 * Pass the site-wide CTAs list to the CTA block's editor script.
 *
 * There's no post type or REST-queryable entity behind Site-Wide Settings'
 * `ctas` repeater — unlike Child Page Nav's page picker, core-data can't
 * resolve this, so it's localised directly onto the block's own registered
 * script handle (`{block-name}-editor-script`, per WP's auto-naming from
 * block.json) as a plain global the block reads at render time.
 *
 * @return void
 */
function cb_identityjs2026_localize_cta_choices() {
	if ( ! wp_script_is( 'cb-identityjs2026-cta-editor-script', 'registered' ) ) {
		return;
	}

	// array_values() on both ends: repeater rows can have non-sequential
	// or string keys (e.g. "new_<timestamp>_<n>" from js/repeater-field.js's
	// "Add row"), and array_map() preserves whatever keys it's given. A
	// PHP array with non-sequential keys json_encode()s as a JS object, not
	// an array — silently breaking edit.js's choices.map() the moment a row
	// is added without ever being re-saved through a full page reload.
	$ctas    = array_values( cb_identityjs2026_get_repeater_setting( 'ctas' ) );
	$choices = array_values(
		array_map(
			static function ( $cta ) {
				return array(
					'id'    => $cta['cta_id'] ?? '',
					'title' => $cta['title'] ?? '',
				);
			},
			$ctas
		)
	);

	wp_add_inline_script(
		'cb-identityjs2026-cta-editor-script',
		'window.cbIdentityJs2026Ctas = ' . wp_json_encode( $choices ) . ';',
		'before'
	);
}
add_action( 'enqueue_block_editor_assets', 'cb_identityjs2026_localize_cta_choices' );
