<?php
/**
 * Shared case_study card helpers — Work Index and Case Study Grid both
 * link to case_study posts and need the same "what does this card say and
 * does it have a hover video" logic, so it lives here rather than
 * duplicated (with function_exists guards) across both blocks' render.php,
 * the way the real source duplicated cb_find_hero_subtitle() across five
 * separate block templates before it was consolidated into cb-utility.php.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * Recursively scans parsed blocks for a Case Study Hero block
 * (cb-identityjs2026/case-study-hero) and returns its subtitle/video
 * attributes. Ported from the real source's cb_find_hero_subtitle()
 * (inc/cb-utility.php) — this project stores those values as ordinary
 * block attributes (parsed via block.json), not an ACF classic block's
 * nested attrs.data, so the lookup itself is simpler than the real
 * source's own legacy-block-name fallback handling.
 *
 * @param array $blocks Parsed blocks (parse_blocks() output).
 * @return array{subtitle: string, vimeoId: string, vimeoHash: string}|null
 */
function cb_identityjs2026_find_case_study_hero_block( $blocks ) {
	foreach ( $blocks as $block ) {
		if ( 'cb-identityjs2026/case-study-hero' === ( $block['blockName'] ?? '' ) ) {
			return array(
				'subtitle'  => $block['attrs']['subtitle'] ?? '',
				'vimeoId'   => $block['attrs']['vimeoId'] ?? '',
				'vimeoHash' => $block['attrs']['vimeoHash'] ?? '',
			);
		}

		if ( ! empty( $block['innerBlocks'] ) ) {
			$found = cb_identityjs2026_find_case_study_hero_block( $block['innerBlocks'] );
			if ( $found ) {
				return $found;
			}
		}
	}

	return null;
}

/**
 * A case_study post's primary Service term ID, if one is set. Ported
 * verbatim from cb_get_primary_service_term_id() (cb-featured-work.php) —
 * used by Case Study Grid's grid mode to rank a fixed `selected_services`
 * picker's results in the editor's own chosen order, same as the real
 * source. Yoast SEO isn't active on this install, so the class_exists/
 * metadata_exists guards fall straight through to the "first assigned
 * term" fallback — kept anyway for parity with real saved content once a
 * site with Yoast active imports it.
 *
 * @param int $post_id
 * @return int
 */
function cb_identityjs2026_get_primary_service_term_id( $post_id ) {
	$primary_term_id = 0;

	if ( class_exists( 'WPSEO_Primary_Term' ) ) {
		$primary_term    = new WPSEO_Primary_Term( 'service', $post_id );
		$primary_term_id = (int) $primary_term->get_primary_term();
	} elseif ( metadata_exists( 'post', $post_id, '_yoast_wpseo_primary_service' ) ) {
		$primary_term_id = (int) get_post_meta( $post_id, '_yoast_wpseo_primary_service', true );
	}

	if ( $primary_term_id > 0 && term_exists( $primary_term_id, 'service' ) ) {
		return $primary_term_id;
	}

	$assigned_terms = wp_get_post_terms( $post_id, 'service', array( 'fields' => 'ids' ) );
	if ( is_wp_error( $assigned_terms ) || empty( $assigned_terms ) ) {
		return 0;
	}

	return (int) reset( $assigned_terms );
}

/**
 * A case_study post's card-facing meta: description text and (optional)
 * hover-preview video. Subtitle falls back to a trimmed excerpt when the
 * post has no Case Study Hero block yet, or the block exists with an empty
 * subtitle field — same fallback the real source documents for
 * cb_find_hero_subtitle() callers.
 *
 * @param int $post_id
 * @return array{desc: string, vimeoId: string, vimeoHash: string}
 */
function cb_identityjs2026_get_case_study_card_meta( $post_id ) {
	$hero = cb_identityjs2026_find_case_study_hero_block( parse_blocks( get_post_field( 'post_content', $post_id ) ) );

	$desc = $hero['subtitle'] ?? '';
	if ( ! $desc ) {
		$desc = wp_trim_words( get_the_excerpt( $post_id ), 18, '...' );
	}

	return array(
		'desc'      => $desc,
		'vimeoId'   => $hero['vimeoId'] ?? '',
		'vimeoHash' => $hero['vimeoHash'] ?? '',
	);
}
