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
 * The real source's two structures (a hardcoded 5-field-pair email list
 * with hand-placed section headings, and an office→sub_addresses
 * repeater) are unified into one `groups` repeater — a name plus a nested
 * list — used in two modes. `new_section`/`is_group` (the evolved
 * cb-identitygroup2026 source's own flags for exactly this same grouping
 * need) aren't needed here: with a real nested repeater, a "section" or
 * "group" is just a top-level row with more than one child, not a flag
 * threaded through a flat list.
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
						{ name: 'name', label: __( 'Name', 'cb-identityjs2026' ), type: 'text' },
						{
							name: 'emails',
							label: __( 'Emails', 'cb-identityjs2026' ),
							type: 'repeater',
							subLayout: 'row',
							subFields: [
								{ name: 'email', label: __( 'Email', 'cb-identityjs2026' ), type: 'text' },
								{ name: 'phone', label: __( 'Phone', 'cb-identityjs2026' ), type: 'text', help: __( 'Optional.', 'cb-identityjs2026' ) },
							],
							subEmptyRow: { email: '', phone: '' },
						},
					] }
					emptyRow={ { name: '', emails: [] } }
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
