import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { TextControl, SelectControl, ToggleControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from Pushthrough (renamed — "Pushthrough" didn't describe what it
 * does) — see identity-global-block-spec.md's Push Panel entry. Two-column
 * panel: left side is either a title+text OR a logo, right side is a
 * description + link. Confirmed live on identityglobal.com/about/'s real
 * instance (background image, plain title/no left text, no left_content
 * so the overlay uses its default tint, not the --black modifier).
 *
 * Overlay tint uses block.json's native supports.color.background
 * (__experimentalSkipSerialization: true) rather than a custom attribute —
 * per explicit instruction, and applied specifically to the overlay div in
 * render.php, not the section itself, so an editor's colour choice never
 * paints over the panel's own background image. Confirmed live
 * (2026-09-22) that get_block_wrapper_attributes()/useBlockProps() apply
 * colour supports to whatever element they're spread onto — skip
 * serialization is what stops that landing on this block's own editor
 * form wrapper (see this block's own docblock in render.php for the
 * defaults it falls back to when nothing's picked).
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { backgroundId, leftContentType, title, leftContent, logoId, description, linkText, linkUrl, linkTarget } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );
	const backgroundUrl = useAttachmentUrl( backgroundId );
	const logoUrl = useAttachmentUrl( logoId );
	const isText = 'text' === leftContentType;

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Push Panel" textDomain="cb-identityjs2026">
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
									<img src={ backgroundUrl } alt="" style={ { maxWidth: '200px', display: 'block', marginBottom: '8px' } } />
								) }
								<Button variant="secondary" onClick={ open }>
									{ backgroundUrl ? __( 'Replace Background', 'cb-identityjs2026' ) : __( 'Select Background', 'cb-identityjs2026' ) }
								</Button>
							</div>
						) }
					/>
				</MediaUploadCheck>
				<p className="cb-identityjs2026-editor-field__help">
					{ __(
						'Full-bleed photo behind the panel, with a tint over it — override the tint colour from Color in the block’s own Settings sidebar.',
						'cb-identityjs2026'
					) }
				</p>
			</div>

			<SelectControl
				label={ __( 'Left Side', 'cb-identityjs2026' ) }
				value={ leftContentType }
				options={ [
					{ label: 'Text', value: 'text' },
					{ label: 'Logo', value: 'logo' },
				] }
				onChange={ ( value ) => setAttributes( { leftContentType: value } ) }
			/>

			{ isText ? (
				<>
					<TextControl
						label={ __( 'Title', 'cb-identityjs2026' ) }
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
					/>
					<div className="cb-identityjs2026-editor-field">
						<label className="cb-identityjs2026-editor-field__label">{ __( 'Left Content', 'cb-identityjs2026' ) }</label>
						<RichText
							identifier="leftContent"
							tagName="div"
							multiline="p"
							className="cb-identityjs2026-editor-field__control"
							aria-label={ __( 'Left Content', 'cb-identityjs2026' ) }
							placeholder={ __( 'Left Content', 'cb-identityjs2026' ) }
							value={ leftContent }
							onChange={ ( value ) => setAttributes( { leftContent: value } ) }
						/>
						<p className="cb-identityjs2026-editor-field__help">
							{ __( 'Also drives the overlay tint: filling this in switches the overlay to its darker variant, unless a colour is set above.', 'cb-identityjs2026' ) }
						</p>
					</div>
				</>
			) : (
				<div className="cb-identityjs2026-editor-field">
					<label className="cb-identityjs2026-editor-field__label">{ __( 'Logo', 'cb-identityjs2026' ) }</label>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { logoId: media.id } ) }
							allowedTypes={ [ 'image' ] }
							value={ logoId }
							render={ ( { open } ) => (
								<div className="cb-identityjs2026-editor-field__control">
									{ logoUrl && <img src={ logoUrl } alt="" style={ { maxWidth: '200px', display: 'block', marginBottom: '8px' } } /> }
									<Button variant="secondary" onClick={ open }>
										{ logoUrl ? __( 'Replace Logo', 'cb-identityjs2026' ) : __( 'Select Logo', 'cb-identityjs2026' ) }
									</Button>
								</div>
							) }
						/>
					</MediaUploadCheck>
				</div>
			) }

			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Description', 'cb-identityjs2026' ) }</label>
				<RichText
					identifier="description"
					tagName="div"
					multiline="p"
					className="cb-identityjs2026-editor-field__control"
					aria-label={ __( 'Description', 'cb-identityjs2026' ) }
					placeholder={ __( 'Description', 'cb-identityjs2026' ) }
					value={ description }
					onChange={ ( value ) => setAttributes( { description: value } ) }
				/>
			</div>

			<TextControl
				label={ __( 'Link Text', 'cb-identityjs2026' ) }
				value={ linkText }
				onChange={ ( value ) => setAttributes( { linkText: value } ) }
			/>
			<TextControl
				type="url"
				label={ __( 'Link URL', 'cb-identityjs2026' ) }
				value={ linkUrl }
				onChange={ ( value ) => setAttributes( { linkUrl: value } ) }
			/>
			<ToggleControl
				label={ __( 'Open link in a new tab', 'cb-identityjs2026' ) }
				checked={ linkTarget }
				onChange={ ( value ) => setAttributes( { linkTarget: value } ) }
			/>
		</EditorBlockShell>
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
			return media?.source_url || '';
		},
		[ id ]
	);
}
