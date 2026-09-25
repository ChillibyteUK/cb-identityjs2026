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

export const COLUMN_LAYOUT_OPTIONS = [
	{ label: 'Full Width', value: '12' },
	{ label: 'Two Columns (50/50)', value: '6-6' },
	{ label: 'One Third / Two Thirds', value: '4-8' },
	{ label: 'Two Thirds / One Third', value: '8-4' },
	{ label: 'Three Columns', value: '4-4-4' },
	{ label: 'Four Columns', value: '3-3-3-3' },
	{ label: 'One Quarter / Half / One Quarter', value: '3-6-3' },
	{ label: 'Half / One Quarter / One Quarter', value: '6-3-3' },
	{ label: 'One Quarter / One Quarter / Half', value: '3-3-6' },
];

export const MODULE_TYPE_OPTIONS = [
	{ label: 'Heading (H1)', value: 'h1' },
	{ label: 'Heading (H2)', value: 'h2' },
	{ label: 'Heading (H3)', value: 'h3' },
	{ label: 'Text', value: 'text' },
	{ label: 'List', value: 'list' },
	{ label: 'Stats', value: 'stats' },
	{ label: 'Quote', value: 'quote' },
	{ label: 'Links', value: 'links' },
	{ label: 'Logo Grid', value: 'logo_grid' },
	{ label: 'Image', value: 'image' },
	{ label: 'Video', value: 'video' },
	{ label: 'Q&A', value: 'qa' },
	{ label: 'Button', value: 'button' },
	{ label: 'Empty', value: 'empty' },
];

export const FW_OPTIONS = [
	{ label: 'Light', value: 'fw-light' },
	{ label: 'Regular', value: 'fw-regular' },
	{ label: 'Book', value: 'fw-book' },
	{ label: 'Semibold', value: 'fw-semibold' },
];

const fsOption = ( slug ) => ( { label: slug, value: slug } );

export const HEADING_FS_OPTIONS = [ 'fs-200', 'fs-400', 'fs-500', 'fs-600', 'fs-700', 'fs-850', 'fs-875', 'fs-900' ].map( fsOption );
export const TEXT_FS_OPTIONS = [ 'fs-100', 'fs-200', 'fs-300', 'fs-400', 'fs-500', 'fs-600', 'fs-700' ].map( fsOption );
export const LIST_FS_OPTIONS = [ 'fs-100', 'fs-200', 'fs-400', 'fs-500' ].map( fsOption );
export const STATS_FS_OPTIONS = TEXT_FS_OPTIONS;

export const HEADING_DEFAULTS = {
	h1: { fontSize: 'fs-850', fontWeight: 'fw-semibold' },
	h2: { fontSize: 'fs-700', fontWeight: 'fw-book' },
	h3: { fontSize: 'fs-600', fontWeight: 'fw-book' },
};

export const IMAGE_ASPECT_RATIO_OPTIONS = [
	{ label: 'Native', value: 'native' },
	{ label: '21:9', value: '21x9' },
	{ label: '16:9', value: '16x9' },
	{ label: '4:3', value: '4x3' },
	{ label: '1:1', value: '1x1' },
];

export const IMAGE_SIZE_OPTIONS = [
	{ label: 'Cover', value: 'cover' },
	{ label: 'Contain', value: 'contain' },
];

/**
 * @return {string} A short id, unique enough among sibling rows/modules —
 * same shape as RepeaterField's own generateRowId(), duplicated here since
 * it isn't exported and this block manages its own nested row arrays
 * (rows, and modules within each row) rather than using RepeaterField for
 * them directly.
 */
export function generateId() {
	return `id-${ Date.now().toString( 36 ) }-${ Math.random().toString( 36 ).slice( 2, 8 ) }`;
}

export function emptyModule() {
	return {
		id: generateId(),
		moduleType: 'text',
		headingText: '',
		headingFontSize: '',
		headingFontWeight: '',
		textContent: '',
		textFontSize: 'fs-300',
		textFontWeight: 'fw-light',
		listContent: '',
		listFontSize: 'fs-100',
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
		buttonLinkText: '',
		buttonLinkUrl: '',
		buttonLinkTarget: false,
		ctaText: '',
	};
}

export function emptyColumn() {
	return {
		id: generateId(),
		modules: [ emptyModule() ],
	};
}

export function emptyRow() {
	return {
		id: generateId(),
		columnLayout: '12',
		hasLine: false,
		hasPaddingTop: true,
		hasPaddingBottom: true,
		columns: [ emptyColumn() ],
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
export function normalizeRowColumns( row ) {
	return Array.isArray( row.columns ) && row.columns.length ? row.columns : [ emptyColumn() ];
}
