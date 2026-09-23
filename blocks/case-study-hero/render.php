<?php
/**
 * Block template for Case Study Hero.
 *
 * Built from cb-case-study-hero. Placed at the top of a case_study post's
 * content — title comes from the post itself (get_the_title()), not a
 * field. Its `subtitle` attribute is what cb_identityjs2026_get_hero_meta()
 * (inc/case-study.php) reads for both this block's own display and every
 * card that links to this case study elsewhere (Work Index, Case Study
 * Grid) — see that function's own header comment.
 *
 * Video embed src is built from vimeoId/vimeoHash + the fixed Vimeo app_id,
 * matching Media Panel's own render.php exactly (this project's established
 * convention — see that block's own comment on why, not the real source's
 * raw pasted vimeo_url + cb_vimeo_url_with_dnt()).
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$subtitle   = $attributes['subtitle'] ?? '';
$vimeo_id   = $attributes['vimeoId'] ?? '';
$vimeo_hash = $attributes['vimeoHash'] ?? '';

// Same fixed Vimeo app/account registration as Media Panel — see that
// block's own render.php comment for why this is a plain variable, not a
// const (this file is require()'d once per block instance on the page).
$vimeo_app_id = 58479;

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => 'case-study-hero' ) );
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<h1 class="case-study-hero__title">
		<div class="id-container"><?php echo esc_html( get_the_title() ); ?></div>
	</h1>
	<?php if ( $subtitle ) : ?>
		<h2 class="case-study-hero__subtitle">
			<div class="id-container"><?php echo esc_html( $subtitle ); ?></div>
		</h2>
	<?php endif; ?>
	<?php if ( $vimeo_id ) : ?>
		<?php
		$video_src = add_query_arg(
			array(
				'h'         => $vimeo_hash,
				'dnt'       => '1',
				'badge'     => '0',
				'player_id' => '0',
				'app_id'    => $vimeo_app_id,
				'autoplay'  => '1',
			),
			'https://player.vimeo.com/video/' . rawurlencode( $vimeo_id )
		);
		?>
		<div class="id-container case-study-hero__video-container">
			<div class="case-study-hero__video-overlay"></div>
			<iframe class="case-study-hero__video" src="<?php echo esc_url( $video_src ); ?>" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
		</div>
	<?php endif; ?>
</section>
