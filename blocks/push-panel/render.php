<?php
/**
 * Block template for Push Panel.
 *
 * Built from Pushthrough — see identity-global-block-spec.md's Push Panel
 * entry. Confirmed live on identityglobal.com/about/'s real instance:
 * section background/color/border, overlay's default tint colour, title/
 * description font-size/weight/line-height, link colour/weight, and the
 * 50/50 two-column split all matched exactly.
 *
 * Overlay tint: block.json declares supports.color.background with
 * __experimentalSkipSerialization, so get_block_wrapper_attributes() never
 * auto-applies it to $wrapper_attributes (confirmed live — without that
 * flag, the colour landed on the section's own wrapper instead of the
 * overlay div specifically, and separately, on this block's own editor
 * form wrapper — see Detail List's own history earlier this session for
 * the exact same class of bug). $attributes['backgroundColor'] is read
 * directly instead, and applied only to the overlay div below.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$background_id     = absint( $attributes['backgroundId'] ?? 0 );
$left_content_type = $attributes['leftContentType'] ?? 'text';
$title              = trim( (string) ( $attributes['title'] ?? '' ) );
$left_content       = trim( (string) ( $attributes['leftContent'] ?? '' ) );
$logo_id            = absint( $attributes['logoId'] ?? 0 );
$description        = trim( (string) ( $attributes['description'] ?? '' ) );
$link_text          = trim( (string) ( $attributes['linkText'] ?? '' ) );
$link_url           = trim( (string) ( $attributes['linkUrl'] ?? '' ) );
$link_target        = ! empty( $attributes['linkTarget'] );

$background_url = $background_id ? wp_get_attachment_image_url( $background_id, 'full' ) : '';
$is_text        = 'text' === $left_content_type;

$root_classes = array( 'push-panel' );
if ( $background_url ) {
	$root_classes[] = 'push-panel--has-bg';
}

// Anchor-aware id + the background photo as inline styles (no <style> keyed to a generated id).
$wrapper_args = array( 'class' => implode( ' ', $root_classes ) );
if ( $background_url ) {
	$wrapper_args['style'] = 'background-image: url(\'' . esc_url( $background_url ) . '\'); background-size: cover; background-position: center; background-attachment: fixed;';
}
list( $instance_id, $wrapper_attributes ) = cb_identityjs2026_block_wrapper( $attributes, 'push-panel-', $wrapper_args );

// Overlay tint: an editor's own colour choice (native picker, palette-only —
// disable-custom-colors is on theme-wide, so this is always a plain slug)
// always wins; otherwise falls back to the real source's own default/--dark
// modifier, driven by whether there's real left-side text (not just the
// type being "text" with nothing typed in yet — matches the real PHP's own
// `$left_content ? 'overlay--black' : ''` condition exactly).
$overlay_slug    = $attributes['backgroundColor'] ?? '';
$overlay_classes = array( 'push-panel__overlay' );
if ( $overlay_slug ) {
	$overlay_classes[] = 'has-background';
	$overlay_classes[] = 'has-' . $overlay_slug . '-background-color';
} elseif ( $is_text && $left_content ) {
	$overlay_classes[] = 'push-panel__overlay--dark';
}

$arrow = ( 'identity' === cb_identityjs2026_get_site() && ! $background_url ) ? 'arrow-wh.svg' : 'arrow-g400.svg';
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<?php if ( $background_url ) : ?>
		<div class="<?php echo esc_attr( implode( ' ', $overlay_classes ) ); ?>"></div>
	<?php endif; ?>
	<div class="id-container">
		<div class="push-panel__row">
			<div class="push-panel__col" data-animate="fade-up">
				<?php if ( $is_text ) : ?>
					<?php if ( $title ) : ?>
						<h2 class="push-panel__title"><?php echo esc_html( $title ); ?></h2>
					<?php endif; ?>
					<?php if ( $left_content ) : ?>
						<div class="push-panel__left-content"><?php echo wp_kses_post( $left_content ); ?></div>
					<?php endif; ?>
				<?php elseif ( $logo_id ) : ?>
					<div class="push-panel__logo"><?php echo wp_get_attachment_image( $logo_id, 'full' ); ?></div>
				<?php endif; ?>
			</div>
			<div class="push-panel__col" data-animate="fade-up" data-animate-delay="100">
				<?php if ( $description ) : ?>
					<div class="push-panel__desc"><?php echo wp_kses_post( $description ); ?></div>
				<?php endif; ?>
				<?php if ( $link_url && $link_text ) : ?>
					<a href="<?php echo esc_url( $link_url ); ?>" class="push-panel__link" target="<?php echo esc_attr( $link_target ? '_blank' : '_self' ); ?>"<?php echo $link_target ? ' rel="noopener"' : ''; ?>>
						<?php echo esc_html( $link_text ); ?>
						<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/' . $arrow ); ?>" width="33" height="26" alt="" />
					</a>
				<?php endif; ?>
			</div>
		</div>
	</div>
</section>
