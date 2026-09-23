<?php
/**
 * Blog index — the News/Insights/Perspectives/Press listing at
 * `page_for_posts`.
 *
 * Identity's own real design (confirmed against
 * cb-identitygroup2026/index-identity.php) is genuinely different from a
 * generic post list: a hero pulling its intro text from the Posts page's
 * own content, then two capped 3-post grids — "Insights" (Insights +
 * Perspectives categories) and "Press" (Press category) — not one
 * unbounded chronological list. Since this theme currently only serves
 * `identity` (see inc/site-config.php), this file IS that design directly
 * rather than a generic index.php dispatching to an index-{site}.php
 * variant the way the older shared theme did — add that split only once a
 * second brand genuinely needs a different index layout, matching this
 * project's own "don't build for a brand that doesn't exist yet" rule
 * (MULTI-BRAND.md).
 *
 * `<main id="main">` is already open (see header.php) and closed
 * (footer.php) — this only needs to render what goes inside it.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

get_header( cb_identityjs2026_get_site() );

/**
 * Renders one post-card grid: up to 3 posts from the given category
 * slug(s), with a fixed 3/6/3 (or 6/3/3) column-span pattern matching the
 * real source's own card sizing.
 *
 * @param string   $category_slugs Comma-separated category slug(s) for
 *                                 `category_name` (WP_Query OR-matches these).
 * @param int[]    $spans          Three grid-column spans (out of 12), one
 *                                 per card, in display order.
 * @return void
 */
if ( ! function_exists( 'cb_identityjs2026_render_insight_cards' ) ) :
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
		$span       = $spans[ $index ] ?? 6;
		$categories = get_the_category();
		++$index;
		?>
		<a href="<?php echo esc_url( get_permalink() ); ?>" class="insight-type-grid__card" style="--insight-card-span: <?php echo (int) $span; ?>;">
			<?php if ( has_post_thumbnail() ) : ?>
				<div class="insight-type-grid__image-wrapper">
					<?php
					the_post_thumbnail(
						'full',
						array(
							'class' => 'insight-type-grid__image',
							'alt'   => get_post_meta( get_post_thumbnail_id(), '_wp_attachment_image_alt', true ),
						)
					);
					?>
				</div>
			<?php endif; ?>
			<div class="insight-type-grid__content">
				<?php if ( ! empty( $categories ) ) : ?>
					<div class="insight-type-grid__category"><?php echo esc_html( $categories[0]->name ); ?></div>
				<?php endif; ?>
				<h3 class="insight-type-grid__title"><?php the_title(); ?></h3>
				<div class="insight-type-grid__date">
					<?php echo esc_html( get_the_date( 'j F Y' ) ); ?>
					<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/arrow-n600-solid.svg' ); ?>" width="14" height="13" alt="" />
				</div>
			</div>
		</a>
		<?php
	}
	wp_reset_postdata();
}
endif;

/**
 * Category archive link by slug, or '#' if the category doesn't exist —
 * avoids a get_category_link( false ) warning if a site is missing one of
 * the three categories this page expects.
 *
 * @param string $slug Category slug.
 * @return string
 */
if ( ! function_exists( 'cb_identityjs2026_category_link_by_slug' ) ) :
function cb_identityjs2026_category_link_by_slug( $slug ) {
	$term = get_category_by_slug( $slug );
	return $term ? get_category_link( $term ) : '#';
}
endif;
?>

<div class="news-insights">
	<section class="news-hero">
		<h1 class="news-hero__title">
			<div class="id-container">News, insights, and perspectives</div>
		</h1>
		<h2 class="news-hero__subtitle">
			<div class="id-container">Creating news and leading conversations that shape our industry</div>
		</h2>
		<?php
		$page_for_posts = get_option( 'page_for_posts' );
		$intro          = $page_for_posts ? get_post_field( 'post_content', $page_for_posts ) : '';
		if ( $intro ) :
			?>
			<div class="news-hero__intro id-container">
				<?php echo wp_kses_post( apply_filters( 'the_content', $intro ) ); ?>
			</div>
		<?php endif; ?>
	</section>

	<section class="insight-type insight-type--dark">
		<a class="insight-type__header" href="<?php echo esc_url( cb_identityjs2026_category_link_by_slug( 'insights' ) ); ?>">
			<div class="id-container insight-type__header-inner">
				<span>Insights</span>
				<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/arrow-wh.svg' ); ?>" width="65" height="60" alt="" />
			</div>
		</a>
		<div class="insight-type-grid id-container">
			<?php cb_identityjs2026_render_insight_cards( 'insights,perspectives', array( 3, 6, 3 ) ); ?>
		</div>
	</section>

	<section class="insight-type insight-type--accent">
		<a class="insight-type__header" href="<?php echo esc_url( cb_identityjs2026_category_link_by_slug( 'press' ) ); ?>">
			<div class="id-container insight-type__header-inner">
				<span>Press</span>
				<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/arrow-wh.svg' ); ?>" width="65" height="60" alt="" />
			</div>
		</a>
		<div class="insight-type-grid id-container">
			<?php cb_identityjs2026_render_insight_cards( 'press', array( 6, 3, 3 ) ); ?>
		</div>
	</section>

	<?php echo render_block( array( 'blockName' => 'cb-identityjs2026/cta' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- render_block() output is already escaped by the block's own render.php. ?>
</div>

<?php
get_footer( cb_identityjs2026_get_site() );
