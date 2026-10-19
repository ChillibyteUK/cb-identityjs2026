<?php
/**
 * Block template for Case Study Hero.
 *
 * Built from cb-case-study-hero. Placed at the top of a case_study post's
 * content — the h1 is the post's own title (get_the_title()) unless the
 * optional `title` attribute is set, which overrides it for this hero only.
 * Its `subtitle` attribute is what cb_identityjs2026_get_hero_meta()
 * (inc/case-study.php) reads for both this block's own display and every
 * card that links to this case study elsewhere (Work Index, Case Study
 * Grid) — see that function's own header comment.
 *
 * Video embed src is built from vimeoId/vimeoHash + the fixed Vimeo app_id,
 * matching Media Panel's own render.php exactly (this project's established
 * convention — see that block's own comment on why, not the real source's
 * raw pasted vimeo_url + cb_vimeo_url_with_dnt()).
 *
 * autoplay=1&muted=1 (plus "autoplay" in the iframe's own allow attribute,
 * required by browser autoplay policy) — explicit instruction: when this
 * block has a video, it autoplays muted. Real production's own embed only
 * ever added `&autoplay=1` with no muted param (cb_vimeo_url_with_dnt()
 * only ever adds dnt=1) — that's not reproduced here, this is a
 * deliberate, explicit deviation, not a missed value.
 *
 * Full Width / Full Bleed toggles mirror Media Panel's own, see $media_classes.
 *
 * With no video but a featured image, the image fills the same 16:9 frame
 * (and overlay) instead.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$title      = trim( (string) ( $attributes['title'] ?? '' ) );
$title      = '' !== $title ? $title : get_the_title();
$subtitle   = $attributes['subtitle'] ?? '';
$vimeo_id   = $attributes['vimeoId'] ?? '';
$vimeo_hash = $attributes['vimeoHash'] ?? '';
$full_width = ! empty( $attributes['fullWidth'] );
$full_bleed = ! empty( $attributes['fullBleed'] );

// Same two options as Media Panel, applied to whichever of video/image shows:
// Full Width drops the container so the 16:9 frame runs edge to edge; Full
// Bleed (which implies full width) swaps the 16:9 box for a viewport-height
// cover frame.
$media_classes = array( 'case-study-hero__video-container' );
if ( $full_bleed ) {
	$media_classes[] = 'case-study-hero__video-container--bleed';
} elseif ( $full_width ) {
	$media_classes[] = 'case-study-hero__video-container--full-width';
} else {
	$media_classes[] = 'id-container';
}
$media_class = implode( ' ', $media_classes );

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'case-study-hero' . ( $full_bleed && ( $vimeo_id || has_post_thumbnail() ) ? ' case-study-hero--bleed' : '' ) ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<h1 class="case-study-hero__title">
		<div class="id-container"><?php echo esc_html( $title ); ?></div>
	</h1>
	<?php if ( $subtitle ) : ?>
		<h2 class="case-study-hero__subtitle">
			<div class="id-container"><?php echo esc_html( $subtitle ); ?></div>
		</h2>
	<?php endif; ?>
	<?php if ( $vimeo_id ) : ?>
		<?php
		$video_src = cb_identityjs2026_vimeo_src( $vimeo_id, $vimeo_hash, 'background' );
		$iframe_id = wp_unique_id( 'case-study-hero-video-' );
		?>
		<div class="<?php echo esc_attr( $media_class ); ?>">
			<div class="case-study-hero__video-overlay"></div>
			<iframe id="<?php echo esc_attr( $iframe_id ); ?>" class="case-study-hero__video" src="<?php echo esc_url( $video_src ); ?>" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
			<?php echo cb_identityjs2026_video_unmute_button( $iframe_id ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped in the helper. ?>
		</div>
	<?php elseif ( has_post_thumbnail() ) : ?>
		<?php // No video supplied — fall back to the featured image in the same 16:9 frame. ?>
		<div class="<?php echo esc_attr( $media_class ); ?>">
			<div class="case-study-hero__video-overlay"></div>
			<?php the_post_thumbnail( 'full', array( 'class' => 'case-study-hero__image' ) ); ?>
		</div>
	<?php endif; ?>
</section>
