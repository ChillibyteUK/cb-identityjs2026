<?php
/**
 * Block template for Content Builder.
 *
 * Built from `cb-content-grid-v2` — see identity-global-block-spec.md's
 * Content Builder entry and content-builder-research.md for the full real-
 * source audit (cb-identity2025 vs cb-identitygroup2026, several genuine
 * divergences found and decided on deliberately, noted inline below where
 * they matter). Built against coda's fuller 13-module-type set.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$rows                = $attributes['rows'] ?? array();
$background_image_id = absint( $attributes['backgroundImageId'] ?? 0 );
$section_classes     = array( 'content-builder' );

// Heading colour (native supports.color.text, skip-serialization — same
// manual-class pattern as Section Title's own render.php, since
// __experimentalSkipSerialization means get_block_wrapper_attributes()
// never auto-applies it). Deliberately scoped to HEADING modules only (see
// ".content-builder.has-text-color .content-builder__h1/h2/h3 { color:
// inherit; }" in content-builder.css) — per explicit instruction, this is
// a manual per-instance override for the heading specifically (e.g. Purple
// 900 for "Result" on a light purple-200 background), independent of the
// BODY text colour below, which is automatic, not manual.
$text_slug = $attributes['textColor'] ?? '';
if ( $text_slug ) {
	$section_classes[] = 'has-text-color';
	$section_classes[] = 'has-' . $text_slug . '-color';
}

// Background colour (native supports.color.background, skip-serialization —
// same reasoning/pattern as Push Panel/Section Title elsewhere in this
// theme). Its slug also drives two other things below: the real source's
// own dark-lines/light-lines divider colour logic, and (new) automatic
// body-text contrast — neither is a manual control, both are derived from
// the same digit read off the slug.
$bg_slug  = $attributes['backgroundColor'] ?? '';
$bg_digit = 0;
if ( $bg_slug ) {
	$section_classes[] = 'has-background';
	$section_classes[] = 'has-' . $bg_slug . '-background-color';

	if ( preg_match( '/(\d+)(?!.*\d)/', $bg_slug, $bg_digit_match ) ) {
		$bg_digit = (int) $bg_digit_match[1];
	}
}

// Divider-line colour — ported exactly from cb-content-grid-v2.php
// (cb-identitygroup2026/blocks/cb-content-grid-v2.php:32-43), confirmed via
// its three real, distinct branches: (1) no backgroundColor attribute at
// all → dark-lines (the plain default); (2) a backgroundColor slug ending
// in a digit → light-lines if that digit is >= 600, else dark-lines; (3) a
// backgroundColor slug set but with NO digit at all (e.g. "primary-black")
// → light-lines. Confirmed live: identityglobal.com/work/arm-everywhere/'s
// "Approach" section uses has-primary-black-background-color and renders
// light lines — case (3), previously collapsed into case (1)'s dark-lines
// here by mistake (both hit bg_digit=0), which is what made lines
// invisible on a dark background with no colour explicitly set.
$line_class = 'content-builder--dark-lines';
if ( $bg_slug ) {
	if ( $bg_digit ) {
		$line_class = ( $bg_digit >= 600 ) ? 'content-builder--light-lines' : 'content-builder--dark-lines';
	} else {
		$line_class = 'content-builder--light-lines';
	}
}
$section_classes[] = $line_class;

// Body-text contrast — automatic, not a manual control (per explicit
// instruction: "text color is light on dark backgrounds and dark on light
// backgrounds"). This project's own colour slugs follow a Tailwind-style
// ramp (low digit = light shade, e.g. purple-100 #f1f0ff; high digit =
// dark shade, e.g. purple-900 #2f13ba — confirmed in tokens/identity.css),
// so a digit under 600 means a LIGHT background needing dark text; 600+ or
// no digit at all (a named dark colour like "primary-black", or no
// background set at all, which on this dark-by-default brand still means
// a dark background) all mean a DARK background needing light text — the
// existing default. Only the "light background, low digit" case needs an
// override.
$section_classes[] = ( $bg_digit && $bg_digit < 600 ) ? 'content-builder--text-dark' : 'content-builder--text-light';

$style_declarations = array();

// Driven via a dedicated custom property rather than the "has-text-color
// has-{slug}-color" class pair cascading down to headings by inheritance —
// that approach broke once body text (below) needed to win the SAME
// property on the SAME root element at equal specificity: whichever of
// the two rules loaded last would leak into the other. A custom property
// read directly by the heading rule (content-builder.css) sidesteps the
// whole race. --wp--preset--color--{slug} is WP core's own global custom
// property for a palette colour, always defined at :root regardless of
// which element carries the has-*-color class.
if ( $text_slug ) {
	$style_declarations[] = sprintf( '--content-builder-heading-color: var(--wp--preset--color--%s);', esc_attr( $text_slug ) );
}

$background_url = $background_image_id ? wp_get_attachment_image_url( $background_image_id, 'full' ) : '';
if ( $background_url ) {
	$style_declarations[] = sprintf( '--_bg-url: url(%s);', esc_url_raw( $background_url ) );
	$section_classes[]    = 'content-builder--has-background-image';
}

$section_style = implode( ' ', $style_declarations );

// Real ACF-block source reads $block['anchor']/$block['id'] (both real,
// documented ACF Blocks conventions — coda's own 2026-08-28 fix prefers
// 'anchor' over 'id' specifically to avoid a collision across a duplicated
// block instance, see content-builder-research.md §3). This is a native
// Gutenberg block, not an ACF Block: $block here is a WP_Block OBJECT, not
// an array, and this project's other blocks don't read it at all — plain
// wp_unique_id() is what Feature Overlay etc. already use, matching that
// same established pattern instead of porting the ACF-specific mechanism.
$instance_id = wp_unique_id( 'content-builder-' );

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $section_classes ) ) );

/**
 * One newline-per-item textarea value into a list of trimmed, non-empty
 * lines — this block's own equivalent of the real source's shared
 * `cb_list()` helper (not available in this theme; behaviour matched
 * directly instead of ported line-for-line).
 *
 * @param string $value
 * @return string[]
 */
