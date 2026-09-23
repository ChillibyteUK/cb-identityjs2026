<?php
/**
 * Block template for Testimonial.
 *
 * Built from `cb-testimonial` — see identity-global-block-spec.md's
 * Testimonial entry. Long-quote size-down (>130 plain-text characters)
 * confirmed real and current in cb-identitygroup2026's PHP (absent from
 * the older cb-identity2025 copy) — ported directly, including counting
 * the plain-text length with tags stripped, not the raw field value, so
 * an editor's own formatting doesn't skew the count.
 *
 * `style`'s 3 real choices (Light/Purple/Dark) are cb-identity2025's own
 * original ACF field values, confirmed still live in production via 4 real
 * identityglobal.com/work/ case studies (2026-09-22) — NOT the newer
 * consolidated theme's own default ACF choices (Light/Raspberry/Purple),
 * which never actually shipped for this brand. See edit.js for the full
 * note.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$quote   = trim( (string) ( $attributes['quote'] ?? '' ) );
$author  = trim( (string) ( $attributes['author'] ?? '' ) );
$company = trim( (string) ( $attributes['company'] ?? '' ) );
$style   = $attributes['style'] ?? '';

if ( '' === $quote ) {
	return;
}

$section_classes = array( 'testimonial' );
if ( $style ) {
	$section_classes[] = $style;
}

// Long quotes get a smaller size so they don't overrun the layout — counted
// on the plain-text length (tags stripped), not the raw field value.
$quote_classes = array( 'testimonial__quote' );
if ( mb_strlen( wp_strip_all_tags( $quote ) ) > 130 ) {
	$quote_classes[] = 'testimonial__quote--long';
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $section_classes ) ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="id-container">
		<div class="<?php echo esc_attr( implode( ' ', $quote_classes ) ); ?>">&ldquo;<?php echo wp_kses_post( $quote ); ?>&rdquo;</div>
		<?php if ( $author ) : ?>
			<div class="testimonial__author"><?php echo esc_html( $author ); ?></div>
		<?php endif; ?>
		<?php if ( $company ) : ?>
			<div class="testimonial__company"><?php echo esc_html( $company ); ?></div>
		<?php endif; ?>
	</div>
</section>
