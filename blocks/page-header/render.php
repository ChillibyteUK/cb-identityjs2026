<?php
/**
 * Block template for Page Header.
 *
 * Built from About Page Header — see identity-global-block-spec.md's Page
 * Header entry. `title` renders as a plain multi-line <h1> — confirmed
 * live on identityglobal.com/about/ that this instance has no animated
 * split-title markup, just line breaks.
 *
 * `animatedTitle` is accepted as an attribute (per spec, for a future
 * Region Page Header instance) but not rendered here — no real instance to
 * build/verify that treatment against yet.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$title                = $attributes['title'] ?? '';
$intro_text           = $attributes['introText'] ?? '';
$secondary_panel_type = $attributes['secondaryPanelType'] ?? 'none';
$secondary_text       = $attributes['secondaryText'] ?? '';
$quote                = $attributes['quote'] ?? '';
$quote_author         = $attributes['quoteAuthor'] ?? '';
$quote_company        = $attributes['quoteCompany'] ?? '';
$background_id        = absint( $attributes['backgroundId'] ?? 0 );

$background_url = $background_id ? wp_get_attachment_image_url( $background_id, 'full' ) : '';

$instance_id = wp_unique_id( 'page-header-' );

$root_classes = array( 'page-header' );
if ( $background_url ) {
	$root_classes[] = 'page-header--has-background';
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $root_classes ) ) );
?>
<?php if ( $background_url ) : ?>
	<style>
		#<?php echo esc_attr( $instance_id ); ?> {
			--bg-url: url('<?php echo esc_url( $background_url ); ?>');
		}
	</style>
<?php endif; ?>
<section id="<?php echo esc_attr( $instance_id ); ?>" <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="page-header__top">
		<div class="id-container">
			<?php if ( $title ) : ?>
				<h1 class="page-header__title"><?php echo wp_kses_post( nl2br( esc_html( $title ) ) ); ?></h1>
			<?php endif; ?>
			<?php if ( $intro_text ) : ?>
				<div class="page-header__intro"><?php echo wp_kses_post( $intro_text ); ?></div>
			<?php endif; ?>
		</div>
	</div>
	<?php if ( 'text' === $secondary_panel_type && $secondary_text ) : ?>
		<div class="page-header__panel">
			<div class="id-container">
				<div class="page-header__panel-text"><?php echo wp_kses_post( $secondary_text ); ?></div>
			</div>
		</div>
	<?php elseif ( 'quote' === $secondary_panel_type && $quote ) : ?>
		<div class="page-header__panel">
			<div class="id-container">
				<blockquote class="page-header__quote"><?php echo wp_kses_post( nl2br( esc_html( $quote ) ) ); ?></blockquote>
				<?php if ( $quote_author ) : ?>
					<div class="page-header__quote-author"><?php echo esc_html( $quote_author ); ?></div>
				<?php endif; ?>
				<?php if ( $quote_company ) : ?>
					<div class="page-header__quote-company"><?php echo esc_html( $quote_company ); ?></div>
				<?php endif; ?>
			</div>
		</div>
	<?php endif; ?>
</section>
