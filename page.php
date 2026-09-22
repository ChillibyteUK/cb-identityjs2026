<?php
/**
 * Page template.
 *
 * No wrapping .container here — confirmed against the real theme's own
 * page.php, which renders the_content() completely unwrapped. Each block
 * handles its own width (most opt into .container/.id-container
 * internally; a few, like Media Panel's full_width/full_bleed, deliberately
 * don't). Wrapping everything in .container here would cap every block at
 * --container-max-width regardless of what the block itself asks for —
 * exactly the bug that shipped once already in this project.
 *
 * @package cb-identityjs2026
 */

get_header( cb_identityjs2026_get_site() );
?>

<?php
while ( have_posts() ) {
	the_post();
	the_content();
}
?>

<?php
get_footer( cb_identityjs2026_get_site() );
