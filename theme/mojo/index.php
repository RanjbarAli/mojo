<?php get_header(); ?>
<main id="main" class="section"><div class="container">
<h1 class="h1"><?php echo is_search() ? esc_html( sprintf( 'Search results for “%s”', get_search_query( false ) ) ) : wp_kses_post( get_the_archive_title() ); ?></h1>
<div class="posts"><?php while ( have_posts() ) { the_post(); get_template_part( 'parts/post-card' ); } ?></div>
<?php if ( ! have_posts() ) echo '<p>No articles found.</p>'; the_posts_pagination(); ?>
</div></main>
<?php get_footer(); ?>
