import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import RepeaterField from '../../_shared/RepeaterField';

/**
 * Built from cb-contact-page — see identity-global-block-spec.md's Contact
 * Directory entry, and this session's own re-scoping of it. The real
 * source's title/intro/CTA are dropped entirely: title+intro are just Page
 * Header's own `title`/`introText` fields, and the CTA button is the
 * existing standalone CB CTA block (site-wide, already reusable) placed
 * next to Page Header — there's no reason for either of those to grow a
 * bespoke field here just because this one page needs them once.
 *
 * The real source's two structures unify into one `groups` repeater, but
 * NOT the same shape in both modes — confirmed directly against
 * identityglobal.com/contact/'s live markup, not assumed symmetric:
 *
 * - Locations: each group IS one named thing (an office) with a nested
 *   list of its own sub-addresses — "UK" containing 4 separate addresses
 *   is genuinely one name with several nested children.
 * - Email Groups: the real `.cb-contact-page__emails` wrapper (a divider
 *   boundary, borderred top+bottom) is NOT itself named — it just holds
 *   several independent name+email PAIRS with no divider between them
 *   ("New business" / "New business USA" / "New business Middle East"
 *   all sit inside ONE wrapper), only getting a new wrapper (hence a new
 *   divider) at "PR & Media". So a Group here has no `name` of its own at
 *   all — just a nested `entries` list, each entry carrying its own name.
 *
 * Getting this backwards (one shared name, multiple emails nested under
 * it) was a real bug caught after building it — it doesn't match
 * production's actual grouping, and put a divider between every single
 * name/email pair instead of only between real section boundaries.
 *
 * Either way, `new_section`/`is_group` (the evolved cb-identitygroup2026
 * source's own flags for exactly this same grouping need) aren't needed
 * here: with a real nested repeater, a divider boundary is just "a new
 * top-level row", not a flag threaded through a flat list.
 *
 * The real source's "LOCATIONS" banner (a distinct photo-background
 * section between the two halves) is a separate CB Section Title block
 * instance, not a field here — same "hardcoded banner → Section Title"
 * migration already used elsewhere in this rebuild (File List/Policies,
 * Child Page Nav).
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { mode, groups } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );
	const isEmails = 'emails' === mode;

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Contact Directory" textDomain="cb-identityjs2026">
			<SelectControl
				label={ __( 'Mode', 'cb-identityjs2026' ) }
				value={ mode }
				options={ [
					{ label: 'Email Groups', value: 'emails' },
					{ label: 'Locations', value: 'locations' },
				] }
				help={ __(
					'Background colour is set via this block’s own Styles panel (Color → Background) — real source uses black for Email Groups, Neutral 1100 for Locations.',
					'cb-identityjs2026'
				) }
				onChange={ ( value ) => setAttributes( { mode: value } ) }
			/>

			{ isEmails ? (
				<RepeaterField
					label={ __( 'Groups', 'cb-identityjs2026' ) }
					layout="column"
					value={ groups }
					onChange={ ( value ) => setAttributes( { groups: value } ) }
					fields={ [
						{
							name: 'entries',
							label: __( 'Entries (each with its own name + email) — no divider between entries in the same Group, only between Groups', 'cb-identityjs2026' ),
							type: 'repeater',
							subLayout: 'row',
							subFields: [
								{ name: 'name', label: __( 'Name', 'cb-identityjs2026' ), type: 'text' },
								{ name: 'email', label: __( 'Email', 'cb-identityjs2026' ), type: 'text' },
								{ name: 'phone', label: __( 'Phone', 'cb-identityjs2026' ), type: 'text', help: __( 'Optional.', 'cb-identityjs2026' ) },
							],
							subEmptyRow: { name: '', email: '', phone: '' },
						},
					] }
					emptyRow={ { entries: [] } }
				/>
			) : (
				<RepeaterField
					label={ __( 'Groups', 'cb-identityjs2026' ) }
					layout="column"
					value={ groups }
					onChange={ ( value ) => setAttributes( { groups: value } ) }
					fields={ [
						{ name: 'name', label: __( 'Office Name', 'cb-identityjs2026' ), type: 'text' },
						{
							name: 'addresses',
							label: __( 'Addresses', 'cb-identityjs2026' ),
							type: 'repeater',
							subLayout: 'column',
							subFields: [
								{ name: 'title', label: __( 'Sub-office Title', 'cb-identityjs2026' ), type: 'text', help: __( 'Optional.', 'cb-identityjs2026' ) },
								{ name: 'address', label: __( 'Address', 'cb-identityjs2026' ), type: 'textarea' },
								{ name: 'phone', label: __( 'Phone', 'cb-identityjs2026' ), type: 'text', help: __( 'Optional.', 'cb-identityjs2026' ) },
							],
							subEmptyRow: { title: '', address: '', phone: '' },
						},
					] }
					emptyRow={ { name: '', addresses: [] } }
				/>
			) }
		</EditorBlockShell>
	);
}
