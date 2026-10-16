/**
 * Mute/Unmute toggle for Vimeo iframes (Media Panel hero mode, Case Study
 * Hero) — ported from Media Panel's former inline script. Each
 * .video-unmute[data-video-id] button controls the iframe with that id via
 * the Vimeo Player API (player.js, enqueued by the PHP helper).
 *
 * player.js can itself be delayed by CDN/script-delay layers, so retry
 * briefly rather than giving up on the first check. Self-guarding: no-ops
 * without a .video-unmute button in the DOM.
 */
function wireUnmute(button, attemptsLeft) {
	const iframe = document.getElementById(button.dataset.videoId);
	if (!iframe) return;

	if (typeof window.Vimeo === 'undefined') {
		if (attemptsLeft > 0) {
			setTimeout(() => wireUnmute(button, attemptsLeft - 1), 200);
		}
		return;
	}

	const player = new window.Vimeo.Player(iframe);
	button.addEventListener('click', () => {
		player.getMuted().then((isMuted) => {
			player.setMuted(!isMuted);
			button.textContent = isMuted ? button.dataset.labelUnmuted : button.dataset.labelMuted;
			button.classList.toggle('video-unmute--playing', isMuted);
			button.blur();
		});
	});
}

export function initVideoUnmute() {
	document.querySelectorAll('.video-unmute[data-video-id]').forEach((button) => wireUnmute(button, 25));
}
