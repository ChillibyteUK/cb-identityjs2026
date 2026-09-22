<?php
/**
 * Block template for CTA.
 *
 * Built from cb-cta — see identity-global-block-spec.md's Call to Action
 * entry. Content is resolved from Site-Wide Settings' `ctas` repeater via
 * cb_identityjs2026_get_cta(), not from block attributes directly — the
 * block only stores which CTA ID to look up.
 *
 * Mask A is the only clip shape ever used on the real site (confirmed,
 * not assumed) so it's hardcoded here — matches identity-global-block-
 * spec.md's explicit note not to build a mask-choice field.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$cta_choice = $attributes['ctaChoice'] ?? '';
$cta        = cb_identityjs2026_get_cta( $cta_choice );

if ( ! $cta ) {
	return;
}

$cta_title   = $cta['title'] ?? '';
$content     = $cta['content'] ?? '';
$link_url    = $cta['link_url'] ?? '';
$link_text   = $cta['link_text'] ?? '';
$link_target = ! empty( $cta['link_target'] );
$bg_id       = absint( $cta['background'] ?? 0 );
$image_id    = absint( $cta['image'] ?? 0 );

$background_url = $bg_id ? wp_get_attachment_image_url( $bg_id, 'full' ) : '';

$instance_id = wp_unique_id( 'cta-' );

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'cta' ) );
?>
<?php if ( $background_url ) : ?>
	<style>
		#<?php echo esc_attr( $instance_id ); ?> {
			--cta-bg-url: url('<?php echo esc_url( $background_url ); ?>');
		}
	</style>
<?php endif; ?>
<section id="<?php echo esc_attr( $instance_id ); ?>" <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="id-container cta__row">
		<div class="cta__media-col">
			<?php if ( $image_id ) : ?>
				<div class="cta__clip-group">
					<?php
					echo wp_get_attachment_image(
						$image_id,
						'full',
						false,
						array(
							'class' => 'cta__image',
							'alt'   => get_post_meta( $image_id, '_wp_attachment_image_alt', true ),
						)
					);
					?>
				</div>
			<?php endif; ?>
		</div>
		<div class="cta__content-col">
			<?php if ( $cta_title ) : ?>
				<h2 class="cta__title"><?php echo wp_kses_post( nl2br( esc_html( $cta_title ) ) ); ?></h2>
			<?php endif; ?>
			<?php if ( $content ) : ?>
				<div class="cta__content"><?php echo wp_kses_post( nl2br( esc_html( $content ) ) ); ?></div>
			<?php endif; ?>
			<?php if ( $link_url && $link_text ) : ?>
				<div class="cta__button">
					<a href="<?php echo esc_url( $link_url ); ?>" class="id-button"<?php echo $link_target ? ' target="_blank" rel="noopener"' : ''; ?>>
						<?php echo esc_html( $link_text ); ?>
					</a>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
<?php if ( $image_id ) : ?>
<script>
document.addEventListener('DOMContentLoaded', function () {
	var section = document.getElementById(<?php echo wp_json_encode( $instance_id ); ?>);
	if (!section) return;

	var img = section.querySelector('.cta__image');
	if (!img) return;

	var ticking = false;

	function update() {
		var rect = section.getBoundingClientRect();
		var windowHeight = window.innerHeight;

		if (rect.bottom > 0 && rect.top < windowHeight) {
			var percent = (windowHeight - rect.top) / (windowHeight + rect.height);
			percent = Math.max(0, Math.min(1, percent));
			var translateY = (percent - 0.5) * 240;
			img.style.transform = 'translateY(' + translateY.toFixed(1) + 'px)';
		}

		ticking = false;
	}

	function onScroll() {
		if (!ticking) {
			window.requestAnimationFrame(update);
			ticking = true;
		}
	}

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll);
	onScroll();
});
</script>
<?php endif; ?>
