import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import RowEditor from './RowEditor';
import { emptyRow } from './constants';

/**
 * Built from `cb-content-grid-v2` — see identity-global-block-spec.md's
 * Content Builder entry and content-builder-research.md for the full real-
 * source audit. Built against cb-identitygroup2026's fuller 13-module-type
 * set (h1/stats and the has_padding row field are coda-only additions,
 * absent from the older cb-identity2025 copy).
 *
 * Background colour uses block.json's native supports.color.background
 * (__experimentalSkipSerialization) — same reasoning as every other block
 * this session using that pattern (see Push Panel/Section Title): applied
 * to the section itself in render.php, not the editor's own form wrapper.
 * Its slug also drives the real source's dark-lines/light-lines divider
 * colour logic (see render.php).
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { rows, backgroundImageId } = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );
	const backgroundUrl = useSelect(
		( select ) => {
			if ( ! backgroundImageId ) {
				return '';
			}
			return select( coreStore ).getMedia( backgroundImageId )?.source_url || '';
		},
		[ backgroundImageId ]
	);

	function updateRows( next ) {
		setAttributes( { rows: next } );
	}

	function updateRow( index, patch ) {
		const next = rows.slice();
		next[ index ] = { ...next[ index ], ...patch };
		updateRows( next );
	}

	function addRow() {
		updateRows( [ ...rows, emptyRow() ] );
	}

	function removeRow( index ) {
		// eslint-disable-next-line no-alert -- matches RepeaterField's own confirm() convention.
		if ( ! window.confirm( __( 'Remove this row?', 'cb-identityjs2026' ) ) ) {
			return;
		}
		updateRows( rows.filter( ( _row, i ) => i !== index ) );
	}

	function moveRow( index, direction ) {
		const target = index + direction;
		if ( target < 0 || target >= rows.length ) {
			return;
		}
		const next = rows.slice();
		const tmp = next[ index ];
		next[ index ] = next[ target ];
		next[ target ] = tmp;
		updateRows( next );
	}

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Content Builder" textDomain="cb-identityjs2026">
			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Background Image', 'cb-identityjs2026' ) }</label>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) => setAttributes( { backgroundImageId: media.id } ) }
						allowedTypes={ [ 'image' ] }
						value={ backgroundImageId }
						render={ ( { open } ) => (
							<div className="cb-identityjs2026-editor-field__control">
								{ backgroundUrl && (
									<img src={ backgroundUrl } alt="" style={ { maxWidth: '200px', display: 'block', marginBottom: '8px' } } />
								) }
								<Button variant="secondary" onClick={ open }>
									{ backgroundUrl ? __( 'Replace Background', 'cb-identityjs2026' ) : __( 'Select Background', 'cb-identityjs2026' ) }
								</Button>
							</div>
						) }
					/>
				</MediaUploadCheck>
				<p className="cb-identityjs2026-editor-field__help">
					{ __( 'Optional — a parallax cover image behind every row. Override the divider-line colour from Color in the block’s own Settings sidebar.', 'cb-identityjs2026' ) }
				</p>
			</div>

			{ rows.map( ( row, index ) => (
				<div className="cb-identityjs2026-content-builder-row-wrap" key={ row.id }>
					<div className="cb-identityjs2026-content-builder-row-wrap__header">
						<span>{ __( 'Row', 'cb-identityjs2026' ) } { index + 1 }</span>
						<div className="cb-identityjs2026-repeater-field__row-actions">
							<Button size="small" label={ __( 'Move up', 'cb-identityjs2026' ) } onClick={ () => moveRow( index, -1 ) } disabled={ 0 === index }>
								&#9650;
							</Button>
							<Button
								size="small"
								label={ __( 'Move down', 'cb-identityjs2026' ) }
								onClick={ () => moveRow( index, 1 ) }
								disabled={ index === rows.length - 1 }
							>
								&#9660;
							</Button>
							<Button size="small" isDestructive label={ __( 'Remove', 'cb-identityjs2026' ) } onClick={ () => removeRow( index ) }>
								&times;
							</Button>
						</div>
					</div>
					<RowEditor row={ row } updateRow={ ( patch ) => updateRow( index, patch ) } />
				</div>
			) ) }
			<Button variant="primary" onClick={ addRow }>
				{ __( 'Add Row', 'cb-identityjs2026' ) }
			</Button>
		</EditorBlockShell>
	);
}
