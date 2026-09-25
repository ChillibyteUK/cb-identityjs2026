<?php
/**
 * Block template for File List.
 *
 * Built from cb-file-block — see identity-global-block-spec.md's File List
 * entry. `section_title` is deliberately not a field here any more; every
 * real source instance's pre_title becomes a separate CB Section Title
 * block placed immediately before this one instead, and the anchor id it
 * used to generate now comes from this block's own native "HTML anchor"
 * Advanced-panel setting (per the spec's migration note).
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$files = array_values(
	array_filter(
		$attributes['files'] ?? array(),
		function ( $row ) {
			return '' !== trim( (string) ( $row['title'] ?? '' ) );
		}
	)
);

if ( ! $files ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'file-list' ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<?php foreach ( $files as $index => $row ) : ?>
		<?php
		// Same href/target logic as the real source (cb-file-block.php): a
		// Page Link, when set, wins over a File, and only a File opens in a
		// new tab — not an editor choice, see this block's own edit.js.
		$page_link_url = trim( (string) ( $row['pageLink'] ?? '' ) );
		$file_id       = absint( $row['file'] ?? 0 );
		$file_url      = $file_id ? wp_get_attachment_url( $file_id ) : '';

		if ( $page_link_url ) {
			$href   = $page_link_url;
			$target = '_self';
		} elseif ( $file_url ) {
			$href   = $file_url;
			$target = '_blank';
		} else {
			$href   = '#';
			$target = '_self';
		}
		?>
		<a
			href="<?php echo esc_url( $href ); ?>"
			class="file-list__item"
			target="<?php echo esc_attr( $target ); ?>"
			<?php echo '_blank' === $target ? 'rel="noopener"' : ''; ?>
			data-animate="fade-up"
			data-animate-delay="<?php echo esc_attr( $index * 100 ); ?>"
		>
			<span class="file-list__item-title"><?php echo esc_html( trim( (string) $row['title'] ) ); ?></span>
			<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/arrow-wh.svg' ); ?>" width="65" height="60" alt="" class="file-list__item-icon" />
		</a>
	<?php endforeach; ?>
</section>
