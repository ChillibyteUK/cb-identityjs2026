/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/_shared/EditorBlockShell.js"
/*!********************************************!*\
  !*** ./blocks/_shared/EditorBlockShell.js ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EditorBlockShell)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






/**
 * Wraps a block's edit.js output in a collapsible section with a title bar
 * and open/closed toggle, persisting the toggle state per block-instance
 * (keyed by the block's position path within the post plus the current
 * URL) in localStorage — so a page with many blocks stays scannable in the
 * editor instead of every block's full field set staying expanded at once.
 *
 * @param {Object}   props
 * @param {Object}   props.blockProps       Result of useBlockProps().
 * @param {string}   props.clientId         The block's clientId, for deriving its position path.
 * @param {string}   [props.classPrefix]    Class/prefix root, matches editor.css.
 * @param {string}   [props.textDomain]     i18n text domain for the toggle's aria-label.
 * @param {string}   [props.storageNamespace] Extra localStorage key segment, in case two shells need independent state on the same path.
 * @param {string}   props.title            Block name shown in the title bar.
 * @param {boolean}  [props.defaultOpen]    Initial state before localStorage is read.
 * @param {*}        props.children         The block's own field controls.
 */

function EditorBlockShell({
  blockProps,
  clientId,
  classPrefix = 'cb-identityjs2026',
  textDomain = 'cb-identityjs2026',
  storageNamespace = 'block',
  title,
  children,
  defaultOpen = true
}) {
  const [isOpen, setIsOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(defaultOpen);
  const instanceId = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.useInstanceId)(EditorBlockShell);
  const contentId = `${classPrefix}-editor-block-content-${instanceId}`;
  const contentRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useRef)();
  const blockPath = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    if (!clientId) {
      return '';
    }
    const {
      getBlockIndex,
      getBlockRootClientId
    } = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store);
    const path = [];
    let currentId = clientId;
    while (currentId) {
      const parentId = getBlockRootClientId(currentId) || '';
      path.unshift(String(getBlockIndex(currentId, parentId)));
      currentId = parentId || null;
    }
    return path.join('.');
  }, [clientId]);
  const storageKey = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useMemo)(() => {
    if (!clientId || !blockPath || typeof window === 'undefined') {
      return '';
    }
    return [classPrefix, 'editor-block-state', storageNamespace, window.location.pathname, window.location.search, blockPath].join(':');
  }, [blockPath, classPrefix, clientId, storageNamespace]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!storageKey || typeof window === 'undefined') {
      return;
    }
    const storedValue = window.localStorage.getItem(storageKey);
    if (storedValue === 'closed') {
      setIsOpen(false);
    } else if (storedValue === 'open') {
      setIsOpen(true);
    }
  }, [storageKey]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!storageKey || typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(storageKey, isOpen ? 'open' : 'closed');
  }, [isOpen, storageKey]);

  // Confirmed live (2026-09-22) as a real, reproducible bug, not a theory:
  // every field in a block's own fields-form UI (TextControl, RichText,
  // the repeater's own inputs) renders inside the block's own canvas
  // output, which sits inside Gutenberg's WritingFlow component — the
  // same wrapper that manages block-to-block multi-selection. Pressing
  // Shift+Arrow with the cursor mid-text (not at a boundary — ruled out
  // as WordPress's own intentional "extend past the edge" behaviour)
  // handed focus to WritingFlow's own handler instead of the input doing
  // its own text selection.
  //
  // A React onKeyDown prop + event.stopPropagation() here does NOT fix
  // it: per Gutenberg's own source
  // (packages/block-editor/src/components/writing-flow/use-arrow-nav.js),
  // WritingFlow intercepts with a plain native `node.addEventListener(
  // 'keydown', onKeyDown )` on its own wrapper element — not a React
  // synthetic handler. That native listener fires during real DOM bubble
  // propagation, which reaches it before React's own internal delegated
  // dispatch (which is what actually invokes a React onKeyDown prop) ever
  // gets to run — so stopping propagation inside React's synthetic system
  // is always too late. Only a real addEventListener on a descendant node
  // (this one) intercepts during native bubbling before it reaches
  // WritingFlow's own ancestor listener.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    const node = contentRef.current;
    if (!node) {
      return;
    }
    function stopShiftArrowFromReachingWritingFlow(event) {
      if (event.shiftKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.stopPropagation();
      }
    }
    node.addEventListener('keydown', stopShiftArrowFromReachingWritingFlow);
    return () => {
      node.removeEventListener('keydown', stopShiftArrowFromReachingWritingFlow);
    };
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    ...blockProps,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: `${classPrefix}-editor-block__title`,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        children: title
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("button", {
        type: "button",
        className: `${classPrefix}-editor-block__toggle`,
        onClick: () => setIsOpen(open => !open),
        "aria-expanded": isOpen,
        "aria-controls": contentId,
        "aria-label": isOpen ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Hide block fields', textDomain) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show block fields', textDomain),
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
          "aria-hidden": "true",
          children: isOpen ? '−' : '+'
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      id: contentId,
      ref: contentRef,
      className: `${classPrefix}-editor-block__content`,
      hidden: !isOpen,
      children: children
    })]
  });
}

