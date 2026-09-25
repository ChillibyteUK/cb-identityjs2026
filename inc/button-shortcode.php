<?php
/**
 * [cb_button] shortcode — a plain, standalone link styled with this
 * project's own shared .id-button component (forms.css), for the one-off
 * case where a page needs just a button with no surrounding CTA panel
 * (title/description/image/parallax) the way the CB CTA block always
 * renders. Built for the Contact page's old contact_link field
 * (cb-contact-page.php) — real source rendered it as a bare
 * `<a class="id-button">`, not a CTA panel, so reusing CB CTA there would
 * have added a section it never had. Typed directly into a RichText field
 * (e.g. Page Header's Intro Text) rather than needing its own block/field
 * anywhere.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

add_shortcode( 'cb_button', 'cb_identityjs2026_button_shortcode' );

/**
 * [cb_button url="https://..." text="Get in touch" target="_blank"]
 *
 * @param array $atts Shortcode attributes.
 * @return string HTML markup for the button, or '' if url/text are missing.
 */
function cb_identityjs2026_button_shortcode( $atts ) {
	$atts = shortcode_atts(
		array(
			'url'    => '',
			'text'   => '',
			'target' => '',
		),
		$atts,
		'cb_button'
	);

	if ( ! $atts['url'] || ! $atts['text'] ) {
		return '';
	}

	$target_attr = '_blank' === $atts['target'] ? ' target="_blank" rel="noopener"' : '';

	return sprintf(
		'<a href="%1$s" class="id-button"%2$s>%3$s</a>',
		esc_url( $atts['url'] ),
		$target_attr, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built entirely from a fixed literal above, no user input.
		esc_html( $atts['text'] )
	);
}
