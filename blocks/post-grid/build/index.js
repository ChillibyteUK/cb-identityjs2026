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

/***/ "./blocks/post-grid/src/edit.js"
/*!**************************************!*\
  !*** ./blocks/post-grid/src/edit.js ***!
  \**************************************/
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
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _shared_EditorBlockShell__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../_shared/EditorBlockShell */ "./blocks/_shared/EditorBlockShell.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







/**
 * Built from cb-recent-news / cb-recent-news-identity + Latest Insights —
 * see identity-global-block-spec.md's Post Grid entry.
 *
 * `filterGroups` replaces the earlier querySource (category XOR taxonomy)
 * toggle: an editor can now combine several taxonomies at once — one or
 * more categories AND one or more themes AND one or more services, etc.
 * Category is just another option in the same taxonomy list, not a
 * special-cased separate field, since it's a taxonomy like any other.
 *
 * Each row is one taxonomy + a checkbox list of that taxonomy's terms
 * (OR-matched within the row); rows are ANDed together in render.php's
 * tax_query. Checkboxes, not a native multi-select, for the same reason
 * as before — the full list and current selection stay visible at a
 * glance once a taxonomy has more than a small handful of terms.
 */

const TAXONOMY_OPTIONS = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Category', 'cb-identityjs2026'),
  value: 'category'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Theme', 'cb-identityjs2026'),
  value: 'theme'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Service', 'cb-identityjs2026'),
  value: 'service'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Region', 'cb-identityjs2026'),
  value: 'region'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Person', 'cb-identityjs2026'),
  value: 'person'
}];
function FilterGroupRow({
  group,
  index,
  onChange,
  onRemove,
  canRemove
}) {
  const taxonomy = group.taxonomy || 'category';
  const terms = group.terms || [];
  const {
    taxonomyTerms,
    hasResolved
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const query = {
      per_page: -1,
      orderby: 'name',
      order: 'asc',
      _fields: ['id', 'name']
    };
    return {
      taxonomyTerms: select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__.store).getEntityRecords('taxonomy', taxonomy, query),
      hasResolved: select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__.store).hasFinishedResolution('getEntityRecords', ['taxonomy', taxonomy, query])
    };
  }, [taxonomy]);
  function toggleTerm(id) {
    const next = terms.includes(id) ? terms.filter(existing => existing !== id) : [...terms, id];
    onChange(index, {
      ...group,
      terms: next
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: "cb-identityjs2026-post-grid-filter-row",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "cb-identityjs2026-post-grid-filter-row__header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Taxonomy', 'cb-identityjs2026'),
        value: taxonomy,
        options: TAXONOMY_OPTIONS,
        onChange: value => onChange(index, {
          taxonomy: value,
          terms: []
        }),
        __nextHasNoMarginBottom: true
      }), canRemove && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        size: "small",
        isDestructive: true,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove filter', 'cb-identityjs2026'),
        onClick: () => onRemove(index),
        children: "\xD7"
      })]
    }), !hasResolved ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, {}) : !(taxonomyTerms ?? []).length ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
      className: "cb-identityjs2026-editor-field__help",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No terms found.', 'cb-identityjs2026')
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "cb-identityjs2026-term-checklist",
      children: taxonomyTerms.map(term => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
        label: term.name,
        checked: terms.includes(term.id),
        onChange: () => toggleTerm(term.id)
      }, term.id))
    })]
  });
}
function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    filterGroups,
    count,
    showCategory,
    showDate
  } = attributes;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: 'container cb-identityjs2026-editor-block'
  });
  const groups = filterGroups && filterGroups.length ? filterGroups : [];
  function updateGroup(index, nextGroup) {
    const next = groups.slice();
    next[index] = nextGroup;
    setAttributes({
      filterGroups: next
    });
  }
  function addGroup() {
    setAttributes({
      filterGroups: [...groups, {
        taxonomy: 'category',
        terms: []
      }]
    });
  }
  function removeGroup(index) {
    setAttributes({
      filterGroups: groups.filter((_group, i) => i !== index)
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_shared_EditorBlockShell__WEBPACK_IMPORTED_MODULE_5__["default"], {
    blockProps: blockProps,
    clientId: clientId,
    title: "CB Post Grid",
    textDomain: "cb-identityjs2026",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "cb-identityjs2026-editor-field",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
        className: "cb-identityjs2026-editor-field__label",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Filters', 'cb-identityjs2026')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        className: "cb-identityjs2026-editor-field__help",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Each filter matches any post with at least one of its checked terms (OR). Posts must match every filter (AND) — e.g. Category: Insights AND Theme: Growth.', 'cb-identityjs2026')
      }), groups.map((group, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(FilterGroupRow, {
        group: group,
        index: index,
        onChange: updateGroup,
        onRemove: removeGroup,
        canRemove: groups.length > 1
      }, index)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        onClick: addGroup,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('+ Add Filter', 'cb-identityjs2026')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "cb-identityjs2026-editor-field-row cb-identityjs2026-editor-field-row--3col",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
        type: "number",
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Count', 'cb-identityjs2026'),
        value: count,
        min: 1,
        max: 24,
        onChange: value => setAttributes({
          count: '' === value ? 1 : Number(value)
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Category', 'cb-identityjs2026'),
        checked: showCategory,
        onChange: value => setAttributes({
          showCategory: value
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Show Date', 'cb-identityjs2026'),
        checked: showDate,
        onChange: value => setAttributes({
          showDate: value
        })
      })]
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

/***/ "@wordpress/core-data"
/*!**********************************!*\
  !*** external ["wp","coreData"] ***!
  \**********************************/
(module) {

module.exports = window["wp"]["coreData"];

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

/***/ "./blocks/post-grid/block.json"
/*!*************************************!*\
  !*** ./blocks/post-grid/block.json ***!
  \*************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"cb-identityjs2026/post-grid","title":"CB Post Grid","category":"cb-identityjs2026","icon":"grid-view","attributes":{"filterGroups":{"type":"array","default":[{"taxonomy":"category","terms":[]}],"items":{"type":"object","properties":{"taxonomy":{"type":"string"},"terms":{"type":"array","items":{"type":"number"}}}}},"count":{"type":"number","default":3},"showCategory":{"type":"boolean","default":true},"showDate":{"type":"boolean","default":true}},"supports":{"anchor":true,"className":true,"align":true},"editorScript":"file:./build/index.js","render":"file:./render.php"}');

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
/*!***************************************!*\
  !*** ./blocks/post-grid/src/index.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./blocks/post-grid/src/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../block.json */ "./blocks/post-grid/block.json");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_2__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"],
  save: () => null
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map