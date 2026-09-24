<?php
/**
 * [service_parents] shortcode — ported from cb-identitygroup2026's
 * cb_service_parents_shortcode() (inc/cb-theme.php), unchanged. On a
 * singular case_study/post, lists the top-level parent(s) of whichever
 * `service` term(s) are assigned to it (a child term resolves to its own
 * parent; an already-top-level term is used as-is), linking each to the
 * work archive filtered to that service.
 *
 * The work archive link (`/work/?service={slug}`) is carried over as-is
 * from production, but this theme's own Work Index block (see
 * blocks/work-index/render.php) filters client-side only — it doesn't yet
 * read a `?service=` query param on load, so these links land on /work/
 * without actually pre-filtering. Flagged, not silently fixed: revisit if
 * that pre-filter behaviour is wanted.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

add_shortcode( 'service_parents', 'cb_identityjs2026_service_parents_shortcode' );

/**
 * Displays parent categories of service taxonomy terms assigned to the current post.
 *
 * @return string HTML markup for parent service categories or empty string.
 */
function cb_identityjs2026_service_parents_shortcode() {
	if ( ! is_singular() ) {
		return '';
	}

	$post_id = get_the_ID();
	$terms   = get_the_terms( $post_id, 'service' );

	if ( ! $terms || is_wp_error( $terms ) ) {
		return '';
	}

	$parents = array();
	foreach ( $terms as $term ) {
		if ( $term->parent ) {
			$parent = get_term( $term->parent, 'service' );
			if ( $parent && ! is_wp_error( $parent ) ) {
				$parents[ $parent->term_id ] = $parent;
			}
		} else {
			$parents[ $term->term_id ] = $term;
		}
	}

	if ( empty( $parents ) ) {
		return '';
	}

	$output = '<ul class="service-parents">';
	foreach ( $parents as $parent ) {
		$output .= '<li><a href="' . esc_url( home_url( '/work/?service=' . $parent->slug ) ) . '">' . esc_html( $parent->name ) . '</a></li>';
	}
	$output .= '</ul>';

	return $output;
}
