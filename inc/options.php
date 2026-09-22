<?php
/**
 * Site-Wide Settings page — plain Settings API, one array option
 * (cb_identityjs2026_site_settings). Replaces the old ACF options page; read
 * values elsewhere in the theme with cb_identityjs2026_get_setting( $key ).
 *
 * The Icons tab (SVG upload straight into img/icons/) from the ACF version
 * of this page is deliberately not ported here — deferred to a future
 * plugin rather than rebuilt as part of dropping ACF.
 *
 * Includes field types beyond plain text/email/url inputs — `textarea`/
 * `code` (multi-line values, e.g. a pasted vendor script), `checkbox`,
 * `gallery` (a fixed multi-image list, e.g. an accreditation badge row) and
 * `repeater` (genuinely repeating structured rows, e.g. a client-logo
 * list) — plus a generic tabs pattern once there are enough sections to
 * make one long scrolling page unwieldy. The Scripts tab's three raw markup
 * slots (`custom_head`, `custom_body_open`, `custom_body_close`), gated by
 * `custom_scripts_logged_out_only`, are printed unescaped by design — see
 * inc/head-tags.php. `logos` is a real per-project field (feeds the CB Logo
 * Slider block's Site-Wide logo source). `example_repeater` is still a
 * placeholder demonstrating the repeater field type end to end; rename or
 * replace it with a real per-project field.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

/**
 * Option name for the single serialized settings array.
 *
 * @var string
 */
define( 'CB_IDENTITYJS2026_SETTINGS_OPTION', 'cb_identityjs2026_site_settings' );

/**
 * Read one Site-Wide Settings value.
 *
 * @param string $key     Setting key, e.g. 'ga_property'.
 * @param string $default Fallback if the key isn't set.
 * @return string
 */
function cb_identityjs2026_get_setting( $key, $default = '' ) {
	$settings = get_option( CB_IDENTITYJS2026_SETTINGS_OPTION, array() );
	return isset( $settings[ $key ] ) && '' !== $settings[ $key ] ? $settings[ $key ] : $default;
}

/**
 * Register the settings page, section, and fields.
 *
 * @return void
 */
