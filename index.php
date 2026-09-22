<?php
/**
 * Fallback template.
 *
 * @package cb-identityjs2026
 */

get_header( cb_identityjs2026_get_site() );
?>

<div class="container">
	<?php
	if ( have_posts() ) {
		while ( have_posts() ) {
			the_post();
			?>
			<article <?php post_class(); ?>>
				<h1><?php the_title(); ?></h1>
				<?php the_content(); ?>
			</article>
			<?php
		}
	} else {
		?>
		<p><?php esc_html_e( 'Nothing found.', 'cb-identityjs2026' ); ?></p>
		<?php
	}
	?>
</div>

<?php
get_footer( cb_identityjs2026_get_site() );
