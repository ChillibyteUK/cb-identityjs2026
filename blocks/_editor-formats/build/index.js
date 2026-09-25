/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/block-editor"
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
(module) {

module.exports = window["wp"]["blockEditor"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "@wordpress/rich-text"
/*!**********************************!*\
  !*** external ["wp","richText"] ***!
  \**********************************/
(module) {

module.exports = window["wp"]["richText"];

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			const getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.hasOwn(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************************************!*\
  !*** ./blocks/_editor-formats/src/index.js ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/rich-text */ "@wordpress/rich-text");
/* harmony import */ var _wordpress_rich_text__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




/**
 * "Lede" inline format — a components-popover toolbar button (same
 * selection popover Bold/Italic/Link already live in), not a block-level
 * attribute. Needed because the old CSS-only "first paragraph is
 * automatically bigger" rule (removed from .page-header__intro /
 * .page-header__panel-text when introTextFontSize/secondaryTextFontSize
 * were added — see identity.css's own history) can't come back as a fixed
 * rule without re-breaking per-instance font-size control: a RichText
 * field's Font Size dropdown already sets ONE size for the whole field, so
 * "first paragraph bigger than the rest" needs per-selection granularity a
 * block attribute genuinely can't express. This format lets an editor
 * select any paragraph (or run of text) — typically the intro's first
 * paragraph, to restore About Page Header's original lede treatment — and
 * mark just that selection as "lede", opt-in, wherever a RichText field
 * exists project-wide (Page Header's Intro/Secondary Text included, but
 * not limited to them — see .cb-lede in identity.css).
 *
 * Registered once, globally, via enqueue_block_editor_assets (see
 * inc/editor.php) rather than per-block — same reasoning `gap`/spacing
 * utility classes are global rather than duplicated per block.
 */

const FORMAT_NAME = 'cb-identityjs2026/lede';
(0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_1__.registerFormatType)(FORMAT_NAME, {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Lede', 'cb-identityjs2026'),
  tagName: 'span',
  className: 'cb-lede',
  edit({
    isActive,
    value,
    onChange
  }) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichTextToolbarButton, {
      icon: "editor-textcolor",
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Lede', 'cb-identityjs2026'),
      onClick: () => onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_1__.toggleFormat)(value, {
        type: FORMAT_NAME
      })),
      isActive: isActive
    });
  }
});

/**
 * "Heading" inline format — same toolbar-button mechanism as Lede above,
 * for the same underlying reason: fields like Page Header's Secondary Text
 * are a single flat RichText (multiline="p"), and Gutenberg's heading
 * levels only exist as their own separate block type, not something a raw
 * RichText instance can insert mid-field. Real precedent for "a heading
 * inside this exact field" already exists — cb-culture-page-header's own
 * secondary_text WYSIWYG output includes a real <h2> (see cb-culture-page-
 * header.scss's `&__intro h2` rule) — so this reproduces that as a
 * selectable run of text rather than restructuring the field into multiple
 * blocks. Renders as an inline element (a <p>'s content model requires it,
 * since multiline="p" wraps every paragraph in a real <p> tag) styled to
 * read as a heading via `display: block` in identity.css's .cb-heading
 * rule, wherever a RichText field exists project-wide — same "opt-in,
 * global" reasoning as Lede.
 */
const HEADING_FORMAT_NAME = 'cb-identityjs2026/heading';
(0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_1__.registerFormatType)(HEADING_FORMAT_NAME, {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Heading', 'cb-identityjs2026'),
  tagName: 'strong',
  className: 'cb-heading',
  edit({
    isActive,
    value,
    onChange
  }) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichTextToolbarButton, {
      icon: "heading",
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Heading', 'cb-identityjs2026'),
      onClick: () => onChange((0,_wordpress_rich_text__WEBPACK_IMPORTED_MODULE_1__.toggleFormat)(value, {
        type: HEADING_FORMAT_NAME
      })),
      isActive: isActive
    });
  }
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map