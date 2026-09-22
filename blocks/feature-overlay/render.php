<?php
/**
 * Block template for Feature Overlay.
 *
 * Built from `cb-image-feature-overlay` — see identity-global-block-spec.md's
 * Feature Overlay entry. Checked against both cb-identity2025 (older,
 * frozen) and cb-identitygroup2026 (newer, 2026-08-28 dated comments) — the
 * newer one adds the `has_overlay_content` guard and `title_semantic` field
 * reproduced below, and confirms Inline mode's content is plain text
 * (wpautop/esc_html), not richtext.
 *
 * Title Font Size/Font Weight: block.json declares typography supports with
 * __experimentalSkipSerialization, so get_block_wrapper_attributes() never
 * auto-applies them to $wrapper_attributes — same reasoning, and same bug
 * this avoids, as Section Title/Push Panel's colour supports elsewhere in
 * this theme (see those blocks' own render.php notes). Read directly from
 * $attributes and applied only to the title element below.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$presentation    = 'Hero' === ( $attributes['presentation'] ?? 'Inline' ) ? 'Hero' : 'Inline';
$image_id        = absint( $attributes['imageId'] ?? 0 );
$overlay_image_id = absint( $attributes['overlayImageId'] ?? 0 );
$content         = trim( (string) ( $attributes['content'] ?? '' ) );
$title           = trim( (string) ( $attributes['title'] ?? '' ) );
$title_tag       = in_array( $attributes['titleTag'] ?? '', array( 'h1', 'h2', 'h3' ), true ) ? $attributes['titleTag'] : 'h1';
$cta_link_text   = trim( (string) ( $attributes['ctaLinkText'] ?? '' ) );
$cta_link_url    = trim( (string) ( $attributes['ctaLinkUrl'] ?? '' ) );
$cta_link_target = ! empty( $attributes['ctaLinkTarget'] );
$cta_intro       = trim( (string) ( $attributes['ctaIntro'] ?? '' ) );
$block_height    = absint( $attributes['blockHeight'] ?? 0 );

$instance_id = wp_unique_id( 'feature-overlay-' );

$section_classes = array( 'feature-overlay' );
if ( 'Hero' === $presentation ) {
	$section_classes[] = 'feature-overlay--hero';
}

$style_declarations = array();
if ( $block_height ) {
	$style_declarations[] = sprintf( '--_height: %dvh;', $block_height );
}

$image_url = $image_id ? wp_get_attachment_image_url( $image_id, 'full' ) : '';
if ( $image_url ) {
	$style_declarations[] = sprintf( '--_bg-url: url(%s);', esc_url_raw( $image_url ) );
	$section_classes[]    = 'feature-overlay--has-background-image';
}

$overlay_image_url = $overlay_image_id ? wp_get_attachment_image_url( $overlay_image_id, 'full' ) : '';
if ( $overlay_image_url ) {
	$style_declarations[] = sprintf( '--_overlay-bg-url: url(%s);', esc_url_raw( $overlay_image_url ) );
}

$section_style = implode( ' ', $style_declarations );

// Matches the real source's own has_overlay_content guard exactly: Inline
// mode needs real content; Hero mode needs a title, a complete CTA link, or
// a CTA intro — otherwise the overlay (and everything inside it) doesn't
// render at all, leaving a bare background image.
if ( 'Inline' === $presentation ) {
	$has_overlay_content = '' !== $content;
} else {
	$has_overlay_content = '' !== $title || ( $cta_link_url && $cta_link_text ) || '' !== $cta_intro;
}

// fontSize support (skip-serialization): the slug string WP would normally
// turn into `has-{slug}-font-size` via get_block_wrapper_attributes() —
// built by hand here and applied to the title only, not the block wrapper.
$title_font_size_slug = $attributes['fontSize'] ?? '';
$title_classes        = array( 'feature-overlay__title' );
if ( $title_font_size_slug ) {
	$title_classes[] = 'has-' . $title_font_size_slug . '-font-size';
}

// fontWeight support (skip-serialization): no preset system for this one —
// WP always stores it as a literal style value, not a slug.
$title_font_weight = $attributes['style']['typography']['fontWeight'] ?? '';
$title_style        = $title_font_weight ? sprintf( 'font-weight: %s;', esc_attr( $title_font_weight ) ) : '';

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $section_classes ) ) );
?>
<section
	id="<?php echo esc_attr( $instance_id ); ?>"
	<?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>
	<?php echo $section_style ? 'style="' . esc_attr( $section_style ) . '"' : ''; ?>
>
	<?php if ( $has_overlay_content ) : ?>
		<div class="feature-overlay__overlay">
			<div class="id-container">
				<?php if ( 'Inline' === $presentation ) : ?>
					<?php if ( $content ) : ?>
						<div class="feature-overlay__content"><?php echo wp_kses_post( wpautop( esc_html( $content ) ) ); ?></div>
					<?php endif; ?>
				<?php else : ?>
					<div class="feature-overlay__hero-row">
						<?php if ( $title ) : ?>
							<<?php echo esc_attr( $title_tag ); ?> class="<?php echo esc_attr( implode( ' ', $title_classes ) ); ?>" <?php echo $title_style ? 'style="' . esc_attr( $title_style ) . '"' : ''; ?>><?php echo wp_kses_post( $title ); ?></<?php echo esc_attr( $title_tag ); ?>>
						<?php endif; ?>
						<div class="feature-overlay__hero-cta">
							<?php if ( $cta_link_url && $cta_link_text ) : ?>
								<a class="id-button feature-overlay__cta" href="<?php echo esc_url( $cta_link_url ); ?>" target="<?php echo esc_attr( $cta_link_target ? '_blank' : '_self' ); ?>"<?php echo $cta_link_target ? ' rel="noopener"' : ''; ?>><?php echo esc_html( $cta_link_text ); ?></a>
							<?php endif; ?>
							<?php if ( $cta_intro ) : ?>
								<div class="feature-overlay__cta-intro"><?php echo esc_html( $cta_intro ); ?></div>
							<?php endif; ?>
						</div>
					</div>
				<?php endif; ?>
			</div>
		</div>
	<?php endif; ?>
</section>
