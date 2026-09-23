<?php
/**
 * Block template for Work Index.
 *
 * Built from `cb-work-index` — see identity-global-block-spec.md's Work
 * Index entry. Identity's own real markup/copy only (the real source
 * branches per-brand for coda/idtravel/health, which this theme doesn't
 * serve yet — see MULTI-BRAND.md's "don't build for a brand that doesn't
 * exist yet" rule, same reasoning as index.php/page-header).
 *
 * Deliberately simplified vs. the real source, flagged rather than silently
 * dropped:
 * - Filter select is a plain <select>, not the real source's TomSelect
 *   combobox enhancement — same filtering behaviour, simpler markup.
 *
 * Card description and hover-preview video both come from
 * cb_identityjs2026_get_case_study_card_meta() (inc/case-study.php) — the
 * linked case study's own Case Study Hero block subtitle/vimeoId/vimeoHash,
 * falling back to a trimmed excerpt when that block has no subtitle set.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$hero_id         = absint( $attributes['heroCaseStudy'] ?? 0 );
$show_filter_bar = ! empty( $attributes['showFilterBar'] );

if ( ! $hero_id ) {
	$hero_query = new WP_Query(
		array(
			'post_type'      => 'case_study',
			'posts_per_page' => 1,
			'orderby'        => 'menu_order',
			'order'          => 'ASC',
		)
	);
	if ( $hero_query->have_posts() ) {
		$hero_id = $hero_query->posts[0]->ID;
	}
	wp_reset_postdata();
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'work-index' ) );
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<section class="work-index-hero">
		<h1 class="work-index-hero__pretitle">
			<div class="id-container">Our work</div>
		</h1>
		<h2 class="work-index-hero__pretitle-sub">
			<div class="id-container">Where experience changes everything</div>
		</h2>
		<?php if ( $hero_id ) : ?>
			<a href="<?php echo esc_url( get_permalink( $hero_id ) ); ?>" class="work-index-hero__background">
				<?php
				$bg_image_id = get_post_thumbnail_id( $hero_id );
				if ( $bg_image_id ) {
					echo wp_get_attachment_image( $bg_image_id, 'full', false, array( 'class' => 'work-index-hero__image' ) );
				}
				?>
				<div class="work-index-hero__overlay"></div>
				<div class="id-container work-index-hero__content">
					<div class="work-index-hero__title">
						<?php echo esc_html( get_the_title( $hero_id ) ); ?>
						<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/arrow-wh.svg' ); ?>" width="23" height="21" alt="" />
					</div>
					<div class="work-index-hero__desc"><?php echo esc_html( cb_identityjs2026_get_case_study_card_meta( $hero_id )['desc'] ); ?></div>
				</div>
			</a>
		<?php endif; ?>
	</section>

	<?php if ( $show_filter_bar ) : ?>
		<?php
		$service_terms = get_terms(
			array(
				'taxonomy'   => 'service',
				'hide_empty' => true,
				'parent'     => 0,
			)
		);
		?>
		<?php if ( ! is_wp_error( $service_terms ) && ! empty( $service_terms ) ) : ?>
			<div class="work-index__filter-bar">
				<div class="id-container work-index__filter-bar-inner">
					<span class="work-index__filter-label">Filter by:</span>
					<select id="work-index-service-filter" class="work-index__filter-select">
						<option value="all">All Services</option>
						<?php foreach ( $service_terms as $service_term ) : ?>
							<option value="<?php echo esc_attr( $service_term->slug ); ?>"><?php echo esc_html( $service_term->name ); ?></option>
						<?php endforeach; ?>
					</select>
					<button type="button" id="work-index-filter-reset" class="work-index__filter-reset">Reset</button>
				</div>
			</div>
		<?php endif; ?>
	<?php endif; ?>

	<div class="id-container">
		<div class="work-index__cards">
			<?php
			$query = new WP_Query(
				array(
					'post_type'      => 'case_study',
					'posts_per_page' => -1,
					'orderby'        => 'menu_order',
					'order'          => 'ASC',
					'post__not_in'   => $hero_id ? array( $hero_id ) : array(),
				)
			);

			$vimeo_app_id = 58479; // Same fixed Vimeo app/account registration as Media Panel/Case Study Hero.

			while ( $query->have_posts() ) :
				$query->the_post();
				$post_id       = get_the_ID();
				$service_terms = get_the_terms( $post_id, 'service' );
				$service_slugs = array();
				if ( ! is_wp_error( $service_terms ) && ! empty( $service_terms ) ) {
					foreach ( $service_terms as $service_term ) {
						$service_slugs[] = $service_term->slug;
						foreach ( get_ancestors( $service_term->term_id, 'service' ) as $ancestor_id ) {
							$ancestor_term = get_term( $ancestor_id, 'service' );
							if ( $ancestor_term && ! is_wp_error( $ancestor_term ) ) {
								$service_slugs[] = $ancestor_term->slug;
							}
						}
					}
					$service_slugs = array_unique( $service_slugs );
				}

				$card_meta  = cb_identityjs2026_get_case_study_card_meta( $post_id );
				$video_src  = '';
				if ( $card_meta['vimeoId'] ) {
					$video_src = add_query_arg(
						array(
							'h'          => $card_meta['vimeoHash'],
							'dnt'        => '1',
							'badge'      => '0',
							'player_id'  => '0',
							'app_id'     => $vimeo_app_id,
							'background' => '1',
							'autoplay'   => '1',
						),
						'https://player.vimeo.com/video/' . rawurlencode( $card_meta['vimeoId'] )
					);
				}
				?>
				<a href="<?php echo esc_url( get_permalink() ); ?>" class="work-index__card" data-service-terms="<?php echo esc_attr( implode( ' ', $service_slugs ) ); ?>">
					<?php if ( has_post_thumbnail() ) : ?>
						<div class="work-index__image-wrapper">
							<?php the_post_thumbnail( 'full', array( 'class' => 'work-index__image' ) ); ?>
						</div>
					<?php endif; ?>
					<?php if ( $video_src ) : ?>
						<div class="work-index__video" data-video-src="<?php echo esc_url( $video_src ); ?>"></div>
					<?php endif; ?>
					<div class="work-index__content">
						<div class="work-index__title">
							<?php the_title(); ?>
							<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/arrow-n600-solid.svg' ); ?>" width="14" height="13" alt="" />
						</div>
						<div class="work-index__desc"><?php echo esc_html( $card_meta['desc'] ); ?></div>
					</div>
				</a>
				<?php
			endwhile;
			wp_reset_postdata();
			?>
		</div>
	</div>
</div>
<script>
document.addEventListener('DOMContentLoaded', function () {
	var select = document.getElementById('work-index-service-filter');
	var reset = document.getElementById('work-index-filter-reset');
	if (!select) return;
	function applyFilter() {
		var value = select.value;
		document.querySelectorAll('.work-index__card').forEach(function (card) {
			var terms = (card.getAttribute('data-service-terms') || '').split(' ');
			card.style.display = (value === 'all' || terms.indexOf(value) !== -1) ? '' : 'none';
		});
	}
	select.addEventListener('change', applyFilter);
	if (reset) {
		reset.addEventListener('click', function () {
			select.value = 'all';
			applyFilter();
		});
	}
});

document.addEventListener('DOMContentLoaded', function () {
	// Video hover preview: only mount the Vimeo iframe while the card is
	// hovered/focused, so idle cards never hold a live player in memory —
	// ported from cb-featured-work.php's own JS.
	document.querySelectorAll('.work-index__card').forEach(function (card) {
		var container = card.querySelector('.work-index__video');
		if (!container) return;
		var src = container.getAttribute('data-video-src');

		function mountVideo() {
			if (container.querySelector('iframe')) return;
			var iframe = document.createElement('iframe');
			iframe.src = src;
			iframe.frameBorder = '0';
			iframe.allow = 'autoplay; fullscreen';
			iframe.allowFullscreen = true;
			container.appendChild(iframe);
		}
		function unmountVideo() {
			var iframe = container.querySelector('iframe');
			if (iframe) iframe.remove();
		}

		card.addEventListener('mouseenter', mountVideo);
		card.addEventListener('mouseleave', unmountVideo);
		card.addEventListener('focusin', mountVideo);
		card.addEventListener('focusout', unmountVideo);
	});
});
</script>
