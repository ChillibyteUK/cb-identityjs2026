<?php
/**
 * Block template for Child Page Nav.
 *
 * Built from cb-services-nav, generalised via `parentPage` instead of the
 * old hardcoded-to-"services" lookup — see identity-global-block-spec.md's
 * Child Page Nav entry. `title` is optional (e.g. "SERVICES") — confirmed
 * against the real block's own header bar treatment (translucent
 * background, accent-coloured text), reinstated as an editable field.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$parent_page_id = absint( $attributes['parentPage'] ?? 0 );
$title           = trim( $attributes['title'] ?? '' );

if ( ! $parent_page_id ) {
	return;
}

$child_pages = get_pages(
	array(
		'child_of'    => $parent_page_id,
		'sort_column' => 'menu_order',
		'sort_order'  => 'ASC',
	)
);

if ( ! $child_pages ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'child-page-nav' ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="child-page-nav__container">
		<?php if ( $title ) : ?>
			<h2 class="child-page-nav__header">
				<div class="id-container"><?php echo esc_html( $title ); ?></div>
			</h2>
		<?php endif; ?>
		<?php
		foreach ( $child_pages as $index => $child_page ) {
			if ( get_the_ID() === $child_page->ID ) {
				continue;
			}
			?>
			<a href="<?php echo esc_url( get_permalink( $child_page->ID ) ); ?>" class="child-page-nav__item">
				<div class="id-container child-page-nav__item-inner" data-animate="fade-up" data-animate-delay="<?php echo esc_attr( $index * 100 ); ?>">
					<h3 class="child-page-nav__item-title"><?php echo esc_html( get_the_title( $child_page->ID ) ); ?></h3>
					<span class="child-page-nav__item-icon"><?php echo get_icon( 'arrow-n600' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_icon() reads a trusted local theme file, not user input. ?></span>
				</div>
			</a>
			<?php
		}
		?>
	</div>
</section>
