<a class="post" href="<?php the_permalink(); ?>">
<span class="post__img"><?php if ( has_post_thumbnail() ) { the_post_thumbnail( 'mojo-card' ); } else { ?><img src="<?php echo esc_url( get_theme_file_uri( 'assets/img/night-ride.webp' ) ); ?>" alt="" loading="lazy"><?php } ?></span>
<span class="post__meta"><?php echo esc_html( get_the_date() ); ?></span>
<h2 class="h3"><?php the_title(); ?></h2><p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 24 ) ); ?></p>
</a>
