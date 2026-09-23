import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { ToggleControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import PostTypePicker from '../../_shared/PostTypePicker';

/**
 * Built from cb-work-index — see identity-global-block-spec.md's Work
 * Index entry. Identity's own copy/markup only — see render.php's own
 * header comment for the per-brand simplification and the 3 real-source
 * features deliberately not carried over yet (hover video preview, hero
 * subtitle block-parsing, TomSelect).
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { heroCaseStudy, showFilterBar } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Work Index" textDomain="cb-identityjs2026">
			<PostTypePicker
				label={ __( 'Hero Case Study', 'cb-identityjs2026' ) }
				postType="case_study"
				value={ heroCaseStudy }
				onChange={ ( id ) => setAttributes( { heroCaseStudy: id } ) }
				help={ __( 'Optional — defaults to the first case study by menu order.', 'cb-identityjs2026' ) }
			/>

			<ToggleControl
				label={ __( 'Show Filter Bar', 'cb-identityjs2026' ) }
				checked={ showFilterBar }
				onChange={ ( value ) => setAttributes( { showFilterBar: value } ) }
				help={ __( 'A Service-taxonomy dropdown that filters the grid below, client-side.', 'cb-identityjs2026' ) }
			/>
		</EditorBlockShell>
	);
}
