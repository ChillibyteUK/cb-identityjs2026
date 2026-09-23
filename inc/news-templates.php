<?php
/**
 * Shared helpers for the news/insights/press templates — index.php,
 * category-insights.php, category-press.php. Split out here instead of
 * defined inline per-template (index.php used to carry its own
 * function_exists-guarded copies) since category-insights.php and
 * category-press.php need the same card markup, just with an unbounded,
 * repeating 7-position layout instead of index.php's fixed 3-card one.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * Renders one post-card grid: up to 3 posts from the given category
 * slug(s), with a fixed 3/6/3 (or 6/3/3) column-span pattern matching the
 * real source's own card sizing. Used by index.php's two capped sections.
 *
 * @param string $category_slugs Comma-separated category slug(s) for
 *                                `category_name` (WP_Query OR-matches these).
 * @param int[]  $spans          Three grid-column spans (out of 12), one
 *                                per card, in display order.
 * @return void
 */
function cb_identityjs2026_render_insight_cards( $category_slugs, $spans ) {
	$query = new WP_Query(
		array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'orderby'        => 'date',
			'order'          => 'DESC',
			'posts_per_page' => 3,
			'category_name'  => $category_slugs,
		)
	);

	if ( ! $query->have_posts() ) {
		return;
	}

	$index = 0;
	while ( $query->have_posts() ) {
		$query->the_post();
		$span = $spans[ $index ] ?? 6;
		++$index;
		cb_identityjs2026_render_insight_card( $span );
	}
	wp_reset_postdata();
}

/**
 * Renders every published post in the given category slug(s), cycling
 * through the real source's own 7-position span pattern
 * (3/6/3/6/3/3/12, repeating) — used by category-insights.php and
 * category-press.php, whose lists are unbounded, not capped at 3.
 *
 * @param string $category_slugs Comma-separated category slug(s).
 * @return void
 */
function cb_identityjs2026_render_insight_cards_full( $category_slugs ) {
	$query = new WP_Query(
		array(
			'post_type'      => 'post',
			'post_status'    => 'publish',
			'orderby'        => 'date',
			'order'          => 'DESC',
			'posts_per_page' => -1,
			'category_name'  => $category_slugs,
		)
	);

	cb_identityjs2026_render_insight_cards_query( $query, true, true );
}

/**
 * Renders every post in an already-built WP_Query, cycling through the
 * real source's own 7-position span pattern (3/6/3/6/3/3/12, repeating —
 * position 7's span-12 is the cycle's own "wide" break). Shared by
 * cb_identityjs2026_render_insight_cards_full() above (category-insights.php
 * /category-press.php) and the Post Grid block (blocks/post-grid/render.php),
 * which builds its own query from editor-configured fields instead of a
 * fixed category slug.
 *
 * @param WP_Query $query         An already-run WP_Query.
 * @param bool     $show_category Whether each card shows its category label.
 * @param bool     $show_date     Whether each card shows its date row.
 * @return void
 */
function cb_identityjs2026_render_insight_cards_query( $query, $show_category = true, $show_date = true ) {
	if ( ! $query->have_posts() ) {
		return;
	}

	$cycle    = array( 3, 6, 3, 6, 3, 3, 12 );
	$position = 0;
	while ( $query->have_posts() ) {
		$query->the_post();
		$span = $cycle[ $position ];
		cb_identityjs2026_render_insight_card( $span, $position + 1, $show_category, $show_date );
		$position = ( $position + 1 ) % count( $cycle );
	}
	wp_reset_postdata();
}

/**
 * Renders one card's markup for the current post in the loop — shared by
 * both the capped and full-list renderers above.
 *
 * @param int      $span     Grid-column span (out of 12).
 * @param int|null $position     1-indexed position in a 7-card cycle, for
 *                                the full-list renderer's per-position
 *                                aspect ratio (see
 *                                .insight-type-grid__card--N in
 *                                identity.css); omitted (null) for the
 *                                capped 3-card renderer, which is styled by
 *                                section + :nth-child instead.
 * @param bool     $show_category Whether to render the category label.
 * @param bool     $show_date     Whether to render the date row.
 * @return void
 */
function cb_identityjs2026_render_insight_card( $span, $position = null, $show_category = true, $show_date = true ) {
	$categories      = $show_category ? get_the_category() : array();
	$position_class  = $position ? ' insight-type-grid__card--' . (int) $position : '';
	?>
	<a href="<?php echo esc_url( get_permalink() ); ?>" class="insight-type-grid__card<?php echo esc_attr( $position_class ); ?>" style="--insight-card-span: <?php echo (int) $span; ?>;">
		<div class="insight-type-grid__image-wrapper">
			<?php if ( has_post_thumbnail() ) : ?>
				<?php
				the_post_thumbnail(
					'full',
					array(
						'class' => 'insight-type-grid__image',
						'alt'   => get_post_meta( get_post_thumbnail_id(), '_wp_attachment_image_alt', true ),
					)
				);
				?>
			<?php else : ?>
				<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/default-post-image.png' ); ?>" class="insight-type-grid__image" alt="" />
			<?php endif; ?>
		</div>
		<div class="insight-type-grid__content">
			<?php if ( $show_category && ! empty( $categories ) ) : ?>
				<div class="insight-type-grid__category"><?php echo esc_html( $categories[0]->name ); ?></div>
			<?php endif; ?>
			<h3 class="insight-type-grid__title"><?php the_title(); ?></h3>
			<?php if ( $show_date ) : ?>
				<div class="insight-type-grid__date">
					<?php echo esc_html( get_the_date( 'j F Y' ) ); ?>
					<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/arrow-n600-solid.svg' ); ?>" width="14" height="13" alt="" />
				</div>
			<?php endif; ?>
		</div>
	</a>
	<?php
}

/**
 * Category archive link by slug, or '#' if the category doesn't exist —
 * avoids a get_category_link( false ) warning if a site is missing one of
 * the categories these templates expect.
 *
 * @param string $slug Category slug.
 * @return string
 */
function cb_identityjs2026_category_link_by_slug( $slug ) {
	$term = get_category_by_slug( $slug );
	return $term ? get_category_link( $term ) : '#';
}
