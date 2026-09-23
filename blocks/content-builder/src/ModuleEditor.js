import { __ } from '@wordpress/i18n';
import { RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { TextControl, TextareaControl, SelectControl, ToggleControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import RepeaterField from '../../_shared/RepeaterField';
import {
	MODULE_TYPE_OPTIONS,
	FW_OPTIONS,
	HEADING_FS_OPTIONS,
	TEXT_FS_OPTIONS,
	LIST_FS_OPTIONS,
	STATS_FS_OPTIONS,
	HEADING_DEFAULTS,
	IMAGE_ASPECT_RATIO_OPTIONS,
	IMAGE_SIZE_OPTIONS,
	generateId,
} from './constants';

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
export default function ModuleEditor( { module: mod, updateModule } ) {
	return (
		<div className="cb-identityjs2026-content-builder-module">
			<SelectControl
				label={ __( 'Module Type', 'cb-identityjs2026' ) }
				value={ mod.moduleType }
				options={ MODULE_TYPE_OPTIONS }
				onChange={ ( value ) => {
					const patch = { moduleType: value };
					if ( [ 'h1', 'h2', 'h3' ].includes( value ) && ! mod.headingFontSize ) {
						patch.headingFontSize = HEADING_DEFAULTS[ value ].fontSize;
						patch.headingFontWeight = HEADING_DEFAULTS[ value ].fontWeight;
					}
					updateModule( patch );
				} }
			/>

			{ [ 'h1', 'h2', 'h3' ].includes( mod.moduleType ) && (
				<HeadingFields module={ mod } updateModule={ updateModule } />
			) }
			{ 'text' === mod.moduleType && <TextFields module={ mod } updateModule={ updateModule } /> }
			{ 'list' === mod.moduleType && <ListFields module={ mod } updateModule={ updateModule } /> }
			{ 'stats' === mod.moduleType && <StatsFields module={ mod } updateModule={ updateModule } /> }
			{ 'quote' === mod.moduleType && <QuoteFields module={ mod } updateModule={ updateModule } /> }
			{ 'links' === mod.moduleType && <LinksFields module={ mod } updateModule={ updateModule } /> }
			{ 'logo_grid' === mod.moduleType && <LogoGridFields module={ mod } updateModule={ updateModule } /> }
			{ 'image' === mod.moduleType && <ImageFields module={ mod } updateModule={ updateModule } /> }
			{ 'video' === mod.moduleType && <VideoFields module={ mod } updateModule={ updateModule } /> }
			{ 'qa' === mod.moduleType && <QaFields module={ mod } updateModule={ updateModule } /> }
			{ 'button' === mod.moduleType && <ButtonFields module={ mod } updateModule={ updateModule } /> }
			{ 'empty' === mod.moduleType && (
				<p className="cb-identityjs2026-editor-field__help">
					{ __( 'Renders as a deliberately blank column — no fields needed.', 'cb-identityjs2026' ) }
				</p>
			) }
		</div>
	);
}

function FsFwRow( { fsValue, fwValue, fsOptions, onFsChange, onFwChange } ) {
	return (
		<div style={ { display: 'flex', gap: '12px' } }>
			<div style={ { flex: 1 } }>
				<SelectControl label={ __( 'Font Size', 'cb-identityjs2026' ) } value={ fsValue } options={ fsOptions } onChange={ onFsChange } />
			</div>
			<div style={ { flex: 1 } }>
				<SelectControl label={ __( 'Font Weight', 'cb-identityjs2026' ) } value={ fwValue } options={ FW_OPTIONS } onChange={ onFwChange } />
			</div>
		</div>
	);
}

function HeadingFields( { module: mod, updateModule } ) {
	return (
		<>
			<TextControl
				label={ __( 'Heading Text', 'cb-identityjs2026' ) }
				value={ mod.headingText }
				onChange={ ( value ) => updateModule( { headingText: value } ) }
			/>
			<FsFwRow
				fsValue={ mod.headingFontSize || HEADING_DEFAULTS[ mod.moduleType ].fontSize }
				fwValue={ mod.headingFontWeight || HEADING_DEFAULTS[ mod.moduleType ].fontWeight }
				fsOptions={ HEADING_FS_OPTIONS }
				onFsChange={ ( value ) => updateModule( { headingFontSize: value } ) }
				onFwChange={ ( value ) => updateModule( { headingFontWeight: value } ) }
			/>
		</>
	);
}

function TextFields( { module: mod, updateModule } ) {
	return (
		<>
			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Text', 'cb-identityjs2026' ) }</label>
				<RichText
					tagName="div"
					multiline="p"
					className="cb-identityjs2026-editor-field__control"
					aria-label={ __( 'Text', 'cb-identityjs2026' ) }
					placeholder={ __( 'Text', 'cb-identityjs2026' ) }
					value={ mod.textContent }
					onChange={ ( value ) => updateModule( { textContent: value } ) }
				/>
			</div>
			<FsFwRow
				fsValue={ mod.textFontSize }
				fwValue={ mod.textFontWeight }
				fsOptions={ TEXT_FS_OPTIONS }
				onFsChange={ ( value ) => updateModule( { textFontSize: value } ) }
				onFwChange={ ( value ) => updateModule( { textFontWeight: value } ) }
			/>
		</>
	);
}

function ListFields( { module: mod, updateModule } ) {
	return (
		<>
			<TextareaControl
				label={ __( 'List Items', 'cb-identityjs2026' ) }
				value={ mod.listContent }
				onChange={ ( value ) => updateModule( { listContent: value } ) }
				help={ __( 'One item per line.', 'cb-identityjs2026' ) }
			/>
			<FsFwRow
				fsValue={ mod.listFontSize }
				fwValue={ mod.listFontWeight }
				fsOptions={ LIST_FS_OPTIONS }
				onFsChange={ ( value ) => updateModule( { listFontSize: value } ) }
				onFwChange={ ( value ) => updateModule( { listFontWeight: value } ) }
			/>
		</>
	);
}

function StatsFields( { module: mod, updateModule } ) {
	return (
		<RepeaterField
			label={ __( 'Stats', 'cb-identityjs2026' ) }
			layout="column"
			value={ mod.statsRows }
			onChange={ ( value ) => updateModule( { statsRows: value } ) }
			fields={ [
				{ name: 'statText', label: __( 'Stat', 'cb-identityjs2026' ) },
				{ name: 'detailText', label: __( 'Detail', 'cb-identityjs2026' ) },
				{ name: 'statFontSize', label: __( 'Stat Font Size', 'cb-identityjs2026' ), type: 'radio', options: STATS_FS_OPTIONS },
				{ name: 'statFontWeight', label: __( 'Stat Font Weight', 'cb-identityjs2026' ), type: 'radio', options: FW_OPTIONS },
				{ name: 'detailFontSize', label: __( 'Detail Font Size', 'cb-identityjs2026' ), type: 'radio', options: STATS_FS_OPTIONS },
				{ name: 'detailFontWeight', label: __( 'Detail Font Weight', 'cb-identityjs2026' ), type: 'radio', options: FW_OPTIONS },
			] }
			emptyRow={ { statText: '', detailText: '', statFontSize: 'fs-600', statFontWeight: 'fw-semibold', detailFontSize: 'fs-400', detailFontWeight: 'fw-light' } }
		/>
	);
}

function QuoteFields( { module: mod, updateModule } ) {
	return (
		<>
			<TextareaControl
				label={ __( 'Quote', 'cb-identityjs2026' ) }
				value={ mod.quoteText }
				onChange={ ( value ) => updateModule( { quoteText: value } ) }
			/>
			<TextControl
				label={ __( 'Link Text', 'cb-identityjs2026' ) }
				value={ mod.quoteLinkText }
				onChange={ ( value ) => updateModule( { quoteLinkText: value } ) }
			/>
			<TextControl
				type="url"
				label={ __( 'Link URL', 'cb-identityjs2026' ) }
				value={ mod.quoteLinkUrl }
				onChange={ ( value ) => updateModule( { quoteLinkUrl: value } ) }
			/>
			<ToggleControl
				label={ __( 'Open link in a new tab', 'cb-identityjs2026' ) }
				checked={ mod.quoteLinkTarget }
				onChange={ ( value ) => updateModule( { quoteLinkTarget: value } ) }
			/>
			<p className="cb-identityjs2026-editor-field__help">
				{ __( 'Nothing renders unless the Quote itself has text — a link with no quote text is not shown.', 'cb-identityjs2026' ) }
			</p>
		</>
	);
}

function LinksFields( { module: mod, updateModule } ) {
	return (
		<RepeaterField
			label={ __( 'Links', 'cb-identityjs2026' ) }
			layout="column"
			value={ mod.linksRows }
			onChange={ ( value ) => updateModule( { linksRows: value } ) }
			fields={ [
				{ name: 'title', label: __( 'Title', 'cb-identityjs2026' ) },
				{ name: 'file', label: __( 'File', 'cb-identityjs2026' ), type: 'file', mimeTypes: [ 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ] },
			] }
			emptyRow={ { title: '', file: 0, fileName: '' } }
		/>
	);
}

function LogoGridFields( { module: mod, updateModule } ) {
	const rows = mod.logoGridRows || [];

	function updateRows( next ) {
		updateModule( { logoGridRows: next } );
	}

	function updateRow( index, patch ) {
		const next = rows.slice();
		next[ index ] = { ...next[ index ], ...patch };
		updateRows( next );
	}

	function addRow() {
		updateRows( [ ...rows, { id: generateId(), title: '', logoIds: [] } ] );
	}

	function removeRow( index ) {
		// eslint-disable-next-line no-alert -- matches RepeaterField's own confirm() convention.
		if ( ! window.confirm( __( 'Remove this row?', 'cb-identityjs2026' ) ) ) {
			return;
		}
		updateRows( rows.filter( ( _row, i ) => i !== index ) );
	}

	return (
		<div className="cb-identityjs2026-repeater-field cb-identityjs2026-repeater-field--column">
			<label className="cb-identityjs2026-editor-field__label">{ __( 'Logo Grid Rows', 'cb-identityjs2026' ) }</label>
			<div className="cb-identityjs2026-repeater-field__rows">
				{ rows.map( ( row, index ) => (
					<div className="cb-identityjs2026-repeater-field__row" key={ row.id }>
						<TextControl
							label={ __( 'Title', 'cb-identityjs2026' ) }
							value={ row.title }
							onChange={ ( value ) => updateRow( index, { title: value } ) }
						/>
						<LogoGridLogos ids={ row.logoIds } onChange={ ( ids ) => updateRow( index, { logoIds: ids } ) } />
						<div className="cb-identityjs2026-repeater-field__row-actions">
							<Button size="small" isDestructive label={ __( 'Remove', 'cb-identityjs2026' ) } onClick={ () => removeRow( index ) }>
								&times;
							</Button>
						</div>
					</div>
				) ) }
			</div>
			<Button variant="primary" onClick={ addRow }>
				{ __( 'Add row', 'cb-identityjs2026' ) }
			</Button>
		</div>
	);
}

function LogoGridLogos( { ids, onChange } ) {
	const urls = useSelect(
		( select ) => {
			const media = select( coreStore );
			return ( ids || [] ).map( ( id ) => media.getMedia( id )?.source_url ).filter( Boolean );
		},
		[ ids ]
	);

	return (
		<MediaUploadCheck>
			<MediaUpload
				multiple
				gallery
				onSelect={ ( selected ) => onChange( selected.map( ( item ) => item.id ) ) }
				allowedTypes={ [ 'image' ] }
				value={ ids }
				render={ ( { open } ) => (
					<div className="cb-identityjs2026-repeater-field__image">
						{ urls.map( ( url ) => (
							<img key={ url } src={ url } alt="" style={ { maxWidth: '80px', maxHeight: '60px', marginRight: '4px', display: 'inline-block' } } />
						) ) }
						<Button variant="secondary" size="small" onClick={ open }>
							{ ids && ids.length ? __( 'Replace Logos', 'cb-identityjs2026' ) : __( 'Select Logos', 'cb-identityjs2026' ) }
						</Button>
					</div>
				) }
			/>
		</MediaUploadCheck>
	);
}

function ImageFields( { module: mod, updateModule } ) {
	const url = useSelect(
		( select ) => {
			if ( ! mod.imageId ) {
				return '';
			}
			return select( coreStore ).getMedia( mod.imageId )?.source_url || '';
		},
		[ mod.imageId ]
	);

	return (
		<>
			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Image', 'cb-identityjs2026' ) }</label>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) => updateModule( { imageId: media.id } ) }
						allowedTypes={ [ 'image' ] }
						value={ mod.imageId }
						render={ ( { open } ) => (
							<div className="cb-identityjs2026-editor-field__control">
								{ url && <img src={ url } alt="" style={ { maxWidth: '200px', display: 'block', marginBottom: '8px' } } /> }
								<Button variant="secondary" onClick={ open }>
									{ url ? __( 'Replace Image', 'cb-identityjs2026' ) : __( 'Select Image', 'cb-identityjs2026' ) }
								</Button>
							</div>
						) }
					/>
				</MediaUploadCheck>
			</div>
			<SelectControl
				label={ __( 'Aspect Ratio', 'cb-identityjs2026' ) }
				value={ mod.imageAspectRatio }
				options={ IMAGE_ASPECT_RATIO_OPTIONS }
				onChange={ ( value ) => updateModule( { imageAspectRatio: value } ) }
			/>
			<SelectControl
				label={ __( 'Size', 'cb-identityjs2026' ) }
				value={ mod.imageSize }
				options={ IMAGE_SIZE_OPTIONS }
				onChange={ ( value ) => updateModule( { imageSize: value } ) }
				help={ __( '"Native" + "Contain" caps the image to its own real pixel width so it never upscales.', 'cb-identityjs2026' ) }
			/>
			<ToggleControl
				label={ __( 'Bleed to edge', 'cb-identityjs2026' ) }
				checked={ !! mod.imageBleedEdge }
				onChange={ ( value ) => updateModule( { imageBleedEdge: value } ) }
				help={ __( 'Removes the section’s own top/bottom/right padding so the image sits flush against those edges. Only looks right when this image is against that edge already — e.g. the row on the outside of the section, image column on the right.', 'cb-identityjs2026' ) }
			/>
		</>
	);
}

function VideoFields( { module: mod, updateModule } ) {
	return (
		<TextControl
			type="url"
			label={ __( 'Vimeo URL', 'cb-identityjs2026' ) }
			value={ mod.videoUrl }
			onChange={ ( value ) => updateModule( { videoUrl: value } ) }
			help={ __( 'A Vimeo player URL, e.g. https://player.vimeo.com/video/123456789. Always embeds at a fixed 16:9 — there is no per-instance aspect ratio option.', 'cb-identityjs2026' ) }
		/>
	);
}

function QaFields( { module: mod, updateModule } ) {
	return (
		<>
			<RepeaterField
				label={ __( 'Questions & Answers', 'cb-identityjs2026' ) }
				layout="column"
				value={ mod.qaRows }
				onChange={ ( value ) => updateModule( { qaRows: value } ) }
				fields={ [
					{ name: 'question', label: __( 'Question', 'cb-identityjs2026' ) },
					{ name: 'answer', label: __( 'Answer', 'cb-identityjs2026' ), type: 'textarea' },
				] }
				emptyRow={ { question: '', answer: '' } }
			/>
			<ToggleControl
				label={ __( 'Lead First (style the first row larger)', 'cb-identityjs2026' ) }
				checked={ mod.qaLeadFirst }
				onChange={ ( value ) => updateModule( { qaLeadFirst: value } ) }
			/>
			<ToggleControl
				label={ __( 'Large Left (style every question larger)', 'cb-identityjs2026' ) }
				checked={ mod.qaLargeLeft }
				onChange={ ( value ) => updateModule( { qaLargeLeft: value } ) }
			/>
		</>
	);
}

function ButtonFields( { module: mod, updateModule } ) {
	return (
		<>
			<TextControl
				label={ __( 'Button Text', 'cb-identityjs2026' ) }
				value={ mod.buttonLinkText }
				onChange={ ( value ) => updateModule( { buttonLinkText: value } ) }
			/>
			<TextControl
				type="url"
				label={ __( 'Button URL', 'cb-identityjs2026' ) }
				value={ mod.buttonLinkUrl }
				onChange={ ( value ) => updateModule( { buttonLinkUrl: value } ) }
			/>
			<ToggleControl
				label={ __( 'Open in a new tab', 'cb-identityjs2026' ) }
				checked={ mod.buttonLinkTarget }
				onChange={ ( value ) => updateModule( { buttonLinkTarget: value } ) }
			/>
			<TextControl
				label={ __( 'CTA Caption', 'cb-identityjs2026' ) }
				value={ mod.ctaText }
				onChange={ ( value ) => updateModule( { ctaText: value } ) }
				help={ __( 'Optional — shown alongside the button, not instead of it.', 'cb-identityjs2026' ) }
			/>
		</>
	);
}
