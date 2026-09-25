import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import RepeaterField from '../../_shared/RepeaterField';

/**
 * Built from cb-file-block — see identity-global-block-spec.md's File List
 * entry. `section_title` is deliberately not a field here any more: its
 * visible banner text becomes a preceding CB Section Title block, and the
 * anchor id it used to generate now comes from this block's own native
 * "HTML anchor" Advanced-panel setting instead of a bespoke field — per
 * the spec's own note, `cb-file-block` was quietly reinventing Section
 * Title.
 *
 * Each row's link target matches the real source exactly (cb-file-
 * block.php): Page Link (when set) opens `_self`, a File (when no Page
 * Link is set) opens `_blank` — not an editor choice, so there's no
 * "open in new tab" toggle here. Page Link is a plain URL text field
 * (RepeaterField's default field type, not its `link` type) — this row's
 * own `title` field is already the visible label, so the paired "{label}
 * Title" input `link` fields normally add would just be a second, unused
 * text box (the real source's `page_link` ACF value's own title was never
 * read by cb-file-block.php either, only its url).
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { files } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB File List" textDomain="cb-identityjs2026">
			<RepeaterField
				label={ __( 'Files', 'cb-identityjs2026' ) }
				layout="column"
				value={ files }
				onChange={ ( value ) => setAttributes( { files: value } ) }
				fields={ [
					{ name: 'title', label: __( 'Title', 'cb-identityjs2026' ), type: 'text' },
					{
						name: 'pageLink',
						label: __( 'Page Link', 'cb-identityjs2026' ),
						type: 'text',
						help: __( 'Optional — used instead of the file below when set.', 'cb-identityjs2026' ),
					},
					{
						name: 'file',
						label: __( 'File', 'cb-identityjs2026' ),
						type: 'file',
						help: __( 'Optional — ignored if a Page Link above is set.', 'cb-identityjs2026' ),
					},
				] }
				emptyRow={ { title: '', pageLink: '', file: 0, fileName: '' } }
			/>
		</EditorBlockShell>
	);
}
