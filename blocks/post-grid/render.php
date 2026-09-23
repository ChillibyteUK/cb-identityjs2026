<?php
/**
 * Block template for Post Grid.
 *
 * Built from cb-recent-news / cb-recent-news-identity — see
 * identity-global-block-spec.md's Post Grid entry. Card markup reuses the
 * same .insight-type-grid__* classes already built and verified for
 * index.php / category-insights.php / category-press.php (see
 * inc/news-templates.php) — the spec's own note that "identity's real
 * production markup already borrows the Post Grid CSS namespace" is
 * exactly this reuse, just in the other direction (this block borrows
 * theirs, since those were built first).
 *
 * `filterGroups` replaces the earlier querySource (category XOR taxonomy)
 * design — an editor can now combine several taxonomies at once (e.g.
 * Category=Insights AND Theme=Growth AND Service=Branding), each group
 * OR-matching within its own checked terms, ANDed against every other
 * group (WP_Query's tax_query 'relation' => 'AND', one clause per group).
 * `category` is just one more taxonomy in the list, not a special case —
 * WordPress's built-in category taxonomy works fine as an ordinary
 * tax_query clause.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$filter_groups = is_array( $attributes['filterGroups'] ?? null ) ? $attributes['filterGroups'] : array();
$count         = max( 1, absint( $attributes['count'] ?? 3 ) );
$show_category = ! empty( $attributes['showCategory'] );
$show_date     = ! empty( $attributes['showDate'] );

$query_args = array(
	'post_type'      => 'post',
	'post_status'    => 'publish',
	'orderby'        => 'date',
	'order'          => 'DESC',
	'posts_per_page' => $count,
);

// Real source's own post__not_in — only makes sense excluding the post
// this block is rendering on, so only applied on a singular post view.
if ( is_singular( 'post' ) ) {
	$query_args['post__not_in'] = array( get_the_ID() );
}

$tax_query = array();

foreach ( $filter_groups as $group ) {
	$taxonomy = sanitize_key( $group['taxonomy'] ?? '' );
	$terms    = array_filter( array_map( 'absint', $group['terms'] ?? array() ) );

	if ( ! $taxonomy || ! $terms ) {
		continue;
	}

	$tax_query[] = array(
		'taxonomy' => $taxonomy,
		'field'    => 'term_id',
		'terms'    => $terms,
	);
}

// No usable filter at all — nothing to query, matching the earlier
// behaviour of bailing when the editor hasn't picked anything yet.
if ( ! $tax_query ) {
	return;
}

if ( count( $tax_query ) > 1 ) {
	$tax_query['relation'] = 'AND'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- editor-configured term filter, no meaningful alternative.
}

$query_args['tax_query'] = $tax_query; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- editor-configured term filter, no meaningful alternative.

$query = new WP_Query( $query_args );

if ( ! $query->have_posts() ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'insight-type post-grid' ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="insight-type-grid id-container">
		<?php cb_identityjs2026_render_insight_cards_query( $query, $show_category, $show_date ); ?>
	</div>
</section>
