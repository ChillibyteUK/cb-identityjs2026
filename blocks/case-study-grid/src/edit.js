import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, TextControl, CheckboxControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import PostTypePicker from '../../_shared/PostTypePicker';

/**
 * Built from cb-featured-work + cb-related-work (Work by Region / Work
 * Carousel fold in via the same taxonomy_filter pattern) — see
 * identity-global-block-spec.md's Case Study Grid entry. Distinct from
 * Work Index (the full /work/ listing page) — this is the small reusable
 * related/featured widget, droppable into any page.
 *
 * `mode`:
 * - hero: one full-bleed card (real source's `hero_mode` toggle).
 * - grid: `count` latest case studies, optionally narrowed to a fixed
 *   `selectedServices` picker (real source's own `services` field —
 *   always the Service taxonomy specifically, not configurable, matching
 *   production exactly).
 * - auto: derives relevance from the CURRENT post's own terms in
 *   `taxonomyFilter` — generalises Related Work's service-specific
 *   two-pass (Yoast-primary-term match, then general fill) plus its
 *   page-slug fallback to any of theme/service/region, per the spec's
 *   explicit "budget real effort, not a drop-in merge" note.
 */
const TAXONOMY_OPTIONS = [
	{ label: __( 'None', 'cb-identityjs2026' ), value: 'none' },
	{ label: __( 'Theme', 'cb-identityjs2026' ), value: 'theme' },
	{ label: __( 'Service', 'cb-identityjs2026' ), value: 'service' },
	{ label: __( 'Region', 'cb-identityjs2026' ), value: 'region' },
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { mode, heroCaseStudy, count, taxonomyFilter, selectedServices } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	const { serviceTerms, hasResolved } = useSelect( ( select ) => {
		const query = { per_page: -1, orderby: 'name', order: 'asc', _fields: [ 'id', 'name' ] };
		return {
			serviceTerms: select( coreStore ).getEntityRecords( 'taxonomy', 'service', query ),
			hasResolved: select( coreStore ).hasFinishedResolution( 'getEntityRecords', [ 'taxonomy', 'service', query ] ),
		};
	}, [] );

	function toggleService( id ) {
		const next = selectedServices.includes( id )
			? selectedServices.filter( ( existing ) => existing !== id )
			: [ ...selectedServices, id ];
		setAttributes( { selectedServices: next } );
	}

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Case Study Grid" textDomain="cb-identityjs2026">
			<SelectControl
				label={ __( 'Mode', 'cb-identityjs2026' ) }
				value={ mode }
				options={ [
					{ label: 'Hero', value: 'hero' },
					{ label: 'Grid', value: 'grid' },
					{ label: 'Auto (relevant to this page)', value: 'auto' },
				] }
				onChange={ ( value ) => setAttributes( { mode: value } ) }
			/>

			{ 'hero' === mode && (
				<PostTypePicker
					label={ __( 'Hero Case Study', 'cb-identityjs2026' ) }
					postType="case_study"
					value={ heroCaseStudy }
					onChange={ ( id ) => setAttributes( { heroCaseStudy: id } ) }
					help={ __( 'Optional — defaults to the most recent case study.', 'cb-identityjs2026' ) }
				/>
			) }

			{ ( 'grid' === mode || 'auto' === mode ) && (
				<TextControl
					type="number"
					label={ __( 'Count', 'cb-identityjs2026' ) }
					value={ count }
					min={ 1 }
					max={ 24 }
					onChange={ ( value ) => setAttributes( { count: '' === value ? 1 : Number( value ) } ) }
				/>
			) }

			{ 'auto' === mode && (
				<SelectControl
					label={ __( 'Taxonomy', 'cb-identityjs2026' ) }
					value={ taxonomyFilter }
					options={ TAXONOMY_OPTIONS }
					help={ __(
						'Matched against the terms already assigned to the page this block is placed on (falling back to a page-slug/term-slug match) — not an editor-picked filter.',
						'cb-identityjs2026'
					) }
					onChange={ ( value ) => setAttributes( { taxonomyFilter: value } ) }
				/>
			) }

			{ 'grid' === mode && (
				<div className="cb-identityjs2026-editor-field">
					<label className="cb-identityjs2026-editor-field__label">{ __( 'Services', 'cb-identityjs2026' ) }</label>
					<p className="cb-identityjs2026-editor-field__help">
						{ __( 'Optional. Leave all unchecked to show the latest case studies regardless of service.', 'cb-identityjs2026' ) }
					</p>
					{ ! hasResolved ? (
						<Spinner />
					) : ! ( serviceTerms ?? [] ).length ? (
						<p className="cb-identityjs2026-editor-field__help">{ __( 'No terms found.', 'cb-identityjs2026' ) }</p>
					) : (
						<div className="cb-identityjs2026-term-checklist">
							{ serviceTerms.map( ( term ) => (
								<CheckboxControl
									key={ term.id }
									label={ term.name }
									checked={ selectedServices.includes( term.id ) }
									onChange={ () => toggleService( term.id ) }
								/>
							) ) }
						</div>
					) }
				</div>
			) }
		</EditorBlockShell>
	);
}
