<?php
/**
 * Block template for Innovation Header.
 *
 * Built from `cb-innovation-header` — see identity-global-block-spec.md's
 * Page Header entry (this block's own note explains why it's separate, not
 * folded into Page Header) and edit.js's own docblock for the full context.
 * Confirmed against both cb-identity2025 and cb-identitygroup2026 (near-
 * identical — only a handful of coda additions: intro-text font-weight,
 * quote line-height/letter-spacing/text-wrap) plus live
 * identityglobal.com/innovation/ (2026-09-22), which is where the h1's
 * real font-weight was settled: the SCSS literally says
 * `font-weight: var(--fw-semi)` (500) in both themes, no identity-specific
 * override found anywhere, but live computed style is 450 (fw-book) — an
 * unexplained live-vs-source discrepancy, trusted here since live
 * production is this project's own highest-priority source when the two
 * disagree and no documented reason for the gap was found.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$title       = trim( (string) ( $attributes['title'] ?? '' ) );
$intro_text  = trim( (string) ( $attributes['introText'] ?? '' ) );
$background_id = absint( $attributes['backgroundId'] ?? 0 );
$quote       = trim( (string) ( $attributes['quote'] ?? '' ) );
$author      = trim( (string) ( $attributes['author'] ?? '' ) );
$company     = trim( (string) ( $attributes['company'] ?? '' ) );

$background_url = $background_id ? wp_get_attachment_image_url( $background_id, 'full' ) : '';

$style = $background_url ? sprintf( '--_bg-url: url(%s);', esc_url_raw( $background_url ) ) : '';

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'innovation-header' ) );
?>
<section
	<?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>
	<?php echo $style ? 'style="' . esc_attr( $style ) . '"' : ''; ?>
>
	<div class="innovation-header__top">
		<div class="innovation-header__overlay"></div>
		<div class="id-container">
			<?php if ( $title ) : ?>
				<h1 class="innovation-header__title"><?php echo esc_html( $title ); ?></h1>
			<?php endif; ?>
			<?php if ( $intro_text ) : ?>
				<p class="innovation-header__intro-text"><?php echo wp_kses_post( $intro_text ); ?></p>
			<?php endif; ?>
		</div>
	</div>
	<?php if ( $quote ) : ?>
		<div class="innovation-header__quote-wrapper">
			<div class="innovation-header__quote-overlay"></div>
			<div class="id-container">
				<div class="innovation-header__quote">&ldquo;<?php echo esc_html( $quote ); ?>&rdquo;</div>
				<?php if ( $author ) : ?>
					<div class="innovation-header__author"><?php echo esc_html( $author ); ?></div>
				<?php endif; ?>
				<?php if ( $company ) : ?>
					<div class="innovation-header__company"><?php echo esc_html( $company ); ?></div>
				<?php endif; ?>
			</div>
		</div>
	<?php endif; ?>
</section>
