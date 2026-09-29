<?php
/**
 * Block template for Leadership.
 *
 * Built from `cb-leadership` (cb-identitygroup2026/blocks/cb-leadership.php
 * + src/sass/theme/blocks/_cb_leadership.scss) — a health/idtravel-only
 * component with no existing identity styling; migrated here so identity
 * can use it too. See edit.js's own docblock for the full context on the
 * dark-lines/light-lines default flip.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$intro = trim( (string) ( $attributes['intro'] ?? '' ) );
$team  = array_values(
	array_filter(
		$attributes['team'] ?? array(),
		function ( $row ) {
			return '' !== trim( (string) ( $row['name'] ?? '' ) );
		}
	)
);

if ( ! $team ) {
	return;
}

// Native colour supports (background + text), skip-serialization — same
// established pattern as Push Panel/Section Title/Content Builder/Service
// Grid elsewhere in this theme.
$bg_slug = $attributes['backgroundColor'] ?? '';
$fg_slug = $attributes['textColor'] ?? '';

$section_classes = array( 'leadership' );
if ( $bg_slug ) {
	$section_classes[] = 'has-background';
	$section_classes[] = 'has-' . $bg_slug . '-background-color';
}
if ( $fg_slug ) {
	$section_classes[] = 'has-text-color';
	$section_classes[] = 'has-' . $fg_slug . '-color';
}

// Real source's own dynamic logic: a picked background colour's trailing
// digit decides dark vs light lines (≥600 → light, else dark; a
// non-numeric slug also reads as light). Real default (no colour picked)
// is dark-lines — correct for idtravel/coda/health's own light default
// page background, but identity's own default page background is dark
// (--col-bg: #0d0d0c), so an unpicked default here is LIGHT lines instead
// (confirmed directly by the user) — the one deliberate divergence from
// the real source's own literal default.
$line_class = 'light-lines';
if ( $bg_slug ) {
	if ( preg_match( '/(\d+)(?!.*\d)/', $bg_slug, $matches ) ) {
		$line_class = ( (int) $matches[1] >= 600 ) ? 'light-lines' : 'dark-lines';
	} else {
		$line_class = 'light-lines';
	}
}
$section_classes[] = $line_class;

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $section_classes ) ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="id-container">
		<?php // Real source outputs this unconditionally too — an empty intro
		// still reserves its own py-5 block of space, not content-gated. ?>
		<div class="leadership__intro"><?php echo wp_kses_post( wpautop( esc_html( $intro ) ) ); ?></div>
		<div class="leadership__grid">
			<?php foreach ( $team as $index => $row ) : ?>
				<?php
				$image_id = absint( $row['image'] ?? 0 );
				$name     = trim( (string) ( $row['name'] ?? '' ) );
				$role     = trim( (string) ( $row['role'] ?? '' ) );
				$bio      = trim( (string) ( $row['bio'] ?? '' ) );
				?>
				<?php // Real source outputs image/name/role/bio unconditionally, even
				// when empty — the role/name borders are part of the card's own
				// visual rhythm regardless of content completeness, not
				// content-gated. Matched exactly, not cleaned up with `if`s. ?>
				<div class="leadership__item" data-animate="fade-up" data-animate-delay="<?php echo esc_attr( $index * 100 ); ?>">
					<div class="leadership__image">
						<?php echo wp_get_attachment_image( $image_id, 'large' ); ?>
					</div>
					<div class="leadership__name"><?php echo esc_html( $name ); ?></div>
					<div class="leadership__role"><?php echo esc_html( $role ); ?></div>
					<div class="leadership__bio"><?php echo wp_kses_post( wpautop( esc_html( $bio ) ) ); ?></div>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
