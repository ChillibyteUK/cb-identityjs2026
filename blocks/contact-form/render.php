<?php
/**
 * Block template for Contact Form.
 *
 * Built from cb-contact-form — title, left-column content, right-column
 * shortcode (a Gravity Forms embed on the real site, ported unchanged
 * even though Gravity Forms isn't installed on this dev site — the
 * shortcode simply won't resolve to a real form here until it is).
 *
 * The real source's small enhancement script (hide Gravity Forms'
 * required-field asterisks, add this theme's .id-button class to its
 * submit button) is ported as-is — both querySelectorAll calls just no-op
 * when there's no .gform_wrapper/.gform_button in the DOM, so this is
 * always safe to print regardless of whether the shortcode resolves to
 * anything.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$title     = $attributes['title'] ?? '';
$content   = $attributes['content'] ?? '';
$shortcode = $attributes['shortcode'] ?? '';

if ( ! $title && ! $content && ! $shortcode ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'contact-form' ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="id-container">
		<?php if ( $title ) : ?>
			<h1 class="contact-form__title"><?php echo esc_html( $title ); ?></h1>
		<?php endif; ?>
		<div class="contact-form__row">
			<?php if ( $content ) : ?>
				<div class="contact-form__content"><?php echo wp_kses_post( $content ); ?></div>
			<?php endif; ?>
			<?php if ( $shortcode ) : ?>
				<div class="contact-form__embed"><?php echo do_shortcode( $shortcode ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- this field exists specifically to hold a trusted, editor-entered shortcode (e.g. Gravity Forms), same pattern as Content Builder's own shortcode-in-text-module support. ?></div>
			<?php endif; ?>
		</div>
	</div>
</section>
<?php if ( $shortcode ) : ?>
	<script>
	document.addEventListener( 'DOMContentLoaded', function () {
		document.querySelectorAll( '.gform_wrapper.gravity-theme .gfield_required' ).forEach( function ( el ) {
			el.style.display = 'none';
		} );
		document.querySelectorAll( '.gform_button.button' ).forEach( function ( btn ) {
			btn.classList.add( 'id-button' );
		} );
	} );
	</script>
<?php endif; ?>
