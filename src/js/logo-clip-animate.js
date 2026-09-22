/**
 * Logo reveal animation — ported verbatim from
 * cb-identity2025/src/js/custom-javascript.js's "header logo clip animation"
 * IIFE. Self-guarding: no-ops immediately if #site-logo-clip isn't on the
 * page, so it's safe to always run regardless of which brand's header is
 * active. See src/css/site/identity.css for the CSS half.
 */
export function initLogoClipAnimate() {
	const clip = document.getElementById('site-logo-clip');
	if (!clip) return;

	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		clip.style.setProperty('--logo-final-offset', '0px');
		clip.classList.add('animate');
		return;
	}

	// Compute and apply the pixel offset based on the #logo-bars group's bbox.
	function computeOffset() {
		const svg = clip.querySelector('svg');
		if (!svg) return;

		const leftGroup = svg.getElementById ? svg.getElementById('logo-bars') : svg.querySelector('#logo-bars');
		const group = leftGroup || svg.querySelector('g > g');

		let viewBoxWidth = 0;
		if (svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width) {
			viewBoxWidth = svg.viewBox.baseVal.width;
		} else {
			const vb = svg.getAttribute('viewBox');
			if (vb) viewBoxWidth = parseFloat(vb.split(' ')[2]) || 0;
		}

		if (!viewBoxWidth || !group || typeof group.getBBox !== 'function') {
			clip.style.setProperty('--logo-final-offset', '0px');
			return;
		}

		const bbox = group.getBBox();
		const visibleSvgUnits = bbox.x + bbox.width;
		const svgRect = svg.getBoundingClientRect();
		const svgDisplayWidth = svgRect.width || 0;
		const offsetPx = (visibleSvgUnits / viewBoxWidth) * svgDisplayWidth;
		const safeOffset = Math.ceil(offsetPx + 1);
		clip.style.setProperty('--logo-final-offset', `-${safeOffset}px`);
	}

	function trigger() {
		computeOffset();
		requestAnimationFrame(() => {
			setTimeout(() => clip.classList.add('animate'), 60);
		});
	}

	trigger();

	let resizeTimeout = null;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			clip.classList.remove('animate');
			computeOffset();
			void clip.offsetWidth;
			requestAnimationFrame(() => setTimeout(() => clip.classList.add('animate'), 60));
		}, 150);
	});
}
