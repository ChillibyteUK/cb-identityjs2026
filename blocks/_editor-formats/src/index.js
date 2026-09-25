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

/**
 * "Heading" inline format — same toolbar-button mechanism as Lede above,
 * for the same underlying reason: fields like Page Header's Secondary Text
 * are a single flat RichText (multiline="p"), and Gutenberg's heading
 * levels only exist as their own separate block type, not something a raw
 * RichText instance can insert mid-field. Real precedent for "a heading
 * inside this exact field" already exists — cb-culture-page-header's own
 * secondary_text WYSIWYG output includes a real <h2> (see cb-culture-page-
 * header.scss's `&__intro h2` rule) — so this reproduces that as a
 * selectable run of text rather than restructuring the field into multiple
 * blocks. Renders as an inline element (a <p>'s content model requires it,
 * since multiline="p" wraps every paragraph in a real <p> tag) styled to
 * read as a heading via `display: block` in identity.css's .cb-heading
 * rule, wherever a RichText field exists project-wide — same "opt-in,
 * global" reasoning as Lede.
 */
const HEADING_FORMAT_NAME = 'cb-identityjs2026/heading';

registerFormatType( HEADING_FORMAT_NAME, {
	title: __( 'Heading', 'cb-identityjs2026' ),
	tagName: 'strong',
	className: 'cb-heading',
	edit( { isActive, value, onChange } ) {
		return (
			<RichTextToolbarButton
				icon="heading"
				title={ __( 'Heading', 'cb-identityjs2026' ) }
				onClick={ () => onChange( toggleFormat( value, { type: HEADING_FORMAT_NAME } ) ) }
				isActive={ isActive }
			/>
		);
	},
} );
