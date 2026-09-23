<?php
/**
 * Block template for Stat Block.
 *
 * Built from Case Study Key Stats (cb-case-study-key-stats.php, confirmed
 * against cb-identitygroup2026's own _cb_case_study_key_stats.scss) +
 * cb-stats — see identity-global-block-spec.md's Stat Block entry.
 * Rebuilt as an unlimited stat/descriptor repeater (matches Case Study Key
 * Stats' own real saved content) with cb-stats' prefix/suffix/hero/CTA/
 * background-parallax options folded in as per-row/per-block fields, per
 * the spec's explicit recommendation.
 *
 * Real source's own `pre_title` (hardcoded "Key Stats" fallback) is
 * dropped — a Section Title block placed before this one replaces it, per
 * the spec's migration note (same treatment as every other block that had
 * its own pretitle — Work Index, Post Grid, etc).
 *
 * Simplification: no aos-fade-up scroll-reveal stagger on each stat item
 * (real source's own data-aos/data-aos-delay) — this theme has no AOS
 * library wired in yet, and this is a visual-polish detail, not layout.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$show_hero           = ! empty( $attributes['showHero'] );
$hero_title           = $attributes['heroTitle'] ?? '';
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

$root_classes = array( 'stat-block' );
if ( $show_hero && $hero_title ) {
	$root_classes[] = 'stat-block--hero';
}

$background_url   = $background_image_id ? wp_get_attachment_image_url( $background_image_id, 'full' ) : '';
$instance_id      = wp_unique_id( 'stat-block-' );

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
	<?php if ( $show_hero && $hero_title ) : ?>
		<h1 class="stat-block__hero-title">
			<div class="id-container"><?php echo esc_html( $hero_title ); ?></div>
		</h1>
	<?php endif; ?>

	<div class="stat-block__grid">
		<?php foreach ( $stats as $stat ) : ?>
			<?php
			$intro      = $stat['intro'] ?? '';
			$prefix     = $stat['prefix'] ?? '';
			$value      = $stat['value'] ?? '';
			$suffix     = $stat['suffix'] ?? '';
			$descriptor = $stat['descriptor'] ?? '';
			?>
			<div class="stat-block__item">
				<div class="id-container stat-block__item-inner">
					<div class="stat-block__value-col">
						<?php if ( $intro ) : ?>
							<div class="stat-block__intro"><?php echo esc_html( $intro ); ?></div>
						<?php endif; ?>
						<div class="stat-block__value"><?php echo esc_html( $prefix . $value . $suffix ); ?></div>
					</div>
					<?php if ( $descriptor ) : ?>
						<div class="stat-block__descriptor"><?php echo esc_html( $descriptor ); ?></div>
					<?php endif; ?>
				</div>
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
