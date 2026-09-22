<?php
/**
 * Block template for Detail List.
 *
 * Built from About Detail, Service Detail (paired layout — confirmed live
 * on identityglobal.com/about/'s "WHY CHOOSE IDENTITY?" section: colours,
 * spacing, and both fs-700/fs-400 rungs matched to the pixel), and
 * cb-details.php (bullet_list layout — no live instance to verify against,
 * sourced from _cb_details.scss instead) — see
 * identity-global-block-spec.md's Detail List entry.
 *
 * pre_title is deliberately not a field here any more — every real source
 * block's pre_title becomes a separate CB Section Title block placed
 * immediately before this one instead (per the spec's migration note).
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

// A row's title now comes straight out of RichText, which for NEW edits
// always produces real markup (<br>, inline formatting). Rows saved before
// that (plain text, e.g. "When you work with Identity,\nyou can expect...",
// real literal newlines) never got a markup-producing edit and stay that
// way in the saved attribute until someone touches that field again — this
// converts a legacy literal newline to a real <br> so the front end doesn't
// silently lose the line break nl2br() used to handle, leaving anything
// that already looks like markup untouched. A local closure, not a named
// function: render.php is require()'d once per block instance on the page,
// and a bare function declaration here would fatal on a second instance.
$cb_detail_list_legacy_br = function ( $value ) {
	if ( str_contains( $value, '<' ) ) {
		return $value;
	}
	return str_replace( array( "\r\n", "\r", "\n" ), '<br>', $value );
};

$render_style = $attributes['renderStyle'] ?? 'paired';
$intro_row    = ! empty( $attributes['introRow'] );

$details = array_values(
	array_filter(
		$attributes['details'] ?? array(),
		function ( $row ) {
			return '' !== wp_strip_all_tags( (string) ( $row['title'] ?? '' ) );
		}
	)
);

if ( ! $details ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'detail-list' ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="id-container">
		<?php foreach ( $details as $index => $row ) : ?>
			<?php // title/description are both real RichText HTML now — wp_kses_post() only, no esc_html() (would double-escape the markup RichText already produced). ?>
			<?php $title = $cb_detail_list_legacy_br( trim( (string) $row['title'] ) ); ?>

			<?php if ( 'bullet_list' === $render_style ) : ?>
				<div class="detail-list__item detail-list__item--bullet">
					<?php echo wp_kses_post( $title ); ?>
				</div>
			<?php else : ?>
				<?php
				$description     = trim( (string) ( $row['description'] ?? '' ) );
				$has_description = '' !== wp_strip_all_tags( $description );
				$is_intro        = $intro_row && 0 === $index && ! $has_description;

				$item_classes = array( 'detail-list__item' );
				if ( $is_intro ) {
					$item_classes[] = 'detail-list__item--intro';
				}
				?>
				<div class="<?php echo esc_attr( implode( ' ', $item_classes ) ); ?>" data-animate="fade-up" data-animate-delay="<?php echo esc_attr( $index * 100 ); ?>">
					<h2 class="detail-list__title"><?php echo wp_kses_post( $title ); ?></h2>
					<?php if ( $has_description ) : ?>
						<div class="detail-list__description"><?php echo wp_kses_post( $description ); ?></div>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		<?php endforeach; ?>
	</div>
</section>
