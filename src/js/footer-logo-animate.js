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
		clip.style.width = '100%';
		inner.style.transformOrigin = 'left center';
		inner.style.width = '200%';
		inner.style.display = 'block';
		inner.style.transform = 'translateX(0)';
		// Height is CSS aspect-ratio (see src/css/site/identity.css), not
		// JS-measured — a JS height lock is inherently racy against exactly
		// when this function runs relative to first paint, and got the
		// height wrong twice in a row for that reason. aspect-ratio is
		// correct from the very first frame, before any JS runs at all.
		if (prefersReduced) {
			inner.style.transform = 'translateX(-50%)';
			return;
		}
		const animDuration = 1.6;
		const gsapEase = 'power3.out';
		if (window.gsap && typeof window.gsap.to === 'function') {
			window.gsap.to(inner, { xPercent: -50, duration: animDuration, ease: gsapEase });
		} else {
			inner.style.transition = `transform ${animDuration}s cubic-bezier(.22,.9,.32,1)`;
			requestAnimationFrame(() => {
				inner.style.transform = 'translateX(-50%)';
			});
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

	let resizeTimer = null;
	window.addEventListener('resize', () => {
		if (triggered) return;
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			clip.style.width = '100%';
			inner.style.width = '200%';
		}, 120);
	});
}
