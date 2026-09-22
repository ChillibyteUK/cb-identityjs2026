import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { SelectControl, ToggleControl, TextControl, Button } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from cb-full-image + cb-full-video, merged behind mediaType — see
 * identity-global-block-spec.md's Media Panel entry. Video mode stores
 * vimeoId + vimeoHash (not a pasted vimeo_url) — every real saved instance
 * of the old cb-full-video block was a private/unlisted video needing the
 * `h` hash to embed at all, and a free-text URL field let one real value
 * end up with copy-paste corruption (a stray escaped quote, a doubled
 * `&`). app_id is fixed at 58479 (Vimeo app/account registration, not
 * per-video — confirmed identical across all 34 real saved instances),
 * so it's not an editor-facing field.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { mediaType, imageId, imageUrl, imageAlt, topBorder, vimeoId, vimeoHash, fullWidth, fullBleed, heroMode } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Media Panel" textDomain="cb-identityjs2026">
			<SelectControl
				label={ __( 'Media Type', 'cb-identityjs2026' ) }
				value={ mediaType }
				options={ [
					{ label: 'Image', value: 'image' },
					{ label: 'Video', value: 'video' },
				] }
				onChange={ ( value ) => setAttributes( { mediaType: value } ) }
			/>

			{ mediaType === 'image' && (
				<>
					<div className="cb-identityjs2026-editor-field">
						<label className="cb-identityjs2026-editor-field__label">{ __( 'Image', 'cb-identityjs2026' ) }</label>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) =>
									setAttributes( {
										imageId: media.id,
										imageUrl: media.url,
										imageAlt: media.alt || '',
									} )
								}
								allowedTypes={ [ 'image' ] }
								value={ imageId }
								render={ ( { open } ) => (
									<div className="cb-identityjs2026-editor-field__control">
										{ imageUrl && (
											<img
												src={ imageUrl }
												alt={ imageAlt }
												style={ { maxWidth: '200px', display: 'block', marginBottom: '8px' } }
											/>
										) }
										<Button variant="secondary" onClick={ open }>
											{ imageUrl ? __( 'Replace Image', 'cb-identityjs2026' ) : __( 'Select Image', 'cb-identityjs2026' ) }
										</Button>
									</div>
								) }
							/>
						</MediaUploadCheck>
					</div>
					<ToggleControl
						label={ __( 'Top Border', 'cb-identityjs2026' ) }
						checked={ topBorder }
						onChange={ ( value ) => setAttributes( { topBorder: value } ) }
					/>
				</>
			) }

			{ mediaType === 'video' && (
				<>
					{ /* 2 cols (50/50) — same row-grouping technique add_block.sh
					     generates for consecutive non-100%-width fields. */ }
					<div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
						<div style={ { flex: '50 1 0%' } }>
							<TextControl
								label={ __( 'Vimeo Video ID', 'cb-identityjs2026' ) }
								value={ vimeoId }
								help={ __( "The numeric ID from the video's URL, e.g. 1172226452", 'cb-identityjs2026' ) }
								onChange={ ( value ) => setAttributes( { vimeoId: value } ) }
							/>
						</div>
						<div style={ { flex: '50 1 0%' } }>
							<TextControl
								label={ __( 'Vimeo Privacy Hash', 'cb-identityjs2026' ) }
								value={ vimeoHash }
								help={ __( "The h= value from the video's share/embed URL — required for unlisted videos", 'cb-identityjs2026' ) }
								onChange={ ( value ) => setAttributes( { vimeoHash: value } ) }
							/>
						</div>
					</div>

					{ /* 3 cols (33/33/33) */ }
					<div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
						<div style={ { flex: '33 1 0%' } }>
							<ToggleControl
								label={ __( 'Full Width', 'cb-identityjs2026' ) }
								help={ __( 'Removes the container so the video runs edge-to-edge (still 16:9)', 'cb-identityjs2026' ) }
								checked={ fullWidth }
								onChange={ ( value ) => setAttributes( { fullWidth: value } ) }
							/>
						</div>
						<div style={ { flex: '33 1 0%' } }>
							<ToggleControl
								label={ __( 'Full Bleed', 'cb-identityjs2026' ) }
								help={ __( 'Viewport-height cover video, ignores the 16:9 box', 'cb-identityjs2026' ) }
								checked={ fullBleed }
								onChange={ ( value ) => setAttributes( { fullBleed: value } ) }
							/>
						</div>
						<div style={ { flex: '33 1 0%' } }>
							<ToggleControl
								label={ __( 'Hero Mode', 'cb-identityjs2026' ) }
								help={ __( 'Autoplays muted, background-video style, adds an unmute button', 'cb-identityjs2026' ) }
								checked={ heroMode }
								onChange={ ( value ) => setAttributes( { heroMode: value } ) }
							/>
						</div>
					</div>
				</>
			) }
		</EditorBlockShell>
	);
}
