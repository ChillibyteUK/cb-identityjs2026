/**
 * Footer logo reveal — ported from cb-identity2025/footer.php's inline
 * script. Self-guarding: no-ops without #footer-logo-clip in the DOM, safe
 * to always run regardless of which brand's footer is active. Uses GSAP
 * (js/vendor/gsap.min.js) when present, a plain CSS-transition fallback
 * otherwise — same dual path as the real source.
 */
export function initFooterLogoAnimate() {
	const clip = document.getElementById('footer-logo-clip');
	const inner = document.getElementById('footer-logo-inner');
	const svg = document.getElementById('footer-logo-svg');
	if (!clip || !inner || !svg) return;

	const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	let triggered = false;

	function prepareAndAnimate() {
		// Resting state (clip 100%, inner 200%, untransformed) and height
		// (aspect-ratio) are CSS defaults — see .footer__logo-clip and
		// .footer__logo-inner in src/css/site/identity.css — correct from
		// the very first paint, before this function ever runs. Setting
		// them here too, on a delay gated behind IntersectionObserver, was
		// the cause of a visible 100%->200% snap; this function now only
		// ever changes `transform`.
		if (prefersReduced) {
			inner.style.transform = 'translateX(-50%)';
			return;
		}
		const animDuration = 1.6;
		const gsapEase = 'power3.out';
		const cssFallback = () => {
			inner.style.transition = `transform ${animDuration}s cubic-bezier(.22,.9,.32,1)`;
			requestAnimationFrame(() => {
				inner.style.transform = 'translateX(-50%)';
			});
		};
		if (window.gsap && typeof window.gsap.to === 'function') {
			try {
				window.gsap.to(inner, { xPercent: -50, duration: animDuration, ease: gsapEase });
			} catch (error) {
				// Same GSAP-internal-throw failure mode as the other animation
				// scripts here — fall back to the plain CSS-transition path
				// this function already has, rather than leaving inner stuck
				// untransformed (showing the wrong half of the wordmark).
				console.error('[footer-logo-animate] gsap.to failed:', error);
				cssFallback();
			}
		} else {
			cssFallback();
		}
	}

	function triggerIfVisible(el) {
		const rect = el.getBoundingClientRect();
		const vh = window.innerHeight || document.documentElement.clientHeight;
		return rect.top < vh && rect.bottom > 0;
	}

	const triggerEl = document.querySelector('.footer__colophon') || document.querySelector('.footer__logo') || clip;

	if (triggerEl) {
		const observer = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (triggered) return;
					if (entry.isIntersecting && entry.intersectionRatio > 0) {
						triggered = true;
						prepareAndAnimate();
						obs.disconnect();
					}
				});
			},
			{ rootMargin: '0px 0px -10px 0px', threshold: [0.1] }
		);

		observer.observe(triggerEl);

		if (triggerIfVisible(triggerEl)) {
			triggered = true;
			prepareAndAnimate();
			observer.disconnect();
		}
	}
}
