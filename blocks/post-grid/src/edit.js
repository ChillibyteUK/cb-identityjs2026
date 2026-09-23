import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, ToggleControl, TextControl, CheckboxControl, Button, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';

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
const TAXONOMY_OPTIONS = [
	{ label: __( 'Category', 'cb-identityjs2026' ), value: 'category' },
	{ label: __( 'Theme', 'cb-identityjs2026' ), value: 'theme' },
	{ label: __( 'Service', 'cb-identityjs2026' ), value: 'service' },
	{ label: __( 'Region', 'cb-identityjs2026' ), value: 'region' },
	{ label: __( 'Person', 'cb-identityjs2026' ), value: 'person' },
];

function FilterGroupRow( { group, index, onChange, onRemove, canRemove } ) {
	const taxonomy = group.taxonomy || 'category';
	const terms = group.terms || [];

	const { taxonomyTerms, hasResolved } = useSelect(
		( select ) => {
			const query = { per_page: -1, orderby: 'name', order: 'asc', _fields: [ 'id', 'name' ] };
			return {
				taxonomyTerms: select( coreStore ).getEntityRecords( 'taxonomy', taxonomy, query ),
				hasResolved: select( coreStore ).hasFinishedResolution( 'getEntityRecords', [ 'taxonomy', taxonomy, query ] ),
			};
		},
		[ taxonomy ]
	);

	function toggleTerm( id ) {
		const next = terms.includes( id ) ? terms.filter( ( existing ) => existing !== id ) : [ ...terms, id ];
		onChange( index, { ...group, terms: next } );
	}

	return (
		<div className="cb-identityjs2026-post-grid-filter-row">
			<div className="cb-identityjs2026-post-grid-filter-row__header">
				<SelectControl
					label={ __( 'Taxonomy', 'cb-identityjs2026' ) }
					value={ taxonomy }
					options={ TAXONOMY_OPTIONS }
					onChange={ ( value ) => onChange( index, { taxonomy: value, terms: [] } ) }
					__nextHasNoMarginBottom
				/>
				{ canRemove && (
					<Button
						size="small"
						isDestructive
						label={ __( 'Remove filter', 'cb-identityjs2026' ) }
						onClick={ () => onRemove( index ) }
					>
						&times;
					</Button>
				) }
			</div>

			{ ! hasResolved ? (
				<Spinner />
			) : ! ( taxonomyTerms ?? [] ).length ? (
				<p className="cb-identityjs2026-editor-field__help">{ __( 'No terms found.', 'cb-identityjs2026' ) }</p>
			) : (
				<div className="cb-identityjs2026-term-checklist">
					{ taxonomyTerms.map( ( term ) => (
						<CheckboxControl
							key={ term.id }
							label={ term.name }
							checked={ terms.includes( term.id ) }
							onChange={ () => toggleTerm( term.id ) }
						/>
					) ) }
				</div>
			) }
		</div>
	);
}

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { filterGroups, count, showCategory, showDate } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	const groups = filterGroups && filterGroups.length ? filterGroups : [];

	function updateGroup( index, nextGroup ) {
		const next = groups.slice();
		next[ index ] = nextGroup;
		setAttributes( { filterGroups: next } );
	}

	function addGroup() {
		setAttributes( { filterGroups: [ ...groups, { taxonomy: 'category', terms: [] } ] } );
	}

	function removeGroup( index ) {
		setAttributes( { filterGroups: groups.filter( ( _group, i ) => i !== index ) } );
	}

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Post Grid" textDomain="cb-identityjs2026">
			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Filters', 'cb-identityjs2026' ) }</label>
				<p className="cb-identityjs2026-editor-field__help">
					{ __(
						'Each filter matches any post with at least one of its checked terms (OR). Posts must match every filter (AND) — e.g. Category: Insights AND Theme: Growth.',
						'cb-identityjs2026'
					) }
				</p>

				{ groups.map( ( group, index ) => (
					<FilterGroupRow
						key={ index }
						group={ group }
						index={ index }
						onChange={ updateGroup }
						onRemove={ removeGroup }
						canRemove={ groups.length > 1 }
					/>
				) ) }

				<Button variant="secondary" onClick={ addGroup }>
					{ __( '+ Add Filter', 'cb-identityjs2026' ) }
				</Button>
			</div>

			<div className="cb-identityjs2026-editor-field-row cb-identityjs2026-editor-field-row--3col">
				<TextControl
					type="number"
					label={ __( 'Count', 'cb-identityjs2026' ) }
					value={ count }
					min={ 1 }
					max={ 24 }
					onChange={ ( value ) => setAttributes( { count: '' === value ? 1 : Number( value ) } ) }
				/>

				<ToggleControl
					label={ __( 'Show Category', 'cb-identityjs2026' ) }
					checked={ showCategory }
					onChange={ ( value ) => setAttributes( { showCategory: value } ) }
				/>

				<ToggleControl
					label={ __( 'Show Date', 'cb-identityjs2026' ) }
					checked={ showDate }
					onChange={ ( value ) => setAttributes( { showDate: value } ) }
				/>
			</div>
		</EditorBlockShell>
	);
}
