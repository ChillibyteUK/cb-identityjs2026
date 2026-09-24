<?php
/**
 * Block template for Case Study Grid.
 *
 * Built from cb-featured-work + cb-related-work (Work by Region / Work
 * Carousel fold in via the same taxonomy_filter pattern) — see
 * identity-global-block-spec.md's Case Study Grid entry. Distinct from the
 * Work Index block (the full /work/ listing page) — this is the small
 * reusable related/featured widget.
 *
 * `mode: auto` generalises Related Work's service-specific two-pass
 * (Yoast-primary-term match first, general tax_query fill second) and its
 * page-slug fallback to any of theme/service/region, per the spec's own
 * "budget real effort, not a drop-in merge" note — Featured Work's simpler
 * single-pass auto-derive is a special case of this, not built separately.
 *
 * Card description and hover-preview video both come from
 * cb_identityjs2026_get_case_study_card_meta() (inc/case-study.php).
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$mode = $attributes['mode'] ?? 'grid';

// Same fixed Vimeo app/account registration as Media Panel/Case Study
// Hero/Work Index — see those blocks' own render.php comments.
$vimeo_app_id = 58479;

/**
 * Builds a hover-preview-ready Vimeo embed src from a card's meta, or ''
 * when it has no video.
 *
 * @param array $card_meta cb_identityjs2026_get_case_study_card_meta() result.
 * @return string
 */
if ( ! function_exists( 'cb_identityjs2026_case_study_grid_video_src' ) ) {
	function cb_identityjs2026_case_study_grid_video_src( $card_meta, $vimeo_app_id ) {
		if ( ! $card_meta['vimeoId'] ) {
			return '';
		}

		return add_query_arg(
			array(
				'h'          => $card_meta['vimeoHash'],
				'dnt'        => '1',
				'badge'      => '0',
				'player_id'  => '0',
				'app_id'     => $vimeo_app_id,
				'background' => '1',
				'autoplay'   => '1',
			),
			'https://player.vimeo.com/video/' . rawurlencode( $card_meta['vimeoId'] )
		);
	}
}

/**
 * Mount-on-hover Vimeo iframe for every .case-study-grid__video on the
 * page — same pattern as cb-featured-work.php's own JS, ported. Each
 * block instance calls this at its own render point, but the listener
 * itself is page-wide/idempotent (DOMContentLoaded + querySelectorAll),
 * so a page with more than one Case Study Grid instance only needs the
 * script to have run once — the static $printed guard keeps a second
 * instance from re-printing it.
 */
if ( ! function_exists( 'cb_identityjs2026_case_study_grid_hover_script' ) ) {
	function cb_identityjs2026_case_study_grid_hover_script() {
		static $printed = false;
		if ( $printed ) {
			return;
		}
		$printed = true;
		?>
		<script>
		document.addEventListener('DOMContentLoaded', function () {
			document.querySelectorAll('.case-study-grid__card').forEach(function (card) {
				var container = card.querySelector('.case-study-grid__video');
				if (!container) return;
				var src = container.getAttribute('data-video-src');

				function mountVideo() {
					if (container.querySelector('iframe')) return;
					var iframe = document.createElement('iframe');
					iframe.src = src;
					iframe.frameBorder = '0';
					iframe.allow = 'autoplay; fullscreen';
					iframe.allowFullscreen = true;
					container.appendChild(iframe);
				}
				function unmountVideo() {
					var iframe = container.querySelector('iframe');
					if (iframe) iframe.remove();
				}

				card.addEventListener('mouseenter', mountVideo);
				card.addEventListener('mouseleave', unmountVideo);
				card.addEventListener('focusin', mountVideo);
				card.addEventListener('focusout', unmountVideo);
			});
		});
		</script>
		<?php
	}
}

