<?php
/**
 * 404 template.
 *
 * @package cb-identityjs2026
 */

get_header( cb_identityjs2026_get_site() );
?>

<div class="container">
	<h1><?php echo esc_html( cb_identityjs2026_pll_string( 'Page not found' ) ); ?></h1>
	<p><?php echo esc_html( cb_identityjs2026_pll_string( 'The page you’re looking for doesn’t exist.' ) ); ?></p>
</div>

<?php
get_footer( cb_identityjs2026_get_site() );