function cb_identityjs2026_register_settings_page() {
	add_menu_page(
		'Site-Wide Settings',
		'Site-Wide Settings',
		'edit_posts',
		'theme-general-settings',
		'cb_identityjs2026_render_settings_page',
		'dashicons-admin-generic',
		80
	);

	register_setting( 'cb_identityjs2026_settings', CB_IDENTITYJS2026_SETTINGS_OPTION );

	add_settings_section( 'cb_identityjs2026_general', 'General', '__return_false', 'theme-general-settings' );
	add_settings_section( 'cb_identityjs2026_social', 'Social', '__return_false', 'theme-general-settings' );
	add_settings_section( 'cb_identityjs2026_tracking', 'Tracking & Verification', '__return_false', 'theme-general-settings' );
	add_settings_section( 'cb_identityjs2026_scripts', 'Scripts', '__return_false', 'theme-general-settings' );
	add_settings_section( 'cb_identityjs2026_gallery', 'Logos', '__return_false', 'theme-general-settings' );
	add_settings_section( 'cb_identityjs2026_ctas', 'CTAs', '__return_false', 'theme-general-settings' );
	add_settings_section( 'cb_identityjs2026_repeater', 'Repeater', '__return_false', 'theme-general-settings' );

	$fields = array(
		'email'                     => array(
			'label'   => 'Email',
			'type'    => 'email',
			'section' => 'cb_identityjs2026_general',
		),
		'phone'                     => array(
			'label'   => 'Phone',
			'type'    => 'text',
			'section' => 'cb_identityjs2026_general',
		),
		'linkedin_url'              => array(
			'label'       => 'LinkedIn URL',
			'type'        => 'url',
			'section'     => 'cb_identityjs2026_social',
			'placeholder' => 'https://linkedin.com/company/...',
			'description' => 'Leave blank to hide this icon from [social_icons].',
		),
		'instagram_url'             => array(
			'label'       => 'Instagram URL',
			'type'        => 'url',
			'section'     => 'cb_identityjs2026_social',
			'placeholder' => 'https://instagram.com/...',
			'description' => 'Leave blank to hide this icon from [social_icons].',
		),
		'ga_property'               => array(
			'label'       => 'GA Property',
			'type'        => 'text',
			'section'     => 'cb_identityjs2026_tracking',
			'placeholder' => 'G-XXXXXXX',
			'description' => 'Google Analytics measurement ID. Only fires for logged-out visitors.',
		),
		'gtm_property'              => array(
			'label'       => 'GTM Property',
			'type'        => 'text',
			'section'     => 'cb_identityjs2026_tracking',
			'placeholder' => 'GTM-XXXXXXX',
			'description' => 'Google Tag Manager container ID. Only fires for logged-out visitors.',
		),
		'google_site_verification'  => array(
			'label'       => 'Google Site Verification',
			'type'        => 'text',
			'section'     => 'cb_identityjs2026_tracking',
			'description' => 'Content value of the google-site-verification meta tag.',
		),
		'bing_site_verification'    => array(
			'label'       => 'Bing Site Verification',
			'type'        => 'text',
			'section'     => 'cb_identityjs2026_tracking',
			'description' => 'Content value of the msvalidate.01 meta tag.',
		),
		'custom_head'               => array(
			'label'       => 'Head',
			'type'        => 'code',
			'section'     => 'cb_identityjs2026_scripts',
			'description' => 'Printed in <head> after the managed GA/GTM tags. Paste vendor snippets verbatim, <script> tags and all — nothing is escaped or filtered.',
		),
		'custom_body_open'          => array(
			'label'       => 'Body Open',
			'type'        => 'code',
			'section'     => 'cb_identityjs2026_scripts',
			'description' => 'Printed immediately after <body> opens, after the GTM noscript fallback. Where <noscript> tracking pixels belong.',
		),
		'custom_body_close'         => array(
			'label'       => 'Body Close',
			'type'        => 'code',
			'section'     => 'cb_identityjs2026_scripts',
			'description' => 'Printed just before </body>. Use for anything that must not block rendering — chat widgets, late-loading embeds.',
		),
		'custom_scripts_logged_out_only' => array(
			'label'       => 'Logged-Out Visitors Only',
			'type'        => 'checkbox',
			'section'     => 'cb_identityjs2026_scripts',
			'default'     => '1',
			'description' => 'On by default, matching GA/GTM — keeps the team\'s own traffic out of whatever these scripts measure. Untick if a slot holds something every visitor should see, e.g. a chat widget.',
		),
		'logos'                     => array(
			'label'       => 'Logos',
			'type'        => 'gallery',
			'section'     => 'cb_identityjs2026_gallery',
			'description' => 'Used in the CB Logo Slider block when its Logo Source is set to Site-Wide. Read with cb_identityjs2026_get_gallery_setting( \'logos\' ).',
		),
		'ctas'                      => array(
			'label'       => 'CTAs',
			'type'        => 'repeater',
			'section'     => 'cb_identityjs2026_ctas',
			'sub_fields'  => array(
				'cta_id'      => array(
					'label' => 'CTA ID',
					'type'  => 'text',
					'width' => '160px',
				),
				'title'       => array(
					'label' => 'Title',
					'type'  => 'textarea',
				),
				'content'     => array(
					'label' => 'Content',
					'type'  => 'textarea',
				),
				'link_url'    => array(
					'label' => 'Link URL',
					'type'  => 'text',
					'width' => '260px',
				),
				'link_text'   => array(
					'label' => 'Link Text',
					'type'  => 'text',
					'width' => '200px',
				),
				'link_target' => array(
					'label' => 'New Tab',
					'type'  => 'checkbox',
				),
				'background'  => array(
					'label' => 'Background',
					'type'  => 'image',
				),
				'image'       => array(
					'label' => 'Image',
					'type'  => 'image',
				),
			),
		),
		'example_repeater'          => array(
			'label'       => 'Example Repeater',
			'type'        => 'repeater',
			'section'     => 'cb_identityjs2026_repeater',
			'sub_fields'  => array(
				'name' => array(
					'label' => 'Name',
					'type'  => 'text',
				),
				'logo' => array(
					'label' => 'Logo',
					'type'  => 'image',
				),
			),
			'description' => 'Genuinely repeating structured rows — e.g. a client-logo list. Read with cb_identityjs2026_get_repeater_setting( \'example_repeater\' ).',
		),
	);

	foreach ( $fields as $key => $field ) {
		add_settings_field(
			$key,
			$field['label'],
			'cb_identityjs2026_render_settings_field',
			'theme-general-settings',
			$field['section'],
			array_merge( $field, array( 'key' => $key ) )
		);
	}
}
add_action( 'admin_menu', 'cb_identityjs2026_register_settings_page' );

