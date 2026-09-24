import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { TextControl, ToggleControl, Button, SelectControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import RepeaterField from '../../_shared/RepeaterField';

/**
 * Built from Case Study Key Stats (cb-case-study-key-stats) + cb-stats — see
 * identity-global-block-spec.md's Stat Block entry.
 *
 * `layout` replaces the first version's single merged field set (every
 * stat row always showing intro/prefix/value/suffix/descriptor) — confirmed
 * live that was the wrong call: real case-study usage is a plain
 * stat/descriptor list (Case Study Key Stats' own shape, not a counter),
 * so those extra fields were dead UI clutter for the common case.
 * - stack: Case Study Key Stats' real shape — full-width rows, just
 *   `value` + `descriptor`.
 * - column: cb-stats' counter shape — card grid with the full
 *   intro/prefix/value/suffix/descriptor set.
 */
const STACK_FIELDS = [
	{ name: 'value', label: __( 'Value', 'cb-identityjs2026' ), type: 'text', help: __( 'e.g. "300" or "17,000+"', 'cb-identityjs2026' ) },
	{ name: 'descriptor', label: __( 'Descriptor', 'cb-identityjs2026' ), type: 'text' },
];

const COLUMN_FIELDS = [
	{ name: 'intro', label: __( 'Intro', 'cb-identityjs2026' ), type: 'text', help: __( 'Optional lead-in word, e.g. "Over"', 'cb-identityjs2026' ) },
	{ name: 'prefix', label: __( 'Prefix', 'cb-identityjs2026' ), type: 'text', help: __( 'e.g. "$"', 'cb-identityjs2026' ) },
	{ name: 'value', label: __( 'Value', 'cb-identityjs2026' ), type: 'text', help: __( 'e.g. "200"', 'cb-identityjs2026' ) },
	{ name: 'suffix', label: __( 'Suffix', 'cb-identityjs2026' ), type: 'text', help: __( 'e.g. "+" or "M"', 'cb-identityjs2026' ) },
	{ name: 'descriptor', label: __( 'Descriptor', 'cb-identityjs2026' ), type: 'text' },
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		layout,
		preTitle,
		backgroundImageId,
		backgroundImageUrl,
		stats,
		ctaMessage,
		ctaLinkUrl,
		ctaLinkText,
		ctaLinkTarget,
	} = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );
	const isStack = 'column' !== layout;

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Stat Block" textDomain="cb-identityjs2026">
			<SelectControl
				label={ __( 'Layout', 'cb-identityjs2026' ) }
				value={ layout }
				options={ [
					{ label: __( 'Stack (case study — plain stat list)', 'cb-identityjs2026' ), value: 'stack' },
					{ label: __( 'Column (counter cards — intro/prefix/suffix)', 'cb-identityjs2026' ), value: 'column' },
				] }
				onChange={ ( value ) => setAttributes( { layout: value } ) }
			/>

			<TextControl
				label={ __( 'Pre-title', 'cb-identityjs2026' ) }
				value={ preTitle }
				help={ __( 'Optional small header above the stats, e.g. "Key Stats".', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { preTitle: value } ) }
			/>

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
				fields={ isStack ? STACK_FIELDS : COLUMN_FIELDS }
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
