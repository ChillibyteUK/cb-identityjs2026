import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { TextControl, TextareaControl, SelectControl, Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import EditorBlockShell from '../../_shared/EditorBlockShell';

/**
 * Built from About Page Header (and its siblings — Innovation Header,
 * Region Page Header, identity's Service Page Header, the header portion of
 * Culture Page Header) — see identity-global-block-spec.md's Page Header
 * entry. This first pass is built and verified against the About page
 * specifically; `title` renders as a plain multi-line H1 there (confirmed
 * live — no animated split-title markup exists in that instance's DOM).
 *
 * The block has two distinct output regions, grouped visually below to
 * match: the top header (title/intro/background), and an optional
 * secondary panel underneath it (plain text or a pull-quote, never both).
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		title,
		introText,
		animatedTitle,
		secondaryPanelType,
		secondaryText,
		quote,
		quoteAuthor,
		quoteCompany,
		backgroundId,
	} = attributes;
	const blockProps = useBlockProps( { className: 'container cb-identityjs2026-editor-block' } );
	const backgroundUrl = useBackgroundUrl( backgroundId );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="CB Page Header" textDomain="cb-identityjs2026">
			<SectionHeading>{ __( 'Header', 'cb-identityjs2026' ) }</SectionHeading>

			<TextareaControl
				label={ __( 'Title', 'cb-identityjs2026' ) }
				value={ title }
				help={ __( 'Renders as the page\'s plain <h1> — one line per row. Ignored if Animated Title below is set.', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { title: value } ) }
			/>

			<TextControl
				label={ __( 'Animated Title', 'cb-identityjs2026' ) }
				value={ animatedTitle }
				help={ __( 'Optional — takes over from Title above with a split-line animated treatment instead of plain text.', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { animatedTitle: value } ) }
			/>

			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Intro Text', 'cb-identityjs2026' ) }</label>
				<RichText
					tagName="div"
					multiline="p"
					className="cb-identityjs2026-editor-field__control"
					aria-label={ __( 'Intro Text', 'cb-identityjs2026' ) }
					placeholder={ __( 'Intro Text', 'cb-identityjs2026' ) }
					value={ introText }
					onChange={ ( value ) => setAttributes( { introText: value } ) }
				/>
				<p className="cb-identityjs2026-editor-field__help">{ __( 'Paragraph(s) shown under the title.', 'cb-identityjs2026' ) }</p>
			</div>

			<div className="cb-identityjs2026-editor-field">
				<label className="cb-identityjs2026-editor-field__label">{ __( 'Background', 'cb-identityjs2026' ) }</label>
				<MediaUploadCheck>
					<MediaUpload
						onSelect={ ( media ) => setAttributes( { backgroundId: media.id } ) }
						allowedTypes={ [ 'image' ] }
						value={ backgroundId }
						render={ ( { open } ) => (
							<div className="cb-identityjs2026-editor-field__control">
								{ backgroundUrl && (
									<img
										src={ backgroundUrl }
										alt=""
										style={ { maxWidth: '200px', display: 'block', marginBottom: '8px' } }
									/>
								) }
								<Button variant="secondary" onClick={ open }>
									{ backgroundUrl ? __( 'Replace Background', 'cb-identityjs2026' ) : __( 'Select Background', 'cb-identityjs2026' ) }
								</Button>
							</div>
						) }
					/>
				</MediaUploadCheck>
				<p className="cb-identityjs2026-editor-field__help">{ __( 'Full-bleed photo behind the whole header, with a dark tint over it.', 'cb-identityjs2026' ) }</p>
			</div>

			<SectionHeading>{ __( 'Secondary Panel', 'cb-identityjs2026' ) }</SectionHeading>

			<SelectControl
				label={ __( 'Type', 'cb-identityjs2026' ) }
				value={ secondaryPanelType }
				options={ [
					{ label: 'None', value: 'none' },
					{ label: 'Text', value: 'text' },
					{ label: 'Quote', value: 'quote' },
				] }
				help={ __( 'An optional second panel below the header — plain text, a pull-quote, or nothing.', 'cb-identityjs2026' ) }
				onChange={ ( value ) => setAttributes( { secondaryPanelType: value } ) }
			/>

			{ secondaryPanelType === 'text' && (
				<div className="cb-identityjs2026-editor-field">
					<label className="cb-identityjs2026-editor-field__label">{ __( 'Secondary Text', 'cb-identityjs2026' ) }</label>
					<RichText
						tagName="div"
						multiline="p"
						className="cb-identityjs2026-editor-field__control"
						aria-label={ __( 'Secondary Text', 'cb-identityjs2026' ) }
						placeholder={ __( 'Secondary Text', 'cb-identityjs2026' ) }
						value={ secondaryText }
						onChange={ ( value ) => setAttributes( { secondaryText: value } ) }
					/>
				</div>
			) }

			{ secondaryPanelType === 'quote' && (
				<>
					<TextareaControl
						label={ __( 'Quote', 'cb-identityjs2026' ) }
						value={ quote }
						onChange={ ( value ) => setAttributes( { quote: value } ) }
					/>
					<div style={ { display: 'flex', flexWrap: 'wrap', gap: '12px' } }>
						<div style={ { flex: '50 1 0%' } }>
							<TextControl
								label={ __( 'Quote Author', 'cb-identityjs2026' ) }
								value={ quoteAuthor }
								onChange={ ( value ) => setAttributes( { quoteAuthor: value } ) }
							/>
						</div>
						<div style={ { flex: '50 1 0%' } }>
							<TextControl
								label={ __( 'Quote Company', 'cb-identityjs2026' ) }
								value={ quoteCompany }
								onChange={ ( value ) => setAttributes( { quoteCompany: value } ) }
							/>
						</div>
					</div>
				</>
			) }
		</EditorBlockShell>
	);
}

/**
 * Resolves an attachment ID to its full-size URL via core-data, instead of
 * storing a separate `backgroundUrl` attribute that only gets populated
 * inside MediaUpload's own onSelect callback — that dual-attribute
 * approach broke the preview the moment backgroundId was set any other way
 * (a test script, a programmatic block insert), since backgroundUrl just
 * stayed empty. This can't go stale the same way: it's derived, not stored.
 *
 * @param {number} id Attachment ID, or 0/falsy for none.
 */
function useBackgroundUrl( id ) {
	return useSelect(
		( select ) => {
			if ( ! id ) {
				return '';
			}
			const media = select( coreStore ).getMedia( id );
			return media?.source_url || '';
		},
		[ id ]
	);
}

/**
 * A small labelled divider between this block's two output regions — the
 * top header vs. the optional secondary panel below it — so the field list
 * reads as two grouped sections instead of one flat list with no
 * indication of which fields feed which part of the output.
 *
 * Needs its own opaque background: the selected block's own highlight
 * colour (WordPress's default `is-selected` grey) shows through in the
 * gap this heading's margin creates, since — unlike the surrounding field
 * controls, which each paint their own white background/border — a bare
 * heading with just a bottom border doesn't cover the space above it.
 */
function SectionHeading( { children } ) {
	return (
		<h3
			style={ {
				position: 'relative',
				margin: 0,
				padding: '20px 0 12px',
				background: '#fff',
				borderBottom: '1px solid #ddd',
				fontSize: '11px',
				fontWeight: 700,
				letterSpacing: '0.05em',
				textTransform: 'uppercase',
				color: '#50575e',
			} }
		>
			{ children }
		</h3>
	);
}
