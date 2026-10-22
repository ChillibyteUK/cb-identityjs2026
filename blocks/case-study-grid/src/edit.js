import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, TextControl, CheckboxControl, Spinner } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import PostTypePicker from '../../_shared/PostTypePicker';
import PostTypeMultiPicker from '../../_shared/PostTypeMultiPicker';

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
 * - curated: a hand-picked, ordered list of case studies (`caseStudies`, via
 *   PostTypeMultiPicker — same control as Work Index's curated mode); shows every
 *   pick in order, Count doesn't apply.
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
	const { mode, heroCaseStudy, count, taxonomyFilter, selectedServices, selectedThemes, selectedRegions, caseStudies } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	const { serviceTerms, hasResolvedServices, themeTerms, hasResolvedThemes, regionTerms, hasResolvedRegions } = useSelect( ( select ) => {
		const serviceQuery = { per_page: -1, orderby: 'name', order: 'asc', _fields: [ 'id', 'name' ] };
		const themeQuery = { per_page: -1, orderby: 'name', order: 'asc', _fields: [ 'id', 'name' ] };
		const regionQuery = { per_page: -1, orderby: 'name', order: 'asc', _fields: [ 'id', 'name' ] };
		return {
			regionTerms: select( coreStore ).getEntityRecords( 'taxonomy', 'region', regionQuery ),
			hasResolvedRegions: select( coreStore ).hasFinishedResolution( 'getEntityRecords', [ 'taxonomy', 'region', regionQuery ] ),
			serviceTerms: select( coreStore ).getEntityRecords( 'taxonomy', 'service', serviceQuery ),
			hasResolvedServices: select( coreStore ).hasFinishedResolution( 'getEntityRecords', [ 'taxonomy', 'service', serviceQuery ] ),
			themeTerms: select( coreStore ).getEntityRecords( 'taxonomy', 'theme', themeQuery ),
			hasResolvedThemes: select( coreStore ).hasFinishedResolution( 'getEntityRecords', [ 'taxonomy', 'theme', themeQuery ] ),
		};
	}, [] );

	function toggleService( id ) {
		const next = selectedServices.includes( id )
			? selectedServices.filter( ( existing ) => existing !== id )
			: [ ...selectedServices, id ];
		setAttributes( { selectedServices: next } );
	}

	function toggleTheme( id ) {
		const next = selectedThemes.includes( id )
			? selectedThemes.filter( ( existing ) => existing !== id )
			: [ ...selectedThemes, id ];
		setAttributes( { selectedThemes: next } );
	}

	function toggleRegion( id ) {
		const next = selectedRegions.includes( id )
			? selectedRegions.filter( ( existing ) => existing !== id )
			: [ ...selectedRegions, id ];
		setAttributes( { selectedRegions: next } );
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
					{ label: 'Curated (hand-picked, in order)', value: 'curated' },
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

			{ 'curated' === mode && (
				<PostTypeMultiPicker
					label={ __( 'Case Studies', 'cb-identityjs2026' ) }
					addLabel={ __( 'Add case study', 'cb-identityjs2026' ) }
					postType="case_study"
					value={ caseStudies }
					onChange={ ( ids ) => setAttributes( { caseStudies: ids } ) }
					help={ __( 'Shown in this order. Every pick is shown — Count doesn’t apply. On a case study page, that case study is left out of its own list.', 'cb-identityjs2026' ) }
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
				<div className="cb-identityjs2026-editor-field-row cb-identityjs2026-editor-field-row--3col">
					<div className="cb-identityjs2026-editor-field">
						<label className="cb-identityjs2026-editor-field__label">{ __( 'Services', 'cb-identityjs2026' ) }</label>
						<p className="cb-identityjs2026-editor-field__help">
							{ __(
								'Optional. On a case study page, leaving this unchecked auto-matches by the CURRENT case study’s own service (same as production’s Related Work) — picking a service here overrides that auto-match. On any other page, leaving this unchecked shows the latest case studies regardless of service.',
								'cb-identityjs2026'
							) }
						</p>
						{ ! hasResolvedServices ? (
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

					<div className="cb-identityjs2026-editor-field">
						<label className="cb-identityjs2026-editor-field__label">{ __( 'Themes', 'cb-identityjs2026' ) }</label>
						<p className="cb-identityjs2026-editor-field__help">
							{ __(
								'Filters the grid by theme on any page this block is placed on (combined with Services above, if any are picked). On a case study page with no Services picked, it instead just narrows the auto-matched related work by theme — it doesn’t replace that auto-match by service.',
								'cb-identityjs2026'
							) }
						</p>
						{ ! hasResolvedThemes ? (
							<Spinner />
						) : ! ( themeTerms ?? [] ).length ? (
							<p className="cb-identityjs2026-editor-field__help">{ __( 'No terms found.', 'cb-identityjs2026' ) }</p>
						) : (
							<div className="cb-identityjs2026-term-checklist">
								{ themeTerms.map( ( term ) => (
									<CheckboxControl
										key={ term.id }
										label={ term.name }
										checked={ selectedThemes.includes( term.id ) }
										onChange={ () => toggleTheme( term.id ) }
									/>
								) ) }
							</div>
						) }
					</div>

					<div className="cb-identityjs2026-editor-field">
						<label className="cb-identityjs2026-editor-field__label">{ __( 'Regions', 'cb-identityjs2026' ) }</label>
						<p className="cb-identityjs2026-editor-field__help">
							{ __(
								'Filters the grid to work tagged with the chosen region(s), on any page (combined with Services/Themes if picked). On a case study page, picking a region replaces the auto-matched related work, as picking a Service does.',
								'cb-identityjs2026'
							) }
						</p>
						{ ! hasResolvedRegions ? (
							<Spinner />
						) : ! ( regionTerms ?? [] ).length ? (
							<p className="cb-identityjs2026-editor-field__help">{ __( 'No terms found.', 'cb-identityjs2026' ) }</p>
						) : (
							<div className="cb-identityjs2026-term-checklist">
								{ regionTerms.map( ( term ) => (
									<CheckboxControl
										key={ term.id }
										label={ term.name }
										checked={ selectedRegions.includes( term.id ) }
										onChange={ () => toggleRegion( term.id ) }
									/>
								) ) }
							</div>
						) }
					</div>
				</div>
			) }
		</EditorBlockShell>
	);
}