// --- Hero mode -------------------------------------------------------
if ( 'hero' === $mode ) {
	$hero_id = absint( $attributes['heroCaseStudy'] ?? 0 );

	if ( ! $hero_id ) {
		$latest_query = new WP_Query(
			array(
				'post_type'      => 'case_study',
				'posts_per_page' => 1,
				'orderby'        => 'date',
				'order'          => 'DESC',
			)
		);
		if ( $latest_query->have_posts() ) {
			$hero_id = $latest_query->posts[0]->ID;
		}
		wp_reset_postdata();
	}

	if ( ! $hero_id ) {
		return;
	}

	$card_meta = cb_identityjs2026_get_case_study_card_meta( $hero_id );
	$video_src = cb_identityjs2026_case_study_grid_video_src( $card_meta, $vimeo_app_id );

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'case-study-grid case-study-grid--hero' ) );
	?>
	<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
		<a href="<?php echo esc_url( get_permalink( $hero_id ) ); ?>" class="case-study-grid__card case-study-grid__card--hero">
			<?php if ( has_post_thumbnail( $hero_id ) ) : ?>
				<div class="case-study-grid__image-wrapper">
					<?php echo get_the_post_thumbnail( $hero_id, 'full', array( 'class' => 'case-study-grid__image' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</div>
			<?php endif; ?>
			<?php if ( $video_src ) : ?>
				<div class="case-study-grid__video" data-video-src="<?php echo esc_url( $video_src ); ?>"></div>
			<?php endif; ?>
			<div class="case-study-grid__content">
				<div class="case-study-grid__title">
					<?php echo esc_html( get_the_title( $hero_id ) ); ?>
					<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/arrow-wh.svg' ); ?>" width="23" height="21" alt="" />
				</div>
				<div class="case-study-grid__desc"><?php echo esc_html( $card_meta['desc'] ); ?></div>
			</div>
		</a>
	</section>
	<?php
	cb_identityjs2026_case_study_grid_hover_script();
	return;
}

// --- Grid / Auto modes -------------------------------------------------
$count = max( 1, absint( $attributes['count'] ?? 4 ) );

$query_args = array(
	'post_type'      => 'case_study',
	'posts_per_page' => $count,
	'orderby'        => 'date',
	'order'          => 'DESC',
);

$rerank_by_service = array();

if ( 'auto' === $mode ) {
	$taxonomy_filter = sanitize_key( $attributes['taxonomyFilter'] ?? 'none' );

	if ( 'none' === $taxonomy_filter || ! taxonomy_exists( $taxonomy_filter ) ) {
		return;
	}

	$current_terms = wp_get_post_terms( get_the_ID(), $taxonomy_filter, array( 'fields' => 'ids' ) );
	if ( is_wp_error( $current_terms ) ) {
		$current_terms = array();
	}

	// No terms on the current post — try matching its own slug against a
	// term slug in the chosen taxonomy (generalises Related Work's
	// service-description-page fallback to any taxonomy).
	if ( empty( $current_terms ) && is_page() ) {
		$page_slug = get_post_field( 'post_name', get_the_ID() );
		$term      = get_term_by( 'slug', $page_slug, $taxonomy_filter );
		if ( $term && ! is_wp_error( $term ) ) {
			$current_terms = array( (int) $term->term_id );
		}
	}

	if ( empty( $current_terms ) ) {
		return;
	}

	$posts = array();

	// 1. Posts whose own primary term (Yoast, when active) matches the
	// current post's first derived term.
	$primary_meta_key = '_yoast_wpseo_primary_' . $taxonomy_filter;
	$primary_query     = new WP_Query(
		array(
			'post_type'      => 'case_study',
			'posts_per_page' => $count,
			'orderby'        => 'date',
			'order'          => 'DESC',
			'post__not_in'   => array( get_the_ID() ),
			'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				array(
					'key'     => $primary_meta_key,
					'value'   => reset( $current_terms ),
					'compare' => '=',
				),
			),
		)
	);
	if ( $primary_query->have_posts() ) {
		$posts = wp_list_pluck( $primary_query->posts, 'ID' );
	}
	wp_reset_postdata();

	// 2. Fill any remaining slots with a general tax_query match.
	if ( count( $posts ) < $count ) {
		$fill_query = new WP_Query(
			array(
				'post_type'      => 'case_study',
				'posts_per_page' => $count - count( $posts ),
				'orderby'        => 'date',
				'order'          => 'DESC',
				'post__not_in'   => array_merge( array( get_the_ID() ), $posts ),
				'tax_query'      => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
					array(
						'taxonomy' => $taxonomy_filter,
						'field'    => 'term_id',
						'terms'    => $current_terms,
					),
				),
			)
		);
		if ( $fill_query->have_posts() ) {
			$posts = array_merge( $posts, wp_list_pluck( $fill_query->posts, 'ID' ) );
		}
		wp_reset_postdata();
	}

	if ( empty( $posts ) ) {
		return;
	}
} else {
	// Viewing this grid ON a case study's own page shouldn't ever list that
	// same case study among its "related work" — confirmed against
	// production's real .cb-related-work equivalent (identityglobal.com/
	// work/arm-everywhere/), whose own card list never includes the
	// current page. 'auto' mode above already excludes get_the_ID() in its
	// own sub-queries; this is the same exclusion for the plain grid mode.
	$is_case_study_page = is_singular( 'case_study' );

	if ( $is_case_study_page ) {
		$query_args['post__not_in'] = array( get_the_ID() );
	}

	$selected_services = array_filter( array_map( 'absint', $attributes['selectedServices'] ?? array() ) );
	$selected_themes   = array_filter( array_map( 'absint', $attributes['selectedThemes'] ?? array() ) );

	$tax_query = array();

	if ( $selected_services ) {
		$tax_query[]        = array(
			'taxonomy' => 'service',
			'field'    => 'term_id',
			'terms'    => $selected_services,
		);
		$rerank_by_service = $selected_services;
	}

	// Theme filtering only applies on a case study page: manually selected
	// themes override auto-matching by the CURRENT case study's own theme
	// terms; off a case study page this field has no effect at all (the
	// current, pre-existing behaviour — Services-only filtering, or none).
	if ( $is_case_study_page ) {
		if ( $selected_themes ) {
			$tax_query[] = array(
				'taxonomy' => 'theme',
				'field'    => 'term_id',
				'terms'    => $selected_themes,
			);
		} else {
			$current_theme_terms = wp_get_post_terms( get_the_ID(), 'theme', array( 'fields' => 'ids' ) );
			if ( ! is_wp_error( $current_theme_terms ) && $current_theme_terms ) {
				$tax_query[] = array(
					'taxonomy' => 'theme',
					'field'    => 'term_id',
					'terms'    => $current_theme_terms,
				);
			}
		}
	}

	if ( $tax_query ) {
		// Pull the full matching set first so priority ranking (below) is
		// accurate before limiting to $count — matches Featured Work.
		$query_args['posts_per_page'] = -1;
		if ( count( $tax_query ) > 1 ) {
			$tax_query['relation'] = 'AND';
		}
		$query_args['tax_query'] = $tax_query; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
	}

	$query = new WP_Query( $query_args );
	$posts = wp_list_pluck( $query->posts, 'ID' );
	wp_reset_postdata();

	if ( $rerank_by_service && $posts ) {
		usort(
			$posts,
			static function ( $a, $b ) use ( $rerank_by_service ) {
				$a_rank = array_search( cb_identityjs2026_get_primary_service_term_id( $a ), $rerank_by_service, true );
				$b_rank = array_search( cb_identityjs2026_get_primary_service_term_id( $b ), $rerank_by_service, true );
				$a_rank = false === $a_rank ? PHP_INT_MAX : $a_rank;
				$b_rank = false === $b_rank ? PHP_INT_MAX : $b_rank;

				if ( $a_rank !== $b_rank ) {
					return $a_rank <=> $b_rank;
				}

				return strcmp( get_post_field( 'post_date_gmt', $b ), get_post_field( 'post_date_gmt', $a ) );
			}
		);
		$posts = array_slice( $posts, 0, $count );
	}
}

