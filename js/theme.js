/*!
 * cb-identityjs2026 v1.0.0 (https://github.com/ChillibyteUK/cb-identityjs2026)
 * Copyright 2026 Chillibyte - DS
 * Licensed under GPL-3.0
 */
(function () {
	'use strict';

	/**
	 * Mobile nav toggle. Wires any button with aria-controls pointing at a
	 * .navbar-collapse to show/hide it and keep aria-expanded in sync — this is
	 * the entire replacement for Bootstrap's Collapse component for this use case.
	 */
	function initNavToggle() {
	  document.querySelectorAll('.navbar-toggler[aria-controls]').forEach(toggler => {
	    const target = document.getElementById(toggler.getAttribute('aria-controls'));
	    if (!target) return;
	    toggler.addEventListener('click', () => {
	      const isOpen = target.classList.toggle('is-open');
	      toggler.setAttribute('aria-expanded', String(isOpen));
	    });

	    // Close after choosing a link — expected mobile nav behaviour.
	    target.querySelectorAll('a').forEach(link => {
	      link.addEventListener('click', () => {
	        target.classList.remove('is-open');
	        toggler.setAttribute('aria-expanded', 'false');
	      });
	    });
	  });
	}

	/**
	 * Click-to-open nav dropdowns. Each dropdown-toggle button shows/hides its
	 * linked .dropdown-menu and keeps aria-expanded in sync. Clicking elsewhere,
	 * or pressing Escape, closes whatever is open — this is the entire
	 * replacement for hover-based submenus.
	 */
	function initNavDropdowns() {
	  const toggles = document.querySelectorAll('.dropdown-toggle[aria-controls]');
	  function close(toggle) {
	    const menu = document.getElementById(toggle.getAttribute('aria-controls'));
	    if (!menu) return;
	    menu.classList.remove('is-open');
	    toggle.setAttribute('aria-expanded', 'false');
	  }
	  function closeAllExcept(except) {
	    toggles.forEach(toggle => {
	      if (toggle !== except) close(toggle);
	    });
	  }
	  toggles.forEach(toggle => {
	    const menu = document.getElementById(toggle.getAttribute('aria-controls'));
	    if (!menu) return;
	    toggle.addEventListener('click', event => {
	      event.stopPropagation();
	      const isOpen = menu.classList.toggle('is-open');
	      toggle.setAttribute('aria-expanded', String(isOpen));
	      closeAllExcept(toggle);
	    });
	  });
	  document.addEventListener('click', event => {
	    if (event.target.closest('.dropdown-menu')) return;
	    closeAllExcept();
	  });
	  document.addEventListener('keydown', event => {
	    if (event.key !== 'Escape') return;
	    const openToggle = Array.from(toggles).find(toggle => toggle.getAttribute('aria-expanded') === 'true');
	    closeAllExcept();
	    if (openToggle) openToggle.focus();
	  });
	}

	/**
	 * Native <dialog> wiring — replaces Bootstrap's Modal component entirely.
	 * showModal()/close() do the heavy lifting (focus trap, Escape-to-close,
	 * ::backdrop); this just connects trigger/close buttons to a target dialog.
	 *
	 * Markup:
	 *   <button data-dialog-target="my-dialog">Open</button>
	 *   <dialog id="my-dialog">
	 *     <button data-dialog-close>Close</button>
	 *     ...
	 *   </dialog>
	 */
	function initDialogs() {
	  document.querySelectorAll('[data-dialog-target]').forEach(trigger => {
	    const dialog = document.getElementById(trigger.getAttribute('data-dialog-target'));
	    if (!(dialog instanceof HTMLDialogElement)) return;
	    trigger.addEventListener('click', () => dialog.showModal());
	    dialog.querySelectorAll('[data-dialog-close]').forEach(closeBtn => {
	      closeBtn.addEventListener('click', () => dialog.close());
	    });

	    // Click on the backdrop (the dialog element itself, outside its content) closes it.
	    dialog.addEventListener('click', event => {
	      if (event.target === dialog) dialog.close();
	    });
	  });
	}

	/**
	 * Logo reveal animation — ported verbatim from
	 * cb-identity2025/src/js/custom-javascript.js's "header logo clip animation"
	 * IIFE. Self-guarding: no-ops immediately if #site-logo-clip isn't on the
	 * page, so it's safe to always run regardless of which brand's header is
	 * active. See src/css/site/identity.css for the CSS half.
	 */
	function initLogoClipAnimate() {
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
	    const offsetPx = visibleSvgUnits / viewBoxWidth * svgDisplayWidth;
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

	/**
	 * Records a caught init/animation error to `window.__cbInitErrors` for
	 * inspection in devtools. console.error alone isn't enough on this theme —
	 * terser.config.json has drop_console: true, so every console.error call
	 * is stripped from the js/theme.min.js that actually ships. This survives
	 * that stripping since it's plain property access, not a console call.
	 *
	 * @param {string} source  Which script/function caught the error, e.g.
	 *                         '[scroll-animate] gsap.to'.
	 * @param {Error}  error
	 */
	function recordInitError(source, error) {
	  window.__cbInitErrors = window.__cbInitErrors || [];
	  window.__cbInitErrors.push({
	    source,
	    message: error?.message,
	    stack: error?.stack
	  });
	  console.error(source, error);
	}

	/**
	 * Footer logo reveal — ported from cb-identity2025/footer.php's inline
	 * script. Self-guarding: no-ops without #footer-logo-clip in the DOM, safe
	 * to always run regardless of which brand's footer is active. Uses GSAP
	 * (js/vendor/gsap.min.js) when present, a plain CSS-transition fallback
	 * otherwise — same dual path as the real source.
	 */
	function initFooterLogoAnimate() {
	  const clip = document.getElementById('footer-logo-clip');
	  const inner = document.getElementById('footer-logo-inner');
	  const svg = document.getElementById('footer-logo-svg');
	  if (!clip || !inner || !svg) return;
	  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	  let triggered = false;
	  function prepareAndAnimate() {
	    // Resting state (clip 100%, inner 200%, untransformed) and height
	    // (aspect-ratio) are CSS defaults — see .footer__logo-clip and
	    // .footer__logo-inner in src/css/site/identity.css — correct from
	    // the very first paint, before this function ever runs. Setting
	    // them here too, on a delay gated behind IntersectionObserver, was
	    // the cause of a visible 100%->200% snap; this function now only
	    // ever changes `transform`.
	    if (prefersReduced) {
	      inner.style.transform = 'translateX(-50%)';
	      return;
	    }
	    const animDuration = 1.6;
	    const gsapEase = 'power3.out';
	    const cssFallback = () => {
	      inner.style.transition = `transform ${animDuration}s cubic-bezier(.22,.9,.32,1)`;
	      requestAnimationFrame(() => {
	        inner.style.transform = 'translateX(-50%)';
	      });
	    };
	    if (window.gsap && typeof window.gsap.to === 'function') {
	      try {
	        window.gsap.to(inner, {
	          xPercent: -50,
	          duration: animDuration,
	          ease: gsapEase
	        });
	      } catch (error) {
	        // Same GSAP-internal-throw failure mode as the other animation
	        // scripts here — fall back to the plain CSS-transition path
	        // this function already has, rather than leaving inner stuck
	        // untransformed (showing the wrong half of the wordmark).
	        recordInitError('[footer-logo-animate] gsap.to failed', error);
	        cssFallback();
	      }
	    } else {
	      cssFallback();
	    }
	  }
	  function triggerIfVisible(el) {
	    const rect = el.getBoundingClientRect();
	    const vh = window.innerHeight || document.documentElement.clientHeight;
	    return rect.top < vh && rect.bottom > 0;
	  }
	  const triggerEl = document.querySelector('.footer__colophon') || document.querySelector('.footer__logo') || clip;
	  if (triggerEl) {
	    const observer = new IntersectionObserver((entries, obs) => {
	      entries.forEach(entry => {
	        if (triggered) return;
	        if (entry.isIntersecting && entry.intersectionRatio > 0) {
	          triggered = true;
	          prepareAndAnimate();
	          obs.disconnect();
	        }
	      });
	    }, {
	      rootMargin: '0px 0px -10px 0px',
	      threshold: [0.1]
	    });
	    observer.observe(triggerEl);
	    if (triggerIfVisible(triggerEl)) {
	      triggered = true;
	      prepareAndAnimate();
	      observer.disconnect();
	    }
	  }
	}

	/**
	 * Toggles .scrolled on #masthead past 50px scroll — ported from
	 * cb-identity2025/cb-identitygroup2026's inline script
	 * ("Add background to navbar on scroll"). CSS half in
	 * src/css/site/identity.css (solid at rest, translucent once scrolled).
	 * Self-guarding: no-ops without #masthead in the DOM.
	 */
	function initNavScrollBackground() {
	  const navbar = document.getElementById('masthead');
	  if (!navbar) return;
	  function addNavbarBackground() {
	    navbar.classList.toggle('scrolled', window.scrollY > 50);
	  }
	  window.addEventListener('scroll', addNavbarBackground);
	  addNavbarBackground();
	}

	/**
	 * Staggered "bar reveal" title animation — the three-line
	 * bar-slides-in-then-text-fades-in treatment shared by Home Intro and Page
	 * Header's animated title. Originally duplicated per-block in both real
	 * sources (cb-brand-title-text.php and cb-region-page-header.php each had
	 * their own copy of this exact GSAP timeline) — built once here instead,
	 * per identity-global-block-spec.md's Page Header note. Self-guarding:
	 * no-ops without a matching title container, or without gsap/ScrollTrigger.
	 *
	 * @param {string} titleSelector   Container holding up to 3 `.line` rows,
	 *                                 each with a `.barN`/`.textN` pair.
	 * @param {string} triggerSelector ScrollTrigger's own trigger element —
	 *                                 usually the title's parent section, not
	 *                                 the title itself, matching both real
	 *                                 sources' own trigger choice.
	 */
	function initTitleBarRevealAnimate(titleSelector, triggerSelector) {
	  const title = document.querySelector(titleSelector);
	  if (!title || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

	  // .bar/.text both start at opacity: 0 in CSS (page-header.css) — this
	  // timeline is the only thing that ever brings them to opacity: 1. If
	  // GSAP/ScrollTrigger throws anywhere below (seen live: a mismatched
	  // gsap.min.js/ScrollTrigger.min.js pair served mid-deploy), the whole
	  // title stays invisible forever instead of just unanimated — reveal it
	  // plainly instead.
	  const revealPlainly = () => {
	    title.querySelectorAll('.bar, .text').forEach(el => {
	      el.style.opacity = '1';
	      el.style.transform = 'none';
	    });
	  };
	  try {
	    window.gsap.registerPlugin(window.ScrollTrigger);
	    const tl = window.gsap.timeline({
	      defaults: {
	        ease: 'power3.out'
	      },
	      scrollTrigger: {
	        trigger: triggerSelector,
	        start: 'top center',
	        toggleActions: 'play none none none',
	        once: true
	      }
	    });
	    tl.fromTo(`${titleSelector} .bar1`, {
	      x: '-150%',
	      opacity: 0
	    }, {
	      x: 0,
	      opacity: 1,
	      duration: 0.8
	    }, 0).fromTo(`${titleSelector} .bar2`, {
	      x: '150%',
	      opacity: 0
	    }, {
	      x: 0,
	      opacity: 1,
	      duration: 0.8
	    }, 0.3).fromTo(`${titleSelector} .bar3`, {
	      x: '-150%',
	      opacity: 0
	    }, {
	      x: 0,
	      opacity: 1,
	      duration: 0.8
	    }, 0.6).to(`${titleSelector} .bar1`, {
	      rotate: -3,
	      duration: 0.4
	    }, '+=0.1').to(`${titleSelector} .bar2`, {
	      rotate: 5,
	      duration: 0.4
	    }, '-=0.3').to(`${titleSelector} .bar3`, {
	      rotate: -6,
	      duration: 0.4
	    }, '-=0.3').to(`${titleSelector} .text`, {
	      opacity: 1,
	      duration: 0.6,
	      stagger: 0.2
	    }, '+=0.3');
	    tl.timeScale(2);
	  } catch (error) {
	    recordInitError('[title-bar-reveal-animate] GSAP/ScrollTrigger failed', error);
	    revealPlainly();
	  }
	}

	/**
	 * Home Intro's title reveal now lives in the shared
	 * title-bar-reveal-animate.js (see its own header comment) — Page Header's
	 * animated title needed the exact same GSAP timeline, and
	 * identity-global-block-spec.md's Page Header entry is explicit that it
	 * must be "build it once as a shared component, not copied per block".
	 * This file is kept only so nothing importing the old name breaks.
	 */
	function initHomeIntroAnimate() {
	  initTitleBarRevealAnimate('.home-intro__title', '.home-intro');
	}

	/**
	 * Generic scroll-triggered "fade up" entrance reveal, GSAP-based — the
	 * shared replacement for the old theme's AOS.js `data-aos="fade-up"`
	 * attribute. AOS itself was never adopted here; this project already
	 * loads GSAP + ScrollTrigger for Home Intro's own animation (see
	 * inc/enqueue.php), so this reuses those instead of a second library.
	 *
	 * Usage: add `data-animate="fade-up"` to any element, optionally
	 * `data-animate-delay="100"` (milliseconds — matches the old theme's own
	 * per-row `$c += 100` delay convention, e.g. About Detail/Service Detail's
	 * rows) for a staggered reveal across a list. Self-guarding: no-ops
	 * without gsap/ScrollTrigger, or without any [data-animate="fade-up"]
	 * element in the DOM.
	 */
	function initScrollAnimate() {
	  const elements = document.querySelectorAll('[data-animate="fade-up"]');
	  if (!elements.length) return;

	  // base.css hides these elements (opacity: 0) under .js by default, so
	  // GSAP only ever animates them back into view rather than visibly
	  // hiding an already-painted element itself (see base.css's own comment
	  // for the flash this replaced). If gsap/ScrollTrigger failed to load
	  // for any reason, that CSS-hidden state would otherwise never get
	  // undone — reveal everything plainly instead of leaving it invisible.
	  // Same immediate-reveal fallback for prefers-reduced-motion: CSS still
	  // hides these elements under .js regardless of this preference (it has
	  // no way to know it), so it's this script's job to undo that hidden
	  // state for a reduced-motion visitor rather than skip straight to
	  // "just don't animate" and leave base.css's opacity: 0 in place.
	  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	  if (prefersReducedMotion || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
	    elements.forEach(el => {
	      el.style.opacity = '1';
	      el.style.transform = 'none';
	    });
	    return;
	  }
	  try {
	    window.gsap.registerPlugin(window.ScrollTrigger);
	  } catch (error) {
	    // registerPlugin/ScrollTrigger itself can throw when a mismatched
	    // gsap.min.js/ScrollTrigger.min.js pair gets served mid-deploy,
	    // before both files' cache-busted URLs settle to the same build.
	    // When it does, nothing below can safely run, so reveal everything
	    // immediately rather than leave it CSS-hidden forever.
	    recordInitError('[scroll-animate] ScrollTrigger.registerPlugin failed', error);
	    elements.forEach(el => {
	      el.style.opacity = '1';
	      el.style.transform = 'none';
	    });
	    return;
	  }

	  // Trigger positions computed at DOMContentLoaded can be stale by the
	  // time images/fonts below finish loading and shift the page taller —
	  // confirmed live: without this, rows already inside the viewport at
	  // full-page-load time never fire their reveal at all, since
	  // ScrollTrigger only dispatches toggleActions on an observed crossing,
	  // not retroactively once a later refresh() repositions an already-passed
	  // trigger.
	  window.addEventListener('load', () => {
	    try {
	      window.ScrollTrigger.refresh();
	    } catch (error) {
	      recordInitError('[scroll-animate] ScrollTrigger.refresh failed', error);
	    }
	  });
	  elements.forEach(el => {
	    const delay = Number(el.dataset.animateDelay || 0) / 1000;
	    try {
	      // .to(), not .fromTo() — the "from" state (opacity: 0, translated) is
	      // already set by base.css before first paint; setting it again here
	      // would apply it a second time via JS, after the element has already
	      // painted at its normal (visible) styles, which is the exact flash
	      // this whole CSS-first approach exists to avoid.
	      window.gsap.to(el, {
	        y: 0,
	        opacity: 1,
	        duration: 0.6,
	        delay,
	        ease: 'power2.out',
	        scrollTrigger: {
	          trigger: el,
	          start: 'top 85%',
	          toggleActions: 'play none none none',
	          once: true
	        }
	      });
	    } catch (error) {
	      // Same failure mode as the registerPlugin guard above, scoped to
	      // one element's own ScrollTrigger — one bad trigger shouldn't
	      // leave that element (or halt the rest of this loop) invisible.
	      recordInitError('[scroll-animate] gsap.to/ScrollTrigger failed for element', error);
	      el.style.opacity = '1';
	      el.style.transform = 'none';
	    }
	  });
	}

	/**
	 * Smooth scroll — ported verbatim from identityglobal.com's own real inline
	 * init script (confirmed live, 2026-09-22): plain Lenis defaults (smooth:
	 * true, lerp: 0.1), driven by its own raw requestAnimationFrame loop, with
	 * no explicit GSAP ScrollTrigger sync call — that's the real site's actual
	 * setup, not a simplification. Self-guarding: no-ops if the Lenis global
	 * isn't present.
	 */
	function initLenis() {
	  if (typeof window.Lenis === 'undefined') return;
	  const lenis = new window.Lenis({
	    smooth: true,
	    lerp: 0.1
	  });
	  function raf(time) {
	    lenis.raf(time);
	    requestAnimationFrame(raf);
	  }
	  requestAnimationFrame(raf);
	}

	/**
	 * Feature Overlay's background-image parallax — the real source
	 * (cb-image-feature-overlay.php, both cb-identity2025 and
	 * cb-identitygroup2026) drives this with its own bespoke inline <script>
	 * and a manual requestAnimationFrame loop per block instance. Reimplemented
	 * here with GSAP's ScrollTrigger `scrub`, already loaded for Home Intro's
	 * own animation (see inc/enqueue.php), instead of a second hand-rolled
	 * scroll listener doing the same job. Self-guarding: no-ops without
	 * gsap/ScrollTrigger, or without any .feature-overlay--has-background-image
	 * element in the DOM — the image is simply static in that case, matching
	 * this project's established fallback philosophy (see scroll-animate.js).
	 */
	function initFeatureOverlayParallax() {
	  const elements = document.querySelectorAll('.feature-overlay--has-background-image');
	  if (!elements.length) return;
	  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	  if (prefersReducedMotion || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;
	  window.gsap.registerPlugin(window.ScrollTrigger);
	  elements.forEach(el => {
	    // Real source's own range: translateY swings ±120px (240px total)
	    // across the block's full scroll traversal — matched here via
	    // ScrollTrigger's scrub instead of the real source's manual
	    // getBoundingClientRect()/rAF percentage math.
	    window.gsap.fromTo(el, {
	      '--cb-image-feature-overlay-parallax-y': '-120px'
	    }, {
	      '--cb-image-feature-overlay-parallax-y': '120px',
	      ease: 'none',
	      scrollTrigger: {
	        trigger: el,
	        start: 'top bottom',
	        end: 'bottom top',
	        scrub: true
	      }
	    });
	  });
	}

	/**
	 * Content Builder's background-image parallax — same GSAP ScrollTrigger
	 * `scrub` reimplementation already used for Feature Overlay's own parallax
	 * (see feature-overlay-parallax.js), in place of the real source's bespoke
	 * inline <script>/requestAnimationFrame loop. Self-guarding: no-ops without
	 * gsap/ScrollTrigger, or without any .content-builder--has-background-image
	 * element in the DOM.
	 */
	function initContentBuilderParallax() {
	  const elements = document.querySelectorAll('.content-builder--has-background-image');
	  if (!elements.length) return;
	  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	  if (prefersReducedMotion || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;
	  window.gsap.registerPlugin(window.ScrollTrigger);
	  elements.forEach(el => {
	    window.gsap.fromTo(el, {
	      '--content-builder-parallax-y': '-120px'
	    }, {
	      '--content-builder-parallax-y': '120px',
	      ease: 'none',
	      scrollTrigger: {
	        trigger: el,
	        start: 'top bottom',
	        end: 'bottom top',
	        scrub: true
	      }
	    });
	  });
	}

	/**
	 * Matches the rendered height of every `.content-builder__image-wrap`
	 * within a row to the tallest one, for any row with 2+ image modules —
	 * pure runtime measurement in the real source (not derivable from any ACF
	 * field or static CSS), ported here near-verbatim since it's DOM
	 * measurement, not an animation GSAP would help with. Re-runs on load and
	 * on a debounced resize, matching the real source's own timing.
	 */
	function initContentBuilderImageHeights() {
	  const rows = document.querySelectorAll('.content-builder__row');
	  if (!rows.length) return;
	  function matchImageHeights() {
	    rows.forEach(row => {
	      const wraps = row.querySelectorAll('.content-builder__module--image .content-builder__image-wrap');
	      if (wraps.length < 2) return;
	      wraps.forEach(wrap => {
	        wrap.style.height = '';
	      });
	      const tallest = Math.max(...Array.from(wraps).map(wrap => wrap.getBoundingClientRect().height));
	      wraps.forEach(wrap => {
	        wrap.style.height = `${tallest}px`;
	      });
	    });
	  }
	  let resizeTimer;
	  window.addEventListener('resize', () => {
	    clearTimeout(resizeTimer);
	    resizeTimer = setTimeout(matchImageHeights, 100);
	  });
	  matchImageHeights();
	}

	// Each init ran unguarded in one synchronous block — a single throw (e.g. a
	// third-party GSAP/ScrollTrigger internal error) killed every init after it
	// in this list too, not just the one that failed. Isolating each call keeps
	// one broken feature from taking the rest of the page's interactivity down
	// with it.
	function safeInit(fn, ...args) {
	  try {
	    fn(...args);
	  } catch (error) {
	    recordInitError(`[theme.js] ${fn.name || 'init'} failed`, error);
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

})();
//# sourceMappingURL=theme.js.map
