<?php
$layout = $args['layout'] ?? mojo_view();
if ( 'entry' === $layout || ( is_page() && post_password_required() ) ) {
	require get_template_directory() . '/singular.php';
	return;
}
get_header();
?>
<main id="main">
<?php get_template_part( 'parts/' . $layout ); ?>
<?php if ( is_page() && ! post_password_required() && get_post_field( 'post_content', get_queried_object_id() ) && ( ! get_post_meta( get_queried_object_id(), '_elementor_edit_mode', true ) || get_post_meta( get_queried_object_id(), '_mojo_classic_content', true ) ) ) : ?>
<section class="section"><div class="container mojo-entry"><?php while ( have_posts() ) { the_post(); the_content(); } ?></div></section>
<?php endif; ?>
</main>
<?php get_footer(); ?>
