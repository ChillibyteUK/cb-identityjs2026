<?php
/**
 * Block template for Page Header Alt.
 *
 * Mirrors cb-culture-page-header (cb-identity2025/blocks/cb-culture-page-
 * header/cb-culture-page-header.php, unchanged in cb-identitygroup2026) —
 * real example at id.local/about/culture/. One background image is shared
 * across all three regions (top, secondary text, Careers) via a single CSS
 * custom property set once at the root — confirmed against the real
 * source's own `--_bg-url` set once on `.cb-culture-page-header` itself,
 * not per-region — each region then layers its own solid-colour overlay on
 * top via its own ::before.
 *
 * The real source's trailing "LIFE AT IDENTITY" `culture-life` section (a
 * `life` repeater of title+content pairs) is NOT reproduced here — same
 * shape as this project's existing Detail List block, so it belongs as a
 * separate block after this one rather than duplicated in here.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$title                = $attributes['title'] ?? '';
$intro_text           = $attributes['introText'] ?? '';
$background_id        = absint( $attributes['backgroundId'] ?? 0 );
$secondary_text       = $attributes['secondaryText'] ?? '';
$careers_pretitle     = $attributes['careersPretitle'] ?? '';
$careers_title        = $attributes['careersTitle'] ?? '';
$careers_content      = $attributes['careersContent'] ?? '';
$careers_link_url     = $attributes['careersLinkUrl'] ?? '';
$careers_link_text    = $attributes['careersLinkText'] ?? '';
$careers_link_target  = $attributes['careersLinkTarget'] ?? '_self';

$background_url = $background_id ? wp_get_attachment_image_url( $background_id, 'full' ) : '';
$instance_id    = wp_unique_id( 'page-header-alt-' );

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'page-header-alt' ) );
?>
<?php if ( $background_url ) : ?>
	<style>
		#<?php echo esc_attr( $instance_id ); ?> {
			--bg-url: url('<?php echo esc_url( $background_url ); ?>');
		}
	</style>
<?php endif; ?>
<section id="<?php echo esc_attr( $instance_id ); ?>" <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="page-header-alt__top">
		<div class="page-header-alt__top-overlay"></div>
		<div class="id-container">
			<?php if ( $title ) : ?>
				<h1 class="page-header-alt__title"><?php echo wp_kses_post( nl2br( esc_html( $title ) ) ); ?></h1>
			<?php endif; ?>
			<?php if ( $intro_text ) : ?>
				<div class="page-header-alt__intro-text"><?php echo do_shortcode( wp_kses_post( $intro_text ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses_post() sanitizes first; do_shortcode() only expands already-registered, trusted shortcodes against that sanitized result. ?></div>
			<?php endif; ?>
		</div>
	</div>
	<?php if ( $secondary_text ) : ?>
		<div class="page-header-alt__panel">
			<div class="page-header-alt__panel-overlay"></div>
			<div class="id-container">
				<div class="page-header-alt__panel-text"><?php echo do_shortcode( wp_kses_post( $secondary_text ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses_post() sanitizes first; do_shortcode() only expands already-registered, trusted shortcodes against that sanitized result. ?></div>
			</div>
		</div>
	<?php endif; ?>
	<div class="page-header-alt__careers">
		<div class="page-header-alt__careers-overlay"></div>
		<?php if ( $careers_pretitle ) : ?>
			<div class="page-header-alt__careers-pretitle">
				<div class="id-container"><?php echo esc_html( $careers_pretitle ); ?></div>
			</div>
		<?php endif; ?>
		<div class="id-container">
			<div class="page-header-alt__careers-row">
				<?php if ( $careers_title ) : ?>
					<h2 class="page-header-alt__careers-title"><?php echo esc_html( $careers_title ); ?></h2>
				<?php endif; ?>
				<div class="page-header-alt__careers-body">
					<?php if ( $careers_content ) : ?>
						<div class="page-header-alt__careers-content"><?php echo wp_kses_post( nl2br( esc_html( $careers_content ) ) ); ?></div>
					<?php endif; ?>
					<?php if ( $careers_link_url && $careers_link_text ) : ?>
						<a href="<?php echo esc_url( $careers_link_url ); ?>" target="<?php echo esc_attr( $careers_link_target ); ?>" class="page-header-alt__careers-link">
							<?php echo esc_html( $careers_link_text ); ?>
							<img src="<?php echo esc_url( get_theme_file_uri( '/img/arrow-wh.svg' ) ); ?>" width="33" height="26" alt="" />
						</a>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</div>
</section>
