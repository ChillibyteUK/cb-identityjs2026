<?php
/**
 * Block template for Logo Marquee.
 *
 * Built from cb-logo-slider — see identity-global-block-spec.md's Logo
 * Marquee entry. Site-Wide source reads the `logos` Site-Wide Settings
 * field (cb_identityjs2026_get_gallery_setting()); Specific source uses
 * this block's own logoGallery attribute instead.
 *
 * The track renders two identical logo groups back to back — the second
 * is aria-hidden — so the CSS keyframe animation (translate3d 0 → -50%)
 * loops seamlessly; this is the real source's own technique, not invented
 * here. The animation duration is set from the track's actual rendered
 * width so the scroll speed (~80px/s, matching the real site's pace)
 * stays constant regardless of how many logos are configured.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$logo_source = $attributes['logoSource'] ?? 'site_wide';
$logo_ids    = 'specific' === $logo_source
	? array_filter( array_map( 'absint', $attributes['logoGallery'] ?? array() ) )
	: cb_identityjs2026_get_gallery_setting( 'logos' );

if ( empty( $logo_ids ) ) {
	return;
}

$instance_id = wp_unique_id( 'logo-marquee-' );

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'logo-marquee' ) );
?>
<section data-logo-marquee-instance="<?php echo esc_attr( $instance_id ); ?>" <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="id-container logo-marquee__marquee" aria-label="<?php esc_attr_e( 'Logo marquee', 'cb-identityjs2026' ); ?>">
		<div class="logo-marquee__track">
			<?php for ( $loop = 0; $loop < 2; $loop++ ) : ?>
				<div class="logo-marquee__group" <?php echo 1 === $loop ? 'aria-hidden="true"' : ''; ?>>
					<?php foreach ( $logo_ids as $logo_id ) : ?>
						<div class="logo-marquee__item">
							<?php
							echo wp_get_attachment_image(
								$logo_id,
								'full',
								false,
								array(
									'class' => 'logo-marquee__logo',
									'alt'   => get_post_meta( $logo_id, '_wp_attachment_image_alt', true ),
								)
							);
							?>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endfor; ?>
		</div>
	</div>
</section>
<?php if ( 'identity' === cb_identityjs2026_get_site() ) : ?>
<script>
document.addEventListener('DOMContentLoaded', function () {
	var section = document.querySelector('[data-logo-marquee-instance="' + <?php echo wp_json_encode( $instance_id ); ?> + '"]');
	var track = section && section.querySelector('.logo-marquee__track');
	if (!track) return;
	var pxPerSecond = 80; // matches identityglobal.com's real cb-logo-slider pace
	track.style.animationDuration = (track.scrollWidth / 2 / pxPerSecond) + 's';
});
</script>
<?php endif; ?>
