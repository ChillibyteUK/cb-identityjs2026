<?php
/**
 * Block template for Media Panel.
 *
 * Built from cb-full-image + cb-full-video, merged behind $media_type — see
 * identity-global-block-spec.md's Media Panel entry.
 *
 * Video src is built from vimeo_id/vimeo_hash + hero_mode, not stored as a
 * pasted URL — app_id is a fixed constant (Vimeo app/account registration,
 * confirmed identical across every real saved cb-full-video instance, not
 * a per-video value), dnt=1/badge=0/player_id=0 are always on, and
 * autoplay/muted/loop/controls=0 are added only in hero mode.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$media_type = $attributes['mediaType'] ?? 'image';
$image_url  = $attributes['imageUrl'] ?? '';
$image_alt  = $attributes['imageAlt'] ?? '';
$top_border = ! empty( $attributes['topBorder'] );
$vimeo_id   = $attributes['vimeoId'] ?? '';
$vimeo_hash = $attributes['vimeoHash'] ?? '';
$full_width = ! empty( $attributes['fullWidth'] );
$full_bleed = ! empty( $attributes['fullBleed'] );
$hero_mode  = ! empty( $attributes['heroMode'] );

$root_classes = array( 'media-panel', 'media-panel--' . $media_type );
if ( 'image' === $media_type && $top_border ) {
	$root_classes[] = 'media-panel--top-border';
}
if ( 'video' === $media_type && $hero_mode ) {
	$root_classes[] = 'media-panel--hero';
}
if ( 'video' === $media_type && $full_bleed ) {
	$root_classes[] = 'media-panel--full-bleed';
}
if ( 'video' === $media_type && ! $full_bleed && ! $full_width ) {
	$root_classes[] = 'id-container';
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $root_classes ) ) );

if ( 'image' === $media_type && ! $image_url ) {
	return;
}
if ( 'video' === $media_type && ! $vimeo_id ) {
	return;
}

if ( 'video' === $media_type ) {
	$video_src = cb_identityjs2026_vimeo_src( $vimeo_id, $vimeo_hash, $hero_mode ? 'hero' : 'player' );

	$iframe_id = ( $attributes['anchor'] ?? '' ) ? $attributes['anchor'] . '-video' : wp_unique_id( 'media-panel-' );

	if ( $hero_mode ) {
		cb_identityjs2026_enqueue_vimeo_player();
	}
}
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<?php if ( 'image' === $media_type ) : ?>
		<img class="media-panel__image" src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $image_alt ); ?>" loading="lazy">
	<?php elseif ( $full_bleed ) : ?>
		<div class="media-panel__bleed-wrapper">
			<iframe id="<?php echo esc_attr( $iframe_id ); ?>" class="media-panel__video" src="<?php echo esc_url( $video_src ); ?>" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
			<?php if ( $hero_mode ) : ?>
				<?php echo cb_identityjs2026_video_unmute_button( $iframe_id ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in the helper. ?>
			<?php endif; ?>
		</div>
	<?php else : ?>
		<iframe id="<?php echo esc_attr( $iframe_id ); ?>" class="media-panel__video" src="<?php echo esc_url( $video_src ); ?>" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
		<?php if ( $hero_mode ) : ?>
				<?php echo cb_identityjs2026_video_unmute_button( $iframe_id ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in the helper. ?>
		<?php endif; ?>
	<?php endif; ?>
</section>
