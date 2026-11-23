<!-- HERO — cinematic full-screen; photo shrinks into a frame on scroll -->
  <section class="hc" id="hero">
    <div class="hc__media" id="hcMedia">
      <?php if ( is_page() && has_post_thumbnail() ) { the_post_thumbnail( 'full', array( 'fetchpriority' => 'high' ) ); } else { ?><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'home', 'image_assets_img_masters_2_webp' ) ) ); ?>" alt="Rider clearing a fence in Mojo's international arena" fetchpriority="high"><?php } ?>
    </div>
    <div class="container hc__in" id="hcIn">
      <span class="hc__chip" data-hero-in><span class="live-dot" id="liveDot"></span><span id="liveStatus"><?php echo esc_html( mojo_field( 'home', 'open' ) ); ?></span><span class="hc__sep"></span><?php echo esc_html( mojo_field( 'home', 'barka_oman' ) ); ?></span>
      <h1 class="hc__title" id="heroTitle"><?php echo esc_html( mojo_field( 'home', 'ride_with' ) ); ?> <em><?php echo esc_html( mojo_field( 'home', 'mojo' ) ); ?></em></h1>
      <p class="hc__lead" data-hero-in><?php echo esc_html( is_page() && has_excerpt() ? get_the_excerpt() : mojo_field( 'home', 'introduction' ) ); ?></p>
      <div class="hero__ctas hc__ctas" data-hero-in>
        <a class="btn btn--lg" href="<?php echo esc_url( mojo_url( 'booking' ) ); ?>"><span class="btn__icon"><i data-lucide="calendar-check"></i></span><span class="btn__label"><?php echo esc_html( mojo_field( 'home', 'book_a_lesson' ) ); ?></span></a>
        <a class="btn btn--lg btn--ghost" href="<?php echo esc_url( mojo_url( 'services' ) ); ?>"><span class="btn__label"><?php echo esc_html( mojo_field( 'home', 'explore_programs' ) ); ?></span><span class="btn__icon"><i data-lucide="arrow-right"></i></span></a>
      </div>
    </div>
    <span class="hc__cap" id="hcCap"><i data-lucide="trophy"></i><?php echo esc_html( mojo_field( 'home', 'home_of_oman_masters_csi_1' ) ); ?></span>
    <a class="hc__scroll" href="#disciplines" aria-label="Scroll to programs"><span><?php echo esc_html( mojo_field( 'home', 'scroll' ) ); ?></span><i data-lucide="chevron-down"></i></a>
  </section>

  <!-- DISCIPLINES — bento -->
  <section class="section section--sky" id="disciplines">
    <div class="container">
      <div class="head head--row">
        <div class="head" style="margin:0"><span class="eyebrow"><?php echo esc_html( mojo_field( 'home', 'programs' ) ); ?></span><h2 class="h2"><?php echo esc_html( mojo_field( 'home', 'choose_your_discipline' ) ); ?></h2></div>
        <a class="link-arrow" href="<?php echo esc_url( mojo_url( 'services' ) ); ?>"><?php echo esc_html( mojo_field( 'home', 'all_programs' ) ); ?> <i data-lucide="arrow-right"></i></a>
      </div>
      <?php get_template_part( 'parts/disciplines' ); ?>
    </div>
  </section>

  <!-- ABOUT / FACILITY (kept) -->
  <section class="section section--white">
    <div class="container split">
      <div class="collage" id="collage">
        <figure class="c1"><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'home', 'image_assets_img_night_ride_webp' ) ) ); ?>" alt="Riders in the floodlit arena" loading="lazy"></figure>
        <figure class="c2"><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'home', 'image_assets_img_stable_lamp_webp' ) ) ); ?>" alt="Horse looking out of a wooden stable" loading="lazy"></figure>
        <figure class="c3"><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'home', 'image_assets_img_young_rider_webp' ) ) ); ?>" alt="Young rider at Mojo" loading="lazy"></figure>
      </div>
      <div data-reveal>
        <span class="eyebrow"><?php echo esc_html( mojo_field( 'home', 'about_us' ) ); ?></span>
        <h2 class="h2 mt-2"><?php echo esc_html( mojo_field( 'home', 'built_around_the_horse' ) ); ?></h2>
        <p class="lead mt-2"><?php echo esc_html( mojo_field( 'home', 'floodlit_arenas_airy_stables_and_coaches_with_international_show_' ) ); ?></p>
        <ul class="checks">
          <li><i data-lucide="circle-check"></i><span><?php echo esc_html( mojo_field( 'home', 'show_jumping_dressage_for_every_level' ) ); ?></span></li>
          <li><i data-lucide="circle-check"></i><span><?php echo esc_html( mojo_field( 'home', 'safe_well_schooled_horses_for_beginners' ) ); ?></span></li>
          <li><i data-lucide="circle-check"></i><span><?php echo esc_html( mojo_field( 'home', 'young_horse_starting_horse_leasing' ) ); ?></span></li>
        </ul>
        <div class="stats">
          <div class="stat"><b><span data-count="<?php echo esc_attr( mojo_field( 'home', 'horses_count' ) ); ?>"><?php echo esc_attr( mojo_field( 'home', 'horses_count' ) ); ?></span><span class="accent">+</span></b><span><?php echo esc_html( mojo_field( 'home', 'horses' ) ); ?></span></div>
          <div class="stat"><b><span data-count="<?php echo esc_attr( mojo_field( 'home', 'national_riders_hosted_count' ) ); ?>"><?php echo esc_attr( mojo_field( 'home', 'national_riders_hosted_count' ) ); ?></span><span class="accent">+</span></b><span><?php echo esc_html( mojo_field( 'home', 'national_riders_hosted' ) ); ?></span></div>
          <div class="stat"><b><span data-count="<?php echo esc_attr( mojo_field( 'home', 'milestone_seasons_count' ) ); ?>"><?php echo esc_attr( mojo_field( 'home', 'milestone_seasons_count' ) ); ?></span></b><span><?php echo esc_html( mojo_field( 'home', 'milestone_seasons' ) ); ?></span></div>
          <div class="stat"><b><span data-count="<?php echo esc_attr( mojo_field( 'home', 'days_a_week_count' ) ); ?>"><?php echo esc_attr( mojo_field( 'home', 'days_a_week_count' ) ); ?></span><span class="accent"><?php echo esc_html( mojo_field( 'home', '7' ) ); ?></span></b><span><?php echo esc_html( mojo_field( 'home', 'days_a_week' ) ); ?></span></div>
        </div>
        <div class="flex wrap gap-1 mt-3">
          <a class="btn" href="<?php echo esc_url( mojo_url( 'about' ) ); ?>"><span class="btn__label"><?php echo esc_html( mojo_field( 'home', 'our_story' ) ); ?></span><span class="btn__icon"><i data-lucide="arrow-right"></i></span></a>
          <a class="btn btn--ghost" href="<?php echo esc_url( mojo_url( 'contact' ) ); ?>"><span class="btn__icon"><i data-lucide="map-pin"></i></span><span class="btn__label"><?php echo esc_html( mojo_field( 'home', 'visit_us' ) ); ?></span></a>
        </div>
      </div>
    </div>
  </section>

  <!-- ACHIEVEMENTS — results board -->
  <section class="section section--sky">
    <div class="container">
      <div class="head head--row">
        <div class="head" style="margin:0"><span class="eyebrow"><?php echo esc_html( mojo_field( 'home', 'achievements' ) ); ?></span><h2 class="h2"><?php echo esc_html( mojo_field( 'home', 'our_milestones' ) ); ?></h2></div>
        <a class="btn btn--ghost" href="<?php echo esc_url( mojo_url( 'events' ) ); ?>"><span class="btn__icon"><i data-lucide="trophy"></i></span><span class="btn__label"><?php echo esc_html( mojo_field( 'home', 'see_events' ) ); ?></span></a>
      </div>
      <div class="board" id="board" role="table" aria-label="Achievements">
        <div class="board__head" role="row"><span><?php echo esc_html( mojo_field( 'home', 'pos' ) ); ?></span><span><?php echo esc_html( mojo_field( 'home', 'season' ) ); ?></span><span></span><span><?php echo esc_html( mojo_field( 'home', 'milestone' ) ); ?></span><span><?php echo esc_html( mojo_field( 'home', 'result' ) ); ?></span></div>
      </div>
    </div>
  </section>

  <!-- GALLERY (kept) -->
  <section class="section section--white">
    <div class="container">
      <div class="head head--row">
        <div class="head" style="margin:0"><span class="eyebrow"><?php echo esc_html( mojo_field( 'home', 'highlights' ) ); ?></span><h2 class="h2"><?php echo esc_html( mojo_field( 'home', 'moments_from_the_arena' ) ); ?></h2></div>
        <a class="link-arrow" href="<?php echo esc_url( mojo_field( 'contact', 'instagram' ) ); ?>" target="_blank" rel="noopener"><?php echo esc_html( mojo_field( 'home', 'instagram' ) ); ?> <i data-lucide="arrow-up-right"></i></a>
      </div>
      <div class="gallery" id="gallery"></div>
    </div>
  </section>

  <!-- COACH (kept) -->
  <section class="section section--sky">
    <div class="container coach">
      <div class="coach__img" data-reveal><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'home', 'image_assets_img_coach_webp' ) ) ); ?>" alt="Coach Mohammed Gouda" loading="lazy"></div>
      <div data-reveal>
        <span class="eyebrow"><?php echo esc_html( mojo_field( 'home', 'key_staff' ) ); ?></span>
        <h2 class="h2 mt-2"><?php echo esc_html( mojo_field( 'home', 'coach_mohammed_gouda' ) ); ?></h2>
        <div class="roles mt-2"><span class="chip chip--teal"><i data-lucide="crown"></i><?php echo esc_html( mojo_field( 'home', 'general_manager' ) ); ?></span><span class="chip"><i data-lucide="target"></i><?php echo esc_html( mojo_field( 'home', 'training_manager' ) ); ?></span></div>
        <p class="lead mt-2"><?php echo esc_html( mojo_field( 'home', 'leading_mojo_s_coaching_team_and_training_programmes_from_first_l' ) ); ?></p>
        <img class="coach__sig" src="<?php echo esc_url( mojo_media_url( mojo_field( 'home', 'image_assets_img_signature_png' ) ) ); ?>" alt="Signature of Mohammed Gouda" loading="lazy">
        <div class="flex wrap gap-1 mt-2">
          <a class="btn btn--ink" href="<?php echo esc_url( mojo_url( 'booking' ) ); ?>"><span class="btn__icon"><i data-lucide="calendar-check"></i></span><span class="btn__label"><?php echo esc_html( mojo_field( 'home', 'train_with_us' ) ); ?></span></a>
          <a class="btn btn--ghost" href="<?php echo esc_url( mojo_field( 'contact', 'whatsapp' ) ); ?>" target="_blank" rel="noopener"><span class="btn__icon"><i data-lucide="message-circle"></i></span><span class="btn__label"><?php echo esc_html( mojo_field( 'home', 'message' ) ); ?></span></a>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="section section--white">
    <div class="container faq2">
      <div class="faq2__side">
        <span class="eyebrow"><?php echo esc_html( mojo_field( 'home', 'faq' ) ); ?></span>
        <h2 class="h2"><?php echo esc_html( mojo_field( 'home', 'before_your_first_ride' ) ); ?></h2>
        <a class="askpill" href="<?php echo esc_url( mojo_field( 'contact', 'whatsapp' ) ); ?>" target="_blank" rel="noopener" data-reveal>
          <img src="<?php echo esc_url( mojo_media_url( mojo_field( 'home', 'image_assets_img_coach_webp' ) ) ); ?>" alt="" loading="lazy"><span><?php echo esc_html( mojo_field( 'home', 'still_curious_ask_us' ) ); ?></span><span class="go"><i data-lucide="message-circle"></i></span>
        </a>
      </div>
      <div class="acc2" data-acc id="faq"></div>
    </div>
  </section>

  <!-- PARTNERS — logo loop -->
  <section class="logos-sec" aria-label="Partners and sponsors">
    <div class="logos" id="sponsors"></div>
  </section>

  <!-- DEMO — full-bleed photo + form -->
  <section class="demo3" id="demo">
    <div class="demo3__img"><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'home', 'image_assets_img_pony_webp' ) ) ); ?>" alt="" loading="lazy"></div>
    <div class="container demo3__in">
      <div class="demo3__side">
        <span class="eyebrow"><?php echo esc_html( mojo_field( 'home', 'join_today' ) ); ?></span>
        <h2 class="h2" style="color:#fff"><?php echo esc_html( mojo_field( 'home', 'book_a_free_demo' ) ); ?></h2>
        <ol class="dsteps" id="dsteps">
          <li><span class="dsteps__n"><?php echo esc_html( mojo_field( 'home', '1' ) ); ?></span><div><b><?php echo esc_html( mojo_field( 'home', 'tell_us_about_you' ) ); ?></b><span><?php echo esc_html( mojo_field( 'home', 'takes_under_a_minute' ) ); ?></span></div></li>
          <li><span class="dsteps__n"><?php echo esc_html( mojo_field( 'home', '2' ) ); ?></span><div><b><?php echo esc_html( mojo_field( 'home', 'we_call_you_back' ) ); ?></b><span><?php echo esc_html( mojo_field( 'home', 'within_one_working_day' ) ); ?></span></div></li>
          <li><span class="dsteps__n"><?php echo esc_html( mojo_field( 'home', '3' ) ); ?></span><div><b><?php echo esc_html( mojo_field( 'home', 'your_first_ride' ) ); ?></b><span><?php echo esc_html( mojo_field( 'home', 'helmet_gear_provided' ) ); ?></span></div></li>
        </ol>
      </div>
      <form class="demo3__form form" id="demoForm" novalidate>
        <div class="form__row form__row--2">
          <div class="field">
            <label class="label" for="dName">Full name</label>
            <div class="control"><i data-lucide="user" class="lead-ico"></i><input class="input" id="dName" name="name" autocomplete="name" placeholder="Your name" data-rules="required|min:3" data-letters><span class="state-ico"></span></div>
          </div>
          <div class="field">
            <label class="label" for="dPhone">Phone</label>
            <div class="control phone" data-phone data-default="OM"><input class="input" id="dPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" data-rules="required|phone"><span class="state-ico"></span></div>
          </div>
        </div>
        <div class="field">
          <span class="label">I'm interested in</span>
          <div class="choices">
            <label class="choice"><input type="radio" name="interest" value="riding" checked><span><i data-lucide="graduation-cap"></i>Riding school</span></label>
            <label class="choice"><input type="radio" name="interest" value="jumping"><span><i data-lucide="trophy"></i>Show jumping</span></label>
            <label class="choice"><input type="radio" name="interest" value="dressage"><span><i data-lucide="sparkles"></i>Dressage</span></label>
            <label class="choice"><input type="radio" name="interest" value="kids"><span><i data-lucide="baby"></i>Kids</span></label>
          </div>
        </div>
        <div class="field">
          <span class="label">Riding experience</span>
          <div class="choices">
            <label class="choice"><input type="radio" name="level" value="none" data-rules="required"><span>Never ridden</span></label>
            <label class="choice"><input type="radio" name="level" value="some" data-rules="required"><span>A few times</span></label>
            <label class="choice"><input type="radio" name="level" value="regular" data-rules="required"><span>Regular rider</span></label>
          </div>
        </div>
        <label class="switch"><input type="checkbox" name="whatsapp" checked><span class="switch__track"></span><span>Contact me on WhatsApp</span></label>
        <button class="btn btn--lg btn--block" type="submit" data-loading="Sending request" data-success="Request sent"><span class="btn__icon"><i data-lucide="send"></i></span><span class="btn__label">Request free demo</span></button>
      </form>
    </div>
  </section>
