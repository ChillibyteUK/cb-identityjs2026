import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { ComboboxControl, Button } from '@wordpress/components';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Generic ordered multi-post picker for a block attribute holding an array
 * of post IDs — the block-editor equivalent of ACF's `relationship` field.
 * Pick posts with a search-as-you-type combobox (backed by
 * @wordpress/core-data, same as PostTypePicker), then reorder or remove
 * them in the list below. Array order is display order.
 *
 * Reuses RepeaterField's row/number/action CSS classes
 * (.cb-identityjs2026-repeater-field__*, see src/css/editor.css) rather
 * than duplicating that styling.
 *
 * @param {Object}   props
 * @param {string}   props.label       Field label.
 * @param {string}   props.postType    Post type slug to search (e.g. 'case_study').
 * @param {number[]} props.value       Selected post IDs, in display order.
 * @param {Function} props.onChange    ( ids: number[] ) => void
 * @param {string}   [props.help]      Optional help text.
 * @param {string}   [props.addLabel]  Label for the "add" combobox.
 */
export default function PostTypeMultiPicker( { label, postType, value, onChange, help, addLabel } ) {
	const ids = Array.isArray( value ) ? value : [];
	const [ search, setSearch ] = useState( '' );

	const searchResults = useSelect(
		( select ) =>
			select( coreStore ).getEntityRecords( 'postType', postType, {
				search,
				status: 'publish',
				orderby: 'title',
				order: 'asc',
				per_page: 20,
			} ),
		[ postType, search ]
	);

	// Resolve titles for the already-selected posts in one request rather
	// than per row — they won't necessarily be in the current search results.
	const selectedPosts = useSelect(
		( select ) =>
			ids.length
				? select( coreStore ).getEntityRecords( 'postType', postType, {
						include: ids,
						per_page: ids.length,
						status: 'publish',
				  } )
				: [],
		[ postType, ids.join( ',' ) ]
	);

	const titleFor = ( id ) => {
		const post = ( selectedPosts || [] ).find( ( p ) => p.id === id );
		return post ? decodeEntities( post.title?.rendered || '' ) || `#${ id }` : `#${ id }`;
	};

	const options = ( searchResults || [] )
		.filter( ( post ) => ! ids.includes( post.id ) )
		.map( ( post ) => ( { value: post.id, label: decodeEntities( post.title?.rendered || '' ) || `#${ post.id }` } ) );

	function move( index, direction ) {
		const target = index + direction;
		if ( target < 0 || target >= ids.length ) {
			return;
		}
		const next = [ ...ids ];
		[ next[ index ], next[ target ] ] = [ next[ target ], next[ index ] ];
		onChange( next );
	}

	return (
		<div className="cb-identityjs2026-editor-field cb-identityjs2026-multi-picker">
			<span className="cb-identityjs2026-editor-field__label">{ label }</span>
			{ ids.length > 0 && (
				<div className="cb-identityjs2026-repeater-field__rows">
					{ ids.map( ( id, index ) => (
						<div key={ id } className="cb-identityjs2026-repeater-field__row">
							<span className="cb-identityjs2026-repeater-field__number">{ index + 1 }</span>
							<span>{ titleFor( id ) }</span>
							<div className="cb-identityjs2026-repeater-field__row-actions">
								<Button
									size="small"
									label={ __( 'Move up', 'cb-identityjs2026' ) }
									onClick={ () => move( index, -1 ) }
									disabled={ 0 === index }
								>
									&#9650;
								</Button>
								<Button
									size="small"
									label={ __( 'Move down', 'cb-identityjs2026' ) }
									onClick={ () => move( index, 1 ) }
									disabled={ index === ids.length - 1 }
								>
									&#9660;
								</Button>
								<Button
									size="small"
									isDestructive
									label={ __( 'Remove', 'cb-identityjs2026' ) }
									onClick={ () => onChange( ids.filter( ( existing ) => existing !== id ) ) }
								>
									&times;
								</Button>
							</div>
						</div>
					) ) }
				</div>
			) }
			<ComboboxControl
				label={ addLabel || __( 'Add', 'cb-identityjs2026' ) }
				hideLabelFromVision
				value={ null }
				options={ options }
				onFilterValueChange={ ( input ) => setSearch( input ) }
				onChange={ ( id ) => {
					if ( id ) {
						onChange( [ ...ids, Number( id ) ] );
						setSearch( '' );
					}
				} }
				help={ help }
			/>
		</div>
	);
}
