/**
 * Home Intro's staggered title reveal — ported from
 * cb-identitygroup2026/blocks/cb-brand-title-text.php's inline
 * ScrollTrigger timeline (enqueued properly via gsap/gsap-scrolltrigger
 * vendor handles instead of the real source's raw per-instance CDN
 * <script> tags — see inc/enqueue.php). Self-guarding: no-ops without
 * .home-intro__title in the DOM.
 */
export function initHomeIntroAnimate() {
	const title = document.querySelector('.home-intro__title');
	if (!title || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

	window.gsap.registerPlugin(window.ScrollTrigger);

	const tl = window.gsap.timeline({
		defaults: { ease: 'power3.out' },
		scrollTrigger: {
			trigger: '.home-intro',
			start: 'top center',
			toggleActions: 'play none none none',
			once: true,
		},
	});

	tl.fromTo('.home-intro__title .bar1', { x: '-150%', opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 0)
		.fromTo('.home-intro__title .bar2', { x: '150%', opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 0.3)
		.fromTo('.home-intro__title .bar3', { x: '-150%', opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 0.6)
		.to('.home-intro__title .bar1', { rotate: -3, duration: 0.4 }, '+=0.1')
		.to('.home-intro__title .bar2', { rotate: 5, duration: 0.4 }, '-=0.3')
		.to('.home-intro__title .bar3', { rotate: -6, duration: 0.4 }, '-=0.3')
		.to('.home-intro__title .text', { opacity: 1, duration: 0.6, stagger: 0.2 }, '+=0.3');

	tl.timeScale(2);
}
