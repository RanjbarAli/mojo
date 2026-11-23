<section class="phead">
    <div class="phead__img"><?php if ( is_page() && has_post_thumbnail() ) { the_post_thumbnail( 'full', array( 'fetchpriority' => 'high' ) ); } else { ?><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'events', 'image_assets_img_team_webp' ) ) ); ?>" alt=""><?php } ?></div>
    <div class="container phead__in">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="<?php echo esc_url( mojo_url( 'home' ) ); ?>">Home</a><i data-lucide="chevron-right"></i><span>Events</span></nav>
      <h1 class="h1"><?php echo esc_html( mojo_field( 'events', 'events' ) ); ?></h1>
      <p class="lead"><?php echo esc_html( is_page() && has_excerpt() ? get_the_excerpt() : mojo_field( 'events', 'introduction' ) ); ?></p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="head"><span class="eyebrow"><?php echo esc_html( mojo_field( 'events', 'host_with_us' ) ); ?></span><h2 class="h2"><?php echo esc_html( mojo_field( 'events', 'event_packages' ) ); ?></h2></div>
      <div class="pkgs" data-reveal="stagger">
        <?php foreach ( mojo_content( 'packages' ) as $package ) : ?>
        <article class="pkg" data-pkg="<?php echo esc_attr( $package['id'] ); ?>">
          <div class="pkg__top"><span class="ico"><i data-lucide="<?php echo esc_attr( $package['icon'] ); ?>"></i></span><span class="chip"><?php echo esc_html( $package['tag'] ); ?></span></div>
          <h3 class="h3"><?php echo esc_html( $package['title'] ); ?></h3>
          <ul><?php foreach ( preg_split( '/\R/', $package['points'], -1, PREG_SPLIT_NO_EMPTY ) as $point ) : ?><li><i data-lucide="check"></i><?php echo esc_html( $point ); ?></li><?php endforeach; ?></ul>
          <button class="btn btn--ghost btn--block" data-pick="<?php echo esc_attr( $package['id'] ); ?>"><span class="btn__icon"><i data-lucide="mouse-pointer-click"></i></span><span class="btn__label"><?php echo esc_html( mojo_field( 'events', 'choose_package' ) ); ?></span></button>
        </article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section class="section section--white">
    <div class="container">
      <div class="head"><span class="eyebrow"><?php echo esc_html( mojo_field( 'events', 'competitions' ) ); ?></span><h2 class="h2"><?php echo esc_html( mojo_field( 'events', 'past_events' ) ); ?></h2></div>
      <div class="elist">
        <?php foreach ( mojo_event_cards() as $event ) : ?>
        <article class="eitem">
          <div class="eitem__img"><img src="<?php echo esc_url( mojo_media_url( $event['img'] ) ); ?>" alt="<?php echo esc_attr( $event['alt'] ); ?>" loading="lazy"></div>
          <div class="eitem__body"><span class="chip chip--orange"><i data-lucide="<?php echo esc_attr( $event['icon'] ); ?>"></i><?php echo esc_html( $event['tag'] ); ?></span><h3 class="h3"><a style="color:inherit;text-decoration:inherit" href="<?php echo esc_url( $event['url'] ); ?>"><?php echo esc_html( $event['title'] ); ?></a></h3><p><?php echo esc_html( $event['text'] ); ?></p></div>
          <span class="date-badge"><b><?php echo esc_html( $event['year'] ); ?></b><small><?php echo esc_html( mojo_field( 'events', 'season' ) ); ?></small></span>
        </article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section class="section section--form" id="inquiry">
    <div class="container cta">
      <div data-reveal>
        <span class="eyebrow"><?php echo esc_html( mojo_field( 'events', 'plan_your_event' ) ); ?></span>
        <h2 class="h2 mt-2"><?php echo esc_html( mojo_field( 'events', 'send_an_inquiry' ) ); ?></h2>
        <p class="lead mt-2"><?php echo esc_html( mojo_field( 'events', 'share_a_few_details_and_we_ll_build_a_plan_and_quote_for_you' ) ); ?></p>
        <div class="cta__list">
          <a href="<?php echo esc_url( mojo_field( 'contact', 'whatsapp' ) ); ?>" target="_blank" rel="noopener"><span class="ico"><i data-lucide="message-circle"></i></span><span><small><?php echo esc_html( mojo_field( 'events', 'whatsapp' ) ); ?></small><?php echo esc_attr( mojo_field( 'contact', 'phone' ) ); ?></span></a>
          <a href="mailto:<?php echo esc_attr( mojo_field( 'contact', 'email' ) ); ?>"><span class="ico"><i data-lucide="mail"></i></span><span><small><?php echo esc_html( mojo_field( 'events', 'email' ) ); ?></small><?php echo esc_attr( mojo_field( 'contact', 'email' ) ); ?></span></a>
        </div>
      </div>
      <form class="panel form" id="eventForm" novalidate>
        <div class="form__row form__row--2">
          <div class="field">
            <label class="label" for="eName">Full name</label>
            <div class="control"><i data-lucide="user" class="lead-ico"></i><input class="input" id="eName" name="name" autocomplete="name" placeholder="Your name" data-rules="required|min:3" data-letters><span class="state-ico"></span></div>
          </div>
          <div class="field">
            <label class="label" for="ePhone">Phone</label>
            <div class="control phone" data-phone data-default="OM"><input class="input" id="ePhone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" data-rules="required|phone"><span class="state-ico"></span></div>
          </div>
        </div>
        <div class="form__row form__row--2">
          <div class="field">
            <label class="label" id="evType-lbl">Event type</label>
            <select id="evType" name="type" data-cselect data-placeholder="Choose event type" data-icon="party-popper" data-rules="select">
              <option value=""></option>
              <?php foreach ( mojo_content( 'packages' ) as $package ) : ?><option value="<?php echo esc_attr( $package['id'] ); ?>" data-icon="<?php echo esc_attr( $package['icon'] ); ?>"><?php echo esc_html( $package['title'] ); ?></option><?php endforeach; ?>
              <option value="school" data-icon="graduation-cap">School trip</option>
              <option value="other" data-icon="sparkles">Something else</option>
            </select>
          </div>
          <div class="field">
            <label class="label" for="eDate">Preferred date</label>
            <div class="control"><i data-lucide="calendar" class="lead-ico"></i><input class="input" id="eDate" name="date" inputmode="numeric" data-mask="##/##/####" placeholder="DD/MM/YYYY" data-rules="required|fdate"><span class="state-ico"></span></div>
          </div>
        </div>
        <div class="field">
          <span class="label">Guests</span>
          <div class="flex wrap center gap-2">
            <div class="stepper" data-stepper data-min="5" data-max="200">
              <button type="button" aria-label="Fewer guests"><i data-lucide="minus"></i></button><output>10</output>
              <button type="button" aria-label="More guests"><i data-lucide="plus"></i></button><input type="hidden" name="guests" value="10">
            </div>
            <span class="hint">5 – 200 guests</span>
          </div>
        </div>
        <div class="field">
          <span class="label">Add-ons <span class="opt">Optional</span></span>
          <div class="flex wrap gap-2">
            <label class="check"><input type="checkbox" name="addon" value="catering"><span class="check__box"><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg></span><span>Catering</span></label>
            <label class="check"><input type="checkbox" name="addon" value="pony"><span class="check__box"><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg></span><span>Pony rides</span></label>
            <label class="check"><input type="checkbox" name="addon" value="photo"><span class="check__box"><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg></span><span>Photographer</span></label>
          </div>
        </div>
        <div class="field">
          <label class="label" for="eNotes">Notes <span class="counter"></span></label>
          <div class="control control--area"><textarea class="input" id="eNotes" name="notes" maxlength="400" placeholder="Anything we should know?"></textarea></div>
        </div>
        <button class="btn btn--lg btn--block" type="submit" data-loading="Sending inquiry" data-success="Inquiry sent"><span class="btn__icon"><i data-lucide="send"></i></span><span class="btn__label">Send inquiry</span></button>
      </form>
    </div>
  </section>
