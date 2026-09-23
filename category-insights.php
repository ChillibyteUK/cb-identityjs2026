<?php
/**
 * "Insights" category archive — identity's own real design, confirmed
 * against cb-identitygroup2026/category-insights.php. WordPress's own
 * template hierarchy picks this up automatically for the `insights`
 * category slug (category-{slug}.php) — no site-conditional dispatch
 * needed, since only identity's install actually has this category (same
 * reasoning as index.php: don't build brand-dispatch plumbing a second
 * brand doesn't exist to need yet).
 *
 * Unlike index.php's two capped 3-card sections, this lists every
 * Insights/Perspectives/white-paper post (no white-paper category exists
 * yet on this install — included anyway since it's harmless and matches
 * the real source), cycling the same 3/6/3/6/3/3/12 span pattern
 * category-press.php also uses (see cb_identityjs2026_render_insight_cards_full()
 * in inc/news-templates.php), and cross-links to Press at the bottom
 * instead of duplicating a "jump to the other section" header at the top.
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
			<div class="id-container">Insights &amp; Perspectives</div>
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

	<section class="insight-type insight-type--dark">
		<div class="insight-type-grid insight-type-grid--full id-container">
			<?php cb_identityjs2026_render_insight_cards_full( 'insights,perspectives,white-paper' ); ?>
		</div>
		<a class="insight-type__header" href="<?php echo esc_url( cb_identityjs2026_category_link_by_slug( 'press' ) ); ?>">
			<div class="id-container insight-type__header-inner">
				<span>Press &amp; media</span>
				<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/arrow-wh.svg' ); ?>" width="65" height="60" alt="" />
			</div>
		</a>
	</section>

	<?php
	echo render_block( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- render_block() output is already escaped by the block's own render.php.
		array(
			'blockName' => 'cb-identityjs2026/cta',
			'attrs'     => array( 'ctaChoice' => cb_identityjs2026_get_setting( 'cta_category_insights' ) ),
		)
	);
	?>
</div>

<?php
get_footer( cb_identityjs2026_get_site() );
