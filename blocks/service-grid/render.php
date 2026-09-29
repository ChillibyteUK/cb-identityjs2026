<?php
/**
 * Block template for Service Grid.
 *
 * Built from `cb-service-grid` (cb-identitygroup2026/blocks/cb-service-grid.php)
 * — a health/idtravel-only component with no existing identity styling;
 * migrated here so identity can use it too. See edit.js's own docblock.
 *
 * The 6-item mosaic positioning math (grid-column/grid-row per item,
 * cycling every 6 items, offset by `startRow`) is ported directly from the
 * real PHP's own switch statement, not reinterpreted — this is exact,
 * confirmed layout logic, not a value to re-derive.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$items     = $attributes['items'] ?? array();
$start_row = (int) ( $attributes['startRow'] ?? 1 );
if ( $start_row < 1 || $start_row > 3 ) {
	$start_row = 1;
}

$items = array_values(
	array_filter(
		$items,
		function ( $row ) {
			return ! empty( $row['image'] ) || '' !== trim( (string) ( $row['title'] ?? '' ) );
		}
	)
);

if ( ! $items ) {
	return;
}

// Native colour supports (background + text), skip-serialization — same
// reasoning/pattern as Push Panel/Section Title/Content Builder elsewhere
// in this theme: get_block_wrapper_attributes() would otherwise apply
// these to this block's own editor-form wrapper, not just the front end.
$bg_slug = $attributes['backgroundColor'] ?? '';
$fg_slug = $attributes['textColor'] ?? '';

$section_classes = array( 'service-grid' );
if ( $bg_slug ) {
	$section_classes[] = 'has-background';
	$section_classes[] = 'has-' . $bg_slug . '-background-color';
}
if ( $fg_slug ) {
	$section_classes[] = 'has-text-color';
	$section_classes[] = 'has-' . $fg_slug . '-color';
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $section_classes ) ) );

/**
 * Returns this item's grid-column/grid-row inline styles for both its
 * image and body, per the real source's own 6-item repeating pattern.
 *
 * @param int $item_index  0-based index within $items.
 * @param int $start_row   1-3, from the startRow field.
 * @return array{image: string, body: string, alignEnd: bool}
 */
if ( ! function_exists( 'cb_identityjs2026_service_grid_position' ) ) {
	function cb_identityjs2026_service_grid_position( $item_index, $start_row ) {
		$pattern_offset = ( $start_row - 1 ) * 2;
		$layout_index    = $item_index + $pattern_offset;
		$pattern_index   = $layout_index % 6;
		$cycle_index     = (int) floor( $layout_index / 6 );
		$base_row        = ( $cycle_index * 5 ) + 1 - $pattern_offset;
		$align_end       = in_array( $pattern_index, array( 2, 3, 4 ), true );

		switch ( $pattern_index ) {
			case 0:
				$image = sprintf( 'grid-column:1 / 3; grid-row:%1$d / span 2;', $base_row );
				$body  = sprintf( 'grid-column:3 / 4; grid-row:%1$d / span 1; --sg-justify:flex-start;', $base_row );
				break;
			case 1:
				$image = sprintf( 'grid-column:3 / 4; grid-row:%1$d / span 1;', $base_row + 1 );
				$body  = sprintf( 'grid-column:4 / 5; grid-row:%1$d / span 1; --sg-justify:flex-start;', $base_row + 1 );
				break;
			case 2:
				$image = sprintf( 'grid-column:2 / 3; grid-row:%1$d / span 1;', $base_row + 2 );
				$body  = sprintf( 'grid-column:1 / 2; grid-row:%1$d / span 1; --sg-justify:flex-start;', $base_row + 2 );
				break;
			case 3:
				$image = sprintf( 'grid-column:3 / 5; grid-row:%1$d / span 2;', $base_row + 2 );
				$body  = sprintf( 'grid-column:2 / 3; grid-row:%1$d / span 1; --sg-justify:flex-end;', $base_row + 3 );
				break;
			case 4:
				$image = sprintf( 'grid-column:2 / 3; grid-row:%1$d / span 1;', $base_row + 4 );
				$body  = sprintf( 'grid-column:1 / 2; grid-row:%1$d / span 1; --sg-justify:flex-start;', $base_row + 4 );
				break;
			default:
				$image = sprintf( 'grid-column:3 / 4; grid-row:%1$d / span 1;', $base_row + 4 );
				$body  = sprintf( 'grid-column:4 / 5; grid-row:%1$d / span 1; --sg-justify:flex-start;', $base_row + 4 );
				break;
		}

		return array( 'image' => $image, 'body' => $body, 'alignEnd' => $align_end );
	}
}
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="id-container">
		<div class="service-grid__grid">
			<?php foreach ( $items as $item_index => $row ) : ?>
				<?php
				$position     = cb_identityjs2026_service_grid_position( $item_index, $start_row );
				$image_id     = absint( $row['image'] ?? 0 );
				$title        = trim( (string) ( $row['title'] ?? '' ) );
				$content      = trim( (string) ( $row['content'] ?? '' ) );
				$body_classes = array( 'service-grid__body' );
				if ( $position['alignEnd'] ) {
					$body_classes[] = 'service-grid__body--align-end';
				}
				?>
				<div class="service-grid__item" data-animate="fade-up" data-animate-delay="<?php echo esc_attr( $item_index * 100 ); ?>">
					<?php if ( $image_id ) : ?>
						<?php
						echo wp_get_attachment_image(
							$image_id,
							'large',
							false,
							array(
								'class' => 'service-grid__image',
								'style' => $position['image'],
							)
						);
						?>
					<?php endif; ?>
					<div class="<?php echo esc_attr( implode( ' ', $body_classes ) ); ?>" style="<?php echo esc_attr( $position['body'] ); ?>">
						<?php if ( $title ) : ?>
							<div class="service-grid__title"><?php echo esc_html( $title ); ?></div>
						<?php endif; ?>
						<?php if ( $content ) : ?>
							<div class="service-grid__content"><?php echo wp_kses_post( wpautop( esc_html( $content ) ) ); ?></div>
						<?php endif; ?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
