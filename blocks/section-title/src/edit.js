import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from cb-signpost-header — see identity-global-block-spec.md's
 * Section Title entry. A standalone bordered label banner, dropped in
 * ahead of other blocks in place of their old pre_title fields (Child
 * Page Nav, Stat Block, Work Index — see those blocks' own migration
 * notes).
 *
 * block.json's supports.color.text gives this its Gutenberg text-colour
 * picker — WordPress injects that into the block's own Settings sidebar
 * automatically, so no colour control needs building here.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { title } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Section Title" textDomain="cb-identityjs2026">
			<TextControl
				label={ __( 'Title', 'cb-identityjs2026' ) }
				value={ title }
				help={ __( 'Text colour defaults to the brand accent — override it from Color in the block’s own Settings sidebar.', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { title: value } ) }
			/>
		</EditorBlockShell>
	);
}
