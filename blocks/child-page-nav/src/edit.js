import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl, Spinner, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from cb-services-nav — see identity-global-block-spec.md's Child
 * Page Nav entry. Generalised from the old hardcoded-to-"services" block
 * via a page-picker `parentPage` field, so the same block also covers
 * idtravel's nav variants. The spec's migration note said to drop the old
 * heading field in favour of a separate Section Title block — reinstated
 * as an editable `title` field instead (2026-09-22 direct instruction),
 * since the real block's heading has its own distinct treatment (small,
 * accent-coloured, translucent-background bar) that a generic Section
 * Title block wouldn't replicate anyway.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { parentPage, title } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	const { pages, hasResolved } = useSelect(
		( select ) => {
			const query = { per_page: -1, orderby: 'title', order: 'asc', _fields: [ 'id', 'title' ] };
			return {
				pages: select( coreStore ).getEntityRecords( 'postType', 'page', query ),
				hasResolved: select( coreStore ).hasFinishedResolution( 'getEntityRecords', [ 'postType', 'page', query ] ),
			};
		},
		[]
	);

	const options = [
		{ label: __( '— Select a page —', 'cb-identityjs2026' ), value: 0 },
		...( pages ?? [] ).map( ( page ) => ( {
			label: page.title?.rendered || page.title?.raw || `#${ page.id }`,
			value: page.id,
		} ) ),
	];

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Child Page Nav" textDomain="cb-identityjs2026">
			<TextControl
				label={ __( 'Title', 'cb-identityjs2026' ) }
				value={ title }
				help={ __( 'e.g. "SERVICES" — leave blank to hide the title bar entirely.', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { title: value } ) }
			/>
			{ ! hasResolved ? (
				<Spinner />
			) : (
				<SelectControl
					label={ __( 'Parent Page', 'cb-identityjs2026' ) }
					value={ parentPage }
					options={ options }
					help={ __( 'Lists this page\'s children as nav items — e.g. the "Services" page for a services sub-nav.', 'cb-identityjs2026' ) }
					onChange={ ( value ) => setAttributes( { parentPage: Number( value ) } ) }
				/>
			) }
		</EditorBlockShell>
	);
}
