import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { TextControl, TextareaControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from `cb-innovation-header` — see identity-global-block-spec.md's
 * Page Header entry (this block was originally meant to fold into Page
 * Header, per that entry's own migration note — found not to fit: the real
 * source has a full-bleed background image and an embedded quote/author/
 * company section Page Header has no equivalent of, with its own distinct
 * colour treatment that doesn't match Testimonial's 3 confirmed variants
 * either. Kept as its own dedicated block instead, since it's genuinely
 * page-specific (confirmed still live and in real single-page use on
 * identityglobal.com/innovation/, 2026-09-22) — per the spec's own naming
 * taxonomy note: reserve a generic/reusable block for the most reusable
 * pattern, don't force a page-specific one into it.
 *
 * All fields are plain text/textarea in the real ACF source (`quote` is a
 * single-line text field, not a textarea) — no richtext anywhere.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { title, introText, backgroundId, quote, author, company } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );
	const backgroundUrl = useSelect(
		( select ) => {
			if ( ! backgroundId ) {
				return '';
			}
			return select( coreStore ).getMedia( backgroundId )?.source_url || '';
		},
		[ backgroundId ]
	);

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Innovation Header" textDomain="cb-identityjs2026">
			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Background Image', 'cb-identityjs2026' ) }</label>
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
			</div>

			<TextControl label={ __( 'Title', 'cb-identityjs2026' ) } value={ title } onChange={ ( value ) => setAttributes( { title: value } ) } />
			<TextareaControl
				label={ __( 'Intro Text', 'cb-identityjs2026' ) }
				value={ introText }
				onChange={ ( value ) => setAttributes( { introText: value } ) }
			/>

			<TextControl label={ __( 'Quote', 'cb-identityjs2026' ) } value={ quote } onChange={ ( value ) => setAttributes( { quote: value } ) } />
			<div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
				<div style={ { flex: '1 1 0%' } }>
					<TextControl label={ __( 'Author', 'cb-identityjs2026' ) } value={ author } onChange={ ( value ) => setAttributes( { author: value } ) } />
				</div>
				<div style={ { flex: '1 1 0%' } }>
					<TextControl
						label={ __( 'Company', 'cb-identityjs2026' ) }
						value={ company }
						onChange={ ( value ) => setAttributes( { company: value } ) }
					/>
				</div>
			</div>
		</EditorBlockShell>
	);
}
