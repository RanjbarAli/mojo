<section class="phead">
    <div class="phead__img"><?php if ( is_page() && has_post_thumbnail() ) { the_post_thumbnail( 'full', array( 'fetchpriority' => 'high' ) ); } else { ?><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'about', 'image_assets_img_sponsors_day_webp' ) ) ); ?>" alt=""><?php } ?></div>
    <div class="container phead__in">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="<?php echo esc_url( mojo_url( 'home' ) ); ?>">Home</a><i data-lucide="chevron-right"></i><span>About</span></nav>
      <h1 class="h1"><?php echo esc_html( mojo_field( 'about', 'about_mojo' ) ); ?></h1>
      <p class="lead"><?php echo esc_html( is_page() && has_excerpt() ? get_the_excerpt() : mojo_field( 'about', 'introduction' ) ); ?></p>
    </div>
  </section>

  <!-- STORY -->
  <section class="section section--white">
    <div class="container">
      <div class="ab-story">
        <div class="ab-story__head">
          <span class="eyebrow"><?php echo esc_html( mojo_field( 'about', 'our_story' ) ); ?></span>
          <h2 class="h2"><?php echo esc_html( mojo_field( 'about', 'riding_done_properly' ) ); ?></h2>
        </div>
        <div class="ab-story__body" data-reveal>
          <p class="lead"><?php echo esc_html( mojo_field( 'about', 'mojo_began_with_a_simple_idea_give_riders_in_oman_a_place_to_lear' ) ); ?></p>
          <p class="muted"><?php echo esc_html( mojo_field( 'about', 'today_we_teach_show_jumping_dressage_and_riding_school_lessons_fo' ) ); ?></p>
          <ul class="ab-facts">
            <li><b><?php echo esc_html( mojo_field( 'about', '20' ) ); ?></b><span><?php echo esc_html( mojo_field( 'about', 'horses' ) ); ?></span></li>
            <li><b><?php echo esc_html( mojo_field( 'about', 'csi_1' ) ); ?></b><span><?php echo esc_html( mojo_field( 'about', 'international_venue' ) ); ?></span></li>
            <li><b><?php echo esc_html( mojo_field( 'about', '6_7' ) ); ?></b><span><?php echo esc_html( mojo_field( 'about', 'days_a_week' ) ); ?></span></li>
          </ul>
        </div>
      </div>
      <div class="ab-strip" id="abStrip">
        <figure><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'about', 'image_assets_img_arena_jump_webp' ) ) ); ?>" alt="Rider clearing a fence in the arena" loading="lazy"></figure>
        <figure><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'about', 'image_assets_img_stable_lamp_webp' ) ) ); ?>" alt="Horse looking out of a wooden stable" loading="lazy"></figure>
        <figure><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'about', 'image_assets_img_young_rider_webp' ) ) ); ?>" alt="Young rider at Mojo" loading="lazy"></figure>
      </div>
    </div>
  </section>

  <!-- PILLARS -->
  <section class="section">
    <div class="container ab-pillars">
      <figure class="ab-pillars__img" id="abPillarImg"><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'about', 'image_assets_img_care_webp' ) ) ); ?>" alt="Rider and coach with a horse" loading="lazy"></figure>
      <div class="ab-pillars__body">
        <span class="eyebrow"><?php echo esc_html( mojo_field( 'about', 'what_makes_us_different' ) ); ?></span>
        <h2 class="h2"><?php echo esc_html( mojo_field( 'about', 'four_things_we_never_compromise' ) ); ?></h2>
        <ol class="ab-pillars__list" data-reveal="stagger">
          <li><span class="ab-num"><?php echo esc_html( mojo_field( 'about', '01' ) ); ?></span><div><h3 class="h3"><?php echo esc_html( mojo_field( 'about', 'horse_first' ) ); ?></h3><p><?php echo esc_html( mojo_field( 'about', 'welfare_routine_and_fair_training_in_every_decision' ) ); ?></p></div></li>
          <li><span class="ab-num"><?php echo esc_html( mojo_field( 'about', '02' ) ); ?></span><div><h3 class="h3"><?php echo esc_html( mojo_field( 'about', 'safety' ) ); ?></h3><p><?php echo esc_html( mojo_field( 'about', 'certified_equipment_and_calm_horses_matched_to_each_rider' ) ); ?></p></div></li>
          <li><span class="ab-num"><?php echo esc_html( mojo_field( 'about', '03' ) ); ?></span><div><h3 class="h3"><?php echo esc_html( mojo_field( 'about', 'expert_coaching' ) ); ?></h3><p><?php echo esc_html( mojo_field( 'about', 'trainers_with_national_and_international_show_experience' ) ); ?></p></div></li>
          <li><span class="ab-num"><?php echo esc_html( mojo_field( 'about', '04' ) ); ?></span><div><h3 class="h3"><?php echo esc_html( mojo_field( 'about', 'community' ) ); ?></h3><p><?php echo esc_html( mojo_field( 'about', 'families_riders_and_friends_welcome_in_the_arena_and_caf' ) ); ?></p></div></li>
        </ol>
      </div>
    </div>
  </section>

  <!-- FACILITIES -->
  <section class="section section--white">
    <div class="container">
      <div class="head head--row">
        <div class="head" style="margin:0"><span class="eyebrow"><?php echo esc_html( mojo_field( 'about', 'facilities' ) ); ?></span><h2 class="h2"><?php echo esc_html( mojo_field( 'about', 'inside_mojo' ) ); ?></h2></div>
        <a class="link-arrow" href="<?php echo esc_url( mojo_url( 'contact' ) ); ?>"><?php echo esc_html( mojo_field( 'about', 'plan_a_visit' ) ); ?> <i data-lucide="arrow-right"></i></a>
      </div>
      <div class="ab-fac" data-reveal="stagger">
        <figure><span class="ab-fac__img"><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'about', 'image_assets_img_masters_3_webp' ) ) ); ?>" alt="Competition arena" loading="lazy"></span><figcaption><b><?php echo esc_html( mojo_field( 'about', 'competition_arena' ) ); ?></b><span><?php echo esc_html( mojo_field( 'about', 'floodlit_international_standard_footing' ) ); ?></span></figcaption></figure>
        <figure><span class="ab-fac__img"><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'about', 'image_assets_img_stall_webp' ) ) ); ?>" alt="Stable" loading="lazy"></span><figcaption><b><?php echo esc_html( mojo_field( 'about', 'stables' ) ); ?></b><span><?php echo esc_html( mojo_field( 'about', 'spacious_ventilated_daily_turnout' ) ); ?></span></figcaption></figure>
        <figure><span class="ab-fac__img"><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'about', 'image_assets_img_cafe_webp' ) ) ); ?>" alt="Mojo café" loading="lazy"></span><figcaption><b><?php echo esc_html( mojo_field( 'about', 'restaurant_caf' ) ); ?></b><span><?php echo esc_html( mojo_field( 'about', 'indoor_outdoor_seating_by_the_arena' ) ); ?></span></figcaption></figure>
        <figure><span class="ab-fac__img"><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'about', 'image_assets_img_theory_webp' ) ) ); ?>" alt="Classroom" loading="lazy"></span><figcaption><b><?php echo esc_html( mojo_field( 'about', 'classroom' ) ); ?></b><span><?php echo esc_html( mojo_field( 'about', 'theory_horsemanship_sessions' ) ); ?></span></figcaption></figure>
      </div>
    </div>
  </section>

  <!-- MILESTONES -->
  <section class="section">
    <div class="container">
      <div class="head"><span class="eyebrow"><?php echo esc_html( mojo_field( 'about', 'milestones' ) ); ?></span><h2 class="h2"><?php echo esc_html( mojo_field( 'about', 'our_journey_so_far' ) ); ?></h2></div>
      <div class="ab-tl" id="abTl">
        <span class="ab-tl__line"><i id="abTlFill"></i></span>
        <?php foreach ( mojo_content( 'achievements' ) as $milestone ) : ?>
        <div class="ab-tl__item"><span class="ab-tl__dot"></span><time><?php echo esc_html( $milestone['year'] ); ?></time><h3 class="h3"><?php echo esc_html( $milestone['title'] ); ?></h3><p><?php echo esc_html( $milestone['text'] ); ?></p></div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- TEAM -->
  <section class="section section--white">
    <div class="container ab-team">
      <figure class="ab-team__img"><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'about', 'image_assets_img_coach_webp' ) ) ); ?>" alt="Mohammed Gouda" loading="lazy"></figure>
      <div class="ab-team__body" data-reveal>
        <span class="eyebrow"><?php echo esc_html( mojo_field( 'about', 'leadership' ) ); ?></span>
        <h2 class="h2"><?php echo esc_html( mojo_field( 'about', 'mohammed_gouda' ) ); ?></h2>
        <div class="roles"><span class="chip chip--teal"><i data-lucide="crown"></i><?php echo esc_html( mojo_field( 'about', 'general_manager' ) ); ?></span><span class="chip"><i data-lucide="target"></i><?php echo esc_html( mojo_field( 'about', 'training_manager' ) ); ?></span></div>
        <p class="lead"><?php echo esc_html( mojo_field( 'about', 'oversees_mojo_s_coaching_team_horse_training_and_competition_prog' ) ); ?></p>
        <img class="coach__sig" src="<?php echo esc_url( mojo_media_url( mojo_field( 'about', 'image_assets_img_signature_png' ) ) ); ?>" alt="Signature of Mohammed Gouda" loading="lazy">
        <div class="flex wrap gap-1">
          <a class="btn" href="<?php echo esc_url( mojo_url( 'booking' ) ); ?>"><span class="btn__icon"><i data-lucide="calendar-check"></i></span><span class="btn__label"><?php echo esc_html( mojo_field( 'about', 'train_with_us' ) ); ?></span></a>
          <a class="btn btn--ghost" href="<?php echo esc_url( mojo_url( 'contact' ) ); ?>"><span class="btn__icon"><i data-lucide="message-circle"></i></span><span class="btn__label"><?php echo esc_html( mojo_field( 'about', 'get_in_touch' ) ); ?></span></a>
        </div>
      </div>
    </div>
  </section>

  <!-- PARTNERS — logo loop -->
  <section class="logos-sec" aria-label="Partners and sponsors">
    <div class="logos" id="sponsors"></div>
  </section>
