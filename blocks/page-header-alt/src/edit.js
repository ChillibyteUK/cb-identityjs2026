import { __ } from '@wordpress/i18n';
import { RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, TextareaControl, SelectControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Dedicated block mirroring cb-culture-page-header (see cb-identity2025/
 * blocks/cb-culture-page-header/cb-culture-page-header.php, unchanged in
 * cb-identitygroup2026) — real example at id.local/about/culture/. Unlike
 * Page Header, this real source has TWO secondary sections stacked one
 * after another, not one of several mutually-exclusive types: the
 * secondary_text panel (content-wrapper/culture-overlay) AND the Careers
 * panel (its own pretitle strip + heading/content/link), both always
 * rendered together when present. That's why this is its own block rather
 * than an added Page Header option — Page Header's Secondary Panel Type is
 * a single either/or choice, which can't express "both, always".
 *
 * The `life` repeater / "LIFE AT IDENTITY" section from the same real
 * source is deliberately NOT part of this block — it's a separate
 * <section> with its own title+content pairs in alternating columns,
 * identical in shape to this project's existing Detail List block, so it
 * belongs after this block on the page rather than duplicated in here.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		title,
		introText,
		backgroundId,
		secondaryText,
		careersPretitle,
		careersTitle,
		careersContent,
		careersLinkUrl,
		careersLinkText,
		careersLinkTarget,
	} = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );
	const backgroundUrl = useBackgroundUrl( backgroundId );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Page Header Alt" textDomain="cb-identityjs2026">
			<SectionHeading>{ __( 'Header', 'cb-identityjs2026' ) }</SectionHeading>

			<TextareaControl
				label={ __( 'Title', 'cb-identityjs2026' ) }
				value={ title }
				help={ __( 'Renders as the page\'s plain <h1> — one line per row.', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { title: value } ) }
			/>

			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Intro Text', 'cb-identityjs2026' ) }</label>
				<RichText
					identifier="introText"
					tagName="div"
					multiline="p"
					className="cb-identityjs2026-editor-field__control"
					aria-label={ __( 'Intro Text', 'cb-identityjs2026' ) }
					placeholder={ __( 'Intro Text', 'cb-identityjs2026' ) }
					value={ introText }
					onChange={ ( value ) => setAttributes( { introText: value } ) }
				/>
				<p className="cb-identityjs2026-editor-field__help">{ __( 'Paragraph(s) shown under the title.', 'cb-identityjs2026' ) }</p>
			</div>

			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Background', 'cb-identityjs2026' ) }</label>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) => setAttributes( { backgroundId: media.id } ) }
						allowedTypes={ [ 'image' ] }
						value={ backgroundId }
						render={ ( { open } ) => (
							<div className="cb-identityjs2026-editor-field__control">
								{ backgroundUrl && (
									<img
										src={ backgroundUrl }
										alt=""
										style={ { maxWidth: '200px', display: 'block', marginBottom: '8px' } }
									/>
								) }
								<Button variant="secondary" onClick={ open }>
									{ backgroundUrl ? __( 'Replace Background', 'cb-identityjs2026' ) : __( 'Select Background', 'cb-identityjs2026' ) }
								</Button>
							</div>
						) }
					/>
				</MediaUploadCheck>
				<p className="cb-identityjs2026-editor-field__help">{ __( 'Full-bleed photo behind the whole block — the real source shares one image across the header, secondary text panel and Careers panel alike.', 'cb-identityjs2026' ) }</p>
			</div>

			<SectionHeading>{ __( 'Secondary Text', 'cb-identityjs2026' ) }</SectionHeading>

			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Secondary Text', 'cb-identityjs2026' ) }</label>
				<RichText
					identifier="secondaryText"
					tagName="div"
					multiline="p"
					className="cb-identityjs2026-editor-field__control"
					aria-label={ __( 'Secondary Text', 'cb-identityjs2026' ) }
					placeholder={ __( 'Secondary Text', 'cb-identityjs2026' ) }
					value={ secondaryText }
					onChange={ ( value ) => setAttributes( { secondaryText: value } ) }
				/>
				<p className="cb-identityjs2026-editor-field__help">{ __( 'Select text and use the toolbar\'s Heading button to mark a run as a heading — the real source\'s secondary_text field includes one.', 'cb-identityjs2026' ) }</p>
			</div>

			<SectionHeading>{ __( 'Careers Panel', 'cb-identityjs2026' ) }</SectionHeading>

			<TextControl
				label={ __( 'Pretitle', 'cb-identityjs2026' ) }
				value={ careersPretitle }
				onChange={ ( value ) => setAttributes( { careersPretitle: value } ) }
			/>
			<TextControl
				label={ __( 'Heading', 'cb-identityjs2026' ) }
				value={ careersTitle }
				onChange={ ( value ) => setAttributes( { careersTitle: value } ) }
			/>
			<TextareaControl
				label={ __( 'Content', 'cb-identityjs2026' ) }
				value={ careersContent }
				onChange={ ( value ) => setAttributes( { careersContent: value } ) }
			/>
			<div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
				<div style={ { flex: '50 1 0%' } }>
					<TextControl
						label={ __( 'Link URL', 'cb-identityjs2026' ) }
						value={ careersLinkUrl }
						onChange={ ( value ) => setAttributes( { careersLinkUrl: value } ) }
					/>
				</div>
				<div style={ { flex: '50 1 0%' } }>
					<TextControl
						label={ __( 'Link Text', 'cb-identityjs2026' ) }
						value={ careersLinkText }
						onChange={ ( value ) => setAttributes( { careersLinkText: value } ) }
					/>
				</div>
			</div>
			<SelectControl
				label={ __( 'Link Target', 'cb-identityjs2026' ) }
				value={ careersLinkTarget }
				options={ [
					{ label: 'Same Tab', value: '_self' },
					{ label: 'New Tab', value: '_blank' },
				] }
				onChange={ ( value ) => setAttributes( { careersLinkTarget: value } ) }
			/>
		</EditorBlockShell>
	);
}

/**
 * Resolves an attachment ID to its full-size URL via core-data — see Page
 * Header's own identical helper for why (derived, not a separately-stored
 * attribute that can go stale).
 *
 * @param {number} id Attachment ID, or 0/falsy for none.
 */
function useBackgroundUrl( id ) {
	return useSelect(
		( select ) => {
			if ( ! id ) {
				return '';
			}
			const media = select( coreStore ).getMedia( id );
			return media?.source_url || '';
		},
		[ id ]
	);
}

/**
 * Section divider — see Page Header's own identical helper for why it
 * needs an opaque background.
 */
function SectionHeading( { children } ) {
	return (
		<h3
			style={ {
				position: 'relative',
				margin: 0,
				padding: '20px 0 12px',
				background: '#fff',
				borderBottom: '1px solid #ddd',
				fontSize: '11px',
				fontWeight: 700,
				letterSpacing: '0.05em',
				textTransform: 'uppercase',
				color: '#50575e',
			} }
		>
			{ children }
		</h3>
	);
}
