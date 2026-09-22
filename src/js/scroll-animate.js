/**
 * Generic scroll-triggered "fade up" entrance reveal, GSAP-based — the
 * shared replacement for the old theme's AOS.js `data-aos="fade-up"`
 * attribute. AOS itself was never adopted here; this project already
 * loads GSAP + ScrollTrigger for Home Intro's own animation (see
 * inc/enqueue.php), so this reuses those instead of a second library.
 *
 * Usage: add `data-animate="fade-up"` to any element, optionally
 * `data-animate-delay="100"` (milliseconds — matches the old theme's own
 * per-row `$c += 100` delay convention, e.g. About Detail/Service Detail's
 * rows) for a staggered reveal across a list. Self-guarding: no-ops
 * without gsap/ScrollTrigger, or without any [data-animate="fade-up"]
 * element in the DOM.
 */
export function initScrollAnimate() {
	const elements = document.querySelectorAll('[data-animate="fade-up"]');
	if (!elements.length) return;

	// base.css hides these elements (opacity: 0) under .js by default, so
	// GSAP only ever animates them back into view rather than visibly
	// hiding an already-painted element itself (see base.css's own comment
	// for the flash this replaced). If gsap/ScrollTrigger failed to load
	// for any reason, that CSS-hidden state would otherwise never get
	// undone — reveal everything plainly instead of leaving it invisible.
	// Same immediate-reveal fallback for prefers-reduced-motion: CSS still
	// hides these elements under .js regardless of this preference (it has
	// no way to know it), so it's this script's job to undo that hidden
	// state for a reduced-motion visitor rather than skip straight to
	// "just don't animate" and leave base.css's opacity: 0 in place.
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReducedMotion || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
		elements.forEach((el) => {
			el.style.opacity = '1';
			el.style.transform = 'none';
		});
		return;
	}

	window.gsap.registerPlugin(window.ScrollTrigger);

	// Trigger positions computed at DOMContentLoaded can be stale by the
	// time images/fonts below finish loading and shift the page taller —
	// confirmed live: without this, rows already inside the viewport at
	// full-page-load time never fire their reveal at all, since
	// ScrollTrigger only dispatches toggleActions on an observed crossing,
	// not retroactively once a later refresh() repositions an already-passed
	// trigger.
	window.addEventListener('load', () => window.ScrollTrigger.refresh());

	elements.forEach((el) => {
		const delay = Number(el.dataset.animateDelay || 0) / 1000;

		// .to(), not .fromTo() — the "from" state (opacity: 0, translated) is
		// already set by base.css before first paint; setting it again here
		// would apply it a second time via JS, after the element has already
		// painted at its normal (visible) styles, which is the exact flash
		// this whole CSS-first approach exists to avoid.
		window.gsap.to(el, {
			y: 0,
			opacity: 1,
			duration: 0.6,
			delay,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: el,
				start: 'top 85%',
				toggleActions: 'play none none none',
				once: true,
			},
		});
	});
}
