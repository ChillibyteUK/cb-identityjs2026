import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextareaControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import RepeaterField from '../../_shared/RepeaterField';

/**
 * Built from `cb-leadership` — a health/idtravel-only component
 * (`cb-identitygroup2026/blocks/cb-leadership.php`) with no existing
 * identity styling; migrated here so identity can use it too.
 *
 * Real source has a genuine per-brand branch: coda hardcodes a fixed
 * background/line colour with no picker at all, while idtravel (and, by
 * falling into the same "else" branch, health) support the native colour
 * picker with dynamic dark-lines/light-lines logic keyed off the picked
 * background's own numeric suffix (≥600 → light lines, else dark —
 * defaulting to dark-lines when no colour is picked at all).
 *
 * That default doesn't carry over as-is: idtravel/coda/health's own
 * default page background is light, so "dark lines by default" makes
 * sense there — identity's is dark (--col-bg: #0d0d0c), so this project
 * defaults to LIGHT lines instead when no background colour is explicitly
 * picked (confirmed directly by the user, 2026-09-29), while still
 * honouring the same dynamic override once an editor does pick one. See
 * render.php.
 *
 * `intro`/`bio` are plain ACF textareas, not richtext — same pattern
 * already found on Testimonial/Innovation Header/Service Grid.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { intro, team } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Leadership" textDomain="cb-identityjs2026">
			<TextareaControl
				label={ __( 'Intro', 'cb-identityjs2026' ) }
				value={ intro }
				onChange={ ( value ) => setAttributes( { intro: value } ) }
			/>

			<RepeaterField
				label={ __( 'Team', 'cb-identityjs2026' ) }
				layout="column"
				value={ team }
				onChange={ ( value ) => setAttributes( { team: value } ) }
				fields={ [
					{ name: 'image', label: __( 'Image', 'cb-identityjs2026' ), type: 'image' },
					{ name: 'name', label: __( 'Name', 'cb-identityjs2026' ) },
					{ name: 'role', label: __( 'Role', 'cb-identityjs2026' ) },
					{ name: 'bio', label: __( 'Bio', 'cb-identityjs2026' ), type: 'textarea' },
				] }
				emptyRow={ { image: 0, name: '', role: '', bio: '' } }
			/>
		</EditorBlockShell>
	);
}
