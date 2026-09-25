import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from cb-contact-form — title, left-column intro content, right-
 * column shortcode (a Gravity Forms embed on the real site, e.g.
 * `[gravityform id="1" title="false" ajax="true"]`; not installed on this
 * dev site, so the shortcode won't resolve to a real form here — it will
 * once deployed to an environment that has it, same as any other
 * shortcode this block doesn't itself implement).
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { title, content, shortcode } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Contact Form" textDomain="cb-identityjs2026">
			<TextControl
				label={ __( 'Title', 'cb-identityjs2026' ) }
				value={ title }
				help={ __( 'Renders as the page’s <h1>.', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { title: value } ) }
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
				<p className="cb-identityjs2026-editor-field__help">{ __( 'Left column.', 'cb-identityjs2026' ) }</p>
			</div>

			<TextControl
				label={ __( 'Shortcode', 'cb-identityjs2026' ) }
				value={ shortcode }
				placeholder='[gravityform id="1" title="false" ajax="true"]'
				onChange={ ( value ) => setAttributes( { shortcode: value } ) }
			/>
		</EditorBlockShell>
	);
}
