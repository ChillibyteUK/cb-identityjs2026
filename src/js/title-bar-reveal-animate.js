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
import { recordInitError } from './record-init-error';

export function initTitleBarRevealAnimate(titleSelector, triggerSelector) {
	const title = document.querySelector(titleSelector);
	if (!title || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

	// .bar/.text both start at opacity: 0 in CSS (page-header.css) — this
	// timeline is the only thing that ever brings them to opacity: 1. If
	// GSAP/ScrollTrigger throws anywhere below (seen live: a mismatched
	// gsap.min.js/ScrollTrigger.min.js pair served mid-deploy), the whole
	// title stays invisible forever instead of just unanimated — reveal it
	// plainly instead.
	const revealPlainly = () => {
		title.querySelectorAll('.bar, .text').forEach((el) => {
			el.style.opacity = '1';
			el.style.transform = 'none';
		});
	};

	try {
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
	} catch (error) {
		recordInitError('[title-bar-reveal-animate] GSAP/ScrollTrigger failed', error);
		revealPlainly();
	}
}
