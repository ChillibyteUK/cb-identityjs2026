<?php
/**
 * Template Name: Text Page
 *
 * Built from cb-identity2025/page-templates/text-page.php (also present,
 * evolved for multi-brand, in cb-identitygroup2026's own copy) — a plain
 * WYSIWYG page: a title bar followed by the_content() styled for
 * long-form legal/policy copy (lede paragraph, h2 section rules). No
 * Content Builder blocks involved; this predates this theme's own block
 * system and is still the real template Privacy Policy/Modern Slavery
 * pages use on both legacy sites. See src/css/text-page.css for the
 * scoped styling.
 *
 * @package cb-identityjs2026
 */

defined( 'ABSPATH' ) || exit;

get_header( cb_identityjs2026_get_site() );
?>

<main id="main" class="text-page">
	<div class="text-page__title">
		<div class="id-container">
			<h1 class="text-page__title-heading"><?php echo esc_html( get_the_title() ); ?></h1>
		</div>
	</div>
	<div class="id-container">
		<div class="text-page__content">
			<?php
			while ( have_posts() ) {
				the_post();
				the_content();
			}
			?>
		</div>
	</div>
</main>

<?php
get_footer( cb_identityjs2026_get_site() );
