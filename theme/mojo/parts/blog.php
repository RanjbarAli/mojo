<?php
$term = isset( $_GET['topic'] ) && is_string( $_GET['topic'] ) ? sanitize_title( wp_unslash( $_GET['topic'] ) ) : '';
$search = isset( $_GET['journal_search'] ) && is_string( $_GET['journal_search'] ) ? sanitize_text_field( wp_unslash( $_GET['journal_search'] ) ) : '';
$num = max( 1, absint( $_GET['journal_page'] ?? 1 ) );
$journal = new WP_Query( array( 'post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => 9, 'paged' => $num, 'category_name' => $term, 's' => $search, 'ignore_sticky_posts' => true ) );
$url = mojo_url( 'blog' );
?>
<section class="phead"><div class="phead__img"><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'blog', 'image_assets_img_night_ride_webp' ) ) ); ?>" alt=""></div>
<div class="container phead__in"><a class="crumbs" href="<?php echo esc_url( home_url( '/' ) ); ?>">Home / Journal</a><h1 class="h1"><?php echo esc_html( mojo_field( 'blog', 'the_mojo_journal' ) ); ?></h1><p class="lead"><?php echo esc_html( is_page() && has_excerpt() ? get_the_excerpt() : mojo_field( 'blog', 'introduction' ) ); ?></p></div></section>
<section class="section"><div class="container">
<div class="blog-tools"><div class="tabs"><a class="tab" href="<?php echo esc_url( $url ); ?>">All</a>
<?php foreach ( get_categories() as $cat ) : ?><a class="tab" href="<?php echo esc_url( add_query_arg( 'topic', $cat->slug, $url ) ); ?>"><?php echo esc_html( $cat->name ); ?></a><?php endforeach; ?></div>
<form class="search" action="<?php echo esc_url( $url ); ?>" method="get">
<?php if ( ! get_option( 'permalink_structure' ) ) : ?><input type="hidden" name="page_id" value="<?php echo absint( mojo_page_id( 'blog' ) ); ?>"><?php endif; ?>
<input type="hidden" name="topic" value="<?php echo esc_attr( $term ); ?>"><input class="input" type="search" name="journal_search" aria-label="Search articles" placeholder="Search articles" value="<?php echo esc_attr( $search ); ?>"></form></div>
<div class="posts"><?php while ( $journal->have_posts() ) { $journal->the_post(); get_template_part( 'parts/post-card' ); } ?></div>
<?php if ( ! $journal->found_posts ) echo '<p>No articles found.</p>'; ?>
<nav class="pager" aria-label="Pagination"><?php echo wp_kses_post( paginate_links( array( 'base' => str_replace( '999999', '%#%', add_query_arg( 'journal_page', 999999, $url ) ), 'format' => '', 'current' => $num, 'total' => $journal->max_num_pages, 'add_args' => array( 'topic' => $term, 'journal_search' => $search ) ) ) ); ?></nav>
</div></section><?php wp_reset_postdata(); ?>
