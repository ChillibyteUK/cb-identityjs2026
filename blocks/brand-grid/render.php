<?php
/**
 * Block template for Brand Grid.
 *
 * Built from Our Brands — see identity-global-block-spec.md's Brand Grid
 * entry. Confirmed live on identityglobal.com/about/'s real "OUR BRANDS"
 * section (1920px and ~500px viewports) — the real markup has diverged
 * from both local reference themes, so this follows the live DOM/computed
 * styles, not cb-identity2025's own PHP (still trusted for the column-
 * count math below, which was independently confirmed live: 7 real
 * brands produces col-xl-8/col-xxl-3 on the closing cell, exactly
 * matching this formula).
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$intro_text   = trim( (string) ( $attributes['introText'] ?? '' ) );
$closing_text = trim( (string) ( $attributes['closingText'] ?? '' ) );

// Row validity + the field key ('logo', not 'logoId') both caught live
// (2026-09-22): RepeaterField's image field type stores the attachment id
// under the field's own given name directly, not name+"Id" — a real bug
// here, not a naming convention difference, since it silently meant every
// row's logo read as empty regardless of what was actually selected. Only
// the logo is required — matches the real source's own requirement
// exactly (cb-our-brands.php only skips a row missing brand_logo or the
// link field's own array; a present-but-empty link URL there still
// renders, just as a non-clickable div instead of an <a> — replicated
// below rather than treating a missing link as reason to drop the row).
$brands = array_values(
	array_filter(
		$attributes['brands'] ?? array(),
		function ( $row ) {
			return ! empty( $row['logo'] );
		}
	)
);

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'brand-grid' ) );

// Closing-cell span math: this project uses CSS Grid + BEM classes, not
// literal Bootstrap col-* utility classes in markup (established
// convention — see Detail List/Push Panel), so this is re-expressed as a
// "span out of N columns" at each breakpoint (2/3/4) rather than the real
// source's "span out of 12" — verified equivalent against the real,
// confirmed-live 7-brand example (col-xl-8/col-xxl-3 in the real 12-col
// system = span 2 of 3 / span 1 of 4 here, both checked to match).
//
// $display_count is the BRAND count only, not including the closing card
// itself — matches the real source's own $display_count exactly (it only
// ever counts rows with both brand_logo and link). Caught in testing: an
// earlier version of this added +1 for the closing card, which throws the
// whole remainder calculation off (the closing card fills the remainder,
// it can't also count toward creating it).
$display_count = count( $brands );
$md_rem        = $display_count % 2;
$xl_rem        = $display_count % 3;
$xxl_rem       = $display_count % 4;
$last_span_md  = 0 === $md_rem ? 2 : ( 2 - $md_rem );
$last_span_xl  = 0 === $xl_rem ? 3 : ( 3 - $xl_rem );
$last_span_xxl = 0 === $xxl_rem ? 4 : ( 4 - $xxl_rem );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<?php if ( $intro_text ) : ?>
		<div class="id-container">
			<div class="brand-grid__intro"><?php echo wp_kses_post( $intro_text ); ?></div>
		</div>
	<?php endif; ?>
	<div class="id-container">
		<div class="brand-grid__row">
			<?php foreach ( $brands as $row ) : ?>
				<?php
				$logo_id   = absint( $row['logo'] );
				$name      = trim( (string) ( $row['name'] ?? '' ) );
				// RepeaterField's link field type stores the URL under the
				// field's own given name directly ('link'), and the title
				// under name+"Text" ('linkText') — same class of key
				// mismatch as the logo bug above, caught the same way (real
				// saved content already has the correct keys; only this
				// read side was wrong).
				$link_url    = trim( (string) ( $row['link'] ?? '' ) );
				$link_text   = trim( (string) ( $row['linkText'] ?? '' ) );
				$link_target = ! empty( $row['linkTarget'] );
				$tag         = $link_url ? 'a' : 'div';
				?>
				<<?php echo esc_attr( $tag ); ?>
					<?php if ( $link_url ) : ?>
						href="<?php echo esc_url( $link_url ); ?>"<?php echo $link_target ? ' target="_blank" rel="noopener"' : ''; ?>
					<?php endif; ?>
					class="brand-grid__card"
				>
					<div class="brand-grid__card-front">
						<?php
						echo wp_get_attachment_image(
							$logo_id,
							'full',
							false,
							array(
								'class' => 'brand-grid__logo',
								'alt'   => esc_attr( $name ),
							)
						);
						?>
					</div>
					<div class="brand-grid__card-back">
						<?php if ( $name ) : ?>
							<div class="brand-grid__name"><?php echo esc_html( $name ); ?></div>
						<?php endif; ?>
						<?php if ( $link_text ) : ?>
							<div class="brand-grid__strap">
								<?php echo esc_html( $link_text ); ?>
								<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/arrow-wh.svg' ); ?>" width="23" height="21" alt="" />
							</div>
						<?php endif; ?>
					</div>
				</<?php echo esc_attr( $tag ); ?>>
			<?php endforeach; ?>
			<?php if ( $closing_text ) : ?>
				<div class="brand-grid__last" style="--brand-grid-last-span-md: <?php echo esc_attr( $last_span_md ); ?>; --brand-grid-last-span-xl: <?php echo esc_attr( $last_span_xl ); ?>; --brand-grid-last-span-xxl: <?php echo esc_attr( $last_span_xxl ); ?>;">
					<?php echo esc_html( $closing_text ); ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
