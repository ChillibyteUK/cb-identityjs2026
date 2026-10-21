<?php
/**
 * Block template for About Hero.
 *
 * Ported from cb-about-hero (cb-identitygroup2026, the newest copy). Identity
 * only needs the dark treatment, so the legacy health-only Overlay Style
 * toggle and its <hr>-vs-<div> rule switch are deliberately not carried over.
 *
 * Full-viewport-height section: title (between two rules) and intro sit
 * bottom-aligned over an optional parallax background image, with an optional
 * overlay image at 60% opacity, and a translucent Content band pinned to the
 * bottom. The band reads --col-overlay-colour for now.
 *
 * The Content band uses data-animate="fade" (opacity only, as the legacy AOS "fade") —
 * a fade-up would translate the band and expose the background behind it.
 *
 * Background parallax: data-hero-parallax, driven by src/js/hero-parallax.js
 * (replaces the legacy per-instance inline <script>).
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$background_id = absint( $attributes['backgroundId'] ?? 0 );
$overlay_id    = absint( $attributes['overlayImageId'] ?? 0 );
$title         = trim( (string) ( $attributes['title'] ?? '' ) );
$intro         = trim( (string) ( $attributes['intro'] ?? '' ) );
$content       = trim( (string) ( $attributes['content'] ?? '' ) );

// Same guard as the legacy block: nothing to show, render nothing.
if ( '' === $title && '' === $intro && '' === $content && ! $overlay_id ) {
	return;
}

$classes      = array( 'about-hero' );
$extra_attrs  = '';
$background_url = $background_id ? wp_get_attachment_image_url( $background_id, 'full' ) : '';
if ( $background_url ) {
	$classes[]   = 'about-hero--has-background-image';
	$extra_attrs = ' data-hero-parallax style="' . esc_attr( '--about-hero-bg: url(' . esc_url_raw( $background_url ) . ');' ) . '"';
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );
?>
<?php if ( $background_url ) : ?>
	<link rel="preload" as="image" href="<?php echo esc_url( $background_url ); ?>" fetchpriority="high">
<?php endif; ?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?><?php echo $extra_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from esc_attr()/esc_url_raw() above. ?>>
	<div class="about-hero__top">
		<?php if ( $overlay_id ) : ?>
			<div class="about-hero__overlay-image-wrap">
				<?php echo wp_get_attachment_image( $overlay_id, 'full', false, array( 'class' => 'about-hero__overlay-image', 'alt' => '' ) ); ?>
			</div>
		<?php endif; ?>

		<div class="id-container about-hero__container">
			<div class="about-hero__top-inner">
				<?php if ( '' !== $title ) : ?>
					<hr class="about-hero__rule">
					<h1 class="about-hero__title hero-animate"><?php echo esc_html( $title ); ?></h1>
					<hr class="about-hero__rule">
				<?php endif; ?>
				<?php if ( '' !== $intro ) : ?>
					<div class="about-hero__intro hero-animate hero-animate--delay-1"><?php echo wp_kses_post( wpautop( esc_html( $intro ) ) ); ?></div>
				<?php endif; ?>
			</div>
		</div>
	</div>

	<?php if ( '' !== $content ) : ?>
		<div class="about-hero__content-wrap" data-animate="fade">
			<div class="id-container about-hero__container about-hero__container--content">
				<div class="about-hero__content"><?php echo wp_kses_post( $content ); ?></div>
			</div>
		</div>
	<?php endif; ?>
</section>
