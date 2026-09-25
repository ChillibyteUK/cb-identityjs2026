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
  updateRow
}) {
  const id = row[field.name];
  const url = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useSelect)(select => {
    if (!id) {
      return '';
    }
    return select(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_5__.store).getMedia(id)?.source_url || '';
  }, [id]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
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
        })]
      })
    })
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
 *                                  component's own `value`/`onChange` contract at any depth.
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
          if ('image' === field.type) {
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(RepeaterImageField, {
              field: field,
              row: row,
              index: index,
              updateRow: updateRow
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

/***/ "./blocks/detail-list/src/edit.js"
/*!****************************************!*\
  !*** ./blocks/detail-list/src/edit.js ***!
  \****************************************/
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
/* harmony import */ var _shared_RepeaterField__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../_shared/RepeaterField */ "./blocks/_shared/RepeaterField.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






/**
 * Built from About Detail, Service Detail, and cb-details — see
 * identity-global-block-spec.md's Detail List entry. `renderStyle: paired`
 * reproduces About/Service Detail's own real title/description layout
 * (confirmed live on identityglobal.com/about/'s "WHY CHOOSE IDENTITY?"
 * rows); `bullet_list` reproduces cb-details.php's simpler single-line
 * variant (no live instance currently uses this mode — sourced from
 * _cb_details.scss instead, not independently verified against a real
 * page).
 *
 * `introRow` replicates About Detail's own real "first row, no
 * description, shown larger" treatment as an explicit opt-in toggle
 * instead of the old auto-detect-on-save behaviour it used to be — per the
 * spec's own note, this wasn't in cb-details yet. Its colour override
 * moved to real per-row inline formatting once title became RichText (see
 * below) — introRow now only controls size, since there's no per-row
 * equivalent of the block-level Typography size control (each title is one
 * RichText among several in a single block's `details` array, not its own
 * block with its own attributes to hold a size).
 *
 * `title`/`description` are both RichText rather than plain text controls —
 * RichText's own Highlight tool (in its floating selection toolbar) lets an
 * editor override a specific row's colour directly, in the content itself,
 * instead of this block growing more dedicated toggle+CSS-class
 * combinations for cases beyond the one intro-row pattern already known
 * about. Deliberately NOT via block.json's supports.color.text: that's a
 * BLOCK-level control (one colour slot on the whole block's own
 * attributes), not a per-row one, and — confirmed live (2026-09-22) — its
 * useBlockProps()-driven class/style lands on this Edit() function's own
 * outer wrapper, which is the same element EditorBlockShell renders every
 * field label inside. Every label in the editor form (and every row's
 * text on the front end, not just the one intended) picked up that one
 * colour. RichText's inline Highlight format doesn't need the block to
 * declare colour support at all — it works standalone, scoped to the
 * exact selected text.
 */

function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  const {
    renderStyle,
    introRow,
    hasTopBorder,
    details
  } = attributes;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)({
    className: 'container cb-identityjs2026-editor-block'
  });
  const isPaired = 'paired' === renderStyle;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_shared_EditorBlockShell__WEBPACK_IMPORTED_MODULE_3__["default"], {
    blockProps: blockProps,
    clientId: clientId,
    title: "CB Detail List",
    textDomain: "cb-identityjs2026",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Layout', 'cb-identityjs2026'),
      value: renderStyle,
      options: [{
        label: 'Paired (title + description)',
        value: 'paired'
      }, {
        label: 'Bullet List (title only)',
        value: 'bullet_list'
      }],
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Paired shows each row as a title/description pair. Bullet List shows just the titles, one per line.', 'cb-identityjs2026'),
      onChange: value => setAttributes({
        renderStyle: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Top Border', 'cb-identityjs2026'),
      checked: hasTopBorder,
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Not a real source field — added so this block can sit flush against a preceding block when needed.', 'cb-identityjs2026'),
      onChange: value => setAttributes({
        hasTopBorder: value
      })
    }), isPaired && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Style first row as a large intro', 'cb-identityjs2026'),
      checked: introRow,
      help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Only applies when the first row has no description — shows its title larger. For colour, select the row’s title text, open its Highlight tool, and use the Text tab (not Background).', 'cb-identityjs2026'),
      onChange: value => setAttributes({
        introRow: value
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_shared_RepeaterField__WEBPACK_IMPORTED_MODULE_4__["default"], {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Details', 'cb-identityjs2026'),
      layout: "column",
      value: details,
      onChange: value => setAttributes({
        details: value
      }),
      fields: [{
        name: 'title',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Title', 'cb-identityjs2026'),
        type: 'richtext'
      }, ...(isPaired ? [{
        name: 'description',
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Description', 'cb-identityjs2026'),
        type: 'richtext',
        multiline: true
      }] : [])],
      emptyRow: {
        title: '',
        description: ''
      }
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

/***/ "./blocks/detail-list/block.json"
/*!***************************************!*\
  !*** ./blocks/detail-list/block.json ***!
  \***************************************/
(module) {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"cb-identityjs2026/detail-list","title":"CB Detail List","category":"cb-identityjs2026","icon":"excerpt-view","attributes":{"renderStyle":{"type":"string","default":"paired"},"introRow":{"type":"boolean","default":false},"hasTopBorder":{"type":"boolean","default":true},"details":{"type":"array","default":[]}},"supports":{"anchor":true,"className":true,"align":true},"editorScript":"file:./build/index.js","render":"file:./render.php"}');

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
/*!*****************************************!*\
  !*** ./blocks/detail-list/src/index.js ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./blocks/detail-list/src/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../block.json */ "./blocks/detail-list/block.json");



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_2__.name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"],
  save: () => null
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map