import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { TextControl, ToggleControl, Button } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import RepeaterField from '../../_shared/RepeaterField';

/**
 * Built from Case Study Key Stats (cb-case-study-key-stats) + cb-stats — see
 * identity-global-block-spec.md's Stat Block entry. The spec flags an open
 * decision between Case Study Key Stats' unlimited stat/descriptor repeater
 * and cb-stats' fixed 4-slot prefix/suffix/hero/CTA structure, and
 * recommends rebuilding as the repeater (matches real saved content) while
 * folding cb-stats' prefix/suffix/hero/CTA/background-parallax options in
 * as per-row/per-block fields — that's what this is.
 *
 * The real source's own `pre_title` (hardcoded "Key Stats" fallback when
 * blank) is dropped per the spec's migration note — a Section Title block
 * placed before this one replaces it, consistent with every other block in
 * the spec that had its own pretitle.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		showHero,
		heroTitle,
		backgroundImageId,
		backgroundImageUrl,
		stats,
		ctaMessage,
		ctaLinkUrl,
		ctaLinkText,
		ctaLinkTarget,
	} = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Stat Block" textDomain="cb-identityjs2026">
			<ToggleControl
				label={ __( 'Show Hero Title', 'cb-identityjs2026' ) }
				checked={ showHero }
				onChange={ ( value ) => setAttributes( { showHero: value } ) }
			/>

			{ showHero && (
				<TextControl
					label={ __( 'Hero Title', 'cb-identityjs2026' ) }
					value={ heroTitle }
					onChange={ ( value ) => setAttributes( { heroTitle: value } ) }
				/>
			) }

			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Background Image', 'cb-identityjs2026' ) }</label>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) =>
							setAttributes( {
								backgroundImageId: media.id,
								backgroundImageUrl: media.url,
							} )
						}
						allowedTypes={ [ 'image' ] }
						value={ backgroundImageId }
						render={ ( { open } ) => (
							<div className="cb-identityjs2026-editor-field__control">
								{ backgroundImageUrl && (
									<img
										src={ backgroundImageUrl }
										alt=""
										style={ { maxWidth: '200px', display: 'block', marginBottom: '8px' } }
									/>
								) }
								<Button variant="secondary" onClick={ open }>
									{ backgroundImageUrl ? __( 'Replace Image', 'cb-identityjs2026' ) : __( 'Select Image', 'cb-identityjs2026' ) }
								</Button>
								{ backgroundImageUrl && (
									<Button
										variant="tertiary"
										isDestructive
										onClick={ () => setAttributes( { backgroundImageId: 0, backgroundImageUrl: '' } ) }
									>
										{ __( 'Remove', 'cb-identityjs2026' ) }
									</Button>
								) }
							</div>
						) }
					/>
				</MediaUploadCheck>
				<p className="cb-identityjs2026-editor-field__help">
					{ __( 'Optional. Fixed/parallax behind the stats — falls back to a plain dark background when empty.', 'cb-identityjs2026' ) }
				</p>
			</div>

			<RepeaterField
				label={ __( 'Stats', 'cb-identityjs2026' ) }
				value={ stats }
				onChange={ ( rows ) => setAttributes( { stats: rows } ) }
				emptyRow={ { intro: '', prefix: '', value: '', suffix: '', descriptor: '' } }
				layout="column"
				fields={ [
					{ name: 'intro', label: __( 'Intro', 'cb-identityjs2026' ), type: 'text', help: __( 'Optional lead-in word, e.g. "Over"', 'cb-identityjs2026' ) },
					{ name: 'prefix', label: __( 'Prefix', 'cb-identityjs2026' ), type: 'text', help: __( 'e.g. "$"', 'cb-identityjs2026' ) },
					{ name: 'value', label: __( 'Value', 'cb-identityjs2026' ), type: 'text', help: __( 'e.g. "200"', 'cb-identityjs2026' ) },
					{ name: 'suffix', label: __( 'Suffix', 'cb-identityjs2026' ), type: 'text', help: __( 'e.g. "+" or "M"', 'cb-identityjs2026' ) },
					{ name: 'descriptor', label: __( 'Descriptor', 'cb-identityjs2026' ), type: 'text' },
				] }
			/>

			<TextControl
				label={ __( 'CTA Message', 'cb-identityjs2026' ) }
				value={ ctaMessage }
				help={ __( 'Optional text shown alongside the CTA button.', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { ctaMessage: value } ) }
			/>

			<div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
				<div style={ { flex: '50 1 0%' } }>
					<TextControl
						type="url"
						label={ __( 'CTA Link URL', 'cb-identityjs2026' ) }
						value={ ctaLinkUrl }
						onChange={ ( value ) => setAttributes( { ctaLinkUrl: value } ) }
					/>
				</div>
				<div style={ { flex: '50 1 0%' } }>
					<TextControl
						label={ __( 'CTA Link Text', 'cb-identityjs2026' ) }
						value={ ctaLinkText }
						onChange={ ( value ) => setAttributes( { ctaLinkText: value } ) }
					/>
				</div>
			</div>

			<ToggleControl
				label={ __( 'Open CTA Link in a New Tab', 'cb-identityjs2026' ) }
				checked={ ctaLinkTarget }
				onChange={ ( value ) => setAttributes( { ctaLinkTarget: value } ) }
			/>
		</EditorBlockShell>
	);
}
