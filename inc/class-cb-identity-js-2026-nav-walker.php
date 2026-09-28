<?php
/**
 * Lightweight nav walker. Outputs nav-link/dropdown-menu class names (kept
 * for familiarity) but has none of Bootstrap's navwalker complexity — no
 * linkmod/icon handling, no Bootstrap 4/5 branching. Submenus are shown via
 * dropdown-toggle buttons, which are accessible and work with keyboard navigation.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'CB_Identity_JS_2026_Nav_Walker' ) ) {

	/**
	 * Custom nav walker.
	 */
	class CB_Identity_JS_2026_Nav_Walker extends Walker_Nav_Menu {

		/**
		 * Holds the id of the submenu currently being opened, so start_lvl()
		 * can target the same id the preceding start_el() pointed its
		 * dropdown-toggle button's aria-controls at.
		 *
		 * @var string
		 */
		protected $current_submenu_id = '';

		/**
		 * Starts the list before the elements are added.
		 *
		 * @param string   $output Passed by reference.
		 * @param int      $depth  Depth of menu item.
		 * @param stdClass $args   Menu args.
		 * @return void
		 */
		public function start_lvl( &$output, $depth = 0, $args = null ) {
			$output .= '<ul class="dropdown-menu" id="' . esc_attr( $this->current_submenu_id ) . '">';
		}

		/**
		 * Ends the list after the elements are added.
		 *
		 * @param string   $output Passed by reference.
		 * @param int      $depth  Depth of menu item.
		 * @param stdClass $args   Menu args.
		 * @return void
		 */
		public function end_lvl( &$output, $depth = 0, $args = null ) {
			$output .= '</ul>';
		}

		/**
		 * Starts the element output.
		 *
		 * @param string   $output Passed by reference.
		 * @param WP_Post  $item   Menu item.
		 * @param int      $depth  Depth of menu item.
		 * @param stdClass $args   Menu args.
		 * @param int      $id     Menu item ID.
		 * @return void
		 */
		public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
			$has_children = in_array( 'menu-item-has-children', $item->classes, true );
			// A parent item highlights when any of these are present:
			// - current-menu-parent / current_page_parent — the current page
			//   itself is in this menu as a child of this item (menu
			//   hierarchy), e.g. a dropdown child is open.
			// - current-page-ancestor — the current page is NOT in this menu
			//   at all, but is a child page of this item's page in the page
			//   hierarchy. This is the live case: /about/culture/ isn't in
			//   Primary Nav, so WordPress gives About `current-page-ancestor`
			//   (dashes) and neither of the underscore-less parent classes
			//   above — confirmed via wp_nav_menu_objects logging on that
			//   URL. current-menu-ancestor covers the same gap one level
			//   deeper (grandparent via menu hierarchy).
			$is_current = in_array( 'current-menu-item', $item->classes, true )
				|| in_array( 'current-menu-parent', $item->classes, true )
				|| in_array( 'current-menu-ancestor', $item->classes, true )
				|| in_array( 'current_page_parent', $item->classes, true )
				|| in_array( 'current-page-ancestor', $item->classes, true );

			$li_classes = array( 'nav-item' );
			if ( $has_children ) {
				$li_classes[] = 'dropdown';
			}

			$output .= '<li class="' . esc_attr( implode( ' ', $li_classes ) ) . '">';

			if ( $has_children ) {
				// Dropdown parents never navigate — the whole item is the toggle.
				$this->current_submenu_id = 'dropdown-' . $item->ID;
				$toggle_classes            = array( 'nav-link', 'dropdown-toggle' );
				if ( $is_current ) {
					$toggle_classes[] = 'active';
				}
				$output .= '<button type="button" class="' . esc_attr( implode( ' ', $toggle_classes ) ) . '" aria-haspopup="true" aria-expanded="false" aria-controls="' . esc_attr( $this->current_submenu_id ) . '">';
				$output                  .= '<span>' . esc_html( $item->title ) . '</span>';
				$output                  .= '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" /></svg>';
				$output                  .= '</button>';
			} else {
				$link_classes = array( 'nav-link' );
				if ( $is_current ) {
					$link_classes[] = 'active';
				}

				// data-text duplicates the label for CSS to render an invisible
				// bold copy that reserves layout width — lets a brand change
				// font-weight on hover/current without a text reflow/layout
				// shift. Inert (no visual effect) unless a brand's own CSS
				// targets it; see src/css/site/identity.css.
				$output .= '<a class="' . esc_attr( implode( ' ', $link_classes ) ) . '" href="' . esc_url( $item->url ) . '" data-text="' . esc_attr( $item->title ) . '"';
				if ( $is_current ) {
					$output .= ' aria-current="page"';
				}
				$output .= '>' . esc_html( $item->title ) . '</a>';
			}
		}

		/**
		 * Ends the element output.
		 *
		 * @param string   $output Passed by reference.
		 * @param WP_Post  $item   Menu item.
		 * @param int      $depth  Depth of menu item.
		 * @param stdClass $args   Menu args.
		 * @return void
		 */
		public function end_el( &$output, $item, $depth = 0, $args = null ) {
			$output .= '</li>';
		}
	}
}

