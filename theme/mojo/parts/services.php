<section class="phead">
    <div class="phead__img"><?php if ( is_page() && has_post_thumbnail() ) { the_post_thumbnail( 'full', array( 'fetchpriority' => 'high' ) ); } else { ?><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'services', 'image_assets_img_masters_2_webp' ) ) ); ?>" alt=""><?php } ?></div>
    <div class="container phead__in">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="<?php echo esc_url( mojo_url( 'home' ) ); ?>">Home</a><i data-lucide="chevron-right"></i><span>Programs</span></nav>
      <h1 class="h1"><?php echo esc_html( mojo_field( 'services', 'programs' ) ); ?></h1>
      <p class="lead"><?php echo esc_html( is_page() && has_excerpt() ? get_the_excerpt() : mojo_field( 'services', 'introduction' ) ); ?></p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="blog-tools">
        <div class="tabs" data-tabs id="svcTabs" role="tablist">
          <span class="tabs__ind" aria-hidden="true"></span>
          <button class="tab" role="tab" data-value="all" aria-selected="true"><i data-lucide="layout-grid"></i><?php echo esc_html( mojo_field( 'services', 'all' ) ); ?> <span class="count" data-c="all"></span></button>
          <button class="tab" role="tab" data-value="riding" aria-selected="false"><i data-lucide="graduation-cap"></i><?php echo esc_html( mojo_field( 'services', 'riding' ) ); ?> <span class="count" data-c="riding"></span></button>
          <button class="tab" role="tab" data-value="training" aria-selected="false"><i data-lucide="trophy"></i><?php echo esc_html( mojo_field( 'services', 'training' ) ); ?> <span class="count" data-c="training"></span></button>
          <button class="tab" role="tab" data-value="leisure" aria-selected="false"><i data-lucide="coffee"></i><?php echo esc_html( mojo_field( 'services', 'leisure' ) ); ?> <span class="count" data-c="leisure"></span></button>
        </div>
        <div class="search">
          <div class="control"><i data-lucide="search" class="lead-ico"></i><input class="input" id="svcSearch" type="search" placeholder="Search programs" aria-label="Search programs"></div>
        </div>
      </div>
      <div class="svc-grid" id="svcGrid"></div>
      <div class="empty" id="svcEmpty">
        <span class="ico"><i data-lucide="search"></i></span>
        <b><?php echo esc_html( mojo_field( 'services', 'no_programs_match_your_search' ) ); ?></b>
        <button class="btn btn--sm btn--ghost" id="svcReset"><span class="btn__icon"><i data-lucide="rotate-ccw"></i></span><span class="btn__label"><?php echo esc_html( mojo_field( 'services', 'clear_filters' ) ); ?></span></button>
      </div>
    </div>
  </section>

  <section class="section section--sky">
    <div class="container">
      <div class="head"><span class="eyebrow"><?php echo esc_html( mojo_field( 'services', 'how_it_works' ) ); ?></span><h2 class="h2"><?php echo esc_html( mojo_field( 'services', 'three_easy_steps' ) ); ?></h2></div>
      <div class="feats" data-reveal="stagger" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
        <div class="feat"><span class="ico"><i data-lucide="mouse-pointer-click"></i></span><h3 class="h3"><?php echo esc_html( mojo_field( 'services', '1_choose' ) ); ?></h3><p><?php echo esc_html( mojo_field( 'services', 'pick_a_program_or_ask_us_which_fits_your_level' ) ); ?></p></div>
        <div class="feat"><span class="ico"><i data-lucide="calendar-check"></i></span><h3 class="h3"><?php echo esc_html( mojo_field( 'services', '2_book' ) ); ?></h3><p><?php echo esc_html( mojo_field( 'services', 'select_a_date_and_time_that_suits_you_saturday_to_thursday' ) ); ?></p></div>
        <div class="feat"><span class="ico"><i data-lucide="trophy"></i></span><h3 class="h3"><?php echo esc_html( mojo_field( 'services', '3_ride' ) ); ?></h3><p><?php echo esc_html( mojo_field( 'services', 'meet_your_coach_and_horse_helmets_and_gear_provided' ) ); ?></p></div>
      </div>
      <div class="flex wrap gap-1 mt-4">
        <a class="btn btn--lg" href="<?php echo esc_url( mojo_url( 'booking' ) ); ?>"><span class="btn__icon"><i data-lucide="calendar-check"></i></span><span class="btn__label"><?php echo esc_html( mojo_field( 'services', 'book_a_lesson' ) ); ?></span></a>
        <a class="btn btn--lg btn--ghost" href="<?php echo esc_url( mojo_url( 'contact' ) ); ?>"><span class="btn__icon"><i data-lucide="message-circle"></i></span><span class="btn__label"><?php echo esc_html( mojo_field( 'services', 'ask_a_coach' ) ); ?></span></a>
      </div>
    </div>
  </section>