/**
 * Read a `repeater`-type setting as an array of row arrays.
 *
 * WordPress's Settings API stores whatever nested array structure the form
 * posts (no sanitize_callback is registered — see register_setting() above),
 * so rows survive as-is; this just guards the case where the key was never
 * set at all.
 *
 * @param string $key Setting key, e.g. 'example_repeater'.
 * @return array[]
 */
function cb_identityjs2026_get_repeater_setting( $key ) {
	$rows = cb_identityjs2026_get_setting( $key, array() );
	return is_array( $rows ) ? $rows : array();
}

/**
 * Read a `gallery`-type setting as an array of attachment IDs.
 *
 * Stored as a CSV string (see cb_identityjs2026_render_gallery_field()) —
 * this reverses that back into an int array for front-end use.
 *
 * @param string $key Setting key, e.g. 'logos'.
 * @return int[]
 */
function cb_identityjs2026_get_gallery_setting( $key ) {
	return array_filter( array_map( 'absint', explode( ',', cb_identityjs2026_get_setting( $key ) ) ) );
}

/**
 * Look up one row from the `ctas` repeater by its `cta_id`.
 *
 * Falls back to the first configured CTA when `$cta_id` is empty or doesn't
 * match any row — same fallback the real cb-cta.php block uses, so a CTA
 * block never renders completely empty just because its choice wasn't set.
 *
 * @param string $cta_id CTA ID to look up.
 * @return array|null The matching row, the first row as a fallback, or null if no CTAs exist at all.
 */
function cb_identityjs2026_get_cta( $cta_id ) {
	$ctas = cb_identityjs2026_get_repeater_setting( 'ctas' );

	if ( ! $ctas ) {
		return null;
	}

	if ( $cta_id ) {
		foreach ( $ctas as $cta ) {
			if ( isset( $cta['cta_id'] ) && $cta['cta_id'] === $cta_id ) {
				return $cta;
			}
		}
	}

	return reset( $ctas );
}

/**
 * Enqueue the media modal and settings-page admin scripts, settings page only.
 *
 * @param string $hook_suffix Current admin page hook.
 * @return void
 */
function cb_identityjs2026_settings_page_assets( $hook_suffix ) {
	if ( 'toplevel_page_theme-general-settings' !== $hook_suffix ) {
		return;
	}

	wp_enqueue_media();
	wp_enqueue_script(
		'cb-identityjs2026-gallery-field',
		get_stylesheet_directory_uri() . '/js/gallery-field.js',
		array( 'jquery' ),
		wp_get_theme()->get( 'Version' ),
		true
	);
	wp_enqueue_script(
		'cb-identityjs2026-settings-repeater',
		get_stylesheet_directory_uri() . '/js/repeater-field.js',
		array( 'jquery' ),
		wp_get_theme()->get( 'Version' ),
		true
	);
	wp_enqueue_script(
		'cb-identityjs2026-tabs',
		get_stylesheet_directory_uri() . '/js/tabs.js',
		array(),
		wp_get_theme()->get( 'Version' ),
		true
	);
}
add_action( 'admin_enqueue_scripts', 'cb_identityjs2026_settings_page_assets' );

/**
 * Render a single settings field — text/email/url input, a textarea, a
 * gallery picker, or a generic repeater.
 *
 * @param array $args Field args: key, type, placeholder, description.
 * @return void
 */
