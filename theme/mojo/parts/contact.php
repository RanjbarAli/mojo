<section class="phead">
    <div class="phead__img"><?php if ( is_page() && has_post_thumbnail() ) { the_post_thumbnail( 'full', array( 'fetchpriority' => 'high' ) ); } else { ?><img src="<?php echo esc_url( mojo_media_url( mojo_field( 'contact-page', 'image_assets_img_cafe_webp' ) ) ); ?>" alt=""><?php } ?></div>
    <div class="container phead__in">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="<?php echo esc_url( mojo_url( 'home' ) ); ?>">Home</a><i data-lucide="chevron-right"></i><span>Contact</span></nav>
      <h1 class="h1"><?php echo esc_html( mojo_field( 'contact-page', 'get_in_touch' ) ); ?></h1>
      <p class="lead"><?php echo esc_html( is_page() && has_excerpt() ? get_the_excerpt() : mojo_field( 'contact-page', 'introduction' ) ); ?></p>
    </div>
  </section>

  <section class="section">
    <div class="container contact-grid">
      <div class="cinfo" data-reveal="stagger">
        <div class="cinfo__item"><span class="ico ico--o"><i data-lucide="phone"></i></span><div><small><?php echo esc_html( mojo_field( 'contact-page', 'call_us' ) ); ?></small><b><a href="tel:<?php echo esc_attr( preg_replace( '/[^+0-9]/', '', mojo_field( 'contact', 'phone' ) ) ); ?>"><?php echo esc_attr( mojo_field( 'contact', 'phone' ) ); ?></a></b></div>
          <button class="icon-btn" data-copy="<?php echo esc_attr( mojo_field( 'contact', 'phone' ) ); ?>" aria-label="Copy phone number"><span class="copy-ico"><i data-lucide="copy"></i></span></button></div>
        <div class="cinfo__item"><span class="ico" style="background:#E3F7EC;color:#1FAF5A"><i data-lucide="message-circle"></i></span><div><small><?php echo esc_html( mojo_field( 'contact-page', 'whatsapp' ) ); ?></small><b><?php echo esc_html( mojo_field( 'contact-page', 'chat_with_mohammed' ) ); ?></b></div>
          <a class="icon-btn" href="<?php echo esc_url( mojo_field( 'contact', 'whatsapp' ) ); ?>" target="_blank" rel="noopener" aria-label="Open WhatsApp"><i data-lucide="arrow-up-right"></i></a></div>
        <div class="cinfo__item"><span class="ico"><i data-lucide="mail"></i></span><div><small><?php echo esc_html( mojo_field( 'contact-page', 'email' ) ); ?></small><b><a href="mailto:<?php echo esc_attr( mojo_field( 'contact', 'email' ) ); ?>"><?php echo esc_attr( mojo_field( 'contact', 'email' ) ); ?></a></b></div>
          <button class="icon-btn" data-copy="<?php echo esc_attr( mojo_field( 'contact', 'email' ) ); ?>" aria-label="Copy email"><span class="copy-ico"><i data-lucide="copy"></i></span></button></div>
        <div class="cinfo__item"><span class="ico"><i data-lucide="map-pin"></i></span><div><small><?php echo esc_html( mojo_field( 'contact-page', 'visit' ) ); ?></small><b><?php echo esc_attr( mojo_field( 'contact', 'address' ) ); ?></b></div>
          <a class="icon-btn" href="<?php echo esc_url( mojo_field( 'contact', 'map' ) ); ?>" target="_blank" rel="noopener" aria-label="Get directions"><i data-lucide="navigation"></i></a></div>
        <div class="panel panel--line" style="padding:18px 20px">
          <div class="flex between center" style="margin-bottom:4px"><h3 class="h3"><?php echo esc_html( mojo_field( 'contact-page', 'opening_hours' ) ); ?></h3><span class="chip"><span class="live-dot" id="cDot"></span><span id="cStatus"></span></span></div>
          <div class="hours" id="hours"></div>
        </div>
      </div>

      <form class="panel panel--line form" id="contactForm" novalidate>
        <h2 class="h2" style="font-size:1.35rem">Send a message</h2>
        <div class="form__row form__row--2">
          <div class="field">
            <label class="label" for="cName">Full name</label>
            <div class="control"><i data-lucide="user" class="lead-ico"></i><input class="input" id="cName" name="name" autocomplete="name" placeholder="Your name" data-rules="required|min:3" data-letters><span class="state-ico"></span></div>
          </div>
          <div class="field">
            <label class="label" for="cEmail">Email</label>
            <div class="control"><i data-lucide="mail" class="lead-ico"></i><input class="input" id="cEmail" name="email" type="email" autocomplete="email" placeholder="you@example.com" data-rules="required|email"><span class="state-ico"></span></div>
          </div>
        </div>
        <div class="form__row form__row--2">
          <div class="field">
            <label class="label" for="cPhone">Phone <span class="opt">Optional</span></label>
            <div class="control phone" data-phone data-default="OM"><input class="input" id="cPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" data-rules="phone"><span class="state-ico"></span></div>
          </div>
          <div class="field">
            <label class="label" id="cTopic-lbl">Topic</label>
            <select id="cTopic" name="topic" data-cselect data-placeholder="What's it about?" data-icon="message-circle" data-rules="select">
              <option value=""></option>
              <option value="lessons" data-icon="graduation-cap">Lessons</option>
              <option value="jumping" data-icon="trophy">Show jumping training</option>
              <option value="leasing" data-icon="key-round">Horse leasing</option>
              <option value="young" data-icon="sprout">Young horse training</option>
              <option value="events" data-icon="party-popper">Events & parties</option>
              <option value="cafe" data-icon="coffee">Restaurant & café</option>
              <option value="other" data-icon="sparkles">Other</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label class="label" for="cMsg">Message <span class="counter"></span></label>
          <div class="control control--area"><textarea class="input" id="cMsg" name="message" maxlength="600" placeholder="How can we help?" data-rules="required|min:10"></textarea><span class="state-ico"></span></div>
        </div>
        <label class="check"><input type="checkbox" name="copy"><span class="check__box"><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg></span><span>Reply to me by email</span></label>
        <button class="btn btn--lg" type="submit" data-loading="Sending" data-success="Sent"><span class="btn__icon"><i data-lucide="send"></i></span><span class="btn__label">Send message</span></button>
      </form>
    </div>
    <div class="container mt-4">
      <div class="map"><iframe title="Map to Mojo Equestrian Center" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="<?php echo esc_url( mojo_field( 'contact', 'mapEmbed' ) ); ?>"></iframe></div>
    </div>
  </section>
