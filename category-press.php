<?php
/**
 * "Press" category archive — identity's own real design, confirmed against
 * cb-identitygroup2026/category-press.php. Mirror of category-insights.php:
 * full unbounded list (Press category only), purple-900 section background
 * instead of dark, cross-links back to Insights at the bottom. See
 * category-insights.php's own header comment for the shared reasoning
 * (no site-dispatch needed, real source's span-cycle helper, etc).
 *
 * `<main id="main">` is already open (header.php) and closed (footer.php).
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

get_header( cb_identityjs2026_get_site() );

$page_for_posts = get_option( 'page_for_posts' );
$intro          = $page_for_posts ? get_post_field( 'post_content', $page_for_posts ) : '';
?>

<div class="news-insights">
	<section class="news-hero">
		<h1 class="news-hero__title">
			<div class="id-container">Press, news &amp; media</div>
		</h1>
		<h2 class="news-hero__subtitle">
			<div class="id-container">Experience changes everything. Here&#8217;s how we&#8217;re shaping what&#8217;s next.</div>
		</h2>
		<?php if ( $intro ) : ?>
			<div class="news-hero__intro id-container">
				<?php echo wp_kses_post( apply_filters( 'the_content', $intro ) ); ?>
			</div>
		<?php endif; ?>
	</section>

	<section class="insight-type insight-type--accent">
		<div class="insight-type-grid insight-type-grid--full id-container">
			<?php cb_identityjs2026_render_insight_cards_full( 'press' ); ?>
		</div>
		<a class="insight-type__header" href="<?php echo esc_url( cb_identityjs2026_category_link_by_slug( 'insights' ) ); ?>">
			<div class="id-container insight-type__header-inner">
				<span>Insights &amp; perspectives</span>
				<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/arrow-wh.svg' ); ?>" width="65" height="60" alt="" />
			</div>
		</a>
	</section>

	<?php
	echo render_block( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- render_block() output is already escaped by the block's own render.php.
		array(
			'blockName' => 'cb-identityjs2026/cta',
			'attrs'     => array( 'ctaChoice' => cb_identityjs2026_get_setting( 'cta_category_press' ) ),
		)
	);
	?>
</div>

<?php
get_footer( cb_identityjs2026_get_site() );
