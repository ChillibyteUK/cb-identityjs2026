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

/***/ "./blocks/_shared/RepeaterField.js"
/*!*****************************************!*\
  !*** ./blocks/_shared/RepeaterField.js ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RepeaterField)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







/**
 * Short random id for a repeater row, stable for that row's lifetime once
 * assigned (kept as-is by updateRow's `{ ...next[index], ...patch }` spread,
 * since patch never includes `id`). Not cryptographic, doesn't need to be —
 * only needs to be unique among this one row's siblings, as a stable React
 * `key` (see the "why" comment further down, near the .map() call).
 */

function generateRowId() {
  return `row-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * A repeater row's own image field, as a real component rather than
 * inlined into the big fields.map() below — needed so it can call its own
 * useSelect() per row/field to derive the preview URL live from the
 * attachment id, instead of trusting a `{field}Url` value stored only at
 * the moment of selection. Confirmed live (2026-09-22) as the same real
 * bug already found and fixed once this session on Page Header's
 * background field: a row backfilled from existing data, or any path that
 * doesn't go through this exact onSelect callback, leaves that stored
 * Url empty forever even though the id itself is genuinely valid —
 * showing as a blank preview with a working "Replace" button, easy to
 * mistake for "this row has no logo" when it does.
 */
function RepeaterImageField({
  field,
  row,
  index,
  updateRow,
  isColumn
}) {
  const id = row[field.name];
  const url = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => {
    if (!id) {
      return '';
    }
    return select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_5__.store).getMedia(id)?.source_url || '';
  }, [id]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    children: [isColumn && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
      className: "cb-identityjs2026-editor-field__label",
      children: field.label
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
        onSelect: media => updateRow(index, {
          [field.name]: media.id
        }),
        allowedTypes: ['image'],
        value: id,
        render: ({
          open
        }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "cb-identityjs2026-repeater-field__image",
          children: [url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
            src: url,
            alt: ""
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "secondary",
            size: "small",
            onClick: open,
            children: id ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Replace', 'cb-identityjs2026') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select', 'cb-identityjs2026')
          }), id ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "tertiary",
            size: "small",
            isDestructive: true,
            onClick: () => updateRow(index, {
              [field.name]: 0
            }),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove', 'cb-identityjs2026')
          }) : null]
        })
      })
    })]
  });
}

/**
 * Makes a legacy plain-text value safe to hand to RichText. Confirmed live
 * (2026-09-22) as a real, reproducible bug, not a theory: RichText's
 * editable content silently fails to render at all when given a value with
 * no wrapping HTML tag whatsoever (isolated down to a single-row,
 * single-character repro — "a" renders nothing, "<p>a</p>" renders fine).
 * Rows saved before a field was RichText (plain textarea content, e.g.
 * "We bring experience...", no markup at all — some with literal `\n`
 * line breaks from a plain textarea, e.g. Detail List's old title field)
 * hit this on every read until they're re-saved through RichText's own
 * onChange, which always produces real markup — so this exists
 * specifically to bridge that one legacy moment, not as an ongoing
 * safeguard. Literal newlines become <br> first (matching the old
 * textarea's own line-break-only semantics — this project's title fields
 * were never multi-paragraph).
 *
 * The wrapping tag itself must match the field's own `multiline` mode.
 * The original version of this always wrapped in `<p>` regardless — that
 * DOES force multiline-style paragraph behaviour on a non-multiline field
 * despite what an earlier pass here confirmed: reproduced live (2026-09-25)
 * as visible content corruption on Detail List's own (non-multiline) Title
 * field, a plain `<p>` wrapper caused RichText to split text typed
 * immediately after mount mid-word onto a new line — "The" became "Th",
 * newline, "e". A non-multiline field gets a plain inline `<span>` wrapper
 * instead, which satisfies the same "must have a tag" requirement without
 * RichText treating it as a paragraph boundary. Multiline fields (e.g.
 * Detail List's own Description) keep `<p>`, since multiline="p" mode
 * genuinely expects `<p>` children.
 */
function toSafeRichTextHtml(value, multiline) {
  const html = value || '';
  if (html.includes('<')) {
    return html;
  }
  const withBreaks = html.replace(/\r\n|\r|\n/g, '<br>');
  return multiline ? `<p>${withBreaks}</p>` : `<span>${withBreaks}</span>`;
}

/**
 * Generic repeater UI for a block attribute holding an array of row objects.
 * The block-editor equivalent of the `repeater` field type in
 * inc/options.php — same sub-field vocabulary (text/textarea/image), separate
 * implementation since one runs in wp-admin and the other inside the block
 * editor's React tree.
 *
 * Rows lay out inline by default (`layout: 'row'`): each sub-field takes an
 * equal-width slot, with compact move-up/move-down/remove icon buttons at
 * the row's end. Sub-field labels render once, as column headers above the
 * rows, rather than repeating per row — `hideLabelFromVision` keeps them
 * screen-reader accessible on each control without rendering visually
 * twice.
 *
 * `layout: 'column'` stacks each row's sub-fields vertically instead —
 * there's no shared column header in that layout (it wouldn't line up with
 * anything), so each sub-field's own label renders visibly above its
 * control instead of being screen-reader-only.
 *
 * @param {Object}   props
 * @param {string}   props.label    Field group label.
 * @param {Object[]} props.value    Current rows.
 * @param {Function} props.onChange ( rows ) => void
 * @param {Object[]} props.fields   [ { name, label, type: 'text'|'number'|'textarea'|'richtext'|'image'|'file'|'link'|'radio'|'repeater', help, mimeTypes, linkTarget, options, multiline, subFields, subEmptyRow, subLayout } ]
 *                                  `linkTarget` (link fields only) adds an "open in new tab" toggle,
 *                                  storing `{name}Target` on the row — same opt-in shape as the
 *                                  top-level `link` field type's `link_target` option. `options`
 *                                  (radio fields only) is `[ { label, value } ]`, mirroring the
 *                                  top-level `select`/`radio` field types' options shape. `multiline`
 *                                  (richtext fields only) turns on real multi-paragraph editing
 *                                  (RichText's `multiline="p"`); leave it unset for a field that's
 *                                  just single-line-with-line-breaks, e.g. a title. `repeater` fields
 *                                  nest a second RepeaterField instance inside each row — `subFields`
 *                                  is that nested instance's own `fields` array (same shape,
 *                                  recursively), `subEmptyRow` its `emptyRow`, and `subLayout` its
 *                                  `layout` (defaults to 'row' like the top level). The nested value
 *                                  lives at `row[name]` as its own array of rows, same shape as this
 *                                  component's own `value`/`onChange` contract at any depth. `width`
 *                                  (e.g. '40%') gives that field a proportional share of a
 *                                  'row' layout instead of an equal one — implemented as a
 *                                  unitless flex-grow share from a zero basis (so gaps are
 *                                  divided exactly, never overflow the row), e.g. Stat
 *                                  Block's intro 40 / prefix 20 / value 20 / suffix 20.
 *                                  '100%' instead forces its own full-width line.
 * @param {Object}   props.emptyRow Shape of a freshly-added row, e.g. { stat: '', title: '' }.
 * @param {string}   [props.layout] 'row' (default) or 'column'.
 */
function RepeaterField({
  label,
  value,
  onChange,
  fields,
  emptyRow,
  layout = 'row'
}) {
  const isColumn = 'column' === layout;
  const rows = value || [];

  // Proportional flex share for a `width` like '40%' — unitless grow from
  // a zero basis, so the browser divides the leftover space (after gaps)
  // exactly and the shares can never overflow the row and wrap early.
  // '100%' instead forces its own line: zero grow, full basis.
  function widthFlex(width) {
    const percent = parseFloat(width);
    if (!Number.isFinite(percent)) {
      return undefined;
    }
    if (percent >= 100) {
      return '0 0 100%';
    }
    return `${percent} 1 0%`;
  }

  // Rows saved before this `id` field existed (or any other future
  // producer of rows without one) need an id from their very first render,
  // not just eventually: a useEffect-only backfill (running after that
  // first paint) still lets every id-less row mount once sharing the same
  // "no id" identity, and confirmed live, that's enough for a RichText
  // field's internal state to only ever end up correctly wired for the
  // first of them — every other row's RichText silently renders empty,
  // permanently, even after the effect assigns real ids on the next
  // render. useMemo computes real-enough ids synchronously, before
  // anything downstream ever mounts.
  const displayRows = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useMemo)(() => rows.map(row => row.id ? row : {
    ...row,
    id: generateRowId()
  }), [rows]);

  // Persists those ids back into the actual attribute once React commits,
  // so they're stable across reloads/reorders instead of regenerating
  // every render — moveRow/removeRow/updateRow below still key off array
  // index, not id, so this is purely about giving each row a durable
  // identity, not something anything else depends on to function.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(() => {
    if (rows.some(row => !row.id)) {
      onChange(displayRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.length]);
  function updateRow(index, patch) {
    const next = rows.slice();
    next[index] = {
      ...next[index],
      ...patch
    };
    onChange(next);
  }
  function addRow() {
    onChange([...rows, {
      ...emptyRow,
      id: generateRowId()
    }]);
  }
  function removeRow(index) {
    // eslint-disable-next-line no-alert -- a plain confirm() is enough
    // friction for an irreversible remove; no undo exists for this field.
    if (!window.confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove this row?', 'cb-identityjs2026'))) {
      return;
    }
    onChange(rows.filter((_row, i) => i !== index));
  }
  function moveRow(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) {
      return;
    }
    const next = rows.slice();
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    onChange(next);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: isColumn ? 'cb-identityjs2026-repeater-field cb-identityjs2026-repeater-field--column' : 'cb-identityjs2026-repeater-field',
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
      className: "cb-identityjs2026-editor-field__label",
      children: label
    }), !isColumn && rows.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "cb-identityjs2026-repeater-field__header",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
        className: "cb-identityjs2026-repeater-field__number-spacer"
      }), fields.map(field => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
        style: field.width ? {
          flex: widthFlex(field.width)
        } : undefined,
        className: 'image' === field.type || 'file' === field.type ? 'cb-identityjs2026-repeater-field__header-cell cb-identityjs2026-repeater-field__header-cell--image' : 'cb-identityjs2026-repeater-field__header-cell',
        children: field.label
      }, field.name)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
        className: "cb-identityjs2026-repeater-field__row-actions-spacer"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "cb-identityjs2026-repeater-field__rows",
      children: displayRows.map((row, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "cb-identityjs2026-repeater-field__row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
          className: "cb-identityjs2026-repeater-field__number",
          children: index + 1
        }), fields.map(field => {
          // A field with `width` renders inside a sized cell so rows
          // can hold uneven shares (e.g. 40/20/20/20 + a 100% line
          // wrapping below) — see the JSDoc `width` note above.
          const fieldControl = (() => {
            if ('image' === field.type) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(RepeaterImageField, {
                field: field,
                row: row,
                index: index,
                updateRow: updateRow,
                isColumn: isColumn
              }, field.name);
            }
            if ('repeater' === field.type) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
                className: "cb-identityjs2026-repeater-field__nested",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(RepeaterField, {
                  label: field.label,
                  layout: field.subLayout || 'row',
                  value: row[field.name] || [],
                  onChange: value => updateRow(index, {
                    [field.name]: value
                  }),
                  fields: field.subFields || [],
                  emptyRow: field.subEmptyRow || {}
                })
              }, field.name);
            }
            if ('link' === field.type) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                className: "cb-identityjs2026-repeater-field__link",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(`${field.label} Title`, 'cb-identityjs2026'),
                  hideLabelFromVision: !isColumn,
                  value: row[`${field.name}Text`] || '',
                  onChange: v => updateRow(index, {
                    [`${field.name}Text`]: v
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                  type: "url",
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(`${field.label} URL`, 'cb-identityjs2026'),
                  hideLabelFromVision: !isColumn,
                  value: row[field.name] || '',
                  onChange: v => updateRow(index, {
                    [field.name]: v
                  }),
                  help: field.help
                }), field.linkTarget && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(`Open ${field.label} in a new tab`, 'cb-identityjs2026'),
                  checked: !!row[`${field.name}Target`],
                  onChange: v => updateRow(index, {
                    [`${field.name}Target`]: v
                  })
                })]
              }, field.name);
            }
            if ('file' === field.type) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
                  onSelect: media => updateRow(index, {
                    [field.name]: media.id,
                    [`${field.name}Name`]: media.filename || media.title || ''
                  }),
                  allowedTypes: field.mimeTypes || [],
                  value: row[field.name],
                  render: ({
                    open
                  }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                    className: "cb-identityjs2026-repeater-field__image",
                    children: [row[`${field.name}Name`] && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
                      className: "cb-identityjs2026-repeater-field__file-name",
                      children: row[`${field.name}Name`]
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                      variant: "secondary",
                      size: "small",
                      onClick: open,
                      children: row[field.name] ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Replace', 'cb-identityjs2026') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select', 'cb-identityjs2026')
                    })]
                  })
                })
              }, field.name);
            }
            if ('textarea' === field.type) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextareaControl, {
                label: field.label,
                hideLabelFromVision: !isColumn,
                value: row[field.name] || '',
                onChange: v => updateRow(index, {
                  [field.name]: v
                }),
                help: field.help
              }, field.name);
            }
            if ('richtext' === field.type) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
                className: "cb-identityjs2026-repeater-field__richtext",
                children: [isColumn && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
                  className: "cb-identityjs2026-editor-field__label",
                  children: field.label
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
                  identifier: `${row.id}-${field.name}`,
                  tagName: "div",
                  multiline: field.multiline ? 'p' : undefined,
                  className: "cb-identityjs2026-editor-field__control",
                  "aria-label": field.label,
                  placeholder: field.label,
                  value: toSafeRichTextHtml(row[field.name], field.multiline),
                  onChange: v => updateRow(index, {
                    [field.name]: v
                  })
                }), field.help && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
                  className: "cb-identityjs2026-editor-field__help",
                  children: field.help
                })]
              }, field.name);
            }
            if ('radio' === field.type) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.RadioControl, {
                label: field.label,
                hideLabelFromVision: !isColumn,
                selected: row[field.name] || '',
                options: field.options || [],
                onChange: v => updateRow(index, {
                  [field.name]: v
                })
              }, field.name);
            }
            if ('number' === field.type) {
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
                type: "number",
                label: field.label,
                hideLabelFromVision: !isColumn,
                value: row[field.name] ?? '',
                onChange: v => updateRow(index, {
                  [field.name]: '' === v ? '' : Number(v)
                }),
                help: field.help
              }, field.name);
            }
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
              label: field.label,
              hideLabelFromVision: !isColumn,
              value: row[field.name] || '',
              onChange: v => updateRow(index, {
                [field.name]: v
              }),
              help: field.help
            }, field.name);
          })();
          if (!field.width) {
            return fieldControl;
          }
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
            className: "cb-identityjs2026-repeater-field__cell",
            style: {
              flex: widthFlex(field.width)
            },
            children: fieldControl
          }, field.name);
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
          className: "cb-identityjs2026-repeater-field__row-actions",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "small",
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Move up', 'cb-identityjs2026'),
            onClick: () => moveRow(index, -1),
            disabled: 0 === index,
            children: "\u25B2"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "small",
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Move down', 'cb-identityjs2026'),
            onClick: () => moveRow(index, 1),
            disabled: index === rows.length - 1,
            children: "\u25BC"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "small",
            isDestructive: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove', 'cb-identityjs2026'),
            onClick: () => removeRow(index),
            children: "\xD7"
          })]
        })]
      }, row.id))
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "primary",
      onClick: addRow,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add row', 'cb-identityjs2026')
    })]
  });
}

/***/ },

/***/ "./blocks/content-builder/src/ModuleEditor.js"
/*!****************************************************!*\
  !*** ./blocks/content-builder/src/ModuleEditor.js ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ModuleEditor)
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
/* harmony import */ var _shared_RepeaterField__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../_shared/RepeaterField */ "./blocks/_shared/RepeaterField.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./constants */ "./blocks/content-builder/src/constants.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








/**
 * One module's field set — dispatches on `module.moduleType`. Real field
 * shapes/choices confirmed against both cb-identity2025 and
 * cb-identitygroup2026's cb-content-grid-v2 (see content-builder-research.md;
 * this project builds against coda's fuller 13-type set — h1/stats are
 * coda-only additions, and has_padding likewise, per that research).
 *
 * @param {Object}   props
 * @param {Object}   props.module
 * @param {Function} props.updateModule ( patch ) => void
 */

function ModuleEditor({
  module: mod,
  updateModule
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "cb-identityjs2026-content-builder-module",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Module Type', 'cb-identityjs2026'),
      value: mod.moduleType,
      options: _constants__WEBPACK_IMPORTED_MODULE_6__.MODULE_TYPE_OPTIONS,
      onChange: value => {
        const patch = {
          moduleType: value
        };
        if (['h1', 'h2', 'h3'].includes(value) && !mod.headingFontSize) {
          patch.headingFontSize = _constants__WEBPACK_IMPORTED_MODULE_6__.HEADING_DEFAULTS[value].fontSize;
          patch.headingFontWeight = _constants__WEBPACK_IMPORTED_MODULE_6__.HEADING_DEFAULTS[value].fontWeight;
          if (undefined !== _constants__WEBPACK_IMPORTED_MODULE_6__.HEADING_DEFAULTS[value].showLines) {
            patch.headingShowLines = _constants__WEBPACK_IMPORTED_MODULE_6__.HEADING_DEFAULTS[value].showLines;
          }
          if (_constants__WEBPACK_IMPORTED_MODULE_6__.HEADING_DEFAULTS[value].color && !mod.headingColor) {
            patch.headingColor = _constants__WEBPACK_IMPORTED_MODULE_6__.HEADING_DEFAULTS[value].color;
          }
        }
        updateModule(patch);
      }
    }), ['h1', 'h2', 'h3'].includes(mod.moduleType) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(HeadingFields, {
      module: mod,
      updateModule: updateModule
    }), 'text' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(TextFields, {
      module: mod,
      updateModule: updateModule
    }), 'list' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(ListFields, {
      module: mod,
      updateModule: updateModule
    }), 'stats' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(StatsFields, {
      module: mod,
      updateModule: updateModule
    }), 'quote' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(QuoteFields, {
      module: mod,
      updateModule: updateModule
    }), 'links' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(LinksFields, {
      module: mod,
      updateModule: updateModule
    }), 'logo_grid' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(LogoGridFields, {
      module: mod,
      updateModule: updateModule
    }), 'image' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(ImageFields, {
      module: mod,
      updateModule: updateModule
    }), 'video' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(VideoFields, {
      module: mod,
      updateModule: updateModule
    }), 'qa' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(QaFields, {
      module: mod,
      updateModule: updateModule
    }), 'faq' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(FaqFields, {
      module: mod,
      updateModule: updateModule
    }), 'button' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(ButtonFields, {
      module: mod,
      updateModule: updateModule
    }), 'code' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(CodeFields, {
      module: mod,
      updateModule: updateModule
    }), 'divider' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
      className: "cb-identityjs2026-editor-field__help",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('A full-width horizontal line across the column, in the same colour as the section\'s other divider lines — no fields needed.', 'cb-identityjs2026')
    }), 'empty' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      type: "number",
      min: "0",
      step: "0.25",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Height (rem)', 'cb-identityjs2026'),
      value: mod.emptyHeight ?? 0,
      onChange: value => updateModule({
        emptyHeight: value
      }),
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('A decimal rem value, e.g. 1.5. 0 renders a blank column with no height of its own.', 'cb-identityjs2026')
    })]
  });
}
function FsFwRow({
  fsValue,
  fwValue,
  fsOptions,
  onFsChange,
  onFwChange,
  children
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    style: {
      display: 'flex',
      gap: '12px'
    },
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      style: {
        flex: 1,
        minWidth: 0
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Font Size', 'cb-identityjs2026'),
        value: fsValue,
        options: fsOptions,
        onChange: onFsChange
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      style: {
        flex: 1,
        minWidth: 0
      },
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Font Weight', 'cb-identityjs2026'),
        value: fwValue,
        options: _constants__WEBPACK_IMPORTED_MODULE_6__.FW_OPTIONS,
        onChange: onFwChange
      })
    }), children && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      style: {
        flex: 1,
        minWidth: 0
      },
      className: "cb-identityjs2026-editor-field__color",
      children: children
    })]
  });
}

/**
 * Per-heading colour picker — the block editor's own ColorPalette fed by
 * the live theme palette (block-editor settings `colors`, i.e. theme.json,
 * so it follows whatever brand is active with no per-brand list to
 * maintain), tucked inside a swatch-toggle popover so 58 swatches don't
 * take over the module form. The popover deliberately stays open while
 * picking (core's own colour-dropdown behaviour), closing on outside
 * click/Escape via Dropdown itself. Stores the palette SLUG (not the hex),
 * so render.php can use core's own `has-{slug}-color` utility — same
 * mechanism the section-level heading colour already uses, just scoped to
 * one module instead of the whole section (core's utility is !important,
 * so a module colour beats the section colour where both are set, and an
 * empty value inherits as before).
 *
 * @param {Object}   props
 * @param {string}   props.value    Palette slug, or '' for default.
 * @param {Function} props.onChange ( slug ) => void
 */
function HeadingColorDropdown({
  value,
  onChange
}) {
  const palette = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store).getSettings().colors || [], []);
  const match = palette.find(entry => entry.slug === value);
  const color = match ? match.color : undefined;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
      className: "cb-identityjs2026-editor-field__label",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Colour', 'cb-identityjs2026')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Dropdown, {
      popoverProps: {
        placement: 'bottom-start'
      },
      renderToggle: ({
        isOpen,
        onToggle
      }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
        variant: "secondary",
        onClick: onToggle,
        "aria-expanded": isOpen,
        "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Choose heading colour', 'cb-identityjs2026'),
        style: {
          width: '100%',
          justifyContent: 'flex-start',
          minHeight: '40px',
          maxWidth: '100%'
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ColorIndicator, {
          colorValue: color
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
          style: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          },
          children: match ? match.name || match.slug : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Default', 'cb-identityjs2026')
        })]
      }),
      renderContent: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
        style: {
          padding: '16px'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
          colors: palette,
          value: color,
          onChange: next => {
            const nextMatch = palette.find(entry => entry.color === next);
            onChange(nextMatch ? nextMatch.slug : '');
          },
          disableCustomColors: true,
          clearable: true
        })
      })
    })]
  });
}
function HeadingFields({
  module: mod,
  updateModule
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Heading Text', 'cb-identityjs2026'),
      value: mod.headingText,
      onChange: value => updateModule({
        headingText: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(FsFwRow, {
      fsValue: mod.headingFontSize || _constants__WEBPACK_IMPORTED_MODULE_6__.HEADING_DEFAULTS[mod.moduleType].fontSize,
      fwValue: mod.headingFontWeight || _constants__WEBPACK_IMPORTED_MODULE_6__.HEADING_DEFAULTS[mod.moduleType].fontWeight,
      fsOptions: _constants__WEBPACK_IMPORTED_MODULE_6__.HEADING_FS_OPTIONS,
      onFsChange: value => updateModule({
        headingFontSize: value
      }),
      onFwChange: value => updateModule({
        headingFontWeight: value
      }),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(HeadingColorDropdown, {
        value: mod.headingColor || '',
        onChange: value => updateModule({
          headingColor: value
        })
      })
    }), 'h2' === mod.moduleType && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Divider Lines', 'cb-identityjs2026'),
      checked: mod.headingShowLines ?? true,
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Off for a plain H2 with no rule above/below — useful when you just need correct heading markup without the page-title styling.', 'cb-identityjs2026'),
      onChange: value => updateModule({
        headingShowLines: value
      })
    })]
  });
}
function TextFields({
  module: mod,
  updateModule
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "cb-identityjs2026-editor-field",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
        className: "cb-identityjs2026-editor-field__label",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text', 'cb-identityjs2026')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        identifier: mod.id,
        tagName: "div",
        multiline: "p",
        className: "cb-identityjs2026-editor-field__control",
        "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text', 'cb-identityjs2026'),
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Text', 'cb-identityjs2026'),
        value: mod.textContent,
        onChange: value => updateModule({
          textContent: value
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(FsFwRow, {
      fsValue: mod.textFontSize,
      fwValue: mod.textFontWeight,
      fsOptions: _constants__WEBPACK_IMPORTED_MODULE_6__.TEXT_FS_OPTIONS,
      onFsChange: value => updateModule({
        textFontSize: value
      }),
      onFwChange: value => updateModule({
        textFontWeight: value
      })
    })]
  });
}
function ListFields({
  module: mod,
  updateModule
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextareaControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('List Items', 'cb-identityjs2026'),
      value: mod.listContent,
      onChange: value => updateModule({
        listContent: value
      }),
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('One item per line.', 'cb-identityjs2026')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(FsFwRow, {
      fsValue: mod.listFontSize,
      fwValue: mod.listFontWeight,
      fsOptions: _constants__WEBPACK_IMPORTED_MODULE_6__.LIST_FS_OPTIONS,
      onFsChange: value => updateModule({
        listFontSize: value
      }),
      onFwChange: value => updateModule({
        listFontWeight: value
      })
    })]
  });
}
function StatsFields({
  module: mod,
  updateModule
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_RepeaterField__WEBPACK_IMPORTED_MODULE_5__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Stats', 'cb-identityjs2026'),
    layout: "column",
    value: mod.statsRows,
    onChange: value => updateModule({
      statsRows: value
    }),
    fields: [{
      name: 'statText',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Stat', 'cb-identityjs2026')
    }, {
      name: 'detailText',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Detail', 'cb-identityjs2026')
    }, {
      name: 'statFontSize',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Stat Font Size', 'cb-identityjs2026'),
      type: 'radio',
      options: _constants__WEBPACK_IMPORTED_MODULE_6__.STATS_FS_OPTIONS
    }, {
      name: 'statFontWeight',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Stat Font Weight', 'cb-identityjs2026'),
      type: 'radio',
      options: _constants__WEBPACK_IMPORTED_MODULE_6__.FW_OPTIONS
    }, {
      name: 'detailFontSize',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Detail Font Size', 'cb-identityjs2026'),
      type: 'radio',
      options: _constants__WEBPACK_IMPORTED_MODULE_6__.STATS_FS_OPTIONS
    }, {
      name: 'detailFontWeight',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Detail Font Weight', 'cb-identityjs2026'),
      type: 'radio',
      options: _constants__WEBPACK_IMPORTED_MODULE_6__.FW_OPTIONS
    }],
    emptyRow: {
      statText: '',
      detailText: '',
      statFontSize: 'fs-600',
      statFontWeight: 'fw-semibold',
      detailFontSize: 'fs-400',
      detailFontWeight: 'fw-light'
    }
  });
}
function QuoteFields({
  module: mod,
  updateModule
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextareaControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Quote', 'cb-identityjs2026'),
      value: mod.quoteText,
      onChange: value => updateModule({
        quoteText: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Link Text', 'cb-identityjs2026'),
      value: mod.quoteLinkText,
      onChange: value => updateModule({
        quoteLinkText: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      type: "url",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Link URL', 'cb-identityjs2026'),
      value: mod.quoteLinkUrl,
      onChange: value => updateModule({
        quoteLinkUrl: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Open link in a new tab', 'cb-identityjs2026'),
      checked: mod.quoteLinkTarget,
      onChange: value => updateModule({
        quoteLinkTarget: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
      className: "cb-identityjs2026-editor-field__help",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Nothing renders unless the Quote itself has text — a link with no quote text is not shown.', 'cb-identityjs2026')
    })]
  });
}
function LinksFields({
  module: mod,
  updateModule
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_RepeaterField__WEBPACK_IMPORTED_MODULE_5__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Links', 'cb-identityjs2026'),
    layout: "column",
    value: mod.linksRows,
    onChange: value => updateModule({
      linksRows: value
    }),
    fields: [{
      name: 'title',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Title', 'cb-identityjs2026')
    }, {
      name: 'file',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('File', 'cb-identityjs2026'),
      type: 'file',
      mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    }],
    emptyRow: {
      title: '',
      file: 0,
      fileName: ''
    }
  });
}
function LogoGridFields({
  module: mod,
  updateModule
}) {
  const rows = mod.logoGridRows || [];
  function updateRows(next) {
    updateModule({
      logoGridRows: next
    });
  }
  function updateRow(index, patch) {
    const next = rows.slice();
    next[index] = {
      ...next[index],
      ...patch
    };
    updateRows(next);
  }
  function addRow() {
    updateRows([...rows, {
      id: (0,_constants__WEBPACK_IMPORTED_MODULE_6__.generateId)(),
      title: '',
      logoIds: []
    }]);
  }
  function removeRow(index) {
    // eslint-disable-next-line no-alert -- matches RepeaterField's own confirm() convention.
    if (!window.confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove this row?', 'cb-identityjs2026'))) {
      return;
    }
    updateRows(rows.filter((_row, i) => i !== index));
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "cb-identityjs2026-repeater-field cb-identityjs2026-repeater-field--column",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
      className: "cb-identityjs2026-editor-field__label",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Logo Grid Rows', 'cb-identityjs2026')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "cb-identityjs2026-repeater-field__rows",
      children: rows.map((row, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "cb-identityjs2026-repeater-field__row",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Title', 'cb-identityjs2026'),
          value: row.title,
          onChange: value => updateRow(index, {
            title: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(LogoGridLogos, {
          ids: row.logoIds,
          onChange: ids => updateRow(index, {
            logoIds: ids
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "cb-identityjs2026-repeater-field__row-actions",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "small",
            isDestructive: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove', 'cb-identityjs2026'),
            onClick: () => removeRow(index),
            children: "\xD7"
          })
        })]
      }, row.id))
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "primary",
      onClick: addRow,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add row', 'cb-identityjs2026')
    })]
  });
}
function LogoGridLogos({
  ids,
  onChange
}) {
  const urls = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    const media = select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__.store);
    return (ids || []).map(id => media.getMedia(id)?.source_url).filter(Boolean);
  }, [ids]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
      multiple: true,
      gallery: true,
      onSelect: selected => onChange(selected.map(item => item.id)),
      allowedTypes: ['image'],
      value: ids,
      render: ({
        open
      }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "cb-identityjs2026-repeater-field__image",
        children: [urls.map(url => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("img", {
          src: url,
          alt: "",
          style: {
            maxWidth: '80px',
            maxHeight: '60px',
            marginRight: '4px',
            display: 'inline-block'
          }
        }, url)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "secondary",
          size: "small",
          onClick: open,
          children: ids && ids.length ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Replace Logos', 'cb-identityjs2026') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Logos', 'cb-identityjs2026')
        }), ids && ids.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "tertiary",
          size: "small",
          isDestructive: true,
          onClick: () => onChange([]),
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove All', 'cb-identityjs2026')
        })]
      })
    })
  });
}
function ImageFields({
  module: mod,
  updateModule
}) {
  const url = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    if (!mod.imageId) {
      return '';
    }
    return select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__.store).getMedia(mod.imageId)?.source_url || '';
  }, [mod.imageId]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "cb-identityjs2026-editor-field-row cb-identityjs2026-editor-field-row--3col",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "cb-identityjs2026-editor-field",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
          className: "cb-identityjs2026-editor-field__label",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image', 'cb-identityjs2026')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
            onSelect: media => updateModule({
              imageId: media.id
            }),
            allowedTypes: ['image'],
            value: mod.imageId,
            render: ({
              open
            }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
              className: "cb-identityjs2026-editor-field__control",
              children: [url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("img", {
                src: url,
                alt: "",
                style: {
                  maxWidth: '200px',
                  display: 'block',
                  marginBottom: '8px'
                }
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                variant: "secondary",
                onClick: open,
                children: url ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Replace Image', 'cb-identityjs2026') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Image', 'cb-identityjs2026')
              }), url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
                variant: "tertiary",
                isDestructive: true,
                onClick: () => updateModule({
                  imageId: 0
                }),
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove', 'cb-identityjs2026')
              })]
            })
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Aspect Ratio', 'cb-identityjs2026'),
        value: mod.imageAspectRatio,
        options: _constants__WEBPACK_IMPORTED_MODULE_6__.IMAGE_ASPECT_RATIO_OPTIONS,
        onChange: value => updateModule({
          imageAspectRatio: value
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Size', 'cb-identityjs2026'),
        value: mod.imageSize,
        options: _constants__WEBPACK_IMPORTED_MODULE_6__.IMAGE_SIZE_OPTIONS,
        onChange: value => updateModule({
          imageSize: value
        }),
        help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('"Native" + "Contain" caps the image to its own real pixel width so it never upscales.', 'cb-identityjs2026')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Bleed to edge', 'cb-identityjs2026'),
      checked: !!mod.imageBleedEdge,
      onChange: value => updateModule({
        imageBleedEdge: value
      }),
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Removes the section’s own top/bottom/right padding so the image sits flush against those edges. Only looks right when this image is against that edge already — e.g. the row on the outside of the section, image column on the right.', 'cb-identityjs2026')
    })]
  });
}
function VideoFields({
  module: mod,
  updateModule
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
    type: "url",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Vimeo URL', 'cb-identityjs2026'),
    value: mod.videoUrl,
    onChange: value => updateModule({
      videoUrl: value
    }),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('A Vimeo player URL, e.g. https://player.vimeo.com/video/123456789. Always embeds at a fixed 16:9 — there is no per-instance aspect ratio option.', 'cb-identityjs2026')
  });
}
function QaFields({
  module: mod,
  updateModule
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_RepeaterField__WEBPACK_IMPORTED_MODULE_5__["default"], {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Questions & Answers', 'cb-identityjs2026'),
      layout: "column",
      value: mod.qaRows,
      onChange: value => updateModule({
        qaRows: value
      }),
      fields: [{
        name: 'question',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Question', 'cb-identityjs2026')
      }, {
        name: 'answer',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Answer', 'cb-identityjs2026'),
        type: 'textarea'
      }],
      emptyRow: {
        question: '',
        answer: ''
      }
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Lead First (style the first row larger)', 'cb-identityjs2026'),
      checked: mod.qaLeadFirst,
      onChange: value => updateModule({
        qaLeadFirst: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Large Left (style every question larger)', 'cb-identityjs2026'),
      checked: mod.qaLargeLeft,
      onChange: value => updateModule({
        qaLargeLeft: value
      })
    })]
  });
}
function FaqFields({
  module: mod,
  updateModule
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_RepeaterField__WEBPACK_IMPORTED_MODULE_5__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('FAQs', 'cb-identityjs2026'),
    layout: "column",
    value: mod.faqRows,
    onChange: value => updateModule({
      faqRows: value
    }),
    fields: [{
      name: 'question',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Question', 'cb-identityjs2026')
    }, {
      name: 'answer',
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Answer', 'cb-identityjs2026'),
      type: 'richtext',
      multiline: true
    }],
    emptyRow: {
      question: '',
      answer: ''
    }
  });
}
function ButtonFields({
  module: mod,
  updateModule
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Button Text', 'cb-identityjs2026'),
      value: mod.buttonLinkText,
      onChange: value => updateModule({
        buttonLinkText: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      type: "url",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Button URL', 'cb-identityjs2026'),
      value: mod.buttonLinkUrl,
      onChange: value => updateModule({
        buttonLinkUrl: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Open in a new tab', 'cb-identityjs2026'),
      checked: mod.buttonLinkTarget,
      onChange: value => updateModule({
        buttonLinkTarget: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('CTA Caption', 'cb-identityjs2026'),
      value: mod.ctaText,
      onChange: value => updateModule({
        ctaText: value
      }),
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Optional — shown alongside the button, not instead of it.', 'cb-identityjs2026')
    })]
  });
}
function CodeFields({
  module: mod,
  updateModule
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "cb-identityjs2026-editor-field",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("label", {
      className: "cb-identityjs2026-editor-field__label",
      htmlFor: `cb-code-${mod.id}`,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('HTML', 'cb-identityjs2026')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("textarea", {
      id: `cb-code-${mod.id}`,
      className: "cb-identityjs2026-editor-field__control",
      rows: 10,
      spellCheck: "false",
      autoCapitalize: "off",
      autoComplete: "off",
      autoCorrect: "off",
      style: {
        width: '100%',
        fontFamily: 'Consolas, Monaco, monospace',
        fontSize: '12px',
        whiteSpace: 'pre',
        overflowWrap: 'normal',
        overflowX: 'auto'
      },
      value: mod.codeContent || '',
      onChange: event => updateModule({
        codeContent: event.target.value
      }),
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('<div>…</div>', 'cb-identityjs2026')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
      className: "cb-identityjs2026-editor-field__help",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Printed on the page exactly as entered — embeds, iframes, third-party widgets. No filtering, no shortcode expansion.', 'cb-identityjs2026')
    })]
  });
}

/***/ },

/***/ "./blocks/content-builder/src/RowEditor.js"
/*!*************************************************!*\
  !*** ./blocks/content-builder/src/RowEditor.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RowEditor)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./blocks/content-builder/src/constants.js");
/* harmony import */ var _ModuleEditor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ModuleEditor */ "./blocks/content-builder/src/ModuleEditor.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





/**
 * One row's own fields (column layout, top/bottom padding) plus its
 * columns — each column a list of stacked modules, not a single module.
 *
 * Confirmed live against production's own cb-content-grid-v2.php: a flat
 * modules-list mapped 1:1 to columns by index can't express "Heading +
 * Text + List all in one column, next to an Image in the other" — with 3
 * modules in a 2-column layout, the 3rd module wraps onto a new grid row
 * starting at the container's own left edge, not stacked under module 2.
 * Production only ever avoids this by keeping such content in one big ACF
 * wysiwyg field (real TinyMCE, lets an editor insert an inline heading via
 * its Format dropdown) — this block's own `text` module uses Gutenberg's
 * RichText instead, which can't mix tag types the same way (core itself
 * keeps `core/heading`/`core/paragraph` separate for the same reason).
 * Grouping modules into columns is the correct fix either way: it's how
 * you get "heading, then paragraphs, then a list" stacked together
 * regardless of which module types are involved.
 *
 * `has_padding` is coda-only in the real source (see
 * content-builder-research.md) — this block always stores both booleans
 * explicitly (default true/true) since it's a fresh native block with no
 * legacy ACF checkbox-serialization quirk to work around.
 *
 * @param {Object}   props
 * @param {Object}   props.row
 * @param {Function} props.updateRow ( patch ) => void
 */

function RowEditor({
  row,
  updateRow
}) {
  const columns = (0,_constants__WEBPACK_IMPORTED_MODULE_2__.normalizeRowColumns)(row);
  function updateColumns(next) {
    // `modules: undefined` drops the legacy flat key once a row is
    // edited through this UI (JSON.stringify omits undefined-valued
    // keys), so a re-saved row persists in the new `columns` shape only
    // — render.php's own fallback to `modules` only matters for rows
    // this editor hasn't touched yet.
    updateRow({
      columns: next,
      modules: undefined
    });
  }
  function updateColumn(index, patch) {
    const next = columns.slice();
    next[index] = {
      ...next[index],
      ...patch
    };
    updateColumns(next);
  }
  function addColumn() {
    updateColumns([...columns, (0,_constants__WEBPACK_IMPORTED_MODULE_2__.emptyColumn)()]);
  }
  function removeColumn(index) {
    // eslint-disable-next-line no-alert -- matches RepeaterField's own confirm() convention.
    if (!window.confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove this column and everything in it?', 'cb-identityjs2026'))) {
      return;
    }
    updateColumns(columns.filter((_col, i) => i !== index));
  }
  function moveColumn(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= columns.length) {
      return;
    }
    const next = columns.slice();
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    updateColumns(next);
  }
  function updateModules(columnIndex, nextModules) {
    updateColumn(columnIndex, {
      modules: nextModules
    });
  }
  function updateModule(columnIndex, moduleIndex, patch) {
    const modules = columns[columnIndex].modules || [];
    const next = modules.slice();
    next[moduleIndex] = {
      ...next[moduleIndex],
      ...patch
    };
    updateModules(columnIndex, next);
  }
  function addModule(columnIndex) {
    const modules = columns[columnIndex].modules || [];
    updateModules(columnIndex, [...modules, (0,_constants__WEBPACK_IMPORTED_MODULE_2__.emptyModule)()]);
  }
  function removeModule(columnIndex, moduleIndex) {
    // eslint-disable-next-line no-alert -- matches RepeaterField's own confirm() convention.
    if (!window.confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove this module?', 'cb-identityjs2026'))) {
      return;
    }
    const modules = columns[columnIndex].modules || [];
    updateModules(columnIndex, modules.filter((_mod, i) => i !== moduleIndex));
  }
  function moveModule(columnIndex, moduleIndex, direction) {
    const modules = columns[columnIndex].modules || [];
    const target = moduleIndex + direction;
    if (target < 0 || target >= modules.length) {
      return;
    }
    const next = modules.slice();
    const tmp = next[moduleIndex];
    next[moduleIndex] = next[target];
    next[target] = tmp;
    updateModules(columnIndex, next);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "cb-identityjs2026-content-builder-row",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "cb-identityjs2026-row-settings",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Column Layout', 'cb-identityjs2026'),
          value: row.columnLayout,
          options: _constants__WEBPACK_IMPORTED_MODULE_2__.COLUMN_LAYOUT_OPTIONS,
          onChange: value => updateRow({
            columnLayout: value
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "cb-identityjs2026-radio-inline",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RadioControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Padding Top (rem)', 'cb-identityjs2026'),
          selected: String((0,_constants__WEBPACK_IMPORTED_MODULE_2__.getRowPadding)(row, 'Top')),
          options: _constants__WEBPACK_IMPORTED_MODULE_2__.ROW_PADDING_OPTIONS,
          onChange: value => updateRow({
            paddingTop: Number(value)
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "cb-identityjs2026-radio-inline",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RadioControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Padding Bottom (rem)', 'cb-identityjs2026'),
          selected: String((0,_constants__WEBPACK_IMPORTED_MODULE_2__.getRowPadding)(row, 'Bottom')),
          options: _constants__WEBPACK_IMPORTED_MODULE_2__.ROW_PADDING_OPTIONS,
          onChange: value => updateRow({
            paddingBottom: Number(value)
          })
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
      className: "cb-identityjs2026-editor-field__help",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Each column holds its own stack of modules — e.g. a Heading, then Text, then a List, all in one column, next to an Image in the other. Nothing enforces column count against the chosen layout — add as many or as few columns as you like; extra ones just take the layout’s last column width.', 'cb-identityjs2026')
    }), columns.map((column, columnIndex) => {
      const modules = column.modules || [];
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "cb-identityjs2026-content-builder-column-wrap",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "cb-identityjs2026-content-builder-column-wrap__header",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("span", {
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Column', 'cb-identityjs2026'), " ", columnIndex + 1]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "cb-identityjs2026-repeater-field__row-actions",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
              size: "small",
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Move left', 'cb-identityjs2026'),
              onClick: () => moveColumn(columnIndex, -1),
              disabled: 0 === columnIndex,
              children: "\u25C0"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
              size: "small",
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Move right', 'cb-identityjs2026'),
              onClick: () => moveColumn(columnIndex, 1),
              disabled: columnIndex === columns.length - 1,
              children: "\u25B6"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
              size: "small",
              isDestructive: true,
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove column', 'cb-identityjs2026'),
              onClick: () => removeColumn(columnIndex),
              children: "\xD7"
            })]
          })]
        }), modules.map((mod, moduleIndex) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "cb-identityjs2026-content-builder-module-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "cb-identityjs2026-content-builder-module-wrap__header",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("span", {
              children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Module', 'cb-identityjs2026'), " ", moduleIndex + 1]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
              className: "cb-identityjs2026-repeater-field__row-actions",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
                size: "small",
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Move up', 'cb-identityjs2026'),
                onClick: () => moveModule(columnIndex, moduleIndex, -1),
                disabled: 0 === moduleIndex,
                children: "\u25B2"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
                size: "small",
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Move down', 'cb-identityjs2026'),
                onClick: () => moveModule(columnIndex, moduleIndex, 1),
                disabled: moduleIndex === modules.length - 1,
                children: "\u25BC"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
                size: "small",
                isDestructive: true,
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove', 'cb-identityjs2026'),
                onClick: () => removeModule(columnIndex, moduleIndex),
                children: "\xD7"
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_ModuleEditor__WEBPACK_IMPORTED_MODULE_3__["default"], {
            module: mod,
            updateModule: patch => updateModule(columnIndex, moduleIndex, patch)
          })]
        }, mod.id)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          variant: "secondary",
          onClick: () => addModule(columnIndex),
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Module to This Column', 'cb-identityjs2026')
        })]
      }, column.id);
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      variant: "primary",
      onClick: addColumn,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Column', 'cb-identityjs2026')
    })]
  });
}

/***/ },

/***/ "./blocks/content-builder/src/constants.js"
/*!*************************************************!*\
  !*** ./blocks/content-builder/src/constants.js ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COLUMN_LAYOUT_OPTIONS: () => (/* binding */ COLUMN_LAYOUT_OPTIONS),
/* harmony export */   FW_OPTIONS: () => (/* binding */ FW_OPTIONS),
/* harmony export */   HEADING_DEFAULTS: () => (/* binding */ HEADING_DEFAULTS),
/* harmony export */   HEADING_FS_OPTIONS: () => (/* binding */ HEADING_FS_OPTIONS),
/* harmony export */   IMAGE_ASPECT_RATIO_OPTIONS: () => (/* binding */ IMAGE_ASPECT_RATIO_OPTIONS),
/* harmony export */   IMAGE_SIZE_OPTIONS: () => (/* binding */ IMAGE_SIZE_OPTIONS),
/* harmony export */   LIST_FS_OPTIONS: () => (/* binding */ LIST_FS_OPTIONS),
/* harmony export */   MODULE_TYPE_OPTIONS: () => (/* binding */ MODULE_TYPE_OPTIONS),
/* harmony export */   ROW_PADDING_OPTIONS: () => (/* binding */ ROW_PADDING_OPTIONS),
/* harmony export */   STATS_FS_OPTIONS: () => (/* binding */ STATS_FS_OPTIONS),
/* harmony export */   TEXT_FS_OPTIONS: () => (/* binding */ TEXT_FS_OPTIONS),
/* harmony export */   emptyColumn: () => (/* binding */ emptyColumn),
/* harmony export */   emptyModule: () => (/* binding */ emptyModule),
/* harmony export */   emptyRow: () => (/* binding */ emptyRow),
/* harmony export */   generateId: () => (/* binding */ generateId),
/* harmony export */   getRowPadding: () => (/* binding */ getRowPadding),
/* harmony export */   normalizeRowColumns: () => (/* binding */ normalizeRowColumns)
/* harmony export */ });
/**
 * Real, confirmed choices — see content-builder-research.md for the source
 * audit. fs-800/fs-950 are deliberately excluded from every list below:
 * neither has a real, working `--fs-*` token in the current source
 * (cb-identitygroup2026/_tokens.scss), so offering them would just be a
 * dead select option (confirmed: fs-950 is the one real source itself
 * still offers despite it resolving to nothing). fs-300 DOES have a real
 * token in this project (tokens.css/tokens/identity.css) and is offered
 * in TEXT_FS_OPTIONS as the default text-module size.
 */

const COLUMN_LAYOUT_OPTIONS = [{
  label: 'Full Width',
  value: '12'
}, {
  label: 'Two Columns (50/50)',
  value: '6-6'
}, {
  label: 'One Third / Two Thirds',
  value: '4-8'
}, {
  label: 'Two Thirds / One Third',
  value: '8-4'
}, {
  label: 'Three Columns',
  value: '4-4-4'
}, {
  label: 'Four Columns',
  value: '3-3-3-3'
}, {
  label: 'One Quarter / Half / One Quarter',
  value: '3-6-3'
}, {
  label: 'Half / One Quarter / One Quarter',
  value: '6-3-3'
}, {
  label: 'One Quarter / One Quarter / Half',
  value: '3-3-6'
}];
const MODULE_TYPE_OPTIONS = [{
  label: 'Heading (H1)',
  value: 'h1'
}, {
  label: 'Heading (H2)',
  value: 'h2'
}, {
  label: 'Heading (H3)',
  value: 'h3'
}, {
  label: 'Text',
  value: 'text'
}, {
  label: 'List',
  value: 'list'
}, {
  label: 'Stats',
  value: 'stats'
}, {
  label: 'Quote',
  value: 'quote'
}, {
  label: 'Links',
  value: 'links'
}, {
  label: 'Logo Grid',
  value: 'logo_grid'
}, {
  label: 'Image',
  value: 'image'
}, {
  label: 'Video',
  value: 'video'
}, {
  label: 'Q&A (no Schema)',
  value: 'qa'
}, {
  label: 'FAQ',
  value: 'faq'
}, {
  label: 'Button',
  value: 'button'
}, {
  label: 'Code (HTML)',
  value: 'code'
}, {
  label: 'Divider',
  value: 'divider'
}, {
  label: 'Empty',
  value: 'empty'
}];
const FW_OPTIONS = [{
  label: 'Light',
  value: 'fw-light'
}, {
  label: 'Regular',
  value: 'fw-regular'
}, {
  label: 'Book',
  value: 'fw-book'
}, {
  label: 'Semibold',
  value: 'fw-semibold'
}];
const fsOption = slug => ({
  label: slug,
  value: slug
});
const HEADING_FS_OPTIONS = ['fs-200', 'fs-300', 'fs-400', 'fs-500', 'fs-600', 'fs-700', 'fs-850', 'fs-875', 'fs-900'].map(fsOption);
const TEXT_FS_OPTIONS = ['fs-100', 'fs-200', 'fs-300', 'fs-400', 'fs-500', 'fs-600', 'fs-700', 'fs-850'].map(fsOption);
const LIST_FS_OPTIONS = ['fs-100', 'fs-200', 'fs-300', 'fs-400', 'fs-500'].map(fsOption);
const STATS_FS_OPTIONS = TEXT_FS_OPTIONS;

/**
 * Applied when a module is first switched to a heading type (see
 * ModuleEditor.js) — `showLines` / `color` are only set when present here.
 * Existing saved modules are never touched; these only seed new ones.
 */
const HEADING_DEFAULTS = {
  h1: {
    fontSize: 'fs-850',
    fontWeight: 'fw-semibold'
  },
  h2: {
    fontSize: 'fs-850',
    fontWeight: 'fw-light',
    showLines: false
  },
  h3: {
    fontSize: 'fs-300',
    fontWeight: 'fw-book',
    color: 'white'
  }
};
const IMAGE_ASPECT_RATIO_OPTIONS = [{
  label: 'Native',
  value: 'native'
}, {
  label: '21:9',
  value: '21x9'
}, {
  label: '16:9',
  value: '16x9'
}, {
  label: '3:2',
  value: '3x2'
}, {
  label: '4:3',
  value: '4x3'
}, {
  label: '5:4',
  value: '5x4'
}, {
  label: '1:1',
  value: '1x1'
}, {
  label: '2:3 (portrait)',
  value: '2x3'
}, {
  label: '9:16 (portrait)',
  value: '9x16'
}];
const IMAGE_SIZE_OPTIONS = [{
  label: 'Cover',
  value: 'cover'
}, {
  label: 'Contain',
  value: 'contain'
}];

/**
 * @return {string} A short id, unique enough among sibling rows/modules —
 * same shape as RepeaterField's own generateRowId(), duplicated here since
 * it isn't exported and this block manages its own nested row arrays
 * (rows, and modules within each row) rather than using RepeaterField for
 * them directly.
 */
function generateId() {
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function emptyModule() {
  return {
    id: generateId(),
    moduleType: 'text',
    headingText: '',
    headingFontSize: '',
    headingFontWeight: '',
    headingColor: '',
    headingShowLines: false,
    textContent: '',
    textFontSize: 'fs-200',
    textFontWeight: 'fw-regular',
    listContent: '',
    listFontSize: 'fs-200',
    listFontWeight: 'fw-regular',
    statsRows: [],
    quoteText: '',
    quoteLinkText: '',
    quoteLinkUrl: '',
    quoteLinkTarget: false,
    linksRows: [],
    logoGridRows: [],
    imageId: 0,
    imageAspectRatio: 'native',
    imageSize: 'cover',
    videoUrl: '',
    qaRows: [],
    qaLeadFirst: false,
    qaLargeLeft: false,
    faqRows: [],
    buttonLinkText: '',
    buttonLinkUrl: '',
    buttonLinkTarget: false,
    ctaText: '',
    codeContent: '',
    emptyHeight: 0
  };
}
function emptyColumn() {
  return {
    id: generateId(),
    modules: [emptyModule()]
  };
}

/**
 * Row top/bottom padding choices, in rem. 1.5 and 3 are the old on/off
 * toggles' own values (--space-4 / --space-5), so rows saved with the legacy
 * hasPaddingTop/hasPaddingBottom booleans map straight onto them.
 */
const ROW_PADDING_OPTIONS = [0, 1.5, 3, 5].map(value => ({
  label: String(value),
  value: String(value)
}));

/**
 * A row's current padding in rem: the explicit paddingTop/paddingBottom if
 * set, otherwise derived from the legacy boolean (true = 1.5 top / 3 bottom).
 *
 * @param {Object} row
 * @param {'Top'|'Bottom'} side
 * @return {number}
 */
function getRowPadding(row, side) {
  const explicit = row[`padding${side}`];
  if (explicit !== undefined && explicit !== null && explicit !== '') {
    return Number(explicit);
  }
  return row[`hasPadding${side}`] ? 'Top' === side ? 1.5 : 3 : 0;
}
function emptyRow() {
  return {
    id: generateId(),
    columnLayout: '12',
    paddingTop: 1.5,
    paddingBottom: 1.5,
    columns: [emptyColumn()]
  };
}

/**
 * A row's columns — each a list of stacked modules (see RowEditor.js's own
 * header comment for why that grouping exists). Falls back to one empty
 * column only for a genuinely new row with nothing saved yet; there's no
 * legacy flat-`modules`-shape reader here — this theme has no real
 * published content, so every row already saved on this install was
 * migrated to `columns` directly (one-off wp-cli script) rather than this
 * theme carrying a dual-shape reader indefinitely.
 *
 * @param {Object} row
 * @return {Object[]} Array of `{ id, modules }` columns.
 */
function normalizeRowColumns(row) {
  return Array.isArray(row.columns) && row.columns.length ? row.columns : [emptyColumn()];
}

/***/ },

/***/ "./blocks/content-builder/src/edit.js"
/*!********************************************!*\
  !*** ./blocks/content-builder/src/edit.js ***!
  \********************************************/
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
/* harmony import */ var _RowEditor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./RowEditor */ "./blocks/content-builder/src/RowEditor.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./constants */ "./blocks/content-builder/src/constants.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__);









/**
 * Built from `cb-content-grid-v2` — see identity-global-block-spec.md's
 * Content Builder entry and content-builder-research.md for the full real-
 * source audit. Built against cb-identitygroup2026's fuller 13-module-type
 * set (h1/stats and the has_padding row field are coda-only additions,
 * absent from the older cb-identity2025 copy).
 *
 * Background colour uses block.json's native supports.color.background
 * (__experimentalSkipSerialization) — same reasoning as every other block
 * this session using that pattern (see Push Panel/Section Title): applied
 * to the section itself in render.php, not the editor's own form wrapper.
 * Its slug also drives the real source's dark-lines/light-lines divider
 * colour logic (see render.php).
 */

function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    rows,
    backgroundImageId
  } = attributes;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: 'container cb-identityjs2026-editor-block'
  });
  const backgroundUrl = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_3__.useSelect)(select => {
    if (!backgroundImageId) {
      return '';
    }
    return select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_4__.store).getMedia(backgroundImageId)?.source_url || '';
  }, [backgroundImageId]);
  function updateRows(next) {
    setAttributes({
      rows: next
    });
  }
  function updateRow(index, patch) {
    const next = rows.slice();
    next[index] = {
      ...next[index],
      ...patch
    };
    updateRows(next);
  }
  function addRow() {
    updateRows([...rows, (0,_constants__WEBPACK_IMPORTED_MODULE_7__.emptyRow)()]);
  }
  function removeRow(index) {
    // eslint-disable-next-line no-alert -- matches RepeaterField's own confirm() convention.
    if (!window.confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove this row?', 'cb-identityjs2026'))) {
      return;
    }
    updateRows(rows.filter((_row, i) => i !== index));
  }
  function moveRow(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) {
      return;
    }
    const next = rows.slice();
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    updateRows(next);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_shared_EditorBlockShell__WEBPACK_IMPORTED_MODULE_5__["default"], {
    blockProps: blockProps,
    clientId: clientId,
    title: "CB Content Builder",
    textDomain: "cb-identityjs2026",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      className: "cb-identityjs2026-editor-field",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("label", {
        className: "cb-identityjs2026-editor-field__label",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Background Image', 'cb-identityjs2026')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
          onSelect: media => setAttributes({
            backgroundImageId: media.id
          }),
          allowedTypes: ['image'],
          value: backgroundImageId,
          render: ({
            open
          }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
            className: "cb-identityjs2026-editor-field__control",
            children: [backgroundUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("img", {
              src: backgroundUrl,
              alt: "",
              style: {
                maxWidth: '200px',
                display: 'block',
                marginBottom: '8px'
              }
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              variant: "secondary",
              onClick: open,
              children: backgroundUrl ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Replace Background', 'cb-identityjs2026') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Background', 'cb-identityjs2026')
            }), backgroundUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
              variant: "tertiary",
              isDestructive: true,
              onClick: () => setAttributes({
                backgroundImageId: 0
              }),
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove', 'cb-identityjs2026')
            })]
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("p", {
        className: "cb-identityjs2026-editor-field__help",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Optional — a parallax cover image behind every row. Override the divider-line colour from Colour in the block’s own Settings sidebar.', 'cb-identityjs2026')
      })]
    }), rows.map((row, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      className: "cb-identityjs2026-content-builder-row-wrap",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
        className: "cb-identityjs2026-content-builder-row-wrap__header",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("span", {
          children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Row', 'cb-identityjs2026'), " ", index + 1]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          className: "cb-identityjs2026-repeater-field__row-actions",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "small",
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Move up', 'cb-identityjs2026'),
            onClick: () => moveRow(index, -1),
            disabled: 0 === index,
            children: "\u25B2"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "small",
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Move down', 'cb-identityjs2026'),
            onClick: () => moveRow(index, 1),
            disabled: index === rows.length - 1,
            children: "\u25BC"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            size: "small",
            isDestructive: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Remove', 'cb-identityjs2026'),
            onClick: () => removeRow(index),
            children: "\xD7"
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_RowEditor__WEBPACK_IMPORTED_MODULE_6__["default"], {
        row: row,
        updateRow: patch => updateRow(index, patch)
      })]
    }, row.id)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "primary",
      onClick: addRow,
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Row', 'cb-identityjs2026')
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

/***/ "./blocks/content-builder/block.json"
/*!*******************************************!*\
  !*** ./blocks/content-builder/block.json ***!
  \*******************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"cb-identityjs2026/content-builder","title":"CB Content Builder","category":"cb-identityjs2026","icon":"layout","attributes":{"rows":{"type":"array","default":[]},"backgroundImageId":{"type":"number","default":0}},"supports":{"anchor":true,"className":true,"align":true,"color":{"background":true,"text":true,"gradient":false,"__experimentalSkipSerialization":true}},"editorScript":"file:./build/index.js","render":"file:./render.php"}');

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
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		const getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.hasOwn(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************************************!*\
  !*** ./blocks/content-builder/src/index.js ***!
  \*********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./blocks/content-builder/src/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../block.json */ "./blocks/content-builder/block.json");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_2__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"],
  save: () => null
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map