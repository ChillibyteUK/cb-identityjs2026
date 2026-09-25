import { initNavToggle } from './nav-toggle';
import { initNavDropdowns } from './nav-dropdown';
import { initDialogs } from './dialog';
import { initLogoClipAnimate } from './logo-clip-animate';
import { initFooterLogoAnimate } from './footer-logo-animate';
import { initNavScrollBackground } from './nav-scroll-background';
import { initHomeIntroAnimate } from './home-intro-animate';
import { initTitleBarRevealAnimate } from './title-bar-reveal-animate';
import { initScrollAnimate } from './scroll-animate';
import { initLenis } from './lenis-init';
import { initFeatureOverlayParallax } from './feature-overlay-parallax';
import { initContentBuilderParallax, initContentBuilderImageHeights } from './content-builder';

// Each init ran unguarded in one synchronous block — a single throw (e.g. a
// third-party GSAP/ScrollTrigger internal error) killed every init after it
// in this list too, not just the one that failed. Isolating each call keeps
// one broken feature from taking the rest of the page's interactivity down
// with it.
function safeInit(fn, ...args) {
	try {
		fn(...args);
	} catch (error) {
		console.error(`[theme.js] ${fn.name || 'init'} failed:`, error);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	safeInit(initLenis);
	safeInit(initNavToggle);
	safeInit(initNavDropdowns);
	safeInit(initDialogs);
	safeInit(initLogoClipAnimate);
	safeInit(initFooterLogoAnimate);
	safeInit(initNavScrollBackground);
	safeInit(initHomeIntroAnimate);
	safeInit(initTitleBarRevealAnimate, '.page-header__animated-title', '.page-header');
	safeInit(initScrollAnimate);
	safeInit(initFeatureOverlayParallax);
	safeInit(initContentBuilderParallax);
	safeInit(initContentBuilderImageHeights);
});
