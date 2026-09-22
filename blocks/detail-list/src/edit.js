import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, ToggleControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import RepeaterField from '../../_shared/RepeaterField';

/**
 * Built from About Detail, Service Detail, and cb-details — see
 * identity-global-block-spec.md's Detail List entry. `renderStyle: paired`
 * reproduces About/Service Detail's own real title/description layout
 * (confirmed live on identityglobal.com/about/'s "WHY CHOOSE IDENTITY?"
 * rows); `bullet_list` reproduces cb-details.php's simpler single-line
 * variant (no live instance currently uses this mode — sourced from
 * _cb_details.scss instead, not independently verified against a real
 * page).
 *
 * `introRow` replicates About Detail's own real "first row, no
 * description, shown larger" treatment as an explicit opt-in toggle
 * instead of the old auto-detect-on-save behaviour it used to be — per the
 * spec's own note, this wasn't in cb-details yet. Its colour override
 * moved to real per-row inline formatting once title became RichText (see
 * below) — introRow now only controls size, since there's no per-row
 * equivalent of the block-level Typography size control (each title is one
 * RichText among several in a single block's `details` array, not its own
 * block with its own attributes to hold a size).
 *
 * `title`/`description` are both RichText rather than plain text controls —
 * RichText's own Highlight tool (in its floating selection toolbar) lets an
 * editor override a specific row's colour directly, in the content itself,
 * instead of this block growing more dedicated toggle+CSS-class
 * combinations for cases beyond the one intro-row pattern already known
 * about. Deliberately NOT via block.json's supports.color.text: that's a
 * BLOCK-level control (one colour slot on the whole block's own
 * attributes), not a per-row one, and — confirmed live (2026-09-22) — its
 * useBlockProps()-driven class/style lands on this Edit() function's own
 * outer wrapper, which is the same element EditorBlockShell renders every
 * field label inside. Every label in the editor form (and every row's
 * text on the front end, not just the one intended) picked up that one
 * colour. RichText's inline Highlight format doesn't need the block to
 * declare colour support at all — it works standalone, scoped to the
 * exact selected text.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { renderStyle, introRow, details } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );
	const isPaired = 'paired' === renderStyle;

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Detail List" textDomain="cb-identityjs2026">
			<SelectControl
				label={ __( 'Layout', 'cb-identityjs2026' ) }
				value={ renderStyle }
				options={ [
					{ label: 'Paired (title + description)', value: 'paired' },
					{ label: 'Bullet List (title only)', value: 'bullet_list' },
				] }
				help={ __(
					'Paired shows each row as a title/description pair. Bullet List shows just the titles, one per line.',
					'cb-identityjs2026'
				) }
				onChange={ ( value ) => setAttributes( { renderStyle: value } ) }
			/>

			{ isPaired && (
				<ToggleControl
					label={ __( 'Style first row as a large intro', 'cb-identityjs2026' ) }
					checked={ introRow }
					help={ __(
						'Only applies when the first row has no description — shows its title larger. For colour, select the row’s title text, open its Highlight tool, and use the Text tab (not Background).',
						'cb-identityjs2026'
					) }
					onChange={ ( value ) => setAttributes( { introRow: value } ) }
				/>
			) }

			<RepeaterField
				label={ __( 'Details', 'cb-identityjs2026' ) }
				layout="column"
				value={ details }
				onChange={ ( value ) => setAttributes( { details: value } ) }
				fields={ [
					{ name: 'title', label: __( 'Title', 'cb-identityjs2026' ), type: 'richtext' },
					...( isPaired
						? [ { name: 'description', label: __( 'Description', 'cb-identityjs2026' ), type: 'richtext', multiline: true } ]
						: [] ),
				] }
				emptyRow={ { title: '', description: '' } }
			/>
		</EditorBlockShell>
	);
}