function cb_identityjs2026_render_settings_field( $args ) {
	if ( 'gallery' === $args['type'] ) {
		cb_identityjs2026_render_gallery_field( $args );
		return;
	}

	if ( 'repeater' === $args['type'] ) {
		cb_identityjs2026_render_repeater_field( $args );
		return;
	}

	if ( 'textarea' === $args['type'] || 'code' === $args['type'] ) {
		cb_identityjs2026_render_textarea_field( $args );
		return;
	}

	if ( 'checkbox' === $args['type'] ) {
		cb_identityjs2026_render_checkbox_field( $args );
		return;
	}

	$value = cb_identityjs2026_get_setting( $args['key'] );
	?>
	<input
		type="<?php echo esc_attr( $args['type'] ); ?>"
		id="<?php echo esc_attr( $args['key'] ); ?>"
		name="<?php echo esc_attr( CB_IDENTITYJS2026_SETTINGS_OPTION ); ?>[<?php echo esc_attr( $args['key'] ); ?>]"
		value="<?php echo esc_attr( $value ); ?>"
		placeholder="<?php echo esc_attr( $args['placeholder'] ?? '' ); ?>"
		class="regular-text"
	>
	<?php
	if ( ! empty( $args['description'] ) ) {
		?>
		<p class="description"><?php echo esc_html( $args['description'] ); ?></p>
		<?php
	}
}

/**
 * Render a `textarea`- or `code`-type field — for multi-line values like a
 * postal address or a pasted vendor script. `<input type="textarea">` is not
 * a real input type (browsers silently degrade it to a single-line
 * `type="text"`), so this needs its own branch rather than falling through to
 * the generic input above.
 *
 * `code` differs only in presentation — monospace, no spellcheck/autocorrect,
 * and taller by default. The stored value is a plain string either way;
 * nothing here decides whether it's escaped on output, that's the caller's
 * job (see inc/head-tags.php, which prints the script slots verbatim).
 *
 * @param array $args Field args: key, type, placeholder, rows, description.
 * @return void
 */
function cb_identityjs2026_render_textarea_field( $args ) {
	$value   = cb_identityjs2026_get_setting( $args['key'] );
	$is_code = 'code' === $args['type'];
	?>
	<textarea
		id="<?php echo esc_attr( $args['key'] ); ?>"
		name="<?php echo esc_attr( CB_IDENTITYJS2026_SETTINGS_OPTION ); ?>[<?php echo esc_attr( $args['key'] ); ?>]"
		placeholder="<?php echo esc_attr( $args['placeholder'] ?? '' ); ?>"
		rows="<?php echo (int) ( $args['rows'] ?? ( $is_code ? 10 : 4 ) ); ?>"
		class="large-text"
		<?php if ( $is_code ) : ?>
		spellcheck="false"
		autocapitalize="off"
		autocomplete="off"
		style="font-family: Consolas, Monaco, monospace; font-size: 12px; white-space: pre; overflow-wrap: normal; overflow-x: auto;"
		<?php endif; ?>
	><?php echo esc_textarea( $value ); ?></textarea>
	<?php
	if ( ! empty( $args['description'] ) ) {
		?>
		<p class="description"><?php echo esc_html( $args['description'] ); ?></p>
		<?php
	}
}

/**
 * Render a `checkbox`-type field.
 *
 * An unticked checkbox posts nothing at all, which is indistinguishable from
 * "never saved" — so a paired hidden input submits '0' first and the checkbox
 * overwrites it with '1' when ticked. That's what makes a default-on checkbox
 * possible: absent means genuinely-never-saved (fall back to `default`),
 * '0' means deliberately unticked.
 *
 * Note this only works because cb_identityjs2026_get_setting() treats '' as
 * unset but returns '0' as-is — and '0' is falsey in PHP, so callers can just
 * test the returned value.
 *
 * @param array $args Field args: key, label, default, description.
 * @return void
 */
function cb_identityjs2026_render_checkbox_field( $args ) {
	$value = cb_identityjs2026_get_setting( $args['key'], $args['default'] ?? '0' );
	$name  = sprintf( '%s[%s]', CB_IDENTITYJS2026_SETTINGS_OPTION, $args['key'] );
	?>
	<input type="hidden" name="<?php echo esc_attr( $name ); ?>" value="0">
	<label>
		<input
			type="checkbox"
			id="<?php echo esc_attr( $args['key'] ); ?>"
			name="<?php echo esc_attr( $name ); ?>"
			value="1"
			<?php checked( '1', $value ); ?>
		>
		<?php echo esc_html( $args['checkbox_label'] ?? 'Enabled' ); ?>
	</label>
	<?php
	if ( ! empty( $args['description'] ) ) {
		?>
		<p class="description"><?php echo esc_html( $args['description'] ); ?></p>
		<?php
	}
}

