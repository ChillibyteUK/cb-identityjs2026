<?php
/**
 * Project-specific helpers — coupled to this project's own page slugs and
 * content structure. Reusable, project-agnostic functions belong in
 * inc/utilities.php instead (safe to lift verbatim into other projects).
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * URL for a hardcoded page link (e.g. the footer column titles).
 *
 * Resolves the slug to a real page and returns its permalink — which
 * Polylang filters to the current language's URL and translated slug, so
 * /services/ becomes /en/services/ or /ar/<arabic-slug>/ automatically.
 * Falls back to home_url() + slug when no such page exists (e.g.
 * world-expo on installs without that page), which at least keeps the
 * link same-origin instead of root-absolute.
 *
 * @param string $slug     Page slug, e.g. 'services'.
 * @param string $fragment Optional anchor without the hash, e.g. 'brands'.
 * @return string
 */
function cb_identityjs2026_page_link( $slug, $fragment = '' ) {
	$page = get_page_by_path( $slug );

	// Translate to the current language — get_page_by_path() itself is not
	// language-aware (EN/AR pages can share the same post_name), so without
	// this the footer always linked to whichever language get_page_by_path()
	// happened to return first.
	if ( $page && function_exists( 'pll_get_post' ) ) {
		$translated_id = pll_get_post( $page->ID );
		if ( $translated_id ) {
			$translated = get_post( $translated_id );
			if ( $translated ) {
				$page = $translated;
			}
		}
	}

	$url  = $page ? get_permalink( $page ) : home_url( '/' . trim( $slug, '/' ) . '/' );

	if ( '' !== $fragment ) {
		$url .= '#' . ltrim( $fragment, '#' );
	}

	return $url;
}

/**
 * Vimeo embed URL for a video ID (+ optional privacy hash).
 *
 * Every block that embeds Vimeo builds its src here, so the account's fixed
 * app_id and the player-chrome decisions live in one place.
 *
 * Modes:
 * - `background` — decorative looping video (case-study hero, card hover
 *   previews). Sends `background=1` (chromeless, no floating pause button)
 *   AND the explicit autoplay/muted/loop/controls=0 params. `background` and
 *   `controls=0` are honoured only for videos on a Vimeo account with that
 *   feature (profiled); for any other video Vimeo ignores them, and the
 *   explicit params still give an autoplaying muted loop — just with Vimeo's
 *   floating pause button. So an un-profiled video degrades gracefully with
 *   no editor-facing toggle, and gets cleaner automatically once profiled.
 * - `hero` — autoplay/muted/loop/controls=0 without `background`, for
 *   Media Panel's hero mode: its Mute/Unmute button drives the Vimeo Player
 *   API, which we haven't confirmed works under background mode.
 * - `player` — a normal embed with default controls.
 *
 * @param string $vimeo_id   Vimeo video ID.
 * @param string $vimeo_hash Optional privacy hash (the `h` param).
 * @param string $mode       `background`, `hero` or `player`.
 * @return string
 */
function cb_identityjs2026_vimeo_src( $vimeo_id, $vimeo_hash = '', $mode = 'player' ) {
	if ( '' === (string) $vimeo_id ) {
		return '';
	}

	$args = array(
		'dnt'       => '1',
		'badge'     => '0',
		'player_id' => '0',
		'app_id'    => 58479, // Vimeo app/account registration for this account — not per-video.
	);
	if ( '' !== (string) $vimeo_hash ) {
		$args = array( 'h' => $vimeo_hash ) + $args;
	}

	if ( 'background' === $mode || 'hero' === $mode ) {
		$args += array(
			'autoplay' => '1',
			'muted'    => '1',
			'loop'     => '1',
			'controls' => '0',
		);
	}
	if ( 'background' === $mode ) {
		$args['background'] = '1';
	}

	return add_query_arg( $args, 'https://player.vimeo.com/video/' . rawurlencode( $vimeo_id ) );
}

/**
 * Enqueue Vimeo's player.js (needed for the Mute/Unmute button's Player API
 * calls). Safe to call from any number of block instances per page.
 *
 * @return void
 */
function cb_identityjs2026_enqueue_vimeo_player() {
	wp_enqueue_script( 'vimeo-player', 'https://player.vimeo.com/api/player.js', array(), null, true ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
}

/**
 * Mute/Unmute toggle button for a Vimeo iframe, shared by Media Panel's
 * hero mode and Case Study Hero. Wired up by src/js/video-unmute.js via the
 * Vimeo Player API (so the video must be embedded with
 * cb_identityjs2026_vimeo_src() in `hero` mode — muted autoplay, no
 * controls). Positioned at the bottom of its positioned parent; see
 * src/blocks/video-unmute.css.
 *
 * @param string $iframe_id ID attribute of the Vimeo iframe this controls.
 * @return string Button markup.
 */
function cb_identityjs2026_video_unmute_button( $iframe_id ) {
	cb_identityjs2026_enqueue_vimeo_player();

	return sprintf(
		'<button type="button" class="video-unmute" data-video-id="%1$s" data-label-muted="%2$s" data-label-unmuted="%3$s">%4$s</button>',
		esc_attr( $iframe_id ),
		esc_attr( cb_identityjs2026_pll_string( 'Unmute' ) ),
		esc_attr( cb_identityjs2026_pll_string( 'Mute' ) ),
		esc_html( cb_identityjs2026_pll_string( 'Unmute' ) )
	);
}
