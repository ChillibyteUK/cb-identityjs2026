<?php
/**
 * Theme setup — supports, nav menus.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * Core theme supports and nav menu locations.
 *
 * @return void
 */
function cb_identityjs2026_setup() {
	load_theme_textdomain( 'cb-identityjs2026', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' ); // Site title in <head> — no separate "site title" support needed beyond this.
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'style', 'script' ) ); // Clean markup for enqueued tags. Not search-form/comment-form/comment-list/gallery/caption — none of those are in use.
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'disable-custom-colors' );

	// Rename/extend per project. The footer_menu_* locations match
	// identity's real footer structure (cb-identity2025/footer.php) —
	// one location per footer column that's a real menu rather than
	// hardcoded links. See footer-identity.php.
	register_nav_menus(
		array(
			'primary'               => __( 'Primary Menu', 'cb-identityjs2026' ),
			'footer'                => __( 'Footer Menu', 'cb-identityjs2026' ),
			'footer_menu_services'  => __( 'Footer: Services', 'cb-identityjs2026' ),
			'footer_menu_about'     => __( 'Footer: About', 'cb-identityjs2026' ),
			'footer_menu_identity'  => __( 'Footer: Our Brands', 'cb-identityjs2026' ),
			'footer_menu_media'     => __( 'Footer: News', 'cb-identityjs2026' ),
			'footer_menu_global'    => __( 'Footer: Locations', 'cb-identityjs2026' ),
			'footer_menu_legal'     => __( 'Footer: Legal & Info', 'cb-identityjs2026' ),
		)
	);
}
add_action( 'after_setup_theme', 'cb_identityjs2026_setup' );
