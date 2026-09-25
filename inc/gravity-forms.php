<?php
/**
 * Gravity Forms integration — ported unchanged from cb-identity2025/
 * cb-identitygroup2026's own inc/cb-theme.php (`gform_submit_button`
 * filter). Gravity Forms renders its submit as `<input type="submit">`
 * by default, but .id-button's coloured backdrop is a ::before pseudo-
 * element — confirmed live that <input> elements never render ::before/
 * ::after at all (a CSS spec limitation, not a config issue), which is
 * exactly why the button rendered as a plain unstyled grey box even with
 * .id-button correctly added to its classList (see this project's own
 * gallery-field.js-era debugging notes for the same "confirmed live, not
 * guessed" standard). Real source works around it by replacing the whole
 * button with a real <button> element instead, which DOES support
 * ::before — same fix, ported as-is rather than reinvented.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

add_filter(
	'gform_submit_button',
	function ( $button, $form ) {
		return '<button class="gform_button button id-button" style="background-color:transparent;" id="gform_submit_button_' . $form['id'] . '">' . esc_html( $form['button']['text'] ) . '</button>';
	},
	10,
	2
);
