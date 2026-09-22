<?php
/**
 * Footer template — identity install. Loaded via CB_SITE === 'identity',
 * same get_footer( $name ) mechanism as header-identity.php.
 *
 * Structure ported from the LIVE site's rendered DOM, not the checked-out
 * cb-identity2025/footer.php source file — the two have diverged (the file
 * has 10 columns incl. separate Work/News/Legal columns and a "Let's talk."
 * label; the live site has 5 columns, no "Let's talk.", and stacks Work/
 * News/Legal as second menus inside other columns). Trust the live DOM.
 * Menu content (footer_menu_services / _about / _identity / _global /
 * _legal) is assigned in wp-admin, not hardcoded here — see inc/setup.php
 * for the registered locations. footer_menu_media (News) is a second menu
 * stacked inside the About column, not its own column.
 *
 * [social_icons] already exists (inc/social-icons.php). [contact_email] is
 * new (inc/utilities.php), mirroring the real theme's own shortcode but
 * reading Site-Wide Settings' `email` field instead of an ACF option.
 *
 * @package cb-identityjs2026
 */

?>
</main>

<div id="footer-top"></div>

<footer class="footer pt-5 pb-4">
	<div class="id-container px-4 px-md-5">
		<div class="row pb-4 gap-4">
			<!-- 1. Email + social icons -->
			<div class="col-12 col-md-6 col-lg-4 order-9 order-md-1">
				<strong><?php echo do_shortcode( '[contact_email]' ); ?></strong>
				<?php echo do_shortcode( '[social_icons]' ); ?>
			</div>
			<!-- 2. Services, + Work/World Expo/Innovation Lab stacked below -->
			<div class="col-12 col-sm-6 col-md-4 col-lg-2 order-2 order-md-3 order-lg-2">
				<div class="footer-title mb-3"><a href="/services/"><?php esc_html_e( 'Services', 'cb-identityjs2026' ); ?></a></div>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'footer_menu_services',
						'menu_class'     => 'footer__menu',
						'fallback_cb'    => false,
					)
				);
				?>
				<div class="footer-title mt-4 mb-3"><a href="/work/"><?php esc_html_e( 'Work', 'cb-identityjs2026' ); ?></a></div>
				<div class="footer-title mb-3"><a href="/world-expo/"><?php esc_html_e( 'World Expo', 'cb-identityjs2026' ); ?></a></div>
				<div class="footer-title mb-4"><a href="/innovation/"><?php esc_html_e( 'Innovation Lab', 'cb-identityjs2026' ); ?></a></div>
			</div>
			<!-- 3. About, + News stacked below -->
			<div class="col-12 col-sm-6 col-md-4 col-lg-2 order-4 order-md-4 order-lg-3">
				<div class="footer-title mb-3"><a href="/about/"><?php esc_html_e( 'About', 'cb-identityjs2026' ); ?></a></div>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'footer_menu_about',
						'menu_class'     => 'footer__menu',
						'fallback_cb'    => false,
					)
				);
				?>
				<div class="footer-title mt-4 mb-3"><a href="/news/"><?php esc_html_e( 'News', 'cb-identityjs2026' ); ?></a></div>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'footer_menu_media',
						'menu_class'     => 'footer__menu',
						'fallback_cb'    => false,
					)
				);
				?>
			</div>
			<!-- 4. Our Brands -->
			<div class="col-12 col-sm-6 col-md-4 col-lg-2 order-1 order-md-5 order-lg-7">
				<div class="footer-title mb-3"><a href="/about/#brands"><?php esc_html_e( 'Our Brands', 'cb-identityjs2026' ); ?></a></div>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'footer_menu_identity',
						'menu_class'     => 'footer__menu',
						'fallback_cb'    => false,
					)
				);
				?>
			</div>
			<!-- 5. Locations, + Legal & info stacked below -->
			<div class="col-12 col-sm-6 col-md-4 col-lg-2 order-4 order-md-8 order-lg-9">
				<div class="footer-title mb-3"><a href="/contact/#locations"><?php esc_html_e( 'Locations', 'cb-identityjs2026' ); ?></a></div>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'footer_menu_global',
						'menu_class'     => 'footer__menu',
						'fallback_cb'    => false,
					)
				);
				?>
				<div class="footer-title mt-4 mb-3"><?php esc_html_e( 'Legal & info', 'cb-identityjs2026' ); ?></div>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'footer_menu_legal',
						'menu_class'     => 'footer__menu',
						'fallback_cb'    => false,
					)
				);
				?>
			</div>
		</div>
	</div>

	<div class="footer__logo">
		<div class="id-container py-5 px-4 px-md-5">
			<div id="footer-logo-clip" class="footer__logo-clip">
				<div id="footer-logo-inner" class="footer__logo-inner">
					<svg id="footer-logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1332.6 81.83" aria-hidden="true" focusable="false">
						<g fill="#fff">
							<g>
								<polygon points="323.44 0 0 0 0 14.97 323.44 14.97 646.85 14.97 646.85 0 323.44 0"/>
								<polygon points="0 33.42 0 48.4 323.44 48.4 646.85 48.4 646.85 33.42 323.44 33.42 0 33.42"/>
								<polygon points="0 66.84 0 81.82 323.44 81.82 646.85 81.82 646.85 66.84 323.44 66.84 0 66.84"/>
							</g>
							<g>
								<polygon points="976.96 56.99 976.96 0 994.52 0 994.52 81.83 978.97 81.83 918.43 25.21 918.43 81.83 900.87 81.83 900.87 0 916.41 0 976.96 56.99"/>
								<path d="M1251.93,0c10.14,13.09,29.99,40.55,29.99,40.55l29.64-40.55h21.04l-42.07,54.98v26.85h-17.56v-26.48L1230.53.02h21.4v-.02Z"/>
								<polygon points="1225.14 0 1225.14 14.99 1189.28 14.99 1189.28 81.83 1171.72 81.83 1171.72 14.99 1135.87 14.99 1135.87 0 1225.14 0"/>
								<polygon points="1095.29 0 1095.29 14.99 1059.44 14.98 1059.44 81.83 1041.88 81.83 1041.88 14.98 1006.03 14.98 1006.03 0 1095.29 0"/>
								<rect x="666.3" width="17.93" height="81.82"/>
								<polygon points="885.15 14.98 885.15 0 818 0 803.02 0 803.02 81.83 818 81.83 885.15 81.83 885.15 66.86 818 66.85 818 48.41 885.15 48.41 885.15 33.43 818 33.43 818 14.98 885.15 14.98"/>
								<path d="M779.16,10.7c-7.46-7.09-18.34-10.7-32.32-10.7h-43.17v81.82h43.17c28.02,0,43.46-14.55,43.46-40.97,0-12.99-3.75-23.14-11.14-30.16h0ZM721.1,15.05h24.61c8.85,0,15.58,2.08,20,6.19,4.57,4.24,6.88,10.84,6.88,19.62,0,17.44-8.8,25.92-26.89,25.92h-24.61V15.04h.01Z"/>
								<rect x="1106.8" width="17.56" height="81.82"/>
							</g>
						</g>
					</svg>
				</div>
			</div>
		</div>
	</div>

	<div class="id-container px-4 px-md-5 pt-4 footer__colophon">
		<?php esc_html_e( 'Identity Events Management Ltd, Registered Number - 04217845 | VAT Number - GB 813 0913 60', 'cb-identityjs2026' ); ?>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
