import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextareaControl, TextControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from cb-case-study-hero — see identity-global-block-spec.md's Case
 * Study Grid entry (this block isn't itself a spec entry, but its
 * `case_study_subtitle` field is what cb_find_hero_subtitle() reads across
 * Featured/Related/Work Index/Work Carousel/Work by Region — Case Study
 * Grid and Work Index's own card descriptions both depend on it).
 *
 * Placed at the top of a case_study post's content, one per post. Title
 * comes from the post's own title (get_the_title()), not a field here —
 * matches the real source's own h1.
 *
 * Video stores vimeoId + vimeoHash rather than a pasted vimeo_url, same
 * convention as Media Panel's video mode (see that block's own edit.js
 * comment) — this project's own established pattern, not the real
 * source's raw-URL ACF field. Read by the same card-hover-preview markup
 * Work Index / Case Study Grid cards use (mount-on-hover Vimeo iframe,
 * ported from cb-featured-work.php's own JS).
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { subtitle, vimeoId, vimeoHash } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Case Study Hero" textDomain="cb-identityjs2026">
			<TextareaControl
				label={ __( 'Subtitle', 'cb-identityjs2026' ) }
				value={ subtitle }
				help={ __(
					'Shown under the title here, and reused as the card description everywhere this case study appears (Work Index, Case Study Grid) instead of a trimmed excerpt.',
					'cb-identityjs2026'
				) }
				onChange={ ( value ) => setAttributes( { subtitle: value } ) }
			/>

			<div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
				<div style={ { flex: '50 1 0%' } }>
					<TextControl
						label={ __( 'Vimeo Video ID', 'cb-identityjs2026' ) }
						value={ vimeoId }
						help={ __( "The numeric ID from the video's URL, e.g. 1172226452", 'cb-identityjs2026' ) }
						onChange={ ( value ) => setAttributes( { vimeoId: value } ) }
					/>
				</div>
				<div style={ { flex: '50 1 0%' } }>
					<TextControl
						label={ __( 'Vimeo Privacy Hash', 'cb-identityjs2026' ) }
						value={ vimeoHash }
						help={ __( "The h= value from the video's share/embed URL — required for unlisted videos", 'cb-identityjs2026' ) }
						onChange={ ( value ) => setAttributes( { vimeoHash: value } ) }
					/>
				</div>
			</div>

			<p className="cb-identityjs2026-editor-field__help">
				{ __(
					'Optional. Plays here on the case study page itself, and drives the hover-preview video on this case study’s card in Work Index / Case Study Grid.',
					'cb-identityjs2026'
				) }
			</p>
		</EditorBlockShell>
	);
}
