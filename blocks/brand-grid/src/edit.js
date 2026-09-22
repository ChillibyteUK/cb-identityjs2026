import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { TextareaControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import RepeaterField from '../../_shared/RepeaterField';

/**
 * Built from Our Brands (renamed — the flip-card grid shape is reusable
 * elsewhere by name, not tied to one page's copy) — see
 * identity-global-block-spec.md's Brand Grid entry. Confirmed live on
 * identityglobal.com/about/'s real "OUR BRANDS" section — the real
 * markup has diverged from both local reference themes (cb-identity2025's
 * own PHP/SCSS and cb-identitygroup2026's consolidated fork): no
 * id-container/row/col-md-9 wrapping the intro text any more, and the
 * card back's real desktop opacity/padding don't match either local
 * SCSS file (padding is 40px/24px/24px/24px, not a uniform 1.5rem; rest
 * opacity is exactly 0 with a fully solid background, not the 0.95-alpha
 * SCSS claims) — every value here is from live computed styles, not the
 * local files.
 *
 * pre_title is deliberately not a field here — becomes a separate CB
 * Section Title block placed before this one instead, per the spec's own
 * migration note and confirmed directly by the user.
 *
 * closingText (the real source's hardcoded "Together, we deliver a
 * breadth of expertise with the simplicity of one team.") is a real,
 * editable, omittable field here instead of fixed copy — per the spec's
 * own migration note and confirmed directly by the user. Left empty, the
 * closing card simply doesn't render (see render.php) rather than
 * rendering an awkward empty fill cell.
 *
 * Two real bugs caught live (2026-09-22), on the first real page this was
 * actually used on: `render.php` read `$row['logoId']`, but
 * RepeaterField's image field type stores the attachment id under the
 * field's own given name ("logo") directly, not name+"Id" — every row's
 * logo silently read as empty regardless of what was actually picked, so
 * no card ever rendered at all. Separately, a row with a logo but no link
 * was being dropped entirely instead of rendering as a non-clickable card
 * (the real source's own actual behaviour) — fixed in render.php.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { introText, brands, closingText } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Brand Grid" textDomain="cb-identityjs2026">
			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Intro Text', 'cb-identityjs2026' ) }</label>
				<RichText
					tagName="div"
					multiline="p"
					className="cb-identityjs2026-editor-field__control"
					aria-label={ __( 'Intro Text', 'cb-identityjs2026' ) }
					placeholder={ __( 'Intro Text', 'cb-identityjs2026' ) }
					value={ introText }
					onChange={ ( value ) => setAttributes( { introText: value } ) }
				/>
				<p className="cb-identityjs2026-editor-field__help">{ __( 'Optional — shown above the grid.', 'cb-identityjs2026' ) }</p>
			</div>

			<p className="cb-identityjs2026-editor-field__help">
				{ __(
					'Each card shows just the Logo until hovered/focused, then flips to reveal Name and Link Title — that’s the text and arrow shown on the card’s back. Only the Logo is required; without a Link URL the card still shows but isn’t clickable.',
					'cb-identityjs2026'
				) }
			</p>
			<RepeaterField
				label={ __( 'Brands', 'cb-identityjs2026' ) }
				layout="column"
				value={ brands }
				onChange={ ( value ) => setAttributes( { brands: value } ) }
				fields={ [
					{ name: 'logo', label: __( 'Logo', 'cb-identityjs2026' ), type: 'image' },
					{ name: 'name', label: __( 'Name (card back)', 'cb-identityjs2026' ), type: 'text' },
					{ name: 'link', label: __( 'Link (URL + card back text)', 'cb-identityjs2026' ), type: 'link', linkTarget: true },
				] }
				emptyRow={ { name: '', linkText: '', link: '', linkTarget: false } }
			/>

			<TextareaControl
				label={ __( 'Closing Card Text', 'cb-identityjs2026' ) }
				value={ closingText }
				help={ __( 'Optional — the last cell in the grid. Leave blank to omit it entirely.', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { closingText: value } ) }
			/>
		</EditorBlockShell>
	);
}