/**
 * Highlights the section nav item on single case_study views.
 *
 * A case_study post (e.g. /work/vodafone-wimbledon-2026/) is not a child
 * page of anything, so WordPress core never marks any menu item current
 * for it — unlike /about/culture/, where the About item at least gets
 * `current-page-ancestor`. This adds `current-menu-parent` (a class the
 * walker above already treats as current) to the menu item whose URL is
 * the CPT's own front base — i.e. Work for case_study — derived from the
 * post type's rewrite slug rather than hardcoded, so it keeps working if
 * the slug ever changes. Primary menu only; footer menus are untouched.
 *
 * Runs on wp_nav_menu_objects, which fires after core's own
 * _wp_menu_item_classes_by_context(), so core classes are already in
 * place and this only appends.
 *
 * @param WP_Post[] $items Menu items.
 * @param stdClass  $args  Menu args.
 * @return WP_Post[]
 */
function cb_identityjs2026_case_study_nav_highlight( $items, $args ) {
	if ( ! is_singular( 'case_study' ) ) {
		return $items;
	}

	if ( ! isset( $args->theme_location ) || 'primary' !== $args->theme_location ) {
		return $items;
	}

	$post_type = get_post_type_object( 'case_study' );
	$slug      = ( $post_type && ! empty( $post_type->rewrite['slug'] ) ) ? trim( (string) $post_type->rewrite['slug'], '/' ) : 'work';

	foreach ( $items as $item ) {
		// Core's own back-compat marks the posts-page item (News) with
		// `current_page_parent` on every non-page view — including CPT
		// singles, where it doesn't belong (a case study is not a blog
		// post). Strip it here so only Work highlights. Regular single
		// posts never reach this function, so their News highlight is
		// untouched.
		$item->classes = array_diff( (array) $item->classes, array( 'current_page_parent' ) );

		$item_path = isset( $item->url ) ? parse_url( $item->url, PHP_URL_PATH ) : null;
		if ( ! is_string( $item_path ) || '' === $item_path ) {
			continue;
		}

		if ( untrailingslashit( $item_path ) === '/' . $slug ) {
			$item->classes[] = 'current-menu-parent';
		}
	}

	return $items;
}
add_filter( 'wp_nav_menu_objects', 'cb_identityjs2026_case_study_nav_highlight', 10, 2 );

/**
 * Detects the current language from the request path.
 *
 * No Polylang on this install yet — the convention is a first path
 * segment of /en/ or /ar/, with the root site counting as English.
 *
 * @return string 'en' or 'ar'.
 */
function cb_identityjs2026_current_lang() {
	$path = isset( $_SERVER['REQUEST_URI'] ) ? parse_url( (string) $_SERVER['REQUEST_URI'], PHP_URL_PATH ) : '/';
	if ( is_string( $path ) && preg_match( '#^/ar(/|$)#', $path ) ) {
		return 'ar';
	}
	return 'en';
}

/**
 * Appends an EN | عربي language switcher after the last primary nav item.
 *
 * Polylang installs only — returns the menu untouched when Polylang isn't
 * active, so single-language sites never render a dead switcher.
 *
 * Single <li> reading "EN | عربي" — EN links to /en/, AR to /ar/ — with
 * `active` on the current language's link, matching the walker's own
 * active treatment (including data-text for the bold-reserve CSS).
 * Primary menu only.
 *
 * @param string   $items HTML list items.
 * @param stdClass $args  Menu args.
 * @return string
 */
function cb_identityjs2026_append_lang_switcher( $items, $args ) {
	if ( ! isset( $args->theme_location ) || 'primary' !== $args->theme_location ) {
		return $items;
	}

	if ( ! function_exists( 'pll_current_language' ) ) {
		return $items;
	}

	$current = pll_current_language();
	if ( ! is_string( $current ) || '' === $current ) {
		$current = cb_identityjs2026_current_lang();
	}

	$en_url = function_exists( 'pll_home_url' ) ? pll_home_url( 'en' ) : home_url( '/en/' );
	$ar_url = function_exists( 'pll_home_url' ) ? pll_home_url( 'ar' ) : home_url( '/ar/' );

	$en_classes = array( 'nav-link', 'nav-link-lang' );
	$ar_classes = array( 'nav-link', 'nav-link-lang' );
	if ( 'en' === $current ) {
		$en_classes[] = 'active';
	} else {
		$ar_classes[] = 'active';
	}

	$items .= '<li class="nav-item nav-item-lang">';
	$items .= '<a class="' . esc_attr( implode( ' ', $en_classes ) ) . '" href="' . esc_url( $en_url ) . '" hreflang="en" data-text="EN"';
	$items .= 'en' === $current ? ' aria-current="true"' : '';
	$items .= '>EN</a>';
	$items .= '<span class="lang-sep" aria-hidden="true">|</span>';
	$items .= '<a class="' . esc_attr( implode( ' ', $ar_classes ) ) . '" href="' . esc_url( $ar_url ) . '" hreflang="ar" lang="ar" data-text="عربي"';
	$items .= 'ar' === $current ? ' aria-current="true"' : '';
	$items .= '>عربي</a>';
	$items .= '</li>';

	return $items;
}
add_filter( 'wp_nav_menu_items', 'cb_identityjs2026_append_lang_switcher', 10, 2 );
