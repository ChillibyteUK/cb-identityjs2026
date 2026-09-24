import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { ToggleControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import RepeaterField from '../../_shared/RepeaterField';

/**
 * Built from Detail List's own edit.js shape (EditorBlockShell +
 * RepeaterField layout="column", RichText rows) — see
 * identity-global-block-spec.md's FAQ List entry. `question` stays a
 * single-line-with-<br> richtext (same semantics as Detail List's title);
 * `answer` is multiline richtext (same as Detail List's description).
 *
 * No title/intro fields here — the old section_title becomes a separate
 * CB Section Title block placed immediately before this one, same
 * migration as Detail List's pre_title.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { hasTopBorder, faqs } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB FAQ" textDomain="cb-identityjs2026">
			<ToggleControl
				label={ __( 'Top Border', 'cb-identityjs2026' ) }
				checked={ hasTopBorder }
				help={ __( 'Not a real source field — added so this block can sit flush against a preceding block when needed.', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { hasTopBorder: value } ) }
			/>

			<RepeaterField
				label={ __( 'FAQs', 'cb-identityjs2026' ) }
				layout="column"
				value={ faqs }
				onChange={ ( value ) => setAttributes( { faqs: value } ) }
				fields={ [
					{ name: 'question', label: __( 'Question', 'cb-identityjs2026' ), type: 'richtext' },
					{ name: 'answer', label: __( 'Answer', 'cb-identityjs2026' ), type: 'richtext', multiline: true },
				] }
				emptyRow={ { question: '', answer: '' } }
			/>
		</EditorBlockShell>
	);
}
