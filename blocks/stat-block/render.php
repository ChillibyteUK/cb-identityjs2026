<?php
/**
 * Block template for Stat Block.
 *
 * Built from Case Study Key Stats (cb-case-study-key-stats.php, confirmed
 * against cb-identitygroup2026's own _cb_case_study_key_stats.scss) +
 * cb-stats — see identity-global-block-spec.md's Stat Block entry.
 *
 * `layout` replaces the first version's single merged field set — confirmed
 * live against a real case-study usage that the extra intro/prefix/suffix
 * fields were dead weight for the common case (a plain stat/descriptor
 * list, not a counter):
 * - stack: Case Study Key Stats' real shape — full-width rows.
 * - column: cb-stats' counter shape — card grid, full field set. Rebuilt
 *   as a responsive card grid rather than a pixel-precise port of
 *   cb-stats' own fixed 4-slot markup (not read in this pass) — flagged
 *   as a simplification, revisit if cb-stats' exact layout is needed.
 *
 * `pre_title`'s hardcoded "Key Stats" fallback (real source) is dropped —
 * left blank by default, same as every other block that had one (Work
 * Index, Post Grid) — but kept as a real optional field here (not fully
 * migrated to a separate Section Title block) since it's confirmed live to
 * still visually read as part of this block, not a standalone section.
 *
 * The `::before` background gets its own dark scrim layer, not just the
 * bare photo — confirmed live that cb-stats/Key Stats' own translucent
 * rgba(255,255,255,.1) panel alone doesn't hold up against a busy/colourful
 * background image; text needs guaranteed contrast regardless of whatever
 * image gets picked.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$layout               = 'column' === ( $attributes['layout'] ?? 'stack' ) ? 'column' : 'stack';
$pre_title            = $attributes['preTitle'] ?? '';
$background_image_id  = absint( $attributes['backgroundImageId'] ?? 0 );
$stats                = is_array( $attributes['stats'] ?? null ) ? $attributes['stats'] : array();
$cta_message          = $attributes['ctaMessage'] ?? '';
$cta_link_url         = $attributes['ctaLinkUrl'] ?? '';
$cta_link_text        = $attributes['ctaLinkText'] ?? '';
$cta_link_target      = ! empty( $attributes['ctaLinkTarget'] );

$stats = array_values(
	array_filter(
		$stats,
		static function ( $stat ) {
			return ! empty( $stat['value'] ) || ! empty( $stat['descriptor'] );
		}
	)
);

if ( ! $stats ) {
	return;
}

$root_classes = array( 'stat-block', 'stat-block--' . $layout );

$background_url = $background_image_id ? wp_get_attachment_image_url( $background_image_id, 'full' ) : '';
$instance_id     = wp_unique_id( 'stat-block-' );

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $root_classes ) ) );
?>
<?php if ( $background_url ) : ?>
	<style>
		#<?php echo esc_attr( $instance_id ); ?> {
			--stat-block-bg-url: url('<?php echo esc_url( $background_url ); ?>');
		}
	</style>
<?php endif; ?>
<section id="<?php echo esc_attr( $instance_id ); ?>" <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<?php if ( $pre_title ) : ?>
		<div class="stat-block__pre-title">
			<div class="id-container"><?php echo esc_html( $pre_title ); ?></div>
		</div>
	<?php endif; ?>

	<div class="stat-block__grid">
		<?php foreach ( $stats as $stat ) : ?>
			<?php
			$intro      = 'column' === $layout ? ( $stat['intro'] ?? '' ) : '';
			$prefix     = 'column' === $layout ? ( $stat['prefix'] ?? '' ) : '';
			$value      = $stat['value'] ?? '';
			$suffix     = 'column' === $layout ? ( $stat['suffix'] ?? '' ) : '';
			$descriptor = $stat['descriptor'] ?? '';
			?>
			<div class="stat-block__item">
				<?php if ( $intro ) : ?>
					<div class="stat-block__intro"><?php echo esc_html( $intro ); ?></div>
				<?php endif; ?>
				<div class="stat-block__value"><?php echo esc_html( $prefix . $value . $suffix ); ?></div>
				<?php if ( $descriptor ) : ?>
					<div class="stat-block__descriptor"><?php echo esc_html( $descriptor ); ?></div>
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
	</div>

	<?php if ( $cta_message || ( $cta_link_url && $cta_link_text ) ) : ?>
		<div class="stat-block__cta-row">
			<div class="id-container stat-block__cta-row-inner">
				<?php if ( $cta_message ) : ?>
					<div class="stat-block__cta-message"><?php echo esc_html( $cta_message ); ?></div>
				<?php endif; ?>
				<?php if ( $cta_link_url && $cta_link_text ) : ?>
					<a
						href="<?php echo esc_url( $cta_link_url ); ?>"
						class="id-button stat-block__cta"
						<?php echo $cta_link_target ? ' target="_blank" rel="noopener"' : ''; ?>
					>
						<?php echo esc_html( $cta_link_text ); ?>
					</a>
				<?php endif; ?>
			</div>
		</div>
	<?php endif; ?>
</section>
