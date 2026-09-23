<?php
/**
 * Block template for Post Grid.
 *
 * Built from cb-recent-news / cb-recent-news-identity — see
 * identity-global-block-spec.md's Post Grid entry. One `query_source`
 * field replaces the two overlapping blocks (Recent News's category
 * filter, Latest Insights' taxonomy filter) the spec calls out; card
 * markup reuses the same .insight-type-grid__* classes already built and
 * verified for index.php / category-insights.php / category-press.php
 * (see inc/news-templates.php) — the spec's own note that "identity's real
 * production markup already borrows the Post Grid CSS namespace" is
 * exactly this reuse, just in the other direction (this block borrows
 * theirs, since those were built first).
 *
 * Real source computes its pretitle text/colour from the selected
 * category (RECENT NEWS / RECENT INSIGHTS / etc, cb-recent-news-identity's
 * own switch) only when query_source is category — taxonomy_term mode
 * has no equivalent in the real source (Latest Insights' own `pre_title`
 * was free text, migrated to a separate Section Title block placed before
 * this one per the spec's migration note), so no pretitle renders there.
 *
 * Simplification: real source uses two distinct shades per category (a
 * darker one for the pretitle bar, a lighter one for the section body —
 * e.g. purple-800 vs purple-900) — this uses one shade for both, the same
 * colours already confirmed for identity.css's .insight-type--accent /
 * default .insight-type, rather than sourcing two new unconfirmed shades.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$query_source   = $attributes['querySource'] ?? 'category';
$category_id    = absint( $attributes['category'] ?? 0 );
$taxonomy_name  = $attributes['taxonomyName'] ?? 'theme';
$taxonomy_term  = absint( $attributes['taxonomyTerm'] ?? 0 );
$count          = max( 1, absint( $attributes['count'] ?? 3 ) );
$show_category  = ! empty( $attributes['showCategory'] );
$show_date      = ! empty( $attributes['showDate'] );

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

$pretitle    = '';
$is_accent   = false;
$category_slug = '';

if ( 'taxonomy_term' === $query_source ) {
	if ( ! $taxonomy_term ) {
		return;
	}
	$query_args['tax_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- single-term filter, no meaningful alternative.
		array(
			'taxonomy' => $taxonomy_name,
			'field'    => 'term_id',
			'terms'    => $taxonomy_term,
		),
	);
} else {
	if ( ! $category_id ) {
		return;
	}
	$query_args['cat'] = $category_id;

	$category_term = get_term( $category_id, 'category' );
	$category_slug = ( $category_term && ! is_wp_error( $category_term ) ) ? $category_term->slug : '';

	// Real source's own switch (cb-recent-news-identity.php) — matched
	// exactly for the 4 real slugs, same default fallback otherwise.
	switch ( $category_slug ) {
		case 'press':
			$pretitle  = __( 'Recent News', 'cb-identityjs2026' );
			$is_accent = true;
			break;
		case 'insights':
			$pretitle = __( 'Recent Insights', 'cb-identityjs2026' );
			break;
		case 'perspectives':
			$pretitle = __( 'Recent Perspectives', 'cb-identityjs2026' );
			break;
		case 'white-paper':
			$pretitle = __( 'Recent White Papers', 'cb-identityjs2026' );
			break;
		default:
			$pretitle = __( 'Insights & Perspectives', 'cb-identityjs2026' );
			break;
	}
}

$query = new WP_Query( $query_args );

if ( ! $query->have_posts() ) {
	return;
}

$section_classes = array( 'insight-type', 'post-grid' );
if ( $is_accent ) {
	$section_classes[] = 'insight-type--accent';
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $section_classes ) ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<?php if ( $pretitle ) : ?>
		<div class="post-grid__pre-title">
			<div class="id-container post-grid__pre-title-inner"><?php echo esc_html( strtoupper( $pretitle ) ); ?></div>
		</div>
	<?php endif; ?>
	<div class="insight-type-grid id-container">
		<?php cb_identityjs2026_render_insight_cards_query( $query, $show_category, $show_date ); ?>
	</div>
</section>
