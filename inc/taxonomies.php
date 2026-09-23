<?php
/**
 * Custom Taxonomies Registration
 *
 * Ports the 4 custom taxonomies confirmed live in cb-identitygroup2026's own
 * inc/cb-taxonomies.php: `person`, `theme`, `service`, `region` — the same
 * set the old identity/coda-specific themes each registered individually
 * before being consolidated into that shared theme. `theme`/`service`/
 * `region` attach to both `post` and `case_study` (see inc/posttypes.php for
 * that CPT); `person` is `post`-only, matching production exactly.
 *
 * Deliberately NOT ported: cb-identitygroup2026's default-`theme`-term
 * auto-assignment (`cb_assign_default_theme_term()`) and its one-time
 * backfill. That logic exists purely for idtravel's own workflow (every
 * blog post without a `theme` term silently gets tagged "Business Travel")
 * — harmless there since idtravel is the theme's own site, but wrong to run
 * for identity's blog posts, which have no such default and shouldn't be
 * silently tagged with an idtravel-specific term. Revisit if/when this
 * theme's multi-brand support (see inc/site-config.php) actually extends to
 * idtravel.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register custom taxonomies for the theme.
 *
 * @return void
 */
function cb_identityjs2026_register_theme_taxonomies() {

	register_taxonomy(
		'person',
		array( 'post' ),
		array(
			'labels'             => array(
				'name'          => 'People',
				'singular_name' => 'Person',
			),
			'public'             => true,
			'publicly_queryable' => true,
			'hierarchical'       => true,
			'show_ui'            => true,
			'show_in_nav_menus'  => true,
			'show_tagcloud'      => false,
			'show_in_quick_edit' => true,
			'show_admin_column'  => true,
			'show_in_rest'       => true,
			'rewrite'            => array(
				'slug'       => 'people',
				'with_front' => false,
			),
		)
	);

	register_taxonomy(
		'theme',
		array( 'case_study', 'post' ),
		array(
			'labels'             => array(
				'name'          => 'Themes',
				'singular_name' => 'Theme',
			),
			'public'             => true,
			'publicly_queryable' => true,
			'hierarchical'       => true,
			'show_ui'            => true,
			'show_in_nav_menus'  => true,
			'show_tagcloud'      => false,
			'show_in_quick_edit' => true,
			'show_admin_column'  => true,
			'show_in_rest'       => true,
			'rewrite'            => false,
		)
	);

	register_taxonomy(
		'service',
		array( 'case_study', 'post' ),
		array(
			'labels'             => array(
				'name'          => 'Services',
				'singular_name' => 'Service',
			),
			'public'             => true,
			'publicly_queryable' => true,
			'hierarchical'       => true,
			'show_ui'            => true,
			'show_in_nav_menus'  => true,
			'show_tagcloud'      => false,
			'show_in_quick_edit' => true,
			'show_admin_column'  => true,
			'show_in_rest'       => true,
			'rewrite'            => false,
		)
	);

	register_taxonomy(
		'region',
		array( 'case_study', 'post' ),
		array(
			'labels'             => array(
				'name'          => 'Regions',
				'singular_name' => 'Region',
			),
			'public'             => true,
			'publicly_queryable' => true,
			'hierarchical'       => true,
			'show_ui'            => true,
			'show_in_nav_menus'  => true,
			'show_tagcloud'      => false,
			'show_in_quick_edit' => true,
			'show_admin_column'  => true,
			'show_in_rest'       => true,
			'rewrite'            => false,
		)
	);

}
add_action( 'init', 'cb_identityjs2026_register_theme_taxonomies' );