/**
 * Render a `gallery`-type field — a hidden CSV-of-IDs input plus a
 * thumbnail strip, driven by the core media modal in multi-select mode.
 * Initial order is the media-modal selection order; after that, each
 * thumbnail is HTML5-draggable (see js/gallery-field.js) to reorder without
 * reopening the picker — dragging updates both the DOM order and the
 * hidden input's CSV value.
 *
 * @param array $args Field args: key, description.
 * @return void
 */
function cb_identityjs2026_render_gallery_field( $args ) {
	$ids = array_filter( array_map( 'absint', explode( ',', cb_identityjs2026_get_setting( $args['key'] ) ) ) );
	?>
	<div class="cb-identityjs2026-gallery-field">
		<input
			type="hidden"
			id="<?php echo esc_attr( $args['key'] ); ?>"
			name="<?php echo esc_attr( CB_IDENTITYJS2026_SETTINGS_OPTION ); ?>[<?php echo esc_attr( $args['key'] ); ?>]"
			value="<?php echo esc_attr( implode( ',', $ids ) ); ?>"
		>
		<ul class="cb-identityjs2026-gallery-field__preview" style="display: flex; flex-wrap: wrap; gap: 8px; padding: 0; margin: 0 0 8px; list-style: none;">
			<?php
			foreach ( $ids as $id ) {
				$thumb = wp_get_attachment_image_src( $id, 'thumbnail' );
				if ( ! $thumb ) {
					continue;
				}
				?>
				<li draggable="true" data-id="<?php echo esc_attr( $id ); ?>" style="cursor: grab;"><img src="<?php echo esc_url( $thumb[0] ); ?>" alt="" style="width: 80px; height: 80px; object-fit: contain; background: #fff; border: 1px solid #ccc; pointer-events: none;"></li>
				<?php
			}
			?>
		</ul>
		<?php if ( ! empty( $ids ) ) : ?>
			<p class="description" style="margin-top: -4px;"><?php esc_html_e( 'Drag thumbnails to reorder.', 'cb-identityjs2026' ); ?></p>
		<?php endif; ?>
		<p>
			<button type="button" class="button cb-identityjs2026-gallery-field__select">Select Images</button>
			<button type="button" class="button cb-identityjs2026-gallery-field__clear">Clear</button>
		</p>
	</div>
	<?php
	if ( ! empty( $args['description'] ) ) {
		?>
		<p class="description"><?php echo esc_html( $args['description'] ); ?></p>
		<?php
	}
}

/**
 * Render a generic repeater field — rows of declaratively-configured
 * sub-fields (text or image), driven by js/repeater-field.js for add/
 * remove/reorder and per-row image selection.
 *
 * Row indexes in submitted field names don't need to be sequential — the
 * Settings API stores whatever nested array PHP builds from the posted
 * field names, and PHP preserves array insertion (= form field submission
 * = DOM) order regardless of the actual key values, so JS reordering rows
 * in the DOM is enough; nothing needs renumbering.
 *
 * @param array $args Field args: key, sub_fields, description.
 * @return void
 */
