import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from cb-cta — see identity-global-block-spec.md's Call to Action
 * entry. Content lives entirely in Site-Wide Settings' CTAs repeater
 * (title/content/link/images); this block just picks one by its CTA ID.
 * Same indirection as the real block, kept deliberately — it's why the same
 * CTA reads consistently across many pages.
 *
 * The choice list comes from `window.cbIdentityJs2026Ctas`, localised onto
 * this block's own editor script (see inc/cta.php) — there's no post type
 * or REST-queryable entity backing Site-Wide Settings' CTAs, so core-data
 * can't resolve them the way Child Page Nav resolves pages.
 *
 * Only Mask A (the clipped foreground-image shape) is used anywhere on the
 * real site — confirmed, not just assumed — so it's hardcoded in
 * src/blocks/cta.css rather than exposed as a field.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { ctaChoice } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	const ctas = window.cbIdentityJs2026Ctas || [];
	const options = [
		{ label: __( '— First configured CTA —', 'cb-identityjs2026' ), value: '' },
		...ctas.map( ( cta ) => ( { label: cta.id, value: cta.id } ) ),
	];

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB CTA" textDomain="cb-identityjs2026">
			{ ctas.length === 0 ? (
				<p>
					{ __( 'No CTAs configured yet — add one under Site-Wide Settings → CTAs.', 'cb-identityjs2026' ) }
				</p>
			) : (
				<SelectControl
					label={ __( 'CTA', 'cb-identityjs2026' ) }
					value={ ctaChoice }
					options={ options }
					help={ __( 'Choose a CTA from the site-wide CTA library (Site-Wide Settings → CTAs).', 'cb-identityjs2026' ) }
					onChange={ ( value ) => setAttributes( { ctaChoice: value } ) }
				/>
			) }
		</EditorBlockShell>
	);
}
