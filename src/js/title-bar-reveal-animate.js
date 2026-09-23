/**
 * Staggered "bar reveal" title animation — the three-line
 * bar-slides-in-then-text-fades-in treatment shared by Home Intro and Page
 * Header's animated title. Originally duplicated per-block in both real
 * sources (cb-brand-title-text.php and cb-region-page-header.php each had
 * their own copy of this exact GSAP timeline) — built once here instead,
 * per identity-global-block-spec.md's Page Header note. Self-guarding:
 * no-ops without a matching title container, or without gsap/ScrollTrigger.
 *
 * @param {string} titleSelector   Container holding up to 3 `.line` rows,
 *                                 each with a `.barN`/`.textN` pair.
 * @param {string} triggerSelector ScrollTrigger's own trigger element —
 *                                 usually the title's parent section, not
 *                                 the title itself, matching both real
 *                                 sources' own trigger choice.
 */
export function initTitleBarRevealAnimate(titleSelector, triggerSelector) {
	const title = document.querySelector(titleSelector);
	if (!title || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

	window.gsap.registerPlugin(window.ScrollTrigger);

	const tl = window.gsap.timeline({
		defaults: { ease: 'power3.out' },
		scrollTrigger: {
			trigger: triggerSelector,
			start: 'top center',
			toggleActions: 'play none none none',
			once: true,
		},
	});

	tl.fromTo(`${titleSelector} .bar1`, { x: '-150%', opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 0)
		.fromTo(`${titleSelector} .bar2`, { x: '150%', opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 0.3)
		.fromTo(`${titleSelector} .bar3`, { x: '-150%', opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 0.6)
		.to(`${titleSelector} .bar1`, { rotate: -3, duration: 0.4 }, '+=0.1')
		.to(`${titleSelector} .bar2`, { rotate: 5, duration: 0.4 }, '-=0.3')
		.to(`${titleSelector} .bar3`, { rotate: -6, duration: 0.4 }, '-=0.3')
		.to(`${titleSelector} .text`, { opacity: 1, duration: 0.6, stagger: 0.2 }, '+=0.3');

	tl.timeScale(2);
}
