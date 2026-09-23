import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, ToggleControl, RangeControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from cb-recent-news / cb-recent-news-identity + Latest Insights —
 * see identity-global-block-spec.md's Post Grid entry. `querySource`
 * replaces the two blocks' overlapping category/taxonomy filters with one
 * field; the four extra taxonomies (see inc/taxonomies.php) are the
 * `taxonomy_term` mode's own picker.
 */
const TAXONOMY_OPTIONS = [
	{ label: __( 'Theme', 'cb-identityjs2026' ), value: 'theme' },
	{ label: __( 'Service', 'cb-identityjs2026' ), value: 'service' },
	{ label: __( 'Region', 'cb-identityjs2026' ), value: 'region' },
	{ label: __( 'Person', 'cb-identityjs2026' ), value: 'person' },
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { querySource, category, taxonomyName, taxonomyTerm, count, showCategory, showDate } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	const { terms, hasResolved } = useSelect(
		( select ) => {
			const activeTaxonomy = 'taxonomy_term' === querySource ? taxonomyName : 'category';
			const query = { per_page: -1, orderby: 'name', order: 'asc', _fields: [ 'id', 'name' ] };
			return {
				terms: select( coreStore ).getEntityRecords( 'taxonomy', activeTaxonomy, query ),
				hasResolved: select( coreStore ).hasFinishedResolution( 'getEntityRecords', [ 'taxonomy', activeTaxonomy, query ] ),
			};
		},
		[ querySource, taxonomyName ]
	);

	const termOptions = [
		{ label: __( '— Select —', 'cb-identityjs2026' ), value: 0 },
		...( terms ?? [] ).map( ( term ) => ( { label: term.name, value: term.id } ) ),
	];

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Post Grid" textDomain="cb-identityjs2026">
			<SelectControl
				label={ __( 'Query Source', 'cb-identityjs2026' ) }
				value={ querySource }
				options={ [
					{ label: 'Category', value: 'category' },
					{ label: 'Taxonomy Term', value: 'taxonomy_term' },
				] }
				help={ __(
					'Category also drives the pretitle bar text/colour (Recent News, Recent Insights, etc) for the 4 real category slugs — Taxonomy Term has no pretitle of its own; place a Section Title block before this one instead.',
					'cb-identityjs2026'
				) }
				onChange={ ( value ) => setAttributes( { querySource: value } ) }
			/>

			{ 'taxonomy_term' === querySource && (
				<SelectControl
					label={ __( 'Taxonomy', 'cb-identityjs2026' ) }
					value={ taxonomyName }
					options={ TAXONOMY_OPTIONS }
					onChange={ ( value ) => setAttributes( { taxonomyName: value, taxonomyTerm: 0 } ) }
				/>
			) }

			{ ! hasResolved ? (
				<Spinner />
			) : (
				<SelectControl
					label={ 'taxonomy_term' === querySource ? __( 'Term', 'cb-identityjs2026' ) : __( 'Category', 'cb-identityjs2026' ) }
					value={ 'taxonomy_term' === querySource ? taxonomyTerm : category }
					options={ termOptions }
					onChange={ ( value ) =>
						setAttributes(
							'taxonomy_term' === querySource ? { taxonomyTerm: Number( value ) } : { category: Number( value ) }
						)
					}
				/>
			) }

			<RangeControl
				label={ __( 'Count', 'cb-identityjs2026' ) }
				value={ count }
				min={ 1 }
				max={ 24 }
				onChange={ ( value ) => setAttributes( { count: value } ) }
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
		</EditorBlockShell>
	);
}
