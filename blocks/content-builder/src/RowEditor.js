import { __ } from '@wordpress/i18n';
import { SelectControl, ToggleControl, Button } from '@wordpress/components';
import { COLUMN_LAYOUT_OPTIONS, emptyModule } from './constants';
import ModuleEditor from './ModuleEditor';

/**
 * One row's own fields (column layout, has_line, has_padding) plus its
 * modules list. `has_padding` is coda-only in the real source (see
 * content-builder-research.md) — this block always stores both booleans
 * explicitly (default true/true) since it's a fresh native block with no
 * legacy ACF checkbox-serialization quirk to work around.
 *
 * @param {Object}   props
 * @param {Object}   props.row
 * @param {Function} props.updateRow ( patch ) => void
 */
export default function RowEditor( { row, updateRow } ) {
	const modules = row.modules || [];

	function updateModules( next ) {
		updateRow( { modules: next } );
	}

	function updateModule( index, patch ) {
		const next = modules.slice();
		next[ index ] = { ...next[ index ], ...patch };
		updateModules( next );
	}

	function addModule() {
		updateModules( [ ...modules, emptyModule() ] );
	}

	function removeModule( index ) {
		// eslint-disable-next-line no-alert -- matches RepeaterField's own confirm() convention.
		if ( ! window.confirm( __( 'Remove this module?', 'cb-identityjs2026' ) ) ) {
			return;
		}
		updateModules( modules.filter( ( _mod, i ) => i !== index ) );
	}

	function moveModule( index, direction ) {
		const target = index + direction;
		if ( target < 0 || target >= modules.length ) {
			return;
		}
		const next = modules.slice();
		const tmp = next[ index ];
		next[ index ] = next[ target ];
		next[ target ] = tmp;
		updateModules( next );
	}

	return (
		<div className="cb-identityjs2026-content-builder-row">
			<SelectControl
				label={ __( 'Column Layout', 'cb-identityjs2026' ) }
				value={ row.columnLayout }
				options={ COLUMN_LAYOUT_OPTIONS }
				onChange={ ( value ) => updateRow( { columnLayout: value } ) }
			/>
			<div style={ { display: 'flex', gap: '12px' } }>
				<ToggleControl
					label={ __( 'Divider Line Above', 'cb-identityjs2026' ) }
					checked={ row.hasLine }
					onChange={ ( value ) => updateRow( { hasLine: value } ) }
				/>
				<ToggleControl
					label={ __( 'Padding Top', 'cb-identityjs2026' ) }
					checked={ row.hasPaddingTop }
					onChange={ ( value ) => updateRow( { hasPaddingTop: value } ) }
				/>
				<ToggleControl
					label={ __( 'Padding Bottom', 'cb-identityjs2026' ) }
					checked={ row.hasPaddingBottom }
					onChange={ ( value ) => updateRow( { hasPaddingBottom: value } ) }
				/>
			</div>
			<p className="cb-identityjs2026-editor-field__help">
				{ __(
					'Nothing enforces module count against the chosen layout — add as many or as few modules as you like; extra ones just take the layout’s last column width.',
					'cb-identityjs2026'
				) }
			</p>

			{ modules.map( ( mod, index ) => (
				<div className="cb-identityjs2026-content-builder-module-wrap" key={ mod.id }>
					<div className="cb-identityjs2026-content-builder-module-wrap__header">
						<span>{ __( 'Module', 'cb-identityjs2026' ) } { index + 1 }</span>
						<div className="cb-identityjs2026-repeater-field__row-actions">
							<Button size="small" label={ __( 'Move up', 'cb-identityjs2026' ) } onClick={ () => moveModule( index, -1 ) } disabled={ 0 === index }>
								&#9650;
							</Button>
							<Button
								size="small"
								label={ __( 'Move down', 'cb-identityjs2026' ) }
								onClick={ () => moveModule( index, 1 ) }
								disabled={ index === modules.length - 1 }
							>
								&#9660;
							</Button>
							<Button size="small" isDestructive label={ __( 'Remove', 'cb-identityjs2026' ) } onClick={ () => removeModule( index ) }>
								&times;
							</Button>
						</div>
					</div>
					<ModuleEditor module={ mod } updateModule={ ( patch ) => updateModule( index, patch ) } />
				</div>
			) ) }
			<Button variant="secondary" onClick={ addModule }>
				{ __( 'Add Module', 'cb-identityjs2026' ) }
			</Button>
		</div>
	);
}
