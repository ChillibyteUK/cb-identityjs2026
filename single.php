<?php
/**
 * Single post template — identity's own real design, ported from
 * cb-identitygroup2026's single-identity.php (itself built from
 * cb-identity2025's single.php).
 *
 * Identity's real category taxonomy is press/insights/perspectives, which
 * drives the post-press/post-insight colour scheme (see .single-blog in
 * src/css/site/identity.css). The recent-posts section reuses this theme's
 * own insight-card renderer (inc/news-templates.php) and
 * .insight-type__header pattern (same as index.php), excluding the current
 * post — matching the real source's own post__not_in. The closing CTA reads
 * the Page CTAs settings (press → Press Archive CTA, anything else →
 * Insights Archive CTA), same render_block() pattern as index.php.
 *
 * `<main id="main">` is already open (see header-identity.php) and closed
 * (footer-identity.php) — this only renders what goes inside it, so unlike
 * the real source there is no <main> wrapper of its own here.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

get_header( cb_identityjs2026_get_site() );

while ( have_posts() ) {
	the_post();

	$categories = get_the_category();
	$first_category = ( ! empty( $categories ) && ! is_wp_error( $categories ) ) ? $categories[0] : null;

	$category_slug = $first_category instanceof WP_Term ? $first_category->slug : 'press';
	$category_name = $first_category instanceof WP_Term ? $first_category->name : 'Press';
	$post_style    = $category_slug;

	switch ( $post_style ) {
		case 'press':
			$post_style = 'post-press';
			break;
		case 'insights':
		case 'perspectives':
			$post_style = 'post-insight';
			break;
		default:
			$post_style = 'post-press';
			break;
	}

	switch ( $category_slug ) {
		case 'press':
			$recent_title = 'Recent News';
			break;
		case 'insights':
			$recent_title = 'Recent Insights';
			break;
		case 'perspectives':
			$recent_title = 'Recent Perspectives';
			break;
		default:
			$recent_title = 'Insights & Perspectives'; // esc_html() on output handles the &.
			break;
	}
	?>

	<div class="single-blog <?php echo esc_attr( $post_style ); ?>">
		<div class="id-container pt-5 pb-4">
			<div class="post-hero-clip-group">
				<?php if ( has_post_thumbnail() ) : ?>
					<?php
					the_post_thumbnail(
						'full',
						array(
							'class' => 'post-hero-image',
							'alt'   => get_post_meta( get_post_thumbnail_id(), '_wp_attachment_image_alt', true ),
						)
					);
					?>
				<?php else : ?>
					<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/default-post-image.png' ); ?>" alt="" class="post-hero-image" />
				<?php endif; ?>
			</div>
		</div>
		<div class="category-wrapper">
			<div class="id-container px-4 px-md-5">
				<div class="category <?php echo esc_attr( $category_slug ); ?>"><?php echo esc_html( $category_name ); ?></div>
			</div>
		</div>
		<div class="post-title">
			<div class="id-container px-4 px-md-5">
				<div class="row">
					<div class="col-md-9">
						<h1 class="pt-1"><?php echo esc_html( get_the_title() ); ?></h1>
					</div>
				</div>
			</div>
		</div>
		<div class="id-container">
			<div class="row post-content-row mb-5">
				<div class="col-md-3"></div>
				<div class="col-md-9 post-content px-4 px-md-5 ps-md-0 pe-md-5">
					<?php echo apply_filters( 'the_content', get_the_content() ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- the_content output, same as the real source. ?>
				</div>
			</div>
		</div>
		<div class="post-date-row">
			<div class="id-container">
				<div class="row post-content-row">
					<div class="col-md-3"></div>
					<div class="col-md-9 post-content px-4 px-md-5 ps-md-0 pe-md-5">
						<div class="container post-date pt-3">
							<?php echo esc_html( get_the_date( 'j F Y' ) ); ?>
						</div>
					</div>
				</div>
			</div>
		</div>

		<?php
		$recent_query = new WP_Query(
			array(
				'post_type'      => 'post',
				'post_status'    => 'publish',
				'orderby'        => 'date',
				'order'          => 'DESC',
				'posts_per_page' => 3,
				'post__not_in'   => array( get_the_ID() ),
				'category_name'  => $category_slug,
			)
		);

		if ( $recent_query->have_posts() ) :
			?>
			<section class="recent-news insight-type<?php echo 'press' === $category_slug ? ' insight-type--accent' : ''; ?>">
				<a class="insight-type__header" href="<?php echo esc_url( cb_identityjs2026_category_link_by_slug( $category_slug ) ); ?>">
					<div class="id-container insight-type__header-inner">
						<span><?php echo esc_html( $recent_title ); ?></span>
						<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/arrow-wh.svg' ); ?>" width="65" height="60" alt="" />
					</div>
				</a>
				<div class="insight-type-grid id-container">
					<?php
					$spans = array( 3, 6, 3 );
					$index = 0;
					while ( $recent_query->have_posts() ) {
						$recent_query->the_post();
						cb_identityjs2026_render_insight_card( $spans[ $index ] ?? 6 );
						++$index;
					}
					wp_reset_postdata();
					?>
				</div>
			</section>
		<?php endif; ?>

		<?php
		$cta_setting = 'press' === $category_slug
			? cb_identityjs2026_get_setting( 'cta_category_press' )
			: cb_identityjs2026_get_setting( 'cta_category_insights' );

		echo render_block( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- render_block() output is already escaped by the block's own render.php.
			array(
				'blockName' => 'cb-identityjs2026/cta',
				'attrs'     => array( 'ctaChoice' => $cta_setting ),
			)
		);
		?>
	</div>

	<?php
}

get_footer( cb_identityjs2026_get_site() );
