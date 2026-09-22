<?php
/**
 * Enqueue theme CSS/JS. filemtime versioning, no dependencies (no jQuery,
 * no Bootstrap JS) — plain vanilla output, loads immediately.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * Enqueue theme.min.css, then the current brand's tokens stylesheet.
 *
 * Order matters, and it's the OPPOSITE of what you'd expect from "the
 * tokens need to be there for var() to resolve": theme.min.css itself
 * bundles tokens.css's generic :root defaults (theme.css @imports it), so
 * the brand override has to load AFTER theme.min.css to win the cascade —
 * last same-specificity :root declaration wins, not first. Loading the
 * brand file first (the original version of this function) meant
 * theme.min.css's bundled generic values silently clobbered every brand
 * override. See MULTI-BRAND.md.
 *
 * If CB_SITE isn't resolvable, cb_identityjs2026_site_config_notice() (see
 * inc/site-config.php) already surfaces a loud admin notice — this function
 * just skips enqueuing a brand stylesheet that doesn't exist rather than
 * guessing one.
 *
 * @return void
 */
function cb_identityjs2026_enqueue_styles() {
	$rel = '/css/theme.min.css';
	$abs = get_stylesheet_directory() . $rel;
	if ( file_exists( $abs ) ) {
		wp_enqueue_style( 'cb-identityjs2026-theme', get_stylesheet_directory_uri() . $rel, array(), filemtime( $abs ) );
	}

	$site = cb_identityjs2026_get_site();
	if ( null !== $site ) {
		$tokens_rel = "/css/tokens/{$site}.min.css";
		$tokens_abs = get_stylesheet_directory() . $tokens_rel;
		if ( file_exists( $tokens_abs ) ) {
			wp_enqueue_style( 'cb-identityjs2026-tokens', get_stylesheet_directory_uri() . $tokens_rel, array( 'cb-identityjs2026-theme' ), filemtime( $tokens_abs ) );
		}

		// Structural per-brand overrides (not expressible as tokens — e.g.
		// identity's no-container header). Optional: most brands won't need
		// one. Loads last so it can override both theme.min.css and the
		// brand tokens file. See src/css/site/README in MULTI-BRAND.md.
		$site_rel = "/css/site/{$site}.min.css";
		$site_abs = get_stylesheet_directory() . $site_rel;
		if ( file_exists( $site_abs ) ) {
			wp_enqueue_style( 'cb-identityjs2026-site', get_stylesheet_directory_uri() . $site_rel, array( 'cb-identityjs2026-tokens' ), filemtime( $site_abs ) );
		}
	}
}
add_action( 'wp_enqueue_scripts', 'cb_identityjs2026_enqueue_styles' );

/**
 * Enqueue a file from js/vendor/, filemtime-versioned like everything else.
 *
 * Third-party libraries a project needs should be vendored into js/vendor/
 * and committed, the same convention the compiled css/ and js/ output
 * already follows, rather than loaded from a CDN — that avoids extra DNS/TLS
 * handshakes and keeps a vendored stylesheet off a third-party origin. Note
 * the file the upstream version came from in a comment near the call site
 * (e.g. gsap.min.js 3.12.7 cdn.jsdelivr.net/npm/gsap) since it's vendored by
 * hand rather than tracked in package.json.
 *
 * @param string   $handle Handle to register under.
 * @param string   $file   Filename within js/vendor/.
 * @param bool     $is_css True to enqueue as a stylesheet rather than a script.
 * @param string[] $deps   Other registered handles this depends on (e.g. a
 *                         gsap plugin depending on the 'gsap' handle itself).
 * @return void
 */
function cb_identityjs2026_enqueue_vendor( $handle, $file, $is_css = false, $deps = array() ) {
	$rel = '/js/vendor/' . $file;
	$abs = get_stylesheet_directory() . $rel;
	if ( ! file_exists( $abs ) ) {
		return;
	}
	$url = get_stylesheet_directory_uri() . $rel;
	if ( $is_css ) {
		wp_enqueue_style( $handle, $url, $deps, filemtime( $abs ) );
	} else {
		wp_enqueue_script( $handle, $url, $deps, filemtime( $abs ), true );
	}
}

/**
 * Enqueue theme.min.js.
 *
 * @return void
 */
function cb_identityjs2026_enqueue_scripts() {

	// gsap.min.js 3.12.5 cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
	// — identity's footer logo reveal (src/js/footer-logo-animate.js) uses
	// gsap.to() when present, with a plain CSS-transition fallback when not.
	// Only identity needs this today; enqueued unconditionally is still fine
	// since footer-logo-animate.js no-ops without #footer-logo-clip in the DOM.
	cb_identityjs2026_enqueue_vendor( 'gsap', 'gsap.min.js' );
	// ScrollTrigger.min.js 3.12.5 cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js
	// — Home Intro's scroll-triggered reveal (src/js/home-intro-animate.js).
	// Depends on 'gsap' (extends window.gsap), must load after it.
	cb_identityjs2026_enqueue_vendor( 'gsap-scrolltrigger', 'ScrollTrigger.min.js', false, array( 'gsap' ) );
	// lenis.css / lenis.min.js 1.3.11 unpkg.com/lenis@1.3.11/dist/ — smooth
	// scroll, confirmed live on identityglobal.com (its own init script
	// ported into src/js/lenis-init.js).
	cb_identityjs2026_enqueue_vendor( 'lenis-style', 'lenis.css', true );
	cb_identityjs2026_enqueue_vendor( 'lenis', 'lenis.min.js' );

	$rel = '/js/theme.min.js';
	$abs = get_stylesheet_directory() . $rel;
	if ( file_exists( $abs ) ) {
		wp_enqueue_script( 'cb-identityjs2026-theme', get_stylesheet_directory_uri() . $rel, array( 'gsap', 'gsap-scrolltrigger', 'lenis' ), filemtime( $abs ), true );
	}
}
add_action( 'wp_enqueue_scripts', 'cb_identityjs2026_enqueue_scripts' );
