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
export function recordInitError(source, error) {
	window.__cbInitErrors = window.__cbInitErrors || [];
	window.__cbInitErrors.push({ source, message: error?.message, stack: error?.stack });
	console.error(source, error);
}