function cb_identityjs2026_render_repeater_field( $args ) {
	$key        = $args['key'];
	$sub_fields = $args['sub_fields'];
	$rows       = cb_identityjs2026_get_repeater_setting( $key );
	?>
	<div class="cb-identityjs2026-settings-repeater" data-repeater-key="<?php echo esc_attr( $key ); ?>">
		<div class="cb-identityjs2026-settings-repeater__rows">
			<?php
			$number = 0;
			foreach ( $rows as $index => $row ) {
				++$number;
				echo cb_identityjs2026_render_repeater_row( $key, $index, $sub_fields, $row, $number ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped internally.
			}
			?>
		</div>
		<template class="cb-identityjs2026-settings-repeater__template">
			<?php echo cb_identityjs2026_render_repeater_row( $key, '__INDEX__', $sub_fields, array(), 0 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped internally. ?>
		</template>
		<p>
			<button type="button" class="button button-primary cb-identityjs2026-settings-repeater__add-row">Add row</button>
		</p>
	</div>
	<?php
	if ( ! empty( $args['description'] ) ) {
		?>
		<p class="description"><?php echo esc_html( $args['description'] ); ?></p>
		<?php
	}
}

/**
 * Render one repeater row's markup. Shared between already-saved rows and
 * the empty `<template>` row js/repeater-field.js clones for "Add row".
 *
 * @param string     $key        Repeater setting key.
 * @param int|string $index      Row index, or the literal '__INDEX__' placeholder.
 * @param array      $sub_fields Sub-field config: [ name => [ label, type ] ].
 * @param array      $row        Existing row values, keyed by sub-field name.
 * @param int        $number     1-based display position — purely visual, unrelated
 *                                to $index; js/repeater-field.js keeps it in sync
 *                                with DOM order after any add/remove/move.
 * @return string
 */
function cb_identityjs2026_render_repeater_row( $key, $index, $sub_fields, $row, $number ) {
	ob_start();
	?>
	<div class="cb-identityjs2026-settings-repeater__row" style="border: 1px solid #ccc; padding: 16px; margin-bottom: 12px; background: #fff;">
		<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
			<span
				class="cb-identityjs2026-settings-repeater__number"
				style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #f0f0f1; font-size: 12px; font-weight: 600; color: #50575e;"
			><?php echo (int) $number; ?></span>
			<div class="cb-identityjs2026-settings-repeater__row-actions" style="display: flex; gap: 4px;">
				<button type="button" class="button cb-identityjs2026-settings-repeater__move-up" title="Move up">&#9650;</button>
				<button type="button" class="button cb-identityjs2026-settings-repeater__move-down" title="Move down">&#9660;</button>
				<button type="button" class="button cb-identityjs2026-settings-repeater__remove-row" title="Remove">&times;</button>
			</div>
		</div>
		<div style="display: flex; flex-wrap: wrap; gap: 12px;">
			<?php
			foreach ( $sub_fields as $sub_key => $sub_field ) {
				$name  = sprintf( '%s[%s][%s][%s]', CB_IDENTITYJS2026_SETTINGS_OPTION, $key, $index, $sub_key );
				$value = $row[ $sub_key ] ?? '';
				// Each field is a labelled block that wraps onto its own line
				// once its basis no longer fits — a "card" of stacked fields,
				// not a single wide row that needs horizontal scrolling.
				$basis = ! empty( $sub_field['width'] ) ? $sub_field['width'] : '200px';
				if ( 'textarea' === $sub_field['type'] ) {
					$basis = '100%'; // always its own full-width line
				}
				?>
			<div style="flex: 1 1 <?php echo esc_attr( $basis ); ?>; min-width: 0;">
				<label style="display: block; font-size: 11px; font-weight: 600; color: #1d2327; margin-bottom: 4px;"><?php echo esc_html( $sub_field['label'] ); ?></label>
				<?php if ( 'image' === $sub_field['type'] ) : ?>
					<?php $thumb = $value ? wp_get_attachment_image_src( absint( $value ), 'thumbnail' ) : false; ?>
				<div
					class="cb-identityjs2026-settings-repeater__image"
					style="position: relative; width: 64px; height: 64px; background: #fff; border: 1px solid #ccc;"
				>
					<img
						src="<?php echo $thumb ? esc_url( $thumb[0] ) : ''; ?>"
						alt=""
						style="width: 100%; height: 100%; object-fit: contain; display: <?php echo $thumb ? 'block' : 'none'; ?>;"
					>
					<input
						type="hidden"
						class="cb-identityjs2026-settings-repeater__image-input"
						name="<?php echo esc_attr( $name ); ?>"
						value="<?php echo esc_attr( $value ); ?>"
					>
					<div style="position: absolute; inset: auto 0 0 0; display: flex; background: rgba(0, 0, 0, 0.6);">
						<button
							type="button"
							class="cb-identityjs2026-settings-repeater__select-image"
							data-select-label="Select <?php echo esc_attr( $sub_field['label'] ); ?>"
							title="<?php echo esc_attr( ( $thumb ? 'Replace ' : 'Select ' ) . $sub_field['label'] ); ?>"
							style="flex: 1; background: none; border: none; color: #fff; cursor: pointer; padding: 2px 0; font-size: 11px; line-height: 1;"
						>&#9998;</button>
						<button
							type="button"
							class="cb-identityjs2026-settings-repeater__clear-image"
							title="Clear"
							style="flex: 1; background: none; border: none; color: #fff; cursor: pointer; padding: 2px 0; font-size: 13px; line-height: 1; <?php echo $thumb ? '' : 'display: none;'; ?>"
						>&times;</button>
					</div>
				</div>
				<?php elseif ( 'textarea' === $sub_field['type'] ) : ?>
				<textarea
					class="large-text"
					style="width: 100%; height: 60px;"
					aria-label="<?php echo esc_attr( $sub_field['label'] ); ?>"
					name="<?php echo esc_attr( $name ); ?>"
				><?php echo esc_textarea( $value ); ?></textarea>
				<?php elseif ( 'checkbox' === $sub_field['type'] ) : ?>
				<label style="display: flex; align-items: center; gap: 4px; height: 28px;">
					<input
						type="checkbox"
						aria-label="<?php echo esc_attr( $sub_field['label'] ); ?>"
						name="<?php echo esc_attr( $name ); ?>"
						value="1"
						<?php checked( '1', $value ); ?>
					>
					<?php esc_html_e( 'Yes', 'cb-identityjs2026' ); ?>
				</label>
				<?php else : ?>
				<input
					type="text"
					class="regular-text"
					style="width: 100%;"
					aria-label="<?php echo esc_attr( $sub_field['label'] ); ?>"
					name="<?php echo esc_attr( $name ); ?>"
					value="<?php echo esc_attr( $value ); ?>"
				>
				<?php endif; ?>
			</div>
				<?php
			}
			?>
		</div>
	</div>
	<?php
	return ob_get_clean();
}

/**
 * Settings page HTML — one tab per registered section, using
 * js/tabs.js's generic [data-tabs] contract (see that file's docblock)
 * rather than anything Settings-API-specific, so the same markup pattern
 * can be reused wherever tabs are next needed, including a future
 * block-editor equivalent.
 *
 * Replaces do_settings_sections() with a manual per-section loop — that
 * function always renders every section for a page in one continuous flow,
 * with no way to render one section at a time into its own tab panel.
 *
 * @return void
 */
function cb_identityjs2026_render_settings_page() {
	global $wp_settings_sections;

	$sections = $wp_settings_sections['theme-general-settings'] ?? array();
	?>
	<div class="wrap">
		<h1>Site-Wide Settings</h1>
		<form action="options.php" method="post">
			<?php settings_fields( 'cb_identityjs2026_settings' ); ?>
			<div class="cb-identityjs2026-tabs" data-tabs>
				<h2 class="nav-tab-wrapper" data-tabs-nav>
					<?php
					$is_first = true;
					foreach ( $sections as $section_id => $section ) {
						$class = 'nav-tab' . ( $is_first ? ' nav-tab-active' : '' );
						?>
					<a href="#" class="<?php echo esc_attr( $class ); ?>" data-tabs-target="<?php echo esc_attr( $section_id ); ?>"><?php echo esc_html( $section['title'] ); ?></a>
						<?php
						$is_first = false;
					}
					?>
				</h2>
				<?php
				$is_first = true;
				foreach ( $sections as $section_id => $section ) {
					?>
				<div class="cb-identityjs2026-tabs__panel" data-tabs-panel="<?php echo esc_attr( $section_id ); ?>" style="padding-top: 20px;" <?php echo $is_first ? '' : 'hidden'; ?>>
					<?php
					if ( is_callable( $section['callback'] ) ) {
						call_user_func( $section['callback'], $section );
					}
					?>
					<table class="form-table" role="presentation">
						<?php do_settings_fields( 'theme-general-settings', $section_id ); ?>
					</table>
				</div>
					<?php
					$is_first = false;
				}
				?>
			</div>
			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}
