/**
 * Home Intro's title reveal now lives in the shared
 * title-bar-reveal-animate.js (see its own header comment) — Page Header's
 * animated title needed the exact same GSAP timeline, and
 * identity-global-block-spec.md's Page Header entry is explicit that it
 * must be "build it once as a shared component, not copied per block".
 * This file is kept only so nothing importing the old name breaks.
 */
import { initTitleBarRevealAnimate } from './title-bar-reveal-animate';

export function initHomeIntroAnimate() {
	initTitleBarRevealAnimate('.home-intro__title', '.home-intro');
}
