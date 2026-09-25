<?php
/**
 * Block template for Contact Directory.
 *
 * Built from cb-contact-page — see this block's own edit.js docblock for
 * the full re-scoping rationale (title/intro/CTA dropped, LOCATIONS banner
 * moved to a separate Section Title instance, new_section/is_group flags
 * replaced by real nesting) and, critically, for why Email Groups and
 * Locations do NOT share the same group shape — confirmed directly
 * against identityglobal.com/contact/'s live markup:
 *
 * - Locations: a group IS one named office, with a nested list of its own
 *   addresses.
 * - Email Groups: a group is an UNNAMED divider boundary holding several
 *   independent name+email entries with no divider between them — only a
 *   new top-level group gets a new divider.
 *
 * Same real markup/behaviour as the source this was built from either
 * way: antispambot() on emails, tel: links stripped of whitespace.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$mode        = $attributes['mode'] ?? 'emails';
$groups_raw  = $attributes['groups'] ?? array();
$is_emails   = 'emails' === $mode;

if ( $is_emails ) {
	// A group has no name of its own here — keep it only if at least one
	// of its nested entries has a real email.
	$groups = array_values(
		array_filter(
			array_map(
				function ( $group ) {
					$entries = array_values(
						array_filter(
							$group['entries'] ?? array(),
							function ( $row ) {
								return '' !== trim( (string) ( $row['email'] ?? '' ) );
							}
						)
					);
					return $entries ? array( 'entries' => $entries ) : null;
				},
				$groups_raw
			)
		)
	);
} else {
	$groups = array_values(
		array_filter(
			$groups_raw,
			function ( $group ) {
				return '' !== trim( (string) ( $group['name'] ?? '' ) );
			}
		)
	);
}

if ( ! $groups ) {
	return;
}

// Same skip-serialization pattern as Section Title — block.json's
// supports.color uses __experimentalSkipSerialization, so
// get_block_wrapper_attributes() never auto-applies a background class on
// its own; read attributes.backgroundColor directly and build the class by
// hand instead. See Section Title's own render.php for why this is needed
// (this project's fields-form editor UI otherwise leaks the colour onto
// every field label, not just this block's front-end output).
// Defaults to 'primary-black' (identity's #0d0d0c, same hex as --col-bg)
// rather than a plain CSS background-color rule on .contact-directory —
// that would leave this block's default state fighting the exact same
// specificity WordPress's own has-*-background-color utility class has
// once an editor DOES pick a colour (e.g. Neutral 1100 for Locations),
// with no reliable way to guarantee which one wins the cascade. Routing
// both the default AND every editor choice through that one same
// mechanism sidesteps the question entirely.
$root_classes = array( 'contact-directory', 'contact-directory--' . $mode );
$bg_slug      = $attributes['backgroundColor'] ?? '';
if ( ! $bg_slug ) {
	$bg_slug = 'primary-black';
}
$root_classes[] = 'has-background';
$root_classes[] = 'has-' . $bg_slug . '-background-color';

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $root_classes ) ) );

/**
 * @param string $phone
 * @return string tel: href, whitespace stripped.
 */
if ( ! function_exists( 'cb_identityjs2026_contact_directory_tel_href' ) ) {
	function cb_identityjs2026_contact_directory_tel_href( $phone ) {
		return 'tel:' . preg_replace( '/\s+/', '', $phone );
	}
}
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="id-container">
		<?php foreach ( $groups as $group ) : ?>
			<div class="contact-directory__group">
				<?php if ( $is_emails ) : ?>
					<?php foreach ( $group['entries'] as $entry ) : ?>
						<?php
						$name  = trim( (string) ( $entry['name'] ?? '' ) );
						$email = antispambot( trim( (string) $entry['email'] ) );
						$phone = trim( (string) ( $entry['phone'] ?? '' ) );
						?>
						<div class="contact-directory__entry">
							<h2 class="contact-directory__entry-name"><?php echo esc_html( $name ); ?></h2>
							<div class="contact-directory__entry-detail">
								<a class="contact-directory__email" href="mailto:<?php echo esc_attr( $email ); ?>"><?php echo esc_html( $email ); ?></a>
								<?php if ( $phone ) : ?>
									<a class="contact-directory__phone" href="<?php echo esc_attr( cb_identityjs2026_contact_directory_tel_href( $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a>
								<?php endif; ?>
							</div>
						</div>
					<?php endforeach; ?>
				<?php else : ?>
					<?php
					$addresses = array_values(
						array_filter(
							$group['addresses'] ?? array(),
							function ( $row ) {
								return '' !== trim( (string) ( $row['address'] ?? '' ) );
							}
						)
					);
					?>
					<h2 class="contact-directory__group-name"><?php echo esc_html( trim( (string) $group['name'] ) ); ?></h2>
					<div class="contact-directory__addresses">
						<?php foreach ( $addresses as $address_row ) : ?>
							<?php
							$title   = trim( (string) ( $address_row['title'] ?? '' ) );
							$address = trim( (string) $address_row['address'] );
							$phone   = trim( (string) ( $address_row['phone'] ?? '' ) );
							?>
							<div class="contact-directory__address-row">
								<?php if ( $title ) : ?>
									<strong class="contact-directory__address-title"><?php echo esc_html( $title ); ?></strong>
								<?php endif; ?>
								<div class="contact-directory__address"><?php echo wp_kses_post( nl2br( esc_html( $address ) ) ); ?></div>
								<?php if ( $phone ) : ?>
									<a class="contact-directory__phone" href="<?php echo esc_attr( cb_identityjs2026_contact_directory_tel_href( $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a>
								<?php endif; ?>
							</div>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
	</div>
</section>
