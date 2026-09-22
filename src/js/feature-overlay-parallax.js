/**
 * Feature Overlay's background-image parallax — the real source
 * (cb-image-feature-overlay.php, both cb-identity2025 and
 * cb-identitygroup2026) drives this with its own bespoke inline <script>
 * and a manual requestAnimationFrame loop per block instance. Reimplemented
 * here with GSAP's ScrollTrigger `scrub`, already loaded for Home Intro's
 * own animation (see inc/enqueue.php), instead of a second hand-rolled
 * scroll listener doing the same job. Self-guarding: no-ops without
 * gsap/ScrollTrigger, or without any .feature-overlay--has-background-image
 * element in the DOM — the image is simply static in that case, matching
 * this project's established fallback philosophy (see scroll-animate.js).
 */
export function initFeatureOverlayParallax() {
	const elements = document.querySelectorAll('.feature-overlay--has-background-image');
	if (!elements.length) return;

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReducedMotion || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

	window.gsap.registerPlugin(window.ScrollTrigger);

	elements.forEach((el) => {
		// Real source's own range: translateY swings ±120px (240px total)
		// across the block's full scroll traversal — matched here via
		// ScrollTrigger's scrub instead of the real source's manual
		// getBoundingClientRect()/rAF percentage math.
		window.gsap.fromTo(
			el,
			{ '--cb-image-feature-overlay-parallax-y': '-120px' },
			{
				'--cb-image-feature-overlay-parallax-y': '120px',
				ease: 'none',
				scrollTrigger: {
					trigger: el,
					start: 'top bottom',
					end: 'bottom top',
					scrub: true,
				},
			}
		);
	});
}
