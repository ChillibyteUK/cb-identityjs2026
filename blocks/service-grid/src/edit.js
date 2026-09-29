import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import RepeaterField from '../../_shared/RepeaterField';

/**
 * Built from `cb-service-grid` — a health/idtravel-only component
 * (`cb-identitygroup2026/blocks/cb-service-grid.php`) with no existing
 * identity styling; migrated here so identity can use it too. No
 * brand-restriction found in its own ACF field group's location rules
 * (targets the block itself, not a specific site) — it's simply never been
 * used/styled for identity's pages yet.
 *
 * `content` is a plain ACF textarea, not richtext — matches the same
 * pattern already found on Testimonial/Innovation Header's own fields.
 *
 * Colour uses native block typography/colour supports (background AND
 * text — the real ACF Block registers both), __experimentalSkipSerialization
 * — same established pattern as Push Panel/Section Title/Content Builder,
 * needed here for both properties since this project's fields-form editor
 * architecture would otherwise leak either one onto the shared editor form
 * wrapper. See render.php for the manual class-building this requires.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { startRow, items } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Service Grid" textDomain="cb-identityjs2026">
			<SelectControl
				label={ __( 'Start Row', 'cb-identityjs2026' ) }
				value={ startRow }
				options={ [
					{ label: 'Row 1', value: '1' },
					{ label: 'Row 2', value: '2' },
					{ label: 'Row 3', value: '3' },
				] }
				help={ __(
					'Shifts where the mosaic pattern begins — useful so multiple Service Grid instances on the same page don’t all start on the same layout.',
					'cb-identityjs2026'
				) }
				onChange={ ( value ) => setAttributes( { startRow: value } ) }
			/>

			<RepeaterField
				label={ __( 'Items', 'cb-identityjs2026' ) }
				layout="column"
				value={ items }
				onChange={ ( value ) => setAttributes( { items: value } ) }
				fields={ [
					{ name: 'image', label: __( 'Image', 'cb-identityjs2026' ), type: 'image' },
					{ name: 'title', label: __( 'Title', 'cb-identityjs2026' ) },
					{ name: 'content', label: __( 'Content', 'cb-identityjs2026' ), type: 'textarea' },
				] }
				emptyRow={ { image: 0, title: '', content: '' } }
			/>
		</EditorBlockShell>
	);
}
