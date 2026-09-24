import { __ } from '@wordpress/i18n';
import { SelectControl, ToggleControl, Button } from '@wordpress/components';
import { COLUMN_LAYOUT_OPTIONS, emptyModule, emptyColumn, normalizeRowColumns } from './constants';
import ModuleEditor from './ModuleEditor';

/**
 * One row's own fields (column layout, has_line, has_padding) plus its
 * columns — each column a list of stacked modules, not a single module.
 *
 * Confirmed live against production's own cb-content-grid-v2.php: a flat
 * modules-list mapped 1:1 to columns by index can't express "Heading +
 * Text + List all in one column, next to an Image in the other" — with 3
 * modules in a 2-column layout, the 3rd module wraps onto a new grid row
 * starting at the container's own left edge, not stacked under module 2.
 * Production only ever avoids this by keeping such content in one big ACF
 * wysiwyg field (real TinyMCE, lets an editor insert an inline heading via
 * its Format dropdown) — this block's own `text` module uses Gutenberg's
 * RichText instead, which can't mix tag types the same way (core itself
 * keeps `core/heading`/`core/paragraph` separate for the same reason).
 * Grouping modules into columns is the correct fix either way: it's how
 * you get "heading, then paragraphs, then a list" stacked together
 * regardless of which module types are involved.
 *
 * `has_padding` is coda-only in the real source (see
 * content-builder-research.md) — this block always stores both booleans
 * explicitly (default true/true) since it's a fresh native block with no
 * legacy ACF checkbox-serialization quirk to work around.
 *
 * @param {Object}   props
 * @param {Object}   props.row
 * @param {Function} props.updateRow ( patch ) => void
 */
export default function RowEditor( { row, updateRow } ) {
	const columns = normalizeRowColumns( row );

	function updateColumns( next ) {
		// `modules: undefined` drops the legacy flat key once a row is
		// edited through this UI (JSON.stringify omits undefined-valued
		// keys), so a re-saved row persists in the new `columns` shape only
		// — render.php's own fallback to `modules` only matters for rows
		// this editor hasn't touched yet.
		updateRow( { columns: next, modules: undefined } );
	}

	function updateColumn( index, patch ) {
		const next = columns.slice();
		next[ index ] = { ...next[ index ], ...patch };
		updateColumns( next );
	}

	function addColumn() {
		updateColumns( [ ...columns, emptyColumn() ] );
	}

	function removeColumn( index ) {
		// eslint-disable-next-line no-alert -- matches RepeaterField's own confirm() convention.
		if ( ! window.confirm( __( 'Remove this column and everything in it?', 'cb-identityjs2026' ) ) ) {
			return;
		}
		updateColumns( columns.filter( ( _col, i ) => i !== index ) );
	}

	function moveColumn( index, direction ) {
		const target = index + direction;
		if ( target < 0 || target >= columns.length ) {
			return;
		}
		const next = columns.slice();
		const tmp = next[ index ];
		next[ index ] = next[ target ];
		next[ target ] = tmp;
		updateColumns( next );
	}

	function updateModules( columnIndex, nextModules ) {
		updateColumn( columnIndex, { modules: nextModules } );
	}

	function updateModule( columnIndex, moduleIndex, patch ) {
		const modules = columns[ columnIndex ].modules || [];
		const next = modules.slice();
		next[ moduleIndex ] = { ...next[ moduleIndex ], ...patch };
		updateModules( columnIndex, next );
	}

	function addModule( columnIndex ) {
		const modules = columns[ columnIndex ].modules || [];
		updateModules( columnIndex, [ ...modules, emptyModule() ] );
	}

	function removeModule( columnIndex, moduleIndex ) {
		// eslint-disable-next-line no-alert -- matches RepeaterField's own confirm() convention.
		if ( ! window.confirm( __( 'Remove this module?', 'cb-identityjs2026' ) ) ) {
			return;
		}
		const modules = columns[ columnIndex ].modules || [];
		updateModules( columnIndex, modules.filter( ( _mod, i ) => i !== moduleIndex ) );
	}

	function moveModule( columnIndex, moduleIndex, direction ) {
		const modules = columns[ columnIndex ].modules || [];
		const target = moduleIndex + direction;
		if ( target < 0 || target >= modules.length ) {
			return;
		}
		const next = modules.slice();
		const tmp = next[ moduleIndex ];
		next[ moduleIndex ] = next[ target ];
		next[ target ] = tmp;
		updateModules( columnIndex, next );
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
					'Each column holds its own stack of modules — e.g. a Heading, then Text, then a List, all in one column, next to an Image in the other. Nothing enforces column count against the chosen layout — add as many or as few columns as you like; extra ones just take the layout’s last column width.',
					'cb-identityjs2026'
				) }
			</p>

			{ columns.map( ( column, columnIndex ) => {
				const modules = column.modules || [];
				return (
					<div className="cb-identityjs2026-content-builder-column-wrap" key={ column.id }>
						<div className="cb-identityjs2026-content-builder-column-wrap__header">
							<span>
								{ __( 'Column', 'cb-identityjs2026' ) } { columnIndex + 1 }
							</span>
							<div className="cb-identityjs2026-repeater-field__row-actions">
								<Button
									size="small"
									label={ __( 'Move left', 'cb-identityjs2026' ) }
									onClick={ () => moveColumn( columnIndex, -1 ) }
									disabled={ 0 === columnIndex }
								>
									&#9664;
								</Button>
								<Button
									size="small"
									label={ __( 'Move right', 'cb-identityjs2026' ) }
									onClick={ () => moveColumn( columnIndex, 1 ) }
									disabled={ columnIndex === columns.length - 1 }
								>
									&#9654;
								</Button>
								<Button
									size="small"
									isDestructive
									label={ __( 'Remove column', 'cb-identityjs2026' ) }
									onClick={ () => removeColumn( columnIndex ) }
								>
									&times;
								</Button>
							</div>
						</div>

						{ modules.map( ( mod, moduleIndex ) => (
							<div className="cb-identityjs2026-content-builder-module-wrap" key={ mod.id }>
								<div className="cb-identityjs2026-content-builder-module-wrap__header">
									<span>
										{ __( 'Module', 'cb-identityjs2026' ) } { moduleIndex + 1 }
									</span>
									<div className="cb-identityjs2026-repeater-field__row-actions">
										<Button
											size="small"
											label={ __( 'Move up', 'cb-identityjs2026' ) }
											onClick={ () => moveModule( columnIndex, moduleIndex, -1 ) }
											disabled={ 0 === moduleIndex }
										>
											&#9650;
										</Button>
										<Button
											size="small"
											label={ __( 'Move down', 'cb-identityjs2026' ) }
											onClick={ () => moveModule( columnIndex, moduleIndex, 1 ) }
											disabled={ moduleIndex === modules.length - 1 }
										>
											&#9660;
										</Button>
										<Button
											size="small"
											isDestructive
											label={ __( 'Remove', 'cb-identityjs2026' ) }
											onClick={ () => removeModule( columnIndex, moduleIndex ) }
										>
											&times;
										</Button>
									</div>
								</div>
								<ModuleEditor module={ mod } updateModule={ ( patch ) => updateModule( columnIndex, moduleIndex, patch ) } />
							</div>
						) ) }
						<Button variant="secondary" onClick={ () => addModule( columnIndex ) }>
							{ __( 'Add Module to This Column', 'cb-identityjs2026' ) }
						</Button>
					</div>
				);
			} ) }
			<Button variant="primary" onClick={ addColumn }>
				{ __( 'Add Column', 'cb-identityjs2026' ) }
			</Button>
		</div>
	);
}
