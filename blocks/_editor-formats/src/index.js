import { __ } from '@wordpress/i18n';
import { registerFormatType, toggleFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';

/**
 * "Lede" inline format — a components-popover toolbar button (same
 * selection popover Bold/Italic/Link already live in), not a block-level
 * attribute. Needed because the old CSS-only "first paragraph is
 * automatically bigger" rule (removed from .page-header__intro /
 * .page-header__panel-text when introTextFontSize/secondaryTextFontSize
 * were added — see identity.css's own history) can't come back as a fixed
 * rule without re-breaking per-instance font-size control: a RichText
 * field's Font Size dropdown already sets ONE size for the whole field, so
 * "first paragraph bigger than the rest" needs per-selection granularity a
 * block attribute genuinely can't express. This format lets an editor
 * select any paragraph (or run of text) — typically the intro's first
 * paragraph, to restore About Page Header's original lede treatment — and
 * mark just that selection as "lede", opt-in, wherever a RichText field
 * exists project-wide (Page Header's Intro/Secondary Text included, but
 * not limited to them — see .cb-lede in identity.css).
 *
 * Registered once, globally, via enqueue_block_editor_assets (see
 * inc/editor.php) rather than per-block — same reasoning `gap`/spacing
 * utility classes are global rather than duplicated per block.
 */
const FORMAT_NAME = 'cb-identityjs2026/lede';

registerFormatType( FORMAT_NAME, {
	title: __( 'Lede', 'cb-identityjs2026' ),
	tagName: 'span',
	className: 'cb-lede',
	edit( { isActive, value, onChange } ) {
		return (
			<RichTextToolbarButton
				icon="editor-textcolor"
				title={ __( 'Lede', 'cb-identityjs2026' ) }
				onClick={ () => onChange( toggleFormat( value, { type: FORMAT_NAME } ) ) }
				isActive={ isActive }
			/>
		);
	},
} );