if ( ! function_exists( 'cb_identityjs2026_content_builder_list_lines' ) ) {
	function cb_identityjs2026_content_builder_list_lines( $value ) {
		$lines = preg_split( '/\r\n|\r|\n/', (string) $value );
		return array_values( array_filter( array_map( 'trim', $lines ), 'strlen' ) );
	}
}

/**
 * A module's fs-* and fw-* select values as a class string — "fw-book" and
 * "fw-semibold" both resolve to the same real 500 weight via a block-local
 * CSS override (see content-builder.css), not their own distinct tokens —
 * confirmed real behaviour, not reproduced here in PHP, just passed through
 * as the plain class names the CSS override targets.
 *
 * @param string $fs
 * @param string $fw
 * @return string
 */
if ( ! function_exists( 'cb_identityjs2026_content_builder_fs_fw_class' ) ) {
	function cb_identityjs2026_content_builder_fs_fw_class( $fs, $fw ) {
		return trim( implode( ' ', array_filter( array( $fs, $fw ) ) ) );
	}
}

/**
 * Renders one module's markup. Echoes directly (called inside the main
 * template below) rather than returning a string, matching this project's
 * established render.php style elsewhere.
 *
 * @param array $module
 * @param int   $index
 * @return void
 */
if ( ! function_exists( 'cb_identityjs2026_content_builder_render_module' ) ) :
	function cb_identityjs2026_content_builder_render_module( $module, $index ) {
	$type = $module['moduleType'] ?? 'empty';
	?>
	<div
		class="content-builder__module content-builder__module--<?php echo esc_attr( $type ); ?>"
		data-module-index="<?php echo esc_attr( $index ); ?>"
		data-animate="fade-up"
		data-animate-delay="<?php echo esc_attr( $index * 100 ); ?>"
	>
		<?php
		switch ( $type ) {
			case 'h1':
			case 'h2':
			case 'h3':
				$text = trim( (string) ( $module['headingText'] ?? '' ) );
				if ( '' === $text ) {
					break;
				}
				$fs_fw = cb_identityjs2026_content_builder_fs_fw_class( $module['headingFontSize'] ?? '', $module['headingFontWeight'] ?? '' );
				printf(
					'<%1$s class="content-builder__%1$s %2$s">%3$s</%1$s>',
					esc_attr( $type ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- tag name is one of h1/h2/h3 only.
					esc_attr( $fs_fw ),
					wp_kses_post( $text )
				);
				break;

			case 'text':
				$content = trim( (string) ( $module['textContent'] ?? '' ) );
				if ( '' === $content ) {
					break;
				}
				$fs_fw = cb_identityjs2026_content_builder_fs_fw_class( $module['textFontSize'] ?? '', $module['textFontWeight'] ?? '' );
				?>
				<div class="content-builder__text <?php echo esc_attr( $fs_fw ); ?>"><?php echo do_shortcode( wp_kses_post( $content ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_kses_post() sanitizes the stored content first; do_shortcode() only expands already-registered, trusted shortcodes against that sanitized result — e.g. [service_parents], so an editor can type a shortcode inline in a text module like any other post content. ?></div>
				<?php
				break;

			case 'list':
				$items = cb_identityjs2026_content_builder_list_lines( $module['listContent'] ?? '' );
				if ( ! $items ) {
					break;
				}
				$fs_fw = cb_identityjs2026_content_builder_fs_fw_class( $module['listFontSize'] ?? '', $module['listFontWeight'] ?? '' );
				?>
				<ul class="content-builder__list <?php echo esc_attr( $fs_fw ); ?>">
					<?php foreach ( $items as $item ) : ?>
						<li><?php echo wp_kses_post( $item ); ?></li>
					<?php endforeach; ?>
				</ul>
				<?php
				break;

			case 'stats':
				$stat_rows = array_values(
					array_filter(
						$module['statsRows'] ?? array(),
						function ( $row ) {
							return '' !== trim( (string) ( $row['statText'] ?? '' ) ) || '' !== trim( (string) ( $row['detailText'] ?? '' ) );
						}
					)
				);
				if ( ! $stat_rows ) {
					break;
				}
				?>
				<div class="content-builder__stats">
					<?php foreach ( $stat_rows as $stat_row ) : ?>
						<div class="content-builder__stat-item">
							<?php if ( '' !== trim( (string) ( $stat_row['statText'] ?? '' ) ) ) : ?>
								<div class="content-builder__stat <?php echo esc_attr( cb_identityjs2026_content_builder_fs_fw_class( $stat_row['statFontSize'] ?? '', $stat_row['statFontWeight'] ?? '' ) ); ?>">
									<?php echo esc_html( $stat_row['statText'] ); ?>
								</div>
							<?php endif; ?>
							<?php if ( '' !== trim( (string) ( $stat_row['detailText'] ?? '' ) ) ) : ?>
								<div class="content-builder__stat-detail <?php echo esc_attr( cb_identityjs2026_content_builder_fs_fw_class( $stat_row['detailFontSize'] ?? '', $stat_row['detailFontWeight'] ?? '' ) ); ?>">
									<?php echo esc_html( $stat_row['detailText'] ); ?>
								</div>
							<?php endif; ?>
						</div>
					<?php endforeach; ?>
				</div>
				<?php
				break;

			case 'quote':
				// Nothing renders without quote text, even if the link is
				// fully populated — matches real confirmed behaviour exactly
				// (the link-only case is unreachable in production too).
				$quote_text = trim( (string) ( $module['quoteText'] ?? '' ) );
				if ( '' === $quote_text ) {
					break;
				}
				$link_text   = trim( (string) ( $module['quoteLinkText'] ?? '' ) );
				$link_url    = trim( (string) ( $module['quoteLinkUrl'] ?? '' ) );
				$link_target = ! empty( $module['quoteLinkTarget'] );
				?>
				<div class="content-builder__quote-wrap">
					<blockquote class="content-builder__quote">
						<?php foreach ( cb_identityjs2026_content_builder_list_lines( $quote_text ) as $i => $line ) : ?>
							<?php echo 0 === $i ? '' : '<br>'; ?><?php echo esc_html( $line ); ?>
						<?php endforeach; ?>
					</blockquote>
					<?php if ( $link_url && $link_text ) : ?>
						<a class="id-button id-button--sm content-builder__quote-link" href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ? '_blank' : '_self' ); ?>"<?php echo $link_target ? ' rel="noopener"' : ''; ?>>
							<?php echo esc_html( $link_text ); ?>
						</a>
					<?php endif; ?>
				</div>
				<?php
				break;

			case 'links':
				$links_rows = array_values(
					array_filter(
						$module['linksRows'] ?? array(),
						function ( $row ) {
							return ! empty( $row['file'] );
						}
					)
				);
				if ( ! $links_rows ) {
					break;
				}
				?>
				<div class="content-builder__links">
					<?php foreach ( $links_rows as $link_row ) : ?>
						<?php
						$file_id  = absint( $link_row['file'] );
						$file_url = wp_get_attachment_url( $file_id );
						if ( ! $file_url ) {
							continue;
						}
						$title = trim( (string) ( $link_row['title'] ?? '' ) );
						if ( '' === $title ) {
							$title = basename( $file_url );
						}
						?>
						<a class="content-builder__links-link" href="<?php echo esc_url( $file_url ); ?>" target="_blank" rel="noopener noreferrer">
							<span><?php echo esc_html( $title ); ?></span>
							<span class="content-builder__links-arrow">
								<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/arrow-n600-solid.svg' ); ?>" width="38" height="29" alt="" />
							</span>
						</a>
					<?php endforeach; ?>
				</div>
				<?php
				break;

			case 'logo_grid':
				$logo_grid_rows = array_values(
					array_filter(
						$module['logoGridRows'] ?? array(),
						function ( $row ) {
							return ! empty( $row['logoIds'] );
						}
					)
				);
				if ( ! $logo_grid_rows ) {
					break;
				}
				?>
				<div class="content-builder__logo-grid">
					<?php foreach ( $logo_grid_rows as $lg_row ) : ?>
						<div class="content-builder__logo-grid-row">
							<?php if ( '' !== trim( (string) ( $lg_row['title'] ?? '' ) ) ) : ?>
								<h3 class="content-builder__logo-grid-title"><?php echo esc_html( $lg_row['title'] ); ?></h3>
							<?php endif; ?>
							<div class="content-builder__logo-grid-gallery">
								<?php foreach ( (array) $lg_row['logoIds'] as $logo_id ) : ?>
									<div class="content-builder__logo-grid-item">
										<?php
										echo wp_get_attachment_image(
											absint( $logo_id ),
											'full',
											false,
											array(
												'class' => 'content-builder__logo-grid-image',
												'alt'   => esc_attr( get_post_meta( $logo_id, '_wp_attachment_image_alt', true ) ),
											)
										);
										?>
									</div>
								<?php endforeach; ?>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
				<?php
				break;

			case 'image':
				$image_id = absint( $module['imageId'] ?? 0 );
				if ( ! $image_id ) {
					break;
				}
				$aspect       = $module['imageAspectRatio'] ?? 'native';
				$size         = $module['imageSize'] ?? 'cover';
				$wrap_classes = array( 'content-builder__image-wrap' );
				$aspect_map   = array(
					'21x9' => 'ratio-21x9',
					'16x9' => 'ratio-16x9',
					'4x3'  => 'ratio-4x3',
					'1x1'  => 'ratio-1x1',
				);
				if ( isset( $aspect_map[ $aspect ] ) ) {
					$wrap_classes[] = 'ratio';
					$wrap_classes[] = $aspect_map[ $aspect ];
				}
				if ( 'contain' === $size ) {
					$wrap_classes[] = 'content-builder__image-contain';
				}
				if ( ! empty( $module['imageBleedEdge'] ) ) {
					$wrap_classes[] = 'content-builder__image-wrap--bleed';
				}
				$wrap_style = '';
				if ( 'native' === $aspect && 'contain' === $size ) {
					$wrap_classes[] = 'content-builder__image-native';
					$src             = wp_get_attachment_image_src( $image_id, 'full' );
					if ( $src && ! empty( $src[1] ) ) {
						$wrap_style = sprintf( 'width: min(100%%, %dpx);', (int) $src[1] );
					}
				}
				?>
				<div class="<?php echo esc_attr( implode( ' ', $wrap_classes ) ); ?>" <?php echo $wrap_style ? 'style="' . esc_attr( $wrap_style ) . '"' : ''; ?>>
					<?php
					echo wp_get_attachment_image(
						$image_id,
						'full',
						false,
						array( 'class' => 'img-fluid content-builder__image' )
					);
					?>
				</div>
				<?php
				break;

			case 'video':
				$video_url = trim( (string) ( $module['videoUrl'] ?? '' ) );
				if ( '' === $video_url ) {
					break;
				}
				$video_url .= ( false === strpos( $video_url, '?' ) ? '?' : '&' ) . 'dnt=1';
				?>
				<div class="content-builder__video-wrap ratio ratio-16x9">
					<iframe
						class="content-builder__video"
						src="<?php echo esc_url( $video_url ); ?>"
						allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
						referrerpolicy="strict-origin-when-cross-origin"
					></iframe>
				</div>
				<?php
				break;

			case 'qa':
				$qa_rows = array_values(
					array_filter(
						$module['qaRows'] ?? array(),
						function ( $row ) {
							return '' !== trim( (string) ( $row['question'] ?? '' ) ) || '' !== trim( (string) ( $row['answer'] ?? '' ) );
						}
					)
				);
				if ( ! $qa_rows ) {
					break;
				}
				$lead_first = ! empty( $module['qaLeadFirst'] );
				$large_left = ! empty( $module['qaLargeLeft'] );
				?>
				<div class="content-builder__qa">
					<?php foreach ( $qa_rows as $qa_index => $qa_row ) : ?>
						<?php
						$q_classes = array( 'content-builder__qa-question' );
						$a_classes = array( 'content-builder__qa-answer' );
						if ( 0 === $qa_index && $lead_first ) {
							$q_classes[] = 'content-builder__qa-question--first';
							$a_classes[] = 'content-builder__qa-answer--first';
						}
						if ( $large_left ) {
							$q_classes[] = 'content-builder__qa-question--large';
						}
						?>
						<div class="content-builder__qa-row">
							<h3 class="<?php echo esc_attr( implode( ' ', $q_classes ) ); ?>"><?php echo esc_html( $qa_row['question'] ?? '' ); ?></h3>
							<div class="<?php echo esc_attr( implode( ' ', $a_classes ) ); ?>"><?php echo wp_kses_post( wpautop( esc_html( $qa_row['answer'] ?? '' ) ) ); ?></div>
						</div>
					<?php endforeach; ?>
				</div>
				<?php
				break;

			case 'button':
				$link_url    = trim( (string) ( $module['buttonLinkUrl'] ?? '' ) );
				$link_text   = trim( (string) ( $module['buttonLinkText'] ?? '' ) );
				$link_target = ! empty( $module['buttonLinkTarget'] );
				$cta_text    = trim( (string) ( $module['ctaText'] ?? '' ) );
				if ( $link_url && $link_text ) :
					?>
					<a class="id-button content-builder__button" href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ? '_blank' : '_self' ); ?>"<?php echo $link_target ? ' rel="noopener"' : ''; ?>>
						<?php echo esc_html( $link_text ); ?>
					</a>
					<?php
				endif;
				if ( '' !== $cta_text ) :
					?>
					<div class="content-builder__cta-title"><?php echo esc_html( $cta_text ); ?></div>
					<?php
				endif;
				break;

			case 'empty':
			default:
				break;
		}
		?>
	</div>
	<?php
	}
endif;
?>
<section
	id="<?php echo esc_attr( $instance_id ); ?>"
	<?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>
	<?php echo $section_style ? 'style="' . esc_attr( $section_style ) . '"' : ''; ?>
>
	<div class="id-container">
		<?php foreach ( $rows as $row ) : ?>
			<?php
			// A column holds a LIST of stacked modules, not exactly one —
			// confirmed live against production's own cb-content-grid-v2.php
			// that a flat modules-list mapped 1:1 to columns by index can't
			// express "Heading + Text + List all in one column, Image in the
			// other" (production itself only ever avoids this by keeping such
			// content in one big wysiwyg field, which this block's own
			// RichText-based text module can't replicate — see this block's
			// own git history/session notes). No legacy `modules`-shape
			// fallback here — this theme has no real published content yet,
			// so every row already saved on this install was migrated to
			// `columns` directly (one-off wp-cli script, not part of the
			// theme) rather than carrying a dual-shape reader indefinitely.
			$columns       = is_array( $row['columns'] ?? null ) ? $row['columns'] : array();
			$column_layout = $row['columnLayout'] ?? '12';

			$row_variant_map = array(
				'12'      => 'content-builder__row--full',
				'6-6'     => 'content-builder__row--two-col',
				'4-8'     => 'content-builder__row--third-twothirds',
				'8-4'     => 'content-builder__row--twothirds-third',
				'4-4-4'   => 'content-builder__row--three-col',
				'3-3-3-3' => 'content-builder__row--four-col',
				'3-6-3'   => 'content-builder__row--quarter-half-quarter',
				'6-3-3'   => 'content-builder__row--half-quarter-quarter',
				'3-3-6'   => 'content-builder__row--quarter-quarter-half',
			);

			$row_classes = array( 'content-builder__row', $row_variant_map[ $column_layout ] ?? $row_variant_map['12'] );

			if ( ! empty( $row['hasPaddingTop'] ) ) {
				$row_classes[] = 'content-builder__row--pt';
			}
			if ( ! empty( $row['hasPaddingBottom'] ) ) {
				$row_classes[] = 'content-builder__row--pb';
			}
			if ( ! empty( $row['hasLine'] ) ) {
				$row_classes[] = 'content-builder__row--has-line';
			}

			$has_h2 = false;
			foreach ( $columns as $column ) {
				foreach ( ( $column['modules'] ?? array() ) as $module ) {
					if ( 'h2' === ( $module['moduleType'] ?? '' ) && '' !== trim( (string) ( $module['headingText'] ?? '' ) ) ) {
						$has_h2 = true;
						break 2;
					}
				}
			}
			if ( $has_h2 ) {
				$row_classes[] = 'content-builder__row--has-h2';
			}

			// Column span (out of a 12-col grid), keyed by column index —
			// matches real confirmed behaviour exactly: no bounds-checking
			// against the chosen layout, an out-of-range column just reuses
			// the layout's last defined width (see content-builder-research.md
			// §1 and §4.8 — this is real production behaviour, not a bug to
			// silently "fix" by adding new validation here). Expressed as a
			// CSS custom property (`grid-column: span N`) rather than literal
			// col-md-* utility classes, per this project's own established
			// convention (see Brand Grid/Push Panel) — same effective math,
			// no Bootstrap class dependency.
			$col_span_by_index = function ( $layout, $index ) {
				switch ( $layout ) {
					case '6-6':
						return 6;
					case '4-8':
						return 0 === $index ? 4 : 8;
					case '8-4':
						return 0 === $index ? 8 : 4;
					case '4-4-4':
						return 4;
					case '3-3-3-3':
						return 3;
					case '3-6-3':
						return 1 === $index ? 6 : 3;
					case '6-3-3':
						return 0 === $index ? 6 : 3;
					case '3-3-6':
						return 2 === $index ? 6 : 3;
					case '12':
					default:
						return 12;
				}
			};

			// A single counter across every module in the row (not per-column)
			// keeps the fade-up stagger reading as one continuous sequence
			// left-to-right/top-to-bottom, same as the old flat renderer.
			$module_counter = 0;
			?>
			<div class="<?php echo esc_attr( implode( ' ', $row_classes ) ); ?>">
				<?php foreach ( $columns as $column_index => $column ) : ?>
					<div class="content-builder__col" style="--content-builder-col-span: <?php echo esc_attr( $col_span_by_index( $column_layout, $column_index ) ); ?>;">
						<?php foreach ( ( $column['modules'] ?? array() ) as $module ) : ?>
							<?php cb_identityjs2026_content_builder_render_module( $module, $module_counter++ ); ?>
						<?php endforeach; ?>
					</div>
				<?php endforeach; ?>
			</div>
		<?php endforeach; ?>
	</div>
</section>
