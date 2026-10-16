/**
 * Work Index behaviour, scoped per block instance so several can share a
 * page: the Service filter dropdown (client-side show/hide of cards by
 * their data-service-terms) and the hover-preview Vimeo iframe (mounted only
 * while a card is hovered/focused, so idle cards never hold a live player).
 * Ported from the inline <script> that used to live in
 * blocks/work-index/render.php. Self-guarding: no-ops without .work-index
 * in the DOM.
 */
export function initWorkIndex() {
	document.querySelectorAll('.work-index').forEach((block) => {
		const select = block.querySelector('.work-index__filter-select');
		const reset = block.querySelector('.work-index__filter-reset');

		if (select) {
			const applyFilter = () => {
				const value = select.value;
				block.querySelectorAll('.work-index__card').forEach((card) => {
					const terms = (card.getAttribute('data-service-terms') || '').split(' ');
					card.style.display = value === 'all' || terms.includes(value) ? '' : 'none';
				});
			};
			select.addEventListener('change', applyFilter);
			if (reset) {
				reset.addEventListener('click', () => {
					select.value = 'all';
					applyFilter();
				});
			}
		}

		block.querySelectorAll('[data-video-src]').forEach((container) => {
			const card = container.closest('a');
			if (!card) return;
			const src = container.getAttribute('data-video-src');
			const mountVideo = () => {
				if (container.querySelector('iframe')) return;
				const iframe = document.createElement('iframe');
				iframe.src = src;
				iframe.frameBorder = '0';
				iframe.allow = 'autoplay; fullscreen';
				iframe.allowFullscreen = true;
				container.appendChild(iframe);
			};
			const unmountVideo = () => {
				const iframe = container.querySelector('iframe');
				if (iframe) iframe.remove();
			};
			card.addEventListener('mouseenter', mountVideo);
			card.addEventListener('mouseleave', unmountVideo);
			card.addEventListener('focusin', mountVideo);
			card.addEventListener('focusout', unmountVideo);
		});
	});
}
