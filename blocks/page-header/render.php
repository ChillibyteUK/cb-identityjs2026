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
 * `headerVariant: 'plain'` reproduces cb-identitygroup2026's CB Plain Hero (dark
 * background, full-bleed ruled h1, 8-of-12 intro, optional parallax background
 * image with a bigger title and no tint) — see page-header.css's .page-header--plain.
 * It ignores Animated Title and the secondary panel (their fields are hidden in
 * the editor) and always uses the full-scope background.
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
$background_scope     = $attributes['backgroundScope'] ?? 'full';

$background_url = $background_id ? wp_get_attachment_image_url( $background_id, 'full' ) : '';

// 'secondary' reproduces cb-policies-page's own secondary_background field,
// which only ever sat behind its second band — never the title — unlike
// every other real Page Header sibling this block was built from, where a
// background always covers the whole thing. Existing saved instances have
// no backgroundScope attribute at all and fall through to 'full' here,
// keeping their current whole-block rendering exactly as before this was
// added.
$is_plain                = 'plain' === $header_variant;
$plain_has_image         = $is_plain && $background_url && 'full' === $background_scope;
// The plain variant draws its own parallax image (below), not the fixed full-scope one.
$background_is_full      = ! $is_plain && $background_url && 'full' === $background_scope;
$background_is_secondary = $background_url && 'secondary' === $background_scope;

$root_classes = array( 'page-header' );
if ( $background_is_full ) {
	$root_classes[] = 'page-header--has-background';
}
if ( $animated_title ) {
	$root_classes[] = 'page-header--has-animated-title';
}
if ( 'service' === $header_variant ) {
	$root_classes[] = 'page-header--service';
}
if ( $is_plain ) {
	$root_classes[] = 'page-header--plain';
}
if ( $plain_has_image ) {
	$root_classes[] = 'page-header--plain-has-image';
}

$panel_classes = array( 'page-header__panel' );
if ( $background_is_secondary ) {
	$panel_classes[] = 'page-header__panel--has-background';
}
$panel_class_attr = esc_attr( implode( ' ', $panel_classes ) );

// The background photos are inline custom properties (no <style> keyed to a
// generated id), and the element id comes from cb_identityjs2026_block_wrapper()
// so the editor's HTML anchor is honoured instead of fighting a hardcoded id.
$wrapper_args = array( 'class' => implode( ' ', $root_classes ) );
if ( $background_is_full ) {
	$wrapper_args['style'] = '--bg-url: url(\'' . esc_url( $background_url ) . '\');';
} elseif ( $plain_has_image ) {
	$wrapper_args['style'] = '--hero-bg: url(' . esc_url_raw( $background_url ) . ');';
}
list( $instance_id, $wrapper_attributes ) = cb_identityjs2026_block_wrapper( $attributes, 'page-header-', $wrapper_args );

// Parallax hook (src/js/hero-parallax.js) for the plain variant's image.
$plain_attrs = $plain_has_image ? ' data-hero-parallax' : '';

// Secondary-only background: the panel's own custom property.
$panel_style_attr = $background_is_secondary ? ' style="' . esc_attr( '--panel-bg-url: url(\'' . esc_url( $background_url ) . '\');' ) . '"' : '';
?>
<?php if ( $plain_has_image ) : ?>
	<link rel="preload" as="image" href="<?php echo esc_url( $background_url ); ?>" fetchpriority="high">
<?php endif; ?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?><?php echo $plain_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from esc_attr()/esc_url_raw() above. ?>>
	<?php if ( $is_plain ) : ?>
		<?php if ( $title ) : ?>
			<div class="page-header__plain-title">
				<h1 class="id-container"><span class="hero-animate"><?php echo wp_kses_post( nl2br( esc_html( $title ) ) ); ?></span></h1>
			</div>
		<?php endif; ?>
		<?php if ( $intro_text ) : ?>
			<div class="id-container page-header__plain-body">
				<div class="page-header__intro page-header__plain-intro hero-animate hero-animate--delay-1 <?php echo esc_attr( $intro_text_font_size ); ?>"><?php echo do_shortcode( wp_kses_post( $intro_text ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses_post() sanitizes first; do_shortcode() only expands already-registered, trusted shortcodes against that sanitized result. ?></div>
			</div>
		<?php endif; ?>
	<?php else : ?>
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
				<?php // do_shortcode() enables e.g. [cb_button] typed directly into this RichText field — a plain button with no surrounding CTA panel, for a page (like Contact) that needs just one and shouldn't grow a bespoke field for it. ?>
				<div class="page-header__intro <?php echo esc_attr( $intro_text_font_size ); ?>"><?php echo do_shortcode( wp_kses_post( $intro_text ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses_post() sanitizes first; do_shortcode() only expands already-registered, trusted shortcodes against that sanitized result. ?></div>
			<?php endif; ?>
		</div>
	</div>
	<?php endif; ?>
	<?php if ( $is_plain ) : ?>
		<?php // Plain Hero has no secondary panel (its field is hidden in the editor). ?>
	<?php elseif ( 'text' === $secondary_panel_type && $secondary_text ) : ?>
		<div class="<?php echo $panel_class_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- already esc_attr()'d above. ?>"<?php echo $panel_style_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from esc_attr()/esc_url() above. ?>>
			<div class="id-container">
				<div class="page-header__panel-text <?php echo esc_attr( $secondary_text_font_size ); ?>"><?php echo do_shortcode( wp_kses_post( $secondary_text ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses_post() sanitizes first; do_shortcode() only expands already-registered, trusted shortcodes against that sanitized result. ?></div>
			</div>
		</div>
	<?php elseif ( 'quote' === $secondary_panel_type && $quote ) : ?>
		<div class="<?php echo $panel_class_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- already esc_attr()'d above. ?>"<?php echo $panel_style_attr; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from esc_attr()/esc_url() above. ?>>
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
