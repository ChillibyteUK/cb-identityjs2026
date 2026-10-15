/**
 * Count-up for the Stat Block's column layout. Port of cb-identitygroup2026's
 * own stat-hero counter (src/js/custom-javascript.js): each
 * .stat-block__stat-value carrying a data-stat-target animates from 0 to
 * that target over ~1.2s (ease-out cubic) the first time its block scrolls
 * into view. Values without the attribute (non-numeric by the time
 * render.php ran, e.g. legacy "40+" typed into a single field) are left
 * exactly as rendered — never zeroed out.
 */
export function initStatCountUp() {
	const blocks = document.querySelectorAll('.stat-block');
	if (!blocks.length) return;

	const prefersReducedMotion =
		window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const animateValue = (element) => {
		const target = Number(element.dataset.statTarget || 0);
		if (!Number.isFinite(target)) return;

		if (prefersReducedMotion || target === 0) {
			element.textContent = String(target);
			return;
		}

		const duration = 1200;
		const startTime = performance.now();

		const tick = (now) => {
			// Clamped both ends: a rAF timestamp can predate startTime by up
			// to a frame (vsync-aligned, and the observer can fire
			// immediately on a rapid refresh), and without the floor the
			// ease-out below goes negative — a "-1"/"-2" flash on frame one.
			const progress = Math.min(Math.max((now - startTime) / duration, 0), 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			element.textContent = String(Math.round(target * eased));
			if (progress < 1) window.requestAnimationFrame(tick);
		};

		window.requestAnimationFrame(tick);
	};

	// No IntersectionObserver (e.g. a very old browser at this project's
	// evergreen baseline shouldn't happen, but costs nothing to guard) —
	// set final values immediately rather than leaving every stat at "0".
	if (!('IntersectionObserver' in window)) {
		blocks.forEach((block) => {
			block.querySelectorAll('.stat-block__stat-value[data-stat-target]').forEach(animateValue);
		});
		return;
	}

	const observer = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target
					.querySelectorAll('.stat-block__stat-value[data-stat-target]')
					.forEach(animateValue);
				obs.unobserve(entry.target);
			});
		},
		{ threshold: 0.35 }
	);

	blocks.forEach((block) => observer.observe(block));
}
