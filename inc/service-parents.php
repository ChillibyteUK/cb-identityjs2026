<?php
/**
 * [service_parents] shortcode — ported from cb-identitygroup2026's
 * cb_service_parents_shortcode() (inc/cb-theme.php), plus Polylang mapping
 * (production has none). On a singular case_study/post, lists the top-level
 * parent(s) of whichever `service` term(s) are assigned to it (a child term
 * resolves to its own parent; an already-top-level term is used as-is),
 * linking each to the work archive filtered to that service.
 *
 * Polylang: every `service` term exists once per language (same slug, e.g.
 * Brand Experience = 10 en / 188 ar), so each parent is mapped to its
 * current-language translation (pll_get_term) for the label, and the link
 * goes through cb_identityjs2026_page_link( 'work' ) — the theme's
 * Polylang-aware page-link helper — instead of a hardcoded home_url( '/work/' ),
 * so an Arabic page links to the Arabic Work page. Both fall back to the
 * unmapped term/URL when Polylang is inactive or no translation exists.
 *
 * The `?service={slug}` param is carried over from production, but this
 * theme's Work Index block filters client-side only — it doesn't yet read
 * `?service=` on load (known gap, see CLAUDE.md), so these links land on
 * Work without pre-filtering. Slugs are identical across languages, so
 * fixing that later needs no extra mapping.
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

	// Map each parent to its current-language translation, de-duplicating
	// in case two assigned terms resolve to the same translated parent.
	$mapped = array();
	foreach ( $parents as $parent ) {
		if ( function_exists( 'pll_get_term' ) ) {
			$translated_id = pll_get_term( $parent->term_id );
			if ( $translated_id ) {
				$translated = get_term( $translated_id, 'service' );
				if ( $translated && ! is_wp_error( $translated ) ) {
					$parent = $translated;
				}
			}
		}
		$mapped[ $parent->term_id ] = $parent;
	}

	$work_url = cb_identityjs2026_page_link( 'work' );

	$output = '<ul class="service-parents">';
	foreach ( $mapped as $parent ) {
		$output .= '<li><a href="' . esc_url( add_query_arg( 'service', $parent->slug, $work_url ) ) . '">' . esc_html( $parent->name ) . '</a></li>';
	}
	$output .= '</ul>';

	return $output;
}
