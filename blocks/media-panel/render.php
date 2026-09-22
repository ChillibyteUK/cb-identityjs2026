<?php
/**
 * Block template for Media Panel.
 *
 * Built from cb-full-image + cb-full-video, merged behind $media_type — see
 * identity-global-block-spec.md's Media Panel entry.
 *
 * Video src is built from vimeo_id/vimeo_hash + hero_mode, not stored as a
 * pasted URL — app_id is a fixed constant (Vimeo app/account registration,
 * confirmed identical across every real saved cb-full-video instance, not
 * a per-video value), dnt=1/badge=0/player_id=0 are always on, and
 * autoplay/muted/loop/controls=0 are added only in hero mode.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

$media_type = $attributes['mediaType'] ?? 'image';
$image_url  = $attributes['imageUrl'] ?? '';
$image_alt  = $attributes['imageAlt'] ?? '';
$top_border = ! empty( $attributes['topBorder'] );
$vimeo_id   = $attributes['vimeoId'] ?? '';
$vimeo_hash = $attributes['vimeoHash'] ?? '';
$full_width = ! empty( $attributes['fullWidth'] );
$full_bleed = ! empty( $attributes['fullBleed'] );
$hero_mode  = ! empty( $attributes['heroMode'] );

// Vimeo's own embed app registration for this account — not per-video, see
// docblock above. Not a field; change here only if the account's Vimeo app
// is ever re-registered under a new app_id. A plain variable, not a
// const/define() — this file is require()'d once per block instance on
// the page, and a real const would fatal ("already defined") on the second.
$vimeo_app_id = 58479;

$root_classes = array( 'media-panel', 'media-panel--' . $media_type );
if ( 'image' === $media_type && $top_border ) {
	$root_classes[] = 'media-panel--top-border';
}
if ( 'video' === $media_type && $hero_mode ) {
	$root_classes[] = 'media-panel--hero';
}
if ( 'video' === $media_type && $full_bleed ) {
	$root_classes[] = 'media-panel--full-bleed';
}
if ( 'video' === $media_type && ! $full_bleed && ! $full_width ) {
	$root_classes[] = 'id-container';
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $root_classes ) ) );

if ( 'image' === $media_type && ! $image_url ) {
	return;
}
if ( 'video' === $media_type && ! $vimeo_id ) {
	return;
}

if ( 'video' === $media_type ) {
	$video_src = add_query_arg(
		array(
			'h'         => $vimeo_hash,
			'dnt'       => '1',
			'badge'     => '0',
			'player_id' => '0',
			'app_id'    => $vimeo_app_id,
		),
		'https://player.vimeo.com/video/' . rawurlencode( $vimeo_id )
	);

	if ( $hero_mode ) {
		$video_src = add_query_arg(
			array(
				'autoplay' => '1',
				'muted'    => '1',
				'loop'     => '1',
				'controls' => '0',
			),
			$video_src
		);
	}

	$iframe_id = ( $attributes['anchor'] ?? '' ) ? $attributes['anchor'] . '-video' : wp_unique_id( 'media-panel-' );

	if ( $hero_mode ) {
		wp_enqueue_script( 'vimeo-player', 'https://player.vimeo.com/api/player.js', array(), null, true ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
	}
}
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() already escapes. ?>>
	<?php if ( 'image' === $media_type ) : ?>
		<img class="media-panel__image" src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $image_alt ); ?>" loading="lazy">
	<?php elseif ( $full_bleed ) : ?>
		<div class="media-panel__bleed-wrapper">
			<iframe id="<?php echo esc_attr( $iframe_id ); ?>" class="media-panel__video" src="<?php echo esc_url( $video_src ); ?>" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
			<?php if ( $hero_mode ) : ?>
				<button type="button" class="media-panel__unmute" data-video-id="<?php echo esc_attr( $iframe_id ); ?>" data-label-muted="<?php echo esc_attr( cb_identityjs2026_pll_string( 'Unmute' ) ); ?>" data-label-unmuted="<?php echo esc_attr( cb_identityjs2026_pll_string( 'Mute' ) ); ?>"><?php echo esc_html( cb_identityjs2026_pll_string( 'Unmute' ) ); ?></button>
			<?php endif; ?>
		</div>
	<?php else : ?>
		<iframe id="<?php echo esc_attr( $iframe_id ); ?>" class="media-panel__video" src="<?php echo esc_url( $video_src ); ?>" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
		<?php if ( $hero_mode ) : ?>
			<button type="button" class="media-panel__unmute" data-video-id="<?php echo esc_attr( $iframe_id ); ?>" data-label-muted="<?php echo esc_attr( cb_identityjs2026_pll_string( 'Unmute' ) ); ?>" data-label-unmuted="<?php echo esc_attr( cb_identityjs2026_pll_string( 'Mute' ) ); ?>"><?php echo esc_html( cb_identityjs2026_pll_string( 'Unmute' ) ); ?></button>
		<?php endif; ?>
	<?php endif; ?>
</section>

<?php if ( 'video' === $media_type && $hero_mode ) : ?>
<script>
(function () {
	function initUnmute( attemptsLeft ) {
		var iframe = document.getElementById( <?php echo wp_json_encode( $iframe_id ); ?> );
		var button = document.querySelector( '.media-panel__unmute[data-video-id="' + <?php echo wp_json_encode( $iframe_id ); ?> + '"]' );
		if ( ! iframe || ! button ) return;

		// player.js can itself be delayed by CDN/script-delay layers — retry
		// briefly instead of giving up on the first check.
		if ( typeof Vimeo === 'undefined' ) {
			if ( attemptsLeft > 0 ) {
				setTimeout( function () { initUnmute( attemptsLeft - 1 ); }, 200 );
			}
			return;
		}

		var player = new Vimeo.Player( iframe );
		button.addEventListener( 'click', function () {
			player.getMuted().then( function ( isMuted ) {
				player.setMuted( ! isMuted );
				button.textContent = isMuted ? button.getAttribute( 'data-label-unmuted' ) : button.getAttribute( 'data-label-muted' );
				button.classList.toggle( 'media-panel__unmute--playing', isMuted );
				button.blur();
			} );
		} );
	}

	// Don't rely solely on DOMContentLoaded — on some deployments (CDN/
	// script-delay layers) this inline script executes after that event has
	// already fired, silently leaving the button dead (the exact bug that
	// shipped live on identityhealth.com, 2026-09-10, in the old cb-full-video
	// block this one replaces — porting the fix deliberately, not just the
	// surface behaviour).
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', function () { initUnmute( 25 ); } );
	} else {
		initUnmute( 25 );
	}
})();
</script>
<?php endif; ?>
