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
// cb_identityjs2026_render_insight_cards() / cb_identityjs2026_category_link_by_slug()
// now live in inc/news-templates.php, shared with category-insights.php /
// category-press.php.
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
