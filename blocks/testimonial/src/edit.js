import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, TextareaControl, SelectControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from `cb-testimonial` — see identity-global-block-spec.md's
 * Testimonial entry. Confirmed against cb-identity2025's own real ACF
 * field group (`quote` is a plain textarea, not richtext/wysiwyg — its
 * value is only ever run through wp_kses_post(), no toolbar in real
 * content).
 *
 * `style` is a closed set of 3 real, confirmed variants — not a native
 * colour picker. Each one drives a whole coordinated quote/author/company
 * colour scheme (not just a background swap), and coda's consolidated ACF
 * field group's own *default* choices (Light/Raspberry/Purple →
 * neutral-200/raspberry/purple-400) turned out to be the wrong ones for
 * this brand: confirmed live against 4 real identityglobal.com/work/ case
 * studies (2026-09-22) that production actually uses identity's original
 * 3 choices (neutral-100/purple-900/primary-black) — cb-identity2025's own
 * ACF field group, not coda's later default. A plain SelectControl here,
 * not block.json colour supports, since the real choice set is
 * deliberately closed to 3 named options, not the full palette.
 *
 * Long quotes (over 130 plain-text characters) get a smaller size so they
 * don't overrun the layout — see render.php.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { quote, author, company, style } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Testimonial" textDomain="cb-identityjs2026">
			<TextareaControl
				label={ __( 'Quote', 'cb-identityjs2026' ) }
				value={ quote }
				onChange={ ( value ) => setAttributes( { quote: value } ) }
			/>
			<TextControl
				label={ __( 'Author', 'cb-identityjs2026' ) }
				value={ author }
				onChange={ ( value ) => setAttributes( { author: value } ) }
			/>
			<TextControl
				label={ __( 'Company', 'cb-identityjs2026' ) }
				value={ company }
				onChange={ ( value ) => setAttributes( { company: value } ) }
			/>
			<SelectControl
				label={ __( 'Style', 'cb-identityjs2026' ) }
				value={ style }
				options={ [
					{ label: 'Light', value: 'has-neutral-100-background-color' },
					{ label: 'Purple', value: 'has-purple-900-background-color' },
					{ label: 'Dark', value: 'has-primary-black-background-color' },
				] }
				onChange={ ( value ) => setAttributes( { style: value } ) }
			/>
		</EditorBlockShell>
	);
}
