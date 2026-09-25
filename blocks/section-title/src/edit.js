import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { TextControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from cb-signpost-header — see identity-global-block-spec.md's
 * Section Title entry. A standalone bordered label banner, dropped in
 * ahead of other blocks in place of their old pre_title fields (Child
 * Page Nav, Stat Block, Work Index — see those blocks' own migration
 * notes).
 *
 * block.json's supports.color.text gives this its Gutenberg text-colour
 * picker — WordPress injects that into the block's own Settings sidebar
 * automatically, so no colour control needs building here.
 *
 * `backgroundId` is a later, additive addition — cb-contact-page's own
 * "LOCATIONS" banner (_cb_contact_page.scss) is this exact bordered-label
 * pattern but with a full-bleed photo behind it, which is why that one
 * banner was its own dedicated block in the real source instead of just
 * a pre_title field like the others. Existing instances have no
 * backgroundId at all and render exactly as before (transparent, no
 * photo) — see this block's own render.php for how it's applied.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { title, backgroundId } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );
	const backgroundUrl = useBackgroundUrl( backgroundId );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Section Title" textDomain="cb-identityjs2026">
			<TextControl
				label={ __( 'Title', 'cb-identityjs2026' ) }
				value={ title }
				help={ __( 'Text colour defaults to the brand accent — override it from Color in the block’s own Settings sidebar.', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { title: value } ) }
			/>

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
				<p className="cb-identityjs2026-editor-field__help">
					{ __( 'Optional — reproduces cb-contact-page’s own "LOCATIONS" banner (a photo behind this same bordered label), not needed for a plain Section Title.', 'cb-identityjs2026' ) }
				</p>
			</div>
		</EditorBlockShell>
	);
}

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
