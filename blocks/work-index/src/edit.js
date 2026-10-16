import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { ToggleControl, RadioControl, TextControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';
import PostTypePicker from '../../_shared/PostTypePicker';
import PostTypeMultiPicker from '../../_shared/PostTypeMultiPicker';

/**
 * Built from cb-work-index — see identity-global-block-spec.md's Work
 * Index entry. `source` is "all" (every case study, the original /work/
 * behaviour) or "curated" (a hand-picked, ordered list — the block-editor
 * equivalent of an ACF relationship field). Same hero, filter bar and
 * styling either way. See render.php's own header comment.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { source, caseStudies, title, subtitle, heroCaseStudy, showFilterBar, sportOnly } = attributes;
	const isCurated = 'curated' === source;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Work Index" textDomain="cb-identityjs2026">
			<TextControl
				label={ __( 'Title (H1)', 'cb-identityjs2026' ) }
				value={ title }
				onChange={ ( value ) => setAttributes( { title: value } ) }
			/>
			<TextControl
				label={ __( 'Subtitle (H2)', 'cb-identityjs2026' ) }
				value={ subtitle }
				onChange={ ( value ) => setAttributes( { subtitle: value } ) }
			/>

			<PostTypePicker
				label={ __( 'Hero Case Study', 'cb-identityjs2026' ) }
				postType="case_study"
				value={ heroCaseStudy }
				onChange={ ( id ) => setAttributes( { heroCaseStudy: id } ) }
				help={
					isCurated
						? __( 'Optional — shown above the filter bar and not repeated in the list. No hero if left empty.', 'cb-identityjs2026' )
						: __( 'Optional — defaults to the first case study by menu order.', 'cb-identityjs2026' )
				}
			/>

			<div className="cb-identityjs2026-editor-field cb-identityjs2026-radio-inline">
				<span className="cb-identityjs2026-editor-field__label">{ __( 'Display', 'cb-identityjs2026' ) }</span>
				<RadioControl
					label={ __( 'Display', 'cb-identityjs2026' ) }
					hideLabelFromVision
					selected={ source }
					options={ [
						{ label: __( 'All', 'cb-identityjs2026' ), value: 'all' },
						{ label: __( 'Curated', 'cb-identityjs2026' ), value: 'curated' },
					] }
					onChange={ ( value ) => setAttributes( { source: value } ) }
				/>
			</div>

			{ isCurated && (
				<PostTypeMultiPicker
					label={ __( 'Case Studies', 'cb-identityjs2026' ) }
					addLabel={ __( 'Add case study', 'cb-identityjs2026' ) }
					postType="case_study"
					value={ caseStudies }
					onChange={ ( ids ) => setAttributes( { caseStudies: ids } ) }
				/>
			) }

			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0%', minWidth: 0 } }>
					<ToggleControl
						label={ __( 'Show Filters', 'cb-identityjs2026' ) }
						checked={ showFilterBar }
						onChange={ ( value ) => setAttributes( { showFilterBar: value } ) }
						help={ __( 'A Service-taxonomy dropdown that filters the grid below, client-side.', 'cb-identityjs2026' ) }
					/>
				</div>
				{ ! isCurated && (
					<div style={ { flex: '1 1 0%', minWidth: 0 } }>
						<ToggleControl
							label={ __( 'Sport', 'cb-identityjs2026' ) }
							checked={ sportOnly }
							onChange={ ( value ) => setAttributes( { sportOnly: value } ) }
							help={ __( 'On: the grid shows only sports-tagged case studies (theme: Sports) — use on the Sport page. Off: sports-tagged case studies are excluded — use on the main Work page.', 'cb-identityjs2026' ) }
						/>
					</div>
				) }
			</div>
		</EditorBlockShell>
	);
}
