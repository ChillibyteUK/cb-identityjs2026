import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { TextControl, TextareaControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Ported from cb-about-hero (cb-identitygroup2026). Fields match the legacy
 * block: Background Image, Overlay Image, Title (plain text), Intro (plain
 * textarea, rendered through wpautop) and Content (rich text, shown in the
 * translucent band at the bottom). The legacy health-only Overlay Style
 * toggle is intentionally not ported — Identity is dark only.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { backgroundId, overlayImageId, title, intro, content } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB About Hero" textDomain="cb-identityjs2026">
			<div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
				<div style={ { flex: '1 1 0%' } }>
					<ImageField
						label={ __( 'Background Image', 'cb-identityjs2026' ) }
						value={ backgroundId }
						onChange={ ( id ) => setAttributes( { backgroundId: id } ) }
						help={ __( 'Optional — scrolls with a parallax effect behind the title.', 'cb-identityjs2026' ) }
					/>
				</div>
				<div style={ { flex: '1 1 0%' } }>
					<ImageField
						label={ __( 'Overlay Image', 'cb-identityjs2026' ) }
						value={ overlayImageId }
						onChange={ ( id ) => setAttributes( { overlayImageId: id } ) }
						help={ __( 'Optional — drawn over the background at 60% opacity.', 'cb-identityjs2026' ) }
					/>
				</div>
			</div>

			<TextControl
				label={ __( 'Title', 'cb-identityjs2026' ) }
				value={ title }
				help={ __( 'The page’s <h1>, shown between two rules.', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { title: value } ) }
			/>

			<TextareaControl
				label={ __( 'Intro', 'cb-identityjs2026' ) }
				value={ intro }
				help={ __( 'Plain text — blank lines become paragraphs.', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { intro: value } ) }
			/>

			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Content', 'cb-identityjs2026' ) }</label>
				<RichText
					identifier="content"
					tagName="div"
					multiline="p"
					className="cb-identityjs2026-editor-field__control"
					aria-label={ __( 'Content', 'cb-identityjs2026' ) }
					placeholder={ __( 'Content', 'cb-identityjs2026' ) }
					value={ content }
					onChange={ ( value ) => setAttributes( { content: value } ) }
				/>
				<p className="cb-identityjs2026-editor-field__help">{ __( 'Optional — shown in the translucent band at the bottom of the hero.', 'cb-identityjs2026' ) }</p>
			</div>
		</EditorBlockShell>
	);
}

function ImageField( { label, value, onChange, help } ) {
	const url = useAttachmentUrl( value );
	return (
		<div className="cb-identityjs2026-editor-field">
			<label className="cb-identityjs2026-editor-field__label">{ label }</label>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={ ( media ) => onChange( media.id ) }
					allowedTypes={ [ 'image' ] }
					value={ value }
					render={ ( { open } ) => (
						<div className="cb-identityjs2026-editor-field__control">
							{ url && <img src={ url } alt="" style={ { maxWidth: '200px', display: 'block', marginBottom: '8px' } } /> }
							<Button variant="secondary" onClick={ open }>
								{ url ? __( 'Replace', 'cb-identityjs2026' ) : __( 'Select', 'cb-identityjs2026' ) }
							</Button>
							{ url && (
								<Button variant="tertiary" isDestructive onClick={ () => onChange( 0 ) }>
									{ __( 'Remove', 'cb-identityjs2026' ) }
								</Button>
							) }
						</div>
					) }
				/>
			</MediaUploadCheck>
			{ help && <p className="cb-identityjs2026-editor-field__help">{ help }</p> }
		</div>
	);
}

/**
 * @param {number} id Attachment ID, or 0/falsy for none.
 */
function useAttachmentUrl( id ) {
	return useSelect(
		( select ) => {
			if ( ! id ) {
				return '';
			}
			const media = select( coreStore ).getMedia( id );
			return media?.media_details?.sizes?.medium?.source_url || media?.source_url || '';
		},
		[ id ]
	);
}
