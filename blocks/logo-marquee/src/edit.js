import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { SelectControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from cb-logo-slider — see identity-global-block-spec.md's Logo
 * Marquee entry. Renamed from "Logo Slider": it's an infinite auto-scroll
 * marquee, not a navigable carousel. logo_source mirrors the real block's
 * radio (site_wide reads the Logos field in Site-Wide Settings; specific
 * uses this block's own gallery instead — e.g. award logos, sport logos).
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { logoSource, logoGallery } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Logo Marquee" textDomain="cb-identityjs2026">
			<SelectControl
				label={ __( 'Logo Source', 'cb-identityjs2026' ) }
				value={ logoSource }
				options={ [
					{ label: 'Site-Wide', value: 'site_wide' },
					{ label: 'Specific', value: 'specific' },
				] }
				help={ __( 'Site-Wide reads the Logos field in Site-Wide Settings. Specific uses the gallery below instead — e.g. award logos, sport logos.', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { logoSource: value } ) }
			/>

			{ logoSource === 'specific' && (
				<div className="cb-identityjs2026-editor-field">
					<label className="cb-identityjs2026-editor-field__label">{ __( 'Logos', 'cb-identityjs2026' ) }</label>
					<MediaUploadCheck>
						<MediaUpload
							multiple
							gallery
							addToGallery
							onSelect={ ( media ) => setAttributes( { logoGallery: media.map( ( item ) => item.id ) } ) }
							allowedTypes={ [ 'image' ] }
							value={ logoGallery }
							render={ ( { open } ) => (
								<div className="cb-identityjs2026-editor-field__control">
									{ logoGallery.length > 0 && (
										<ul
											style={ {
												display: 'flex',
												flexWrap: 'wrap',
												gap: '8px',
												padding: 0,
												margin: '0 0 8px',
												listStyle: 'none',
											} }
										>
											{ logoGallery.map( ( id ) => (
												<li key={ id } style={ { position: 'relative' } }>
													<LogoThumb id={ id } />
													<Button
														icon="no-alt"
														label={ __( 'Remove', 'cb-identityjs2026' ) }
														onClick={ () =>
															setAttributes( { logoGallery: logoGallery.filter( ( existingId ) => existingId !== id ) } )
														}
														style={ {
															position: 'absolute',
															top: 0,
															right: 0,
															minWidth: '20px',
															height: '20px',
															padding: 0,
															background: 'rgba(0,0,0,0.7)',
															color: '#fff',
														} }
													/>
												</li>
											) ) }
										</ul>
									) }
									<Button variant="secondary" onClick={ open }>
										{ logoGallery.length > 0
											? __( 'Edit Logos', 'cb-identityjs2026' )
											: __( 'Select Logos', 'cb-identityjs2026' ) }
									</Button>
								</div>
							) }
						/>
					</MediaUploadCheck>
				</div>
			) }
		</EditorBlockShell>
	);
}

/**
 * Thumbnail for one gallery image, resolved by ID via the media REST
 * endpoint — MediaUpload's onSelect gives us full media objects, but a
 * block reloaded from saved attributes only has IDs, so the preview needs
 * its own tiny fetch rather than assuming the URL is already known.
 */
function LogoThumb( { id } ) {
	const src = useMediaThumb( id );
	return (
		<div style={ { width: '64px', height: '64px', background: '#fff', border: '1px solid #ccc' } }>
			{ src && <img src={ src } alt="" style={ { width: '100%', height: '100%', objectFit: 'contain' } } /> }
		</div>
	);
}

function useMediaThumb( id ) {
	return useSelect(
		( select ) => {
			const media = select( coreStore ).getMedia( id );
			return media?.media_details?.sizes?.thumbnail?.source_url || media?.source_url || '';
		},
		[ id ]
	);
}