if ( empty( $posts ) ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'case-study-grid' ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<div class="id-container">
		<div class="case-study-grid__cards">
			<?php foreach ( $posts as $post_id ) : ?>
				<?php
				$card_meta = cb_identityjs2026_get_case_study_card_meta( $post_id );
				$video_src = cb_identityjs2026_case_study_grid_video_src( $card_meta, $vimeo_app_id );
				?>
				<a href="<?php echo esc_url( get_permalink( $post_id ) ); ?>" class="case-study-grid__card">
					<?php if ( has_post_thumbnail( $post_id ) ) : ?>
						<div class="case-study-grid__image-wrapper">
							<?php echo get_the_post_thumbnail( $post_id, 'large', array( 'class' => 'case-study-grid__image' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						</div>
					<?php endif; ?>
					<?php if ( $video_src ) : ?>
						<div class="case-study-grid__video" data-video-src="<?php echo esc_url( $video_src ); ?>"></div>
					<?php endif; ?>
					<div class="case-study-grid__content">
						<div class="case-study-grid__title">
							<?php echo esc_html( get_the_title( $post_id ) ); ?>
							<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/img/arrow-n600-solid.svg' ); ?>" width="14" height="13" alt="" />
						</div>
						<div class="case-study-grid__desc"><?php echo esc_html( $card_meta['desc'] ); ?></div>
					</div>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
<?php
cb_identityjs2026_case_study_grid_hover_script();
