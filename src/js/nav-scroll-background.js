/**
 * Toggles .scrolled on #masthead past 50px scroll — ported from
 * cb-identity2025/cb-identitygroup2026's inline script
 * ("Add background to navbar on scroll"). CSS half in
 * src/css/site/identity.css (solid at rest, translucent once scrolled).
 * Self-guarding: no-ops without #masthead in the DOM.
 */
export function initNavScrollBackground() {
	const navbar = document.getElementById('masthead');
	if (!navbar) return;

	function addNavbarBackground() {
		navbar.classList.toggle('scrolled', window.scrollY > 50);
	}

	window.addEventListener('scroll', addNavbarBackground);
	addNavbarBackground();
}
