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

document.addEventListener('DOMContentLoaded', () => {
	initLenis();
	initNavToggle();
	initNavDropdowns();
	initDialogs();
	initLogoClipAnimate();
	initFooterLogoAnimate();
	initNavScrollBackground();
	initHomeIntroAnimate();
	initTitleBarRevealAnimate('.page-header__animated-title', '.page-header');
	initScrollAnimate();
	initFeatureOverlayParallax();
	initContentBuilderParallax();
	initContentBuilderImageHeights();
});