/***/ },

/***/ "./blocks/home-intro/src/edit.js"
/*!***************************************!*\
  !*** ./blocks/home-intro/src/edit.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _shared_EditorBlockShell__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../_shared/EditorBlockShell */ "./blocks/_shared/EditorBlockShell.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





/**
 * Built from cb-brand-title-text — see identity-global-block-spec.md's Home
 * Intro entry. Home-page-only. pre_title renders as the block's real <h1>;
 * title is NOT a heading at all — real source wraps each line in styled
 * <div>s for the stagger-reveal animation (see render.php,
 * src/js/home-intro-animate.js). The animation assumes up to 3 lines —
 * that's a real constraint of the original design (3 hardcoded bar/
 * rotation sets), not a limit added here.
 */

function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    preTitle,
    title,
    contentHeading,
    content,
    linkText,
    linkUrl,
    linkTarget
  } = attributes;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: 'container cb-identityjs2026-editor-block'
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_shared_EditorBlockShell__WEBPACK_IMPORTED_MODULE_3__["default"], {
    blockProps: blockProps,
    clientId: clientId,
    title: "CB Home Intro",
    textDomain: "cb-identityjs2026",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Pre-Title', 'cb-identityjs2026'),
      value: preTitle,
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Renders as the page\'s <h1>', 'cb-identityjs2026'),
      onChange: value => setAttributes({
        preTitle: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextareaControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Title', 'cb-identityjs2026'),
      value: title,
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('One line per row — up to 3 lines, each gets its own animated colour bar', 'cb-identityjs2026'),
      onChange: value => setAttributes({
        title: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content Heading', 'cb-identityjs2026'),
      value: contentHeading,
      onChange: value => setAttributes({
        contentHeading: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "cb-identityjs2026-editor-field",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("label", {
        className: "cb-identityjs2026-editor-field__label",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content', 'cb-identityjs2026')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "div",
        className: "cb-identityjs2026-editor-field__control",
        "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content', 'cb-identityjs2026'),
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Content', 'cb-identityjs2026'),
        value: content,
        onChange: value => setAttributes({
          content: value
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        style: {
          flex: '50 1 0%'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Link Text', 'cb-identityjs2026'),
          value: linkText,
          onChange: value => setAttributes({
            linkText: value
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        style: {
          flex: '50 1 0%'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          type: "url",
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Link URL', 'cb-identityjs2026'),
          value: linkUrl,
          onChange: value => setAttributes({
            linkUrl: value
          })
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Open Link in a new tab', 'cb-identityjs2026'),
      checked: linkTarget,
      onChange: value => setAttributes({
        linkTarget: value
      })
    })]
  });
}

/***/ },

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

/***/ "@wordpress/blocks"
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
(module) {

module.exports = window["wp"]["blocks"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/compose"
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["compose"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "./blocks/home-intro/block.json"
/*!**************************************!*\
  !*** ./blocks/home-intro/block.json ***!
  \**************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"cb-identityjs2026/home-intro","title":"CB Home Intro","category":"cb-identityjs2026","icon":"cover-image","attributes":{"preTitle":{"type":"string","default":""},"title":{"type":"string","default":""},"contentHeading":{"type":"string","default":""},"content":{"type":"string","default":""},"linkText":{"type":"string","default":""},"linkUrl":{"type":"string","default":""},"linkTarget":{"type":"boolean","default":false}},"supports":{"anchor":true,"className":true,"align":true},"editorScript":"file:./build/index.js","render":"file:./render.php"}');

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
/*!****************************************!*\
  !*** ./blocks/home-intro/src/index.js ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./blocks/home-intro/src/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../block.json */ "./blocks/home-intro/block.json");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_2__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"],
  save: () => null
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map