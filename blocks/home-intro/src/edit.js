import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { TextControl, TextareaControl, ToggleControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from cb-brand-title-text — see identity-global-block-spec.md's Home
 * Intro entry. Home-page-only. pre_title renders as the block's real <h1>;
 * title is NOT a heading at all — real source wraps each line in styled
 * <div>s for the stagger-reveal animation (see render.php,
 * src/js/home-intro-animate.js). The animation assumes up to 3 lines —
 * that's a real constraint of the original design (3 hardcoded bar/
 * rotation sets), not a limit added here.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { preTitle, title, contentHeading, content, linkText, linkUrl, linkTarget } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Home Intro" textDomain="cb-identityjs2026">
			<TextControl
				label={ __( 'Pre-Title', 'cb-identityjs2026' ) }
				value={ preTitle }
				help={ __( 'Renders as the page\'s <h1>', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { preTitle: value } ) }
			/>
			<TextareaControl
				label={ __( 'Title', 'cb-identityjs2026' ) }
				value={ title }
				help={ __( 'One line per row — up to 3 lines, each gets its own animated colour bar', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { title: value } ) }
			/>
			<TextControl
				label={ __( 'Content Heading', 'cb-identityjs2026' ) }
				value={ contentHeading }
				onChange={ ( value ) => setAttributes( { contentHeading: value } ) }
			/>
			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Content', 'cb-identityjs2026' ) }</label>
				<RichText
					tagName="div"
					className="cb-identityjs2026-editor-field__control"
					aria-label={ __( 'Content', 'cb-identityjs2026' ) }
					placeholder={ __( 'Content', 'cb-identityjs2026' ) }
					value={ content }
					onChange={ ( value ) => setAttributes( { content: value } ) }
				/>
			</div>
			<div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
				<div style={ { flex: '50 1 0%' } }>
					<TextControl
						label={ __( 'Link Text', 'cb-identityjs2026' ) }
						value={ linkText }
						onChange={ ( value ) => setAttributes( { linkText: value } ) }
					/>
				</div>
				<div style={ { flex: '50 1 0%' } }>
					<TextControl
						type="url"
						label={ __( 'Link URL', 'cb-identityjs2026' ) }
						value={ linkUrl }
						onChange={ ( value ) => setAttributes( { linkUrl: value } ) }
					/>
				</div>
			</div>
			<ToggleControl
				label={ __( 'Open Link in a new tab', 'cb-identityjs2026' ) }
				checked={ linkTarget }
				onChange={ ( value ) => setAttributes( { linkTarget: value } ) }
			/>
		</EditorBlockShell>
	);
}
