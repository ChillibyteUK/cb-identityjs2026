import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor';
import { TextControl, TextareaControl, ToggleControl, Button, RadioControl } from '@wordpress/components';
import { useEffect, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Short random id for a repeater row, stable for that row's lifetime once
 * assigned (kept as-is by updateRow's `{ ...next[index], ...patch }` spread,
 * since patch never includes `id`). Not cryptographic, doesn't need to be —
 * only needs to be unique among this one row's siblings, as a stable React
 * `key` (see the "why" comment further down, near the .map() call).
 */
function generateRowId() {
	return `row-${ Date.now().toString( 36 ) }-${ Math.random().toString( 36 ).slice( 2, 8 ) }`;
}

/**
 * A repeater row's own image field, as a real component rather than
 * inlined into the big fields.map() below — needed so it can call its own
 * useSelect() per row/field to derive the preview URL live from the
 * attachment id, instead of trusting a `{field}Url` value stored only at
 * the moment of selection. Confirmed live (2026-09-22) as the same real
 * bug already found and fixed once this session on Page Header's
 * background field: a row backfilled from existing data, or any path that
 * doesn't go through this exact onSelect callback, leaves that stored
 * Url empty forever even though the id itself is genuinely valid —
 * showing as a blank preview with a working "Replace" button, easy to
 * mistake for "this row has no logo" when it does.
 */
function RepeaterImageField( { field, row, index, updateRow } ) {
	const id = row[ field.name ];
	const url = useSelect(
		( select ) => {
			if ( ! id ) {
				return '';
			}
			return select( coreStore ).getMedia( id )?.source_url || '';
		},
		[ id ]
	);

	return (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={ ( media ) => updateRow( index, { [ field.name ]: media.id } ) }
				allowedTypes={ [ 'image' ] }
				value={ id }
				render={ ( { open } ) => (
					<div className="cb-identityjs2026-repeater-field__image">
						{ url && <img src={ url } alt="" /> }
						<Button variant="secondary" size="small" onClick={ open }>
							{ id ? __( 'Replace', 'cb-identityjs2026' ) : __( 'Select', 'cb-identityjs2026' ) }
						</Button>
					</div>
				) }
			/>
		</MediaUploadCheck>
	);
}

/**
 * Makes a legacy plain-text value safe to hand to RichText. Confirmed live
 * (2026-09-22) as a real, reproducible bug, not a theory: RichText's
 * editable content silently fails to render at all when given a value with
 * no wrapping HTML tag whatsoever (isolated down to a single-row,
 * single-character repro — "a" renders nothing, "<p>a</p>" renders fine).
 * Rows saved before a field was RichText (plain textarea content, e.g.
 * "We bring experience...", no markup at all — some with literal `\n`
 * line breaks from a plain textarea, e.g. Detail List's old title field)
 * hit this on every read until they're re-saved through RichText's own
 * onChange, which always produces real markup — so this exists
 * specifically to bridge that one legacy moment, not as an ongoing
 * safeguard. Literal newlines become <br> first (matching the old
 * textarea's own line-break-only semantics — this project's title fields
 * were never multi-paragraph), then the whole thing is wrapped in one <p>
 * purely to satisfy RichText's "must have a tag" requirement — confirmed
 * live that wrapper doesn't force multiline-style paragraph behaviour on
 * an otherwise non-multiline field, it's just the minimal safe container.
 */
function toSafeRichTextHtml( value ) {
	const html = value || '';
	if ( html.includes( '<' ) ) {
		return html;
	}
	return `<p>${ html.replace( /\r\n|\r|\n/g, '<br>' ) }</p>`;
}

/**
 * Generic repeater UI for a block attribute holding an array of row objects.
 * The block-editor equivalent of the `repeater` field type in
 * inc/options.php — same sub-field vocabulary (text/textarea/image), separate
 * implementation since one runs in wp-admin and the other inside the block
 * editor's React tree.
 *
 * Rows lay out inline by default (`layout: 'row'`): each sub-field takes an
 * equal-width slot, with compact move-up/move-down/remove icon buttons at
 * the row's end. Sub-field labels render once, as column headers above the
 * rows, rather than repeating per row — `hideLabelFromVision` keeps them
 * screen-reader accessible on each control without rendering visually
 * twice.
 *
 * `layout: 'column'` stacks each row's sub-fields vertically instead —
 * there's no shared column header in that layout (it wouldn't line up with
 * anything), so each sub-field's own label renders visibly above its
 * control instead of being screen-reader-only.
 *
 * @param {Object}   props
 * @param {string}   props.label    Field group label.
 * @param {Object[]} props.value    Current rows.
 * @param {Function} props.onChange ( rows ) => void
 * @param {Object[]} props.fields   [ { name, label, type: 'text'|'number'|'textarea'|'richtext'|'image'|'file'|'link'|'radio', help, mimeTypes, linkTarget, options, multiline } ]
 *                                  `linkTarget` (link fields only) adds an "open in new tab" toggle,
 *                                  storing `{name}Target` on the row — same opt-in shape as the
 *                                  top-level `link` field type's `link_target` option. `options`
 *                                  (radio fields only) is `[ { label, value } ]`, mirroring the
 *                                  top-level `select`/`radio` field types' options shape. `multiline`
 *                                  (richtext fields only) turns on real multi-paragraph editing
 *                                  (RichText's `multiline="p"`); leave it unset for a field that's
 *                                  just single-line-with-line-breaks, e.g. a title.
 * @param {Object}   props.emptyRow Shape of a freshly-added row, e.g. { stat: '', title: '' }.
 * @param {string}   [props.layout] 'row' (default) or 'column'.
 */
export default function RepeaterField( { label, value, onChange, fields, emptyRow, layout = 'row' } ) {
	const isColumn = 'column' === layout;
	const rows = value || [];

	// Rows saved before this `id` field existed (or any other future
	// producer of rows without one) need an id from their very first render,
	// not just eventually: a useEffect-only backfill (running after that
	// first paint) still lets every id-less row mount once sharing the same
	// "no id" identity, and confirmed live, that's enough for a RichText
	// field's internal state to only ever end up correctly wired for the
	// first of them — every other row's RichText silently renders empty,
	// permanently, even after the effect assigns real ids on the next
	// render. useMemo computes real-enough ids synchronously, before
	// anything downstream ever mounts.
	const displayRows = useMemo( () => rows.map( ( row ) => ( row.id ? row : { ...row, id: generateRowId() } ) ), [ rows ] );

	// Persists those ids back into the actual attribute once React commits,
	// so they're stable across reloads/reorders instead of regenerating
	// every render — moveRow/removeRow/updateRow below still key off array
	// index, not id, so this is purely about giving each row a durable
	// identity, not something anything else depends on to function.
	useEffect( () => {
		if ( rows.some( ( row ) => ! row.id ) ) {
			onChange( displayRows );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ rows.length ] );

	function updateRow( index, patch ) {
		const next = rows.slice();
		next[ index ] = { ...next[ index ], ...patch };
		onChange( next );
	}

	function addRow() {
		onChange( [ ...rows, { ...emptyRow, id: generateRowId() } ] );
	}

	function removeRow( index ) {
		// eslint-disable-next-line no-alert -- a plain confirm() is enough
		// friction for an irreversible remove; no undo exists for this field.
		if ( ! window.confirm( __( 'Remove this row?', 'cb-identityjs2026' ) ) ) {
			return;
		}
		onChange( rows.filter( ( _row, i ) => i !== index ) );
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
		onChange( next );
	}

	return (
		<div
			className={
				isColumn
					? 'cb-identityjs2026-repeater-field cb-identityjs2026-repeater-field--column'
					: 'cb-identityjs2026-repeater-field'
			}
		>
			<label className="cb-identityjs2026-editor-field__label">{ label }</label>
			{ ! isColumn && rows.length > 0 && (
				<div className="cb-identityjs2026-repeater-field__header">
					<span className="cb-identityjs2026-repeater-field__number-spacer" />
					{ fields.map( ( field ) => (
						<span
							key={ field.name }
							className={
								'image' === field.type || 'file' === field.type
									? 'cb-identityjs2026-repeater-field__header-cell cb-identityjs2026-repeater-field__header-cell--image'
									: 'cb-identityjs2026-repeater-field__header-cell'
							}
						>
							{ field.label }
						</span>
					) ) }
					<span className="cb-identityjs2026-repeater-field__row-actions-spacer" />
				</div>
			) }
			<div className="cb-identityjs2026-repeater-field__rows">
			{ /* key is row.id, not index: on a move/reorder the array positions
			    swap but the row *objects* (and their ids) travel with the
			    move, so a stable id-based key correctly follows each row's
			    actual identity through that swap. An index-based key instead
			    tells React "the thing at position 2 is still the same
			    component," even though its data just changed underneath it —
			    harmless for plain controlled inputs, but RichText owns real
			    browser selection/cursor state inside its own DOM node, and
			    reusing that node across what's actually a different row is
			    exactly what caused shift+arrow selection to behave oddly
			    across a reorder. Iterating displayRows (not rows) is what
			    guarantees that id is there from this very first render — see
			    the useMemo above. */ }
			{ displayRows.map( ( row, index ) => (
				<div className="cb-identityjs2026-repeater-field__row" key={ row.id }>
					<span className="cb-identityjs2026-repeater-field__number">{ index + 1 }</span>
					{ fields.map( ( field ) => {
						if ( 'image' === field.type ) {
							return (
								<RepeaterImageField key={ field.name } field={ field } row={ row } index={ index } updateRow={ updateRow } />
							);
						}

						if ( 'link' === field.type ) {
							return (
								<div className="cb-identityjs2026-repeater-field__link" key={ field.name }>
									<TextControl
										label={ __( `${ field.label } Title`, 'cb-identityjs2026' ) }
										hideLabelFromVision={ ! isColumn }
										value={ row[ `${ field.name }Text` ] || '' }
										onChange={ ( v ) => updateRow( index, { [ `${ field.name }Text` ]: v } ) }
									/>
									<TextControl
										type="url"
										label={ __( `${ field.label } URL`, 'cb-identityjs2026' ) }
										hideLabelFromVision={ ! isColumn }
										value={ row[ field.name ] || '' }
										onChange={ ( v ) => updateRow( index, { [ field.name ]: v } ) }
										help={ field.help }
									/>
									{ field.linkTarget && (
										<ToggleControl
											label={ __( `Open ${ field.label } in a new tab`, 'cb-identityjs2026' ) }
											checked={ !! row[ `${ field.name }Target` ] }
											onChange={ ( v ) => updateRow( index, { [ `${ field.name }Target` ]: v } ) }
										/>
									) }
								</div>
							);
						}

						if ( 'file' === field.type ) {
							return (
								<MediaUploadCheck key={ field.name }>
									<MediaUpload
										onSelect={ ( media ) =>
											updateRow( index, {
												[ field.name ]: media.id,
												[ `${ field.name }Name` ]: media.filename || media.title || '',
											} )
										}
										allowedTypes={ field.mimeTypes || [] }
										value={ row[ field.name ] }
										render={ ( { open } ) => (
											<div className="cb-identityjs2026-repeater-field__image">
												{ row[ `${ field.name }Name` ] && (
													<span className="cb-identityjs2026-repeater-field__file-name">
														{ row[ `${ field.name }Name` ] }
													</span>
												) }
												<Button variant="secondary" size="small" onClick={ open }>
													{ row[ field.name ]
														? __( 'Replace', 'cb-identityjs2026' )
														: __( 'Select', 'cb-identityjs2026' ) }
												</Button>
											</div>
										) }
									/>
								</MediaUploadCheck>
							);
						}

						if ( 'textarea' === field.type ) {
							return (
								<TextareaControl
									key={ field.name }
									label={ field.label }
									hideLabelFromVision={ ! isColumn }
									value={ row[ field.name ] || '' }
									onChange={ ( v ) => updateRow( index, { [ field.name ]: v } ) }
									help={ field.help }
								/>
							);
						}

						if ( 'richtext' === field.type ) {
							return (
								<div className="cb-identityjs2026-repeater-field__richtext" key={ field.name }>
									{ isColumn && <span className="cb-identityjs2026-editor-field__label">{ field.label }</span> }
									{ /* field.multiline: true for real multi-paragraph fields (e.g.
									    Detail List's description). Leave unset/false for a
									    single-line-with-<br> field (e.g. its title) — matches the
									    old textarea's own "line breaks only, no separate paragraphs"
									    semantics (ACF's new_lines: "br"), and multiline="p" would
									    wrongly turn a plain Enter into a new paragraph instead. */ }
									<RichText
										identifier={ `${ row.id }-${ field.name }` }
										tagName="div"
										multiline={ field.multiline ? 'p' : undefined }
										className="cb-identityjs2026-editor-field__control"
										aria-label={ field.label }
										placeholder={ field.label }
										value={ toSafeRichTextHtml( row[ field.name ] ) }
										onChange={ ( v ) => updateRow( index, { [ field.name ]: v } ) }
									/>
									{ field.help && <p className="cb-identityjs2026-editor-field__help">{ field.help }</p> }
								</div>
							);
						}

						if ( 'radio' === field.type ) {
							return (
								<RadioControl
									key={ field.name }
									label={ field.label }
									hideLabelFromVision={ ! isColumn }
									selected={ row[ field.name ] || '' }
									options={ field.options || [] }
									onChange={ ( v ) => updateRow( index, { [ field.name ]: v } ) }
								/>
							);
						}

						if ( 'number' === field.type ) {
							return (
								<TextControl
									key={ field.name }
									type="number"
									label={ field.label }
									hideLabelFromVision={ ! isColumn }
									value={ row[ field.name ] ?? '' }
									onChange={ ( v ) => updateRow( index, { [ field.name ]: '' === v ? '' : Number( v ) } ) }
									help={ field.help }
								/>
							);
						}

						return (
							<TextControl
								key={ field.name }
								label={ field.label }
								hideLabelFromVision={ ! isColumn }
								value={ row[ field.name ] || '' }
								onChange={ ( v ) => updateRow( index, { [ field.name ]: v } ) }
								help={ field.help }
							/>
						);
					} ) }
					<div className="cb-identityjs2026-repeater-field__row-actions">
						<Button
							size="small"
							label={ __( 'Move up', 'cb-identityjs2026' ) }
							onClick={ () => moveRow( index, -1 ) }
							disabled={ 0 === index }
						>
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
						<Button
							size="small"
							isDestructive
							label={ __( 'Remove', 'cb-identityjs2026' ) }
							onClick={ () => removeRow( index ) }
						>
							&times;
						</Button>
					</div>
				</div>
			) ) }
			</div>
			<Button variant="primary" onClick={ addRow }>
				{ __( 'Add row', 'cb-identityjs2026' ) }
			</Button>
		</div>
	);
}
