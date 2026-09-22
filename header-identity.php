<?php
/**
 * Header template — identity install.
 *
 * Logo is theme-specific (each brand handles it differently) — SVG ported
 * verbatim from cb-identity2025/header.php. Fixed-top navbar, no dropdowns
 * (identity's nav has none — see MULTI-BRAND.md). GA/GTM/verification/
 * custom scripts are NOT duplicated here — inc/head-tags.php already
 * handles all of that from Site-Wide Settings.
 *
 * @package cb-identityjs2026
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<script>document.documentElement.classList.add( 'js' );</script>
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<a class="visually-hidden" href="#main">Skip to content</a>
<?php wp_body_open(); ?>

<!-- HEADER-NAV:START -->
<header id="masthead" class="navbar--fixed-top">
	<nav class="navbar id-container px-4 px-md-5" aria-label="Primary navigation">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo-clip" id="site-logo-clip" aria-label="<?php esc_attr_e( 'Identity homepage', 'cb-identityjs2026' ); ?>">
			<div class="logo-inner" id="site-logo-inner">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 835.66 81.83" aria-hidden="true">
					<g fill="#fff">
						<g id="logo-bars">
							<polygon points="74.96 0 0 0 0 14.97 74.96 14.97 149.91 14.97 149.91 0 74.96 0"/>
							<polygon points="0 33.42 0 48.4 74.96 48.4 149.91 48.4 149.91 33.42 74.96 33.42 0 33.42"/>
							<polygon points="0 66.84 0 81.82 74.96 81.82 149.91 81.82 149.91 66.84 74.96 66.84 0 66.84"/>
						</g>
						<polygon points="480.02 56.98 480.02 0 497.58 0 497.58 81.82 482.03 81.82 421.49 25.2 421.49 81.82 403.93 81.82 403.93 0 419.47 0 480.02 56.98"/>
						<path d="M754.99,0c10.14,13.09,29.99,40.55,29.99,40.55L814.62,0h21.04l-42.07,54.98v26.85h-17.56v-26.48L733.59.01h21.4Z"/>
						<polygon points="728.2 0 728.2 14.98 692.34 14.98 692.34 81.82 674.78 81.82 674.78 14.98 638.93 14.98 638.93 0 728.2 0"/>
						<polygon points="598.35 0 598.35 14.98 562.5 14.97 562.5 81.82 544.94 81.82 544.94 14.97 509.09 14.97 509.09 0 598.35 0"/>
						<rect x="169.36" width="17.93" height="81.82"/>
						<polygon points="388.21 14.97 388.21 0 321.06 0 306.08 0 306.08 81.82 321.06 81.82 388.21 81.82 388.21 66.85 321.06 66.84 321.06 48.4 388.21 48.4 388.21 33.42 321.06 33.42 321.06 14.97 388.21 14.97"/>
						<path d="M282.22,10.69c-7.46-7.09-18.34-10.69-32.32-10.69h-43.17v81.82h43.17c28.02,0,43.46-14.55,43.46-40.97,0-12.99-3.75-23.14-11.14-30.16h0ZM224.16,15.04h24.61c8.85,0,15.58,2.08,20,6.19,4.57,4.24,6.88,10.84,6.88,19.62,0,17.44-8.8,25.92-26.89,25.92h-24.61V15.03h0Z"/>
						<rect x="609.86" width="17.56" height="81.82"/>
					</g>
				</svg>
			</div>
		</a>

		<button class="navbar-toggler" type="button" aria-expanded="false" aria-controls="primary-menu" aria-label="Toggle navigation">
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path d="M2 5h16M2 10h16M2 15h16" />
			</svg>
		</button>

		<div class="navbar-collapse" id="primary-menu">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'menu_class'     => 'navbar-nav',
					'container'      => false,
					'fallback_cb'    => false,
					'walker'         => new CB_Identity_JS_2026_Nav_Walker(),
				)
			);
			?>
		</div>
	</nav>
</header>
<!-- HEADER-NAV:END -->

<main id="main">
