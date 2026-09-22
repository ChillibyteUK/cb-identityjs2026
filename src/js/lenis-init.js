/**
 * Smooth scroll — ported verbatim from identityglobal.com's own real inline
 * init script (confirmed live, 2026-09-22): plain Lenis defaults (smooth:
 * true, lerp: 0.1), driven by its own raw requestAnimationFrame loop, with
 * no explicit GSAP ScrollTrigger sync call — that's the real site's actual
 * setup, not a simplification. Self-guarding: no-ops if the Lenis global
 * isn't present.
 */
export function initLenis() {
	if (typeof window.Lenis === 'undefined') return;

	const lenis = new window.Lenis({
		smooth: true,
		lerp: 0.1,
	});

	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}
	requestAnimationFrame(raf);
}
