<?php get_header(); ?>
<main id="main" class="section"><div class="container mojo-entry">
<?php while ( have_posts() ) : the_post(); ?>
<article <?php post_class(); ?>>
<h1 class="h1"><?php the_title(); ?></h1>
<?php if ( is_single() ) : ?><p><?php echo esc_html( get_the_date() ); ?></p><?php endif; ?>
<?php the_post_thumbnail( 'large' ); the_content(); wp_link_pages(); ?>
</article>
<?php endwhile; ?>
</div></main>
<?php get_footer(); ?>
