<?php
/**
 * Block template for Page Header.
 *
 * Built from About Page Header — see identity-global-block-spec.md's Page
 * Header entry. `title` renders as a plain multi-line <h1> — confirmed
 * live on identityglobal.com/about/ that this instance has no animated
 * split-title markup, just line breaks.
 *
 * `animatedTitle`, when set, does NOT replace `title` — confirmed live on
 * identityglobal.com/sport/ (a real Region Page Header instance): the plain
 * H1 ("Identity Sport") and the animated three-line title ("Experience" /
 * "Changes" / "Everything") both render, H1 first, animated title below it.
 * The real Region source hardcoded that second line straight into PHP with
 * its own copy of the GSAP timeline; here it's real content plus the shared
 * title-bar-reveal-animate.js (see identity-global-block-spec.md's Page
 * Header note: "build it once as a shared component, not copied per
 * block"). `page-header--has-animated-title` on the root flags this as a
 * Region-style instance for the H1 size override in page-header.css —
 * confirmed live that Region's H1 differs from About's default
 * (--fs-900/fw-semi here vs --fs-950/fw-light there).
 *
 * `headerVariant: 'service'` is the third real sibling this block was
 * built from (identity's own Service Page Header, real class
 * `cb-service-page-header`) — confirmed live on identityglobal.com/faqs/:
 * H1 is --fs-850/effectively-450-weight (its real `--fw-semi` token
 * resolves to 450 in production, same value as `--fw-book` — this
 * project's own `--fw-semi` is a distinct 500, so `--fw-book` is used
 * directly instead of changing that global token), border-block colour
 * hsl(53 36% 96% / .5) (production's real `--hsl-neutral-050`, not this
 * project's generic --col-border), padding-block 0.25rem 0 (top only) and
 * margin-bottom 2rem — a distinctly tighter, smaller treatment than
 * About's default. Unlike Region, there's no independent real-world
 * signal (like `animatedTitle`'s presence) to infer this from, so it's an
 * explicit editor choice.
 *
 * `introTextFontSize`/`secondaryTextFontSize`: confirmed live on
 * identityglobal.com/sport/ that these AREN'T fixed per-block sizing —
 * the real paragraphs carry manually-applied fs-500/fs-400 utility
 * classes (an editorial choice per page, not CSS defaults), same pattern
 * Content Builder's own text module already uses. So these two fields
 * apply a literal fs-* class the same way, instead of a fixed first-
 * paragraph/rest-paragraph CSS split that couldn't be overridden per
 * instance.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$title                   = $attributes['title'] ?? '';
$animated_title          = $attributes['animatedTitle'] ?? '';
$header_variant          = $attributes['headerVariant'] ?? 'default';
$intro_text              = $attributes['introText'] ?? '';
$intro_text_font_size    = $attributes['introTextFontSize'] ?? '';
$secondary_panel_type    = $attributes['secondaryPanelType'] ?? 'none';
$secondary_text          = $attributes['secondaryText'] ?? '';
$secondary_text_font_size = $attributes['secondaryTextFontSize'] ?? '';
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
if ( $animated_title ) {
	$root_classes[] = 'page-header--has-animated-title';
}
if ( 'service' === $header_variant ) {
	$root_classes[] = 'page-header--service';
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
			<?php if ( $animated_title ) : ?>
				<div class="page-header__animated-title">
					<?php
					$lines = array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', trim( $animated_title ) ) ) );
					$n     = 0;
					foreach ( $lines as $line ) {
						++$n;
						if ( $n > 3 ) {
							break; // the reveal animation only has bar/rotation sets for 3 lines.
						}
						?>
						<div class="line">
							<div class="bar bar<?php echo (int) $n; ?>"></div>
							<div class="text text<?php echo (int) $n; ?>"><?php echo esc_html( $line ); ?></div>
						</div>
						<?php
					}
					?>
				</div>
			<?php endif; ?>
			<?php if ( $intro_text ) : ?>
				<div class="page-header__intro <?php echo esc_attr( $intro_text_font_size ); ?>"><?php echo wp_kses_post( $intro_text ); ?></div>
			<?php endif; ?>
		</div>
	</div>
	<?php if ( 'text' === $secondary_panel_type && $secondary_text ) : ?>
		<div class="page-header__panel">
			<div class="id-container">
				<div class="page-header__panel-text <?php echo esc_attr( $secondary_text_font_size ); ?>"><?php echo wp_kses_post( $secondary_text ); ?></div>
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
