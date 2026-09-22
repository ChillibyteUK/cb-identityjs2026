<?php
/**
 * Block template for Section Title.
 *
 * Built from cb-signpost-header (confirmed against the real theme's
 * _cb_signpost_header.scss/.php) — see identity-global-block-spec.md's
 * Section Title entry. The real source applies its Gutenberg
 * text-colour support to the outer <section>, not the heading itself,
 * and lets the heading inherit it — same approach here.
 *
 * block.json's supports.color (text + background) uses
 * __experimentalSkipSerialization, so get_block_wrapper_attributes() never
 * auto-applies either to $wrapper_attributes — attributes.textColor/
 * backgroundColor are read directly instead, and the resulting classes
 * built in manually below. Confirmed live (2026-09-22): without that flag,
 * useBlockProps()/get_block_wrapper_attributes() apply colour supports to
 * whatever element they're spread onto, which for this project's
 * fields-form editor UI is the same wrapper every field label renders
 * inside — see Detail List's own history earlier this session for the
 * exact bleed this avoids.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$title = $attributes['title'] ?? '';

if ( ! $title ) {
	return;
}

$root_classes = array( 'section-title' );

$text_slug = $attributes['textColor'] ?? '';
if ( $text_slug ) {
	$root_classes[] = 'has-text-color';
	$root_classes[] = 'has-' . $text_slug . '-color';
}

$bg_slug = $attributes['backgroundColor'] ?? '';
if ( $bg_slug ) {
	$root_classes[] = 'has-background';
	$root_classes[] = 'has-' . $bg_slug . '-background-color';
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $root_classes ) ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="id-container">
		<h2 class="section-title__text"><?php echo esc_html( $title ); ?></h2>
	</div>
</section>
