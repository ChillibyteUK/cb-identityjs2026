<?php
/**
 * Block template for FAQ.
 *
 * Built from Detail List — same section shell, same paired
 * question/answer rows, same RichText handling — plus a
 * queue_faq_schema() call so the page also emits a single aggregated
 * FAQPage JSON-LD block via inc/utilities.php's wp_footer-hooked
 * output_faq_schema(). See identity-global-block-spec.md's FAQ List
 * entry.
 *
 * No title field here — the old section_title becomes a separate CB
 * Section Title block placed immediately before this one, same migration
 * as Detail List's pre_title.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

// Same legacy-plain-text bridge as Detail List: a question saved before
// its field was RichText stays literal newlines until re-saved, so convert
// those to <br> while leaving real markup untouched. Local closure, not a
// named function: render.php is require()'d once per block instance, and a
// bare function declaration here would fatal on a second instance.
$cb_faq_legacy_br = function ( $value ) {
	if ( str_contains( $value, '<' ) ) {
		return $value;
	}
	return str_replace( array( "\r\n", "\r", "\n" ), '<br>', $value );
};

$faqs = $attributes['faqs'] ?? array();

$schema_items = array();
foreach ( $faqs as $item ) {
	$schema_items[] = array(
		'question' => $item['question'] ?? '',
		'answer'   => $item['answer'] ?? '',
	);
}
queue_faq_schema( $schema_items );

$faqs = array_values(
	array_filter(
		$faqs,
		function ( $row ) {
			return '' !== wp_strip_all_tags( (string) ( $row['question'] ?? '' ) );
		}
	)
);

if ( ! $faqs ) {
	return;
}

$section_classes = array( 'faq' );
if ( empty( $attributes['hasTopBorder'] ) ) {
	$section_classes[] = 'faq--no-top-border';
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $section_classes ) ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="id-container">
		<?php foreach ( $faqs as $index => $item ) : ?>
			<?php // question/answer are both real RichText HTML now — wp_kses_post() only, no esc_html() (would double-escape the markup RichText already produced). ?>
			<?php $question = $cb_faq_legacy_br( trim( (string) $item['question'] ) ); ?>
			<?php
			$answer          = trim( (string) ( $item['answer'] ?? '' ) );
			$has_answer      = '' !== wp_strip_all_tags( $answer );
			?>
			<div class="faq__item" data-animate="fade-up" data-animate-delay="<?php echo esc_attr( $index * 100 ); ?>">
				<h2 class="faq__question"><?php echo wp_kses_post( $question ); ?></h2>
				<?php if ( $has_answer ) : ?>
					<div class="faq__answer"><?php echo wp_kses_post( $answer ); ?></div>
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
	</div>
</section>
