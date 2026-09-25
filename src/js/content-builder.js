/**
 * Content Builder's background-image parallax — same GSAP ScrollTrigger
 * `scrub` reimplementation already used for Feature Overlay's own parallax
 * (see feature-overlay-parallax.js), in place of the real source's bespoke
 * inline <script>/requestAnimationFrame loop. Self-guarding: no-ops without
 * gsap/ScrollTrigger, or without any .content-builder--has-background-image
 * element in the DOM.
 */
export function initContentBuilderParallax() {
	const elements = document.querySelectorAll('.content-builder--has-background-image');
	if (!elements.length) return;

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReducedMotion || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

	window.gsap.registerPlugin(window.ScrollTrigger);

	elements.forEach((el) => {
		window.gsap.fromTo(
			el,
			{ '--content-builder-parallax-y': '-120px' },
			{
				'--content-builder-parallax-y': '120px',
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

/**
 * Matches the rendered height of every `.content-builder__image-wrap`
 * within a row to the tallest one, for any row with 2+ image modules —
 * pure runtime measurement in the real source (not derivable from any ACF
 * field or static CSS), ported here near-verbatim since it's DOM
 * measurement, not an animation GSAP would help with. Re-runs on load and
 * on a debounced resize, matching the real source's own timing.
 */
export function initContentBuilderImageHeights() {
	const rows = document.querySelectorAll('.content-builder__row');
	if (!rows.length) return;

	function matchImageHeights() {
		rows.forEach((row) => {
			const wraps = row.querySelectorAll('.content-builder__module--image .content-builder__image-wrap');
			if (wraps.length < 2) return;

			wraps.forEach((wrap) => {
				wrap.style.height = '';
			});

			const tallest = Math.max(...Array.from(wraps).map((wrap) => wrap.getBoundingClientRect().height));
			wraps.forEach((wrap) => {
				wrap.style.height = `${tallest}px`;
			});
		});
	}

	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(matchImageHeights, 100);
	});

	matchImageHeights();

	// This runs at DOMContentLoaded, well before images finish downloading —
	// any <img> that hasn't loaded yet measures 0 height, so the "tallest"
	// wrap in a row can be 0 (collapsing every wrap in it to invisible) or
	// based on whichever one image happened to already be cached, and
	// nothing here re-measures once the rest actually load in (only resize
	// did). Re-run once every image in a 2+-image row has loaded or errored.
	const images = Array.from(rows).flatMap((row) =>
		Array.from(row.querySelectorAll('.content-builder__module--image .content-builder__image-wrap img'))
	);
	let pending = images.filter((img) => !img.complete).length;
	if (pending > 0) {
		images.forEach((img) => {
			if (img.complete) return;
			const onLoadOrError = () => {
				pending -= 1;
				if (pending === 0) matchImageHeights();
			};
			img.addEventListener('load', onLoadOrError, { once: true });
			img.addEventListener('error', onLoadOrError, { once: true });
		});
	}
}
