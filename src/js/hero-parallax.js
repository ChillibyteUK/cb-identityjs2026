/**
 * Background-image parallax for hero blocks — any element with
 * `data-hero-parallax` (About Hero, Page Header's Plain variant) gets
 * `--hero-parallax-y` swung from -120px to +120px across its scroll
 * traversal, the same 240px range as the legacy per-instance inline scripts
 * (cb-about-hero / cb-plain-hero) this replaces. Same ScrollTrigger-scrub
 * approach as feature-overlay-parallax.js. Self-guarding: no-ops without
 * gsap/ScrollTrigger or without any matching element, and the image is simply
 * static under reduced motion.
 */
export function initHeroParallax() {
	const elements = document.querySelectorAll('[data-hero-parallax]');
	if (!elements.length) return;

	// The background image stays hidden (src/blocks/hero-parallax.css) until this
	// has put it at its real parallax offset — otherwise it paints at 0 first and
	// visibly jumps once GSAP applies the offset. A CSS failsafe reveals it anyway
	// if this never runs.
	const reveal = () =>
		requestAnimationFrame(() => {
			elements.forEach((el) => el.setAttribute('data-hero-ready', ''));
		});

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReducedMotion || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
		reveal();
		return;
	}

	window.gsap.registerPlugin(window.ScrollTrigger);

	elements.forEach((el) => {
		window.gsap.fromTo(
			el,
			{ '--hero-parallax-y': '-120px' },
			{
				'--hero-parallax-y': '120px',
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

	reveal();
}
