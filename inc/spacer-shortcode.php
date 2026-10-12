<?php
/**
 * [spc] shortcode — an explicit vertical spacer for inside a Content Builder
 * text module (e.g. `[spc 1]` for a 1rem gap).
 *
 * A bare extra paragraph gives inconsistent results there because
 * .content-builder__text p carries its own 1.5rem bottom margin (see
 * src/blocks/content-builder.css) — so the "gap" varies with first/last-
 * child zeroing and surrounding margins. This outputs a fixed-height block
 * instead, so the gap is exactly what was asked for.
 *
 * Positional value, no named parameter needed: `[spc 1]` / `[spc 1.5]`.
 * Named `height`/`h` accepted as a fallback (e.g. `[spc height="1"]`), but
 * never required.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

add_shortcode( 'spc', 'cb_identityjs2026_spacer_shortcode' );

/**
 * `[spc 1]` — spacer with a height of 1rem.
 *
 * @param array|string $atts Shortcode attributes — expects the height as the
 *                           bare positional value ($atts[0]).
 * @return string Spacer markup, or '' for a missing/non-positive height.
 */
function cb_identityjs2026_spacer_shortcode( $atts ) {
	$raw = '';
	if ( is_array( $atts ) ) {
		$raw = $atts[0] ?? $atts['height'] ?? $atts['h'] ?? $atts['size'] ?? '';
	} elseif ( is_string( $atts ) ) {
		$raw = $atts;
	}

	$height = (float) $raw;
	if ( $height <= 0 ) {
		return '';
	}

	// Guard against absurd values blowing out a layout from a typo.
	if ( $height > 20 ) {
		$height = 20;
	}

	$formatted = rtrim( rtrim( number_format( $height, 4, '.', '' ), '0' ), '.' );

	// Span, not div: a text module's RichText wraps the shortcode in a <p>,
	// and a div inside a p is invalid nesting (the browser closes the p
	// early). A span with display:block nests validly — see the
	// p:has(> .cb-spc) rule in content-builder.css which zeroes that
	// wrapping paragraph's own margins so the gap is exactly this height.
	return sprintf(
		'<span class="cb-spc" style="display:block;height:%srem" aria-hidden="true"></span>',
		esc_attr( $formatted )
	);
}
