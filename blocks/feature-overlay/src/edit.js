import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { TextControl, TextareaControl, SelectControl, ToggleControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from `cb-image-feature-overlay` — see identity-global-block-spec.md's
 * Feature Overlay entry. Checked against both cb-identity2025 (older,
 * frozen) and cb-identitygroup2026 (newer, 2026-08-28 dated comments) since
 * the two had genuinely diverged — the newer one adds `title_semantic`
 * (this block's `titleTag`) and confirms Inline mode's content is plain
 * text run through wpautop(esc_html()), not richtext, so real HTML typed
 * into it would just be escaped — a TextareaControl here, not RichText.
 *
 * Title Font Size/Font Weight use native block typography supports
 * (block.json's own `typography` supports, __experimentalSkipSerialization
 * — see render.php for why) rather than a bespoke select, per the spec's
 * stated direction away from the real source's own ACF font selects.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		presentation,
		imageId,
		overlayImageId,
		content,
		title,
		titleTag,
		ctaLinkText,
		ctaLinkUrl,
		ctaLinkTarget,
		ctaIntro,
		blockHeight,
	} = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );
	const imageUrl = useAttachmentUrl( imageId );
	const overlayImageUrl = useAttachmentUrl( overlayImageId );
	const isHero = 'Hero' === presentation;

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Feature Overlay" textDomain="cb-identityjs2026">
			<SelectControl
				label={ __( 'Presentation', 'cb-identityjs2026' ) }
				value={ presentation }
				options={ [
					{ label: 'Inline', value: 'Inline' },
					{ label: 'Hero', value: 'Hero' },
				] }
				onChange={ ( value ) => setAttributes( { presentation: value } ) }
			/>

			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Background Image', 'cb-identityjs2026' ) }</label>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) => setAttributes( { imageId: media.id } ) }
						allowedTypes={ [ 'image' ] }
						value={ imageId }
						render={ ( { open } ) => (
							<div className="cb-identityjs2026-editor-field__control">
								{ imageUrl && (
									<img src={ imageUrl } alt="" style={ { maxWidth: '200px', display: 'block', marginBottom: '8px' } } />
								) }
								<Button variant="secondary" onClick={ open }>
									{ imageUrl ? __( 'Replace Background Image', 'cb-identityjs2026' ) : __( 'Select Background Image', 'cb-identityjs2026' ) }
								</Button>
							</div>
						) }
					/>
				</MediaUploadCheck>
			</div>

			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Overlay Image', 'cb-identityjs2026' ) }</label>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) => setAttributes( { overlayImageId: media.id } ) }
						allowedTypes={ [ 'image' ] }
						value={ overlayImageId }
						render={ ( { open } ) => (
							<div className="cb-identityjs2026-editor-field__control">
								{ overlayImageUrl && (
									<img src={ overlayImageUrl } alt="" style={ { maxWidth: '200px', display: 'block', marginBottom: '8px' } } />
								) }
								<Button variant="secondary" onClick={ open }>
									{ overlayImageUrl ? __( 'Replace Overlay Image', 'cb-identityjs2026' ) : __( 'Select Overlay Image', 'cb-identityjs2026' ) }
								</Button>
							</div>
						) }
					/>
				</MediaUploadCheck>
				<p className="cb-identityjs2026-editor-field__help">
					{ __( 'Optional — a soft blur texture is used automatically when this is left empty.', 'cb-identityjs2026' ) }
				</p>
			</div>

			{ isHero ? (
				<>
					<TextControl
						label={ __( 'Title', 'cb-identityjs2026' ) }
						value={ title }
						onChange={ ( value ) => setAttributes( { title: value } ) }
					/>
					<SelectControl
						label={ __( 'Title Tag', 'cb-identityjs2026' ) }
						value={ titleTag }
						options={ [
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
						] }
						onChange={ ( value ) => setAttributes( { titleTag: value } ) }
						help={ __( 'Font size/weight come from the block’s own Typography panel in Settings, not from here.', 'cb-identityjs2026' ) }
					/>
					<TextControl
						label={ __( 'CTA Link Text', 'cb-identityjs2026' ) }
						value={ ctaLinkText }
						onChange={ ( value ) => setAttributes( { ctaLinkText: value } ) }
					/>
					<TextControl
						type="url"
						label={ __( 'CTA Link URL', 'cb-identityjs2026' ) }
						value={ ctaLinkUrl }
						onChange={ ( value ) => setAttributes( { ctaLinkUrl: value } ) }
					/>
					<ToggleControl
						label={ __( 'Open CTA link in a new tab', 'cb-identityjs2026' ) }
						checked={ ctaLinkTarget }
						onChange={ ( value ) => setAttributes( { ctaLinkTarget: value } ) }
					/>
					<TextControl
						label={ __( 'CTA Intro', 'cb-identityjs2026' ) }
						value={ ctaIntro }
						onChange={ ( value ) => setAttributes( { ctaIntro: value } ) }
					/>
				</>
			) : (
				<TextareaControl
					label={ __( 'Content', 'cb-identityjs2026' ) }
					value={ content }
					onChange={ ( value ) => setAttributes( { content: value } ) }
					help={ __( 'Plain text only — this is rendered through wpautop, not rich text, matching the real source.', 'cb-identityjs2026' ) }
				/>
			) }

			<TextControl
				type="number"
				label={ __( 'Block Height Override (vh)', 'cb-identityjs2026' ) }
				value={ blockHeight || '' }
				onChange={ ( value ) => setAttributes( { blockHeight: value ? Number( value ) : 0 } ) }
				help={ __( 'Optional — leave blank to use the default height (70vh Inline, near-fullscreen Hero).', 'cb-identityjs2026' ) }
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
