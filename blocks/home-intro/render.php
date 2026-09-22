<?php
/**
 * Block template for Home Intro.
 *
 * Built from cb-brand-title-text — see identity-global-block-spec.md's Home
 * Intro entry. Real source wraps this in Bootstrap utility classes
 * (row/col-md-6/g-5/ps-5 etc.) — deliberately not replicated here; this
 * project's whole class-naming rule (see the block spec's "Class naming
 * convention" section) is exactly "one root class + BEM children, no
 * utility soup" — the same 2-column layout is achieved in
 * src/blocks/home-intro.css instead.
 *
 * pre_title is the block's real <h1> — title (the big animated text) is
 * deliberately NOT a heading tag, confirmed against the real source.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$pre_title       = $attributes['preTitle'] ?? '';
$title           = $attributes['title'] ?? '';
$content_heading = $attributes['contentHeading'] ?? '';
$content         = $attributes['content'] ?? '';
$link_text       = $attributes['linkText'] ?? '';
$link_url        = $attributes['linkUrl'] ?? '';
$link_target     = ! empty( $attributes['linkTarget'] );

$has_content = $content_heading || $content || ( $link_url && $link_text );

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'home-intro' ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<?php if ( $pre_title ) : ?>
		<div class="home-intro__pre-title">
			<div class="id-container">
				<h1><?php echo esc_html( $pre_title ); ?></h1>
			</div>
		</div>
	<?php endif; ?>

	<div class="home-intro__row id-container">
		<div class="home-intro__title-col">
			<div class="home-intro__title">
				<?php
				$lines = array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', trim( $title ) ) ) );
				$n     = 0;
				foreach ( $lines as $line ) {
					++$n;
					if ( $n > 3 ) {
						break; // the reveal animation only has bar/rotation sets for 3 lines — a real constraint of the source, not added here.
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
		</div>

		<?php if ( $has_content ) : ?>
			<div class="home-intro__content-col">
				<?php if ( $content_heading ) : ?>
					<div class="home-intro__content-heading"><?php echo esc_html( $content_heading ); ?></div>
				<?php endif; ?>
				<?php if ( $content ) : ?>
					<div class="home-intro__content"><?php echo wp_kses_post( $content ); ?></div>
				<?php endif; ?>
				<?php if ( $link_url && $link_text ) : ?>
					<div class="home-intro__link">
						<a href="<?php echo esc_url( $link_url ); ?>" class="id-button"<?php echo $link_target ? ' target="_blank" rel="noopener"' : ''; ?>>
							<?php echo esc_html( $link_text ); ?>
						</a>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>
</section>
