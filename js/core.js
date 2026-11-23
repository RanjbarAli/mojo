/* ==========================================================================
   Mojo Equestrian — Core UI kit (vanilla JS)
   GSAP everywhere: UI micro-interactions, ScrollTrigger scrubbing, Flip layout changes
   ========================================================================== */
(() => {
  const D = window.MOJO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement;
  html.classList.remove("no-js");
  // We restore scroll ourselves (after GSAP has measured), so reloads mid-page animate correctly
  const SCROLL_KEY = "mojo-scroll:" + location.pathname;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  addEventListener("pagehide", () => { try { sessionStorage.setItem(SCROLL_KEY, String(window.scrollY)); } catch (e) {} });

  /* ---------- Environment: reduced motion for users & low-end devices ---------- */
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conn = navigator.connection || {};
  const lowEnd = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 2) || conn.saveData === true;
  const mobile = matchMedia("(pointer: coarse), (max-width: 767px)").matches;
  const reduced = prefersReduced || lowEnd;
  if (reduced) html.classList.add("reduce-motion");

  // Use device hints for the first viewport, then sample short bursts of visible scrolling.
  const cores = navigator.hardwareConcurrency || 0;
  const memory = navigator.deviceMemory || 0;
  const limitedHardware = (cores && cores <= 4) || (memory && memory <= 4);
  let motionLevel = reduced ? 0 : !limitedHardware && cores >= 6 ? 2 : 1;
  if (mobile && !reduced) {
    let nextSample = 0, goodSamples = 0;
    addEventListener("scroll", () => {
      const now = performance.now();
      if (document.hidden || now < nextSample) return;
      nextSample = now + 2500;
      let first = 0, previous = 0, frames = 0, slow = 0;
      function sample(time) {
        if (document.hidden) return;
        if (!first) first = time;
        if (previous) {
          frames++;
          if (time - previous > 25) slow++;
        }
        previous = time;
        if (time - first < 450) { requestAnimationFrame(sample); return; }
        const previousLevel = motionLevel;
        if (slow / frames > 0.25) {
          motionLevel = Math.max(0, motionLevel - 1);
          goodSamples = 0;
        } else if (slow / frames < 0.08) {
          if (++goodSamples >= 3) {
            motionLevel = Math.min(limitedHardware ? 1 : 2, motionLevel + 1);
            goodSamples = 0;
          }
        } else goodSamples = 0;
        if (motionLevel !== previousLevel) window.dispatchEvent(new Event("mojo:motionchange"));
      }
      requestAnimationFrame(sample);
    }, { passive: true });
  }

  /* ---------- GSAP animation adapter ----------
     animate(target, { prop: [from, to] | [k1, k2, k3…] | to }, { duration, delay, ease, type })
     – 2-value arrays → fromTo · longer arrays → GSAP array keyframes · scalars → to
     – x/y "%" strings → xPercent/yPercent · type:"spring" → back/elastic ease          */
  const spring = { type: "spring" };
  const STAG = Symbol("stagger");
  const stagger = (each, o = {}) => (reduced ? 0 : { [STAG]: true, each, start: o.startDelay || 0 });
  const toEase = (opts) => {
    if (opts.type === "spring") return opts.bounce ? "elastic.out(1, 0.55)" : "back.out(1.5)";
    if (opts.ease === "linear") return "none";
    if (typeof opts.ease === "string") return opts.ease;
    return "expo.out";
  };
  const propOf = (k, v) => {
    if ((k === "x" || k === "y") && typeof v === "string" && v.endsWith("%")) return [k + "Percent", parseFloat(v)];
    return [k, v];
  };
  function animate(target, kf, opts = {}) {
    if (!target || !window.gsap) return Promise.resolve();
    const els = typeof target === "string" ? gsap.utils.toArray(target) : target instanceof Element ? [target] : [...target];
    if (!els.length) return Promise.resolve();
    const vars = { duration: reduced ? 0 : (opts.duration ?? 0.45), ease: toEase(opts), overwrite: "auto" };
    if (opts.type === "spring" && opts.duration == null) vars.duration = reduced ? 0 : 0.6;
    const d = opts.delay;
    if (d && d[STAG]) { vars.stagger = d.each; vars.delay = d.start; } else if (typeof d === "number" && !reduced) vars.delay = d;
    const from = {}, to = {}, frames = {};
    let multi = false;
    for (const [k, v] of Object.entries(kf)) {
      if (Array.isArray(v) && v.length > 2) { multi = true; frames[k] = v; continue; }
      if (Array.isArray(v)) { const [p, a] = propOf(k, v[0]); const [, b] = propOf(k, v[1]); from[p] = a; to[p] = b; }
      else { const [p, b] = propOf(k, v); to[p] = b; }
    }
    return new Promise((res) => {
      vars.onComplete = () => res();
      if (multi) {
        Object.keys(from).forEach((p) => (frames[p] = [from[p], to[p]]));
        Object.keys(to).forEach((p) => !(p in from) && (frames[p] = to[p]));
        Object.keys(frames).forEach((p) => !Array.isArray(frames[p]) && ((vars[p] = frames[p]), delete frames[p]));
        gsap.to(els, { ...vars, keyframes: { ...frames, easeEach: "power2.inOut" }, ease: "none" });
      } else if (Object.keys(from).length) gsap.fromTo(els, from, { ...vars, ...to });
      else gsap.to(els, { ...vars, ...to });
    });
  }

  /* ---------- Icons ---------- */
  const pascal = (n) => n.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("");
  function svg(name, cls = "") {
    const node = window.lucide && lucide.icons[pascal(name)];
    if (!node) return document.createElement("i");
    const el = lucide.createElement(node);
    el.setAttribute("class", `lucide lucide-${name} ${cls}`.trim());
    el.setAttribute("aria-hidden", "true");
    return el;
  }
  const ico = (name, cls = "") => svg(name, cls).outerHTML;
  function renderIcons(root = document) {
    $$("i[data-lucide]", root).forEach((i) => i.replaceWith(svg(i.dataset.lucide, i.className)));
  }

  /* ---------- Opening hours (Oman, UTC+4) ---------- */
  function omanNow() {
    const d = new Date();
    return new Date(d.getTime() + d.getTimezoneOffset() * 60000 + 4 * 3600000);
  }
  function openStatus() {
    const n = omanNow(), h = n.getHours() + n.getMinutes() / 60, { open, close, closedDays } = D.contact.hours;
    if (closedDays.includes(n.getDay())) return { open: false, label: "Closed today · Opens Sat 08:00" };
    if (h < open) return { open: false, label: "Opens today at 08:00" };
    if (h >= close) return { open: false, label: "Closed · Opens 08:00" };
    return { open: true, label: "Open now · until 21:00" };
  }

  /* ---------- Shell (nav, menus, footer) ---------- */
  const page = document.body.dataset.page || "home";
  const nav = [
    { id: "home", href: "index.html", label: "Home", icon: "house" },
    { id: "about", href: "about.html", label: "About", icon: "compass" },
    { id: "services", href: "services.html", label: "Programs", icon: "layout-grid", dd: true },
    { id: "events", href: "events.html", label: "Events", icon: "party-popper" },
    { id: "blog", href: "blog.html", label: "Journal", icon: "newspaper" },
    { id: "contact", href: "contact.html", label: "Contact", icon: "message-circle" },
  ];
  const cur = (id) => (id === page ? ' aria-current="page"' : "");
  const waIcon = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.03c-.24.68-1.42 1.3-1.95 1.35-.5.05-.97.23-3.27-.68-2.77-1.09-4.52-3.92-4.66-4.1-.13-.18-1.11-1.48-1.11-2.82s.7-2 .95-2.27c.24-.27.53-.34.71-.34l.51.01c.16.01.38-.06.6.46.24.55.79 1.89.86 2.03.07.14.11.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.56.16.27.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.27.14.43.11.59-.07.16-.18.68-.79.86-1.07.18-.27.36-.23.6-.14.25.09 1.57.74 1.84.88.27.14.45.2.52.32.07.11.07.66-.17 1.34Z"/></svg>`;

  function buildShell() {
    const ddItems = D.programs.slice(0, 6).map((p) => `
      <a class="dd-item" href="services.html#${p.id}"><span class="dd-item__ico">${ico(p.icon)}</span>
      <span><strong>${p.title}</strong><small>${p.short}</small></span></a>`).join("");

    const top = `
    <header class="topnav" id="topnav">
      <div class="container topnav__in">
        <a class="brand" href="index.html" aria-label="Mojo Equestrian home"><img src="assets/img/logo.png" alt="Mojo Equestrian Center" width="82" height="42"></a>
        <ul class="nav-links" id="navLinks">
          <span class="nav-pill" aria-hidden="true"></span>
          ${nav.map((n) => n.dd ? `
            <li><button class="nav-link" aria-expanded="false" aria-controls="ddPrograms" data-dd${page === n.id ? ' aria-current="page"' : ""}>${n.label}${ico("chevron-down", "chev")}</button>
              <div class="dropdown" id="ddPrograms" role="menu">${ddItems}
                <a class="dd-item" href="services.html"><span class="dd-item__ico" style="background:var(--ink);color:var(--orange)">${ico("arrow-up-right")}</span><span><strong>All programs</strong><small>Compare & book</small></span></a>
              </div></li>` :
            `<li><a class="nav-link" href="${n.href}"${cur(n.id)}>${n.label}</a></li>`).join("")}
        </ul>
        <div class="nav-actions">
          <a class="icon-btn mob-only" href="tel:${D.contact.phoneRaw}" aria-label="Call us">${ico("phone")}</a>
          <a class="icon-btn" href="${D.contact.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp" style="color:#1FAF5A">${waIcon.replace("<svg", '<svg width="22" height="22"')}</a>
          <a class="btn btn--sm" href="booking.html"><span class="btn__icon">${ico("calendar-check")}</span><span class="btn__label">Book a lesson</span></a>
        </div>
      </div>
    </header>`;

    const bnav = `
    <nav class="bnav" aria-label="Primary">
      <div class="bnav__in">
        <span class="bnav__dot" aria-hidden="true"></span>
        <a class="bnav__item" href="index.html"${cur("home")}>${ico("house")}<span>Home</span></a>
        <a class="bnav__item" href="services.html"${cur("services")}>${ico("layout-grid")}<span>Programs</span></a>
        <a class="bnav__item bnav__item--cta" href="booking.html"${cur("booking")}><span class="bnav__fab">${ico("calendar-check")}</span><span>Book</span></a>
        <a class="bnav__item" href="events.html"${cur("events")}>${ico("party-popper")}<span>Events</span></a>
        <button class="bnav__item" id="menuBtn" aria-expanded="false" aria-controls="fmenu"><span class="burger" aria-hidden="true"><i></i><i></i><i></i></span><span>Menu</span></button>
      </div>
    </nav>
    <div class="fmenu" id="fmenu" role="dialog" aria-modal="true" aria-label="Menu">
      <div class="fmenu__top"><img src="assets/img/logo-light.png" alt="Mojo Equestrian"><span class="chip chip--dark"><span class="live-dot" id="menuDot"></span><span id="menuStatus"></span></span></div>
      <div class="fmenu__list">
        ${[...nav, { id: "booking", href: "booking.html", label: "Book a lesson", icon: "calendar-check" }].map((n, i) => `
          <a class="fmenu__link" href="${n.href}"${cur(n.id)}><span><span class="n">0${i + 1}</span>${n.label}</span>${ico("arrow-up-right")}</a>`).join("")}
      </div>
      <div class="fmenu__sub">${D.programs.slice(0, 5).map((p) => `<a class="chip chip--dark" href="services.html#${p.id}">${ico(p.icon)}${p.title}</a>`).join("")}</div>
      <div class="fmenu__foot">
        <div class="fmenu__contact">
          <a href="tel:${D.contact.phoneRaw}">${ico("phone")}${D.contact.phone}</a>
          <a href="mailto:${D.contact.email}">${ico("mail")}${D.contact.email}</a>
          <span>${ico("map-pin")}${D.contact.address}</span>
        </div>
        <div class="fmenu__social">
          <a href="${D.contact.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ico("instagram")}</a>
          <a href="${D.contact.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ico("facebook")}</a>
          <a href="${D.contact.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${waIcon.replace("<svg", '<svg width="20" height="20"')}</a>
        </div>
      </div>
    </div>`;

    const st0 = openStatus();
    const foot = `
    <footer class="footer">
      <div class="fband"><div class="container">
        <div class="fcta">
          <div class="fcta__copy">
            <span class="chip chip--dark"><span class="live-dot${st0.open ? "" : " is-closed"}"></span>${st0.label}</span>
            <h2 class="fcta__title" data-split>Ready to ride?</h2>
          </div>
          <div class="fcta__actions">
            <a class="btn btn--lg" href="booking.html"><span class="btn__icon">${ico("calendar-check")}</span><span class="btn__label">Book a lesson</span></a>
            <a class="btn btn--lg btn--ghost" href="${D.contact.whatsapp}" target="_blank" rel="noopener"><span class="btn__icon">${ico("message-circle")}</span><span class="btn__label">WhatsApp</span></a>
          </div>
        </div>
      </div></div>
      <div class="container footer__main">
        <div class="footer__grid" data-reveal="stagger">
          <div class="footer__brand">
            <img src="assets/img/logo-light.png" alt="Mojo Equestrian" width="89" height="46">
            <p>Show jumping, dressage and riding school in Barka, Oman.</p>
            <div class="socials">
              <a href="${D.contact.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ico("instagram")}</a>
              <a href="${D.contact.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ico("facebook")}</a>
              <a href="${D.contact.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${waIcon.replace("<svg", '<svg width="18" height="18"')}</a>
            </div>
          </div>
          <div><h4>Explore</h4><ul class="footer__links">
            ${nav.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}</ul></div>
          <div><h4>Programs</h4><ul class="footer__links">
            ${D.programs.slice(0, 6).map((p) => `<li><a href="services.html#${p.id}">${p.title}</a></li>`).join("")}</ul></div>
          <div><h4>Visit</h4><ul class="footer__links footer__visit">
            <li>${ico("map-pin")}<span>${D.contact.address}</span></li>
            <li>${ico("clock")}<span>Sat – Thu · 08:00 – 21:00</span></li>
            <li>${ico("phone")}<a href="tel:${D.contact.phoneRaw}">${D.contact.phone}</a></li>
            <li>${ico("mail")}<a href="mailto:${D.contact.email}">${D.contact.email}</a></li></ul></div>
        </div>
        <div class="footer__bottom">
          <span>© ${new Date().getFullYear()} Mojo Equestrian Center · Barka, Sultanate of Oman</span>
          <a class="credit" href="https://aiastra.io" target="_blank" rel="noopener">Designed by <b>Astra</b><span class="credit__ico">${ico("arrow-up-right")}</span></a>
        </div>
      </div>
    </footer>
    <a class="wa-float" href="${D.contact.whatsapp}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${waIcon}</a>
    <div class="toasts" id="toasts" aria-live="polite"></div>`;

    document.body.insertAdjacentHTML("afterbegin", top);
    document.body.insertAdjacentHTML("beforeend", bnav + foot);
  }

  /* ---------- Smooth scroll ---------- */
  let smoother = null;
  function scrollToTarget(target, offset = 0) {
    if (smoother) smoother.scrollTo(target, true, `top ${offset}px`);
    else {
      const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: reduced || mobile ? "auto" : "smooth" });
    }
  }
  function initScroll() {
    if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if (window.gsap && window.Flip) gsap.registerPlugin(Flip);
    if (!mobile && !reduced && window.gsap && window.ScrollTrigger && window.ScrollSmoother) {
      gsap.registerPlugin(ScrollSmoother);
      const wrapper = document.createElement("div");
      const content = document.createElement("div");
      content.className = "scroll-content";
      const main = $("#main");
      main.before(wrapper);
      wrapper.append(content);
      content.append(main, $(".footer"));
      document.body.classList.add("has-smoother");
      smoother = ScrollSmoother.create({ wrapper, content, smooth: 1 });
    }
    // in-page anchors
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute("href").length < 2) return;
      const t = $(a.getAttribute("href"));
      if (!t) return;
      e.preventDefault();
      scrollToTarget(t, 80);
    });
  }
  const lockScroll = (on) => { document.body.classList.toggle("no-scroll", on); smoother?.paused(on); };

  /* ---------- Top nav behaviour ---------- */
  function initTopNav() {
    const bar = $("#topnav");
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (html.classList.contains("nav-lock")) { bar.classList.remove("is-hidden"); last = y; return; }
      if (!document.body.classList.contains("no-scroll")) bar.classList.toggle("is-hidden", y > 320 && y > last + 2);
      if (y < last - 2) bar.classList.remove("is-hidden");
      last = y;
    };
    addEventListener("scroll", onScroll, { passive: true });

    // Sliding hover pill (desktop)
    const links = $("#navLinks"), pill = $(".nav-pill", links);
    const moveTo = (el) => {
      const r = el.getBoundingClientRect(), pr = links.getBoundingClientRect();
      animate(pill, { x: r.left - pr.left, width: r.width, opacity: 1 }, { duration: 0.35 });
    };
    $$(".nav-link", links).forEach((l) => l.addEventListener("mouseenter", () => moveTo(l)));
    links.addEventListener("mouseleave", () => animate(pill, { opacity: 0 }, { duration: 0.25 }));

    // Dropdown
    const ddBtn = $("[data-dd]"), dd = $("#ddPrograms");
    let ddOpen = false, ddTimer;
    const setDD = (open) => {
      if (open === ddOpen) return;
      ddOpen = open;
      ddBtn.setAttribute("aria-expanded", open);
      if (open) {
        dd.classList.add("is-open");
        animate(dd, { opacity: [0, 1], scale: [0.97, 1], y: [-6, 0] }, { duration: 0.3 });
        animate($$(".dd-item", dd), { opacity: [0, 1], x: [-6, 0] }, { delay: stagger(0.03), duration: 0.3 });
      } else {
        animate(dd, { opacity: 0, scale: 0.98, y: -4 }, { duration: 0.2 }).then(() => !ddOpen && dd.classList.remove("is-open"));
      }
    };
    ddBtn.addEventListener("click", () => setDD(!ddOpen));
    ddBtn.parentElement.addEventListener("mouseenter", () => { clearTimeout(ddTimer); setDD(true); });
    ddBtn.parentElement.addEventListener("mouseleave", () => { ddTimer = setTimeout(() => setDD(false), 160); });
    document.addEventListener("click", (e) => { if (!e.target.closest("#ddPrograms, [data-dd]")) setDD(false); });
    document.addEventListener("keydown", (e) => e.key === "Escape" && setDD(false));
  }

  /* ---------- Bottom nav + full-screen menu ---------- */
  function initBottomNav() {
    const dot = $(".bnav__dot"), active = $(".bnav__item[aria-current]"), wrap = $(".bnav__in");
    const placeDot = () => {
      if (!active || active.classList.contains("bnav__item--cta")) { dot.style.opacity = 0; return; }
      const r = active.getBoundingClientRect(), pr = wrap.getBoundingClientRect();
      dot.style.transform = `translateX(${r.left - pr.left + r.width / 2 - 13}px)`;
    };
    placeDot();
    addEventListener("resize", placeDot);
    // Tap feedback on bottom-nav icons
    $$(".bnav__item:not(#menuBtn)").forEach((a) => a.addEventListener("click", () => {
      animate($("svg", a), { scale: [1, 0.8, 1.12, 1], rotate: [0, -8, 0] }, { duration: 0.45 });
      const r = a.getBoundingClientRect(), pr = wrap.getBoundingClientRect();
      if (!a.classList.contains("bnav__item--cta")) animate(dot, { x: r.left - pr.left + r.width / 2 - 13, opacity: 1 }, spring);
    }));

    const btn = $("#menuBtn"), menu = $("#fmenu");
    let open = false;
    const st = openStatus();
    $("#menuStatus").textContent = st.label;
    $("#menuDot").classList.toggle("is-closed", !st.open);

    const origin = () => {
      const r = btn.getBoundingClientRect();
      return `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
    };
    async function toggle(force) {
      const next = force ?? !open;
      if (next === open) return;
      open = next;
      btn.setAttribute("aria-expanded", open);
      document.body.classList.toggle("is-menu-open", open);
      const o = origin(), R = Math.hypot(innerWidth, innerHeight);
      if (open) {
        lockScroll(true);
        menu.classList.add("is-open");
        animate(menu, { clipPath: [`circle(0px at ${o})`, `circle(${R}px at ${o})`] }, { duration: 0.7, ease: [0.65, 0, 0.35, 1] });
        animate($$(".fmenu__link", menu), { opacity: [0, 1], y: [24, 0] }, { delay: stagger(0.045, { startDelay: 0.18 }), duration: 0.5 });
        animate($$(".fmenu__sub .chip, .fmenu__foot", menu), { opacity: [0, 1] }, { delay: 0.45, duration: 0.4 });
      } else {
        await animate(menu, { clipPath: [`circle(${R}px at ${o})`, `circle(0px at ${o})`] }, { duration: 0.55, ease: [0.65, 0, 0.35, 1] });
        if (!open) { menu.classList.remove("is-open"); lockScroll(false); }
      }
    }
    btn.addEventListener("click", () => toggle());
    document.addEventListener("keydown", (e) => e.key === "Escape" && open && toggle(false));
    $$(".fmenu__link, .fmenu__sub a", menu).forEach((a) => a.addEventListener("click", () => {
      animate($("svg", a), { x: [0, 8, 0], y: [0, -8, 0] }, { duration: 0.4 });
    }));
    addEventListener("resize", () => innerWidth >= 992 && open && toggle(false));
  }

  /* ---------- Toasts (message only) ---------- */
  const toastIcons = { success: "check", error: "x", info: "info", warn: "circle-alert" };
  function toast(msg, type = "success", ms = 3800) {
    const box = $("#toasts");
    const t = document.createElement("div");
    t.className = `toast toast--${type}`;
    t.setAttribute("role", type === "error" ? "alert" : "status");
    t.innerHTML = `<span class="toast__ico">${ico(toastIcons[type] || "info")}</span><span class="toast__msg"></span>
      <button class="toast__x" aria-label="Dismiss">${ico("x")}</button><span class="toast__t"></span>`;
    $(".toast__msg", t).textContent = msg;
    box.appendChild(t);
    while (box.children.length > 3) box.firstElementChild.remove();
    animate(t, { opacity: [0, 1], y: [24, 0], scale: [0.92, 1] }, { type: "spring", stiffness: 380, damping: 26 });
    animate($(".toast__ico svg", t), { scale: [0, 1.25, 1], rotate: [-90, 0] }, { duration: 0.5, delay: 0.1 });
    const bar = $(".toast__t", t);
    const timer = animate(bar, { scaleX: [1, 0] }, { duration: ms / 1000, ease: "linear" });
    let gone = false;
    const close = () => {
      if (gone) return; gone = true;
      animate(t, { opacity: 0, y: 12, scale: 0.95 }, { duration: 0.25 }).then(() => t.remove());
    };
    $(".toast__x", t).addEventListener("click", close);
    timer.then(close);
    return close;
  }

  /* ---------- Modal (always centred) ---------- */
  let activeModal = null;
  function modal({ title = "", html = "", size = "", foot = "", bare = false, onOpen, onClose, label } = {}) {
    if (activeModal) activeModal.close(true);
    const root = document.createElement("div");
    root.className = "modal-root";
    root.innerHTML = `<div class="modal-backdrop"></div>
      <div class="modal ${size ? "modal--" + size : ""}" role="dialog" aria-modal="true" aria-label="${label || title}">
        ${bare ? "" : `<div class="modal__head"><h3>${title}</h3><button class="icon-btn modal__close" data-close aria-label="Close">${ico("x")}</button></div>`}
        <div class="${bare ? "" : "modal__body"}">${html}</div>
        ${foot ? `<div class="modal__foot">${foot}</div>` : ""}
      </div>`;
    document.body.appendChild(root);
    renderIcons(root);
    const box = $(".modal", root), bd = $(".modal-backdrop", root);
    const prevFocus = document.activeElement;
    root.classList.add("is-open");
    lockScroll(true);
    animate(bd, { opacity: [0, 1] }, { duration: 0.3 });
    animate(box, { opacity: [0, 1], scale: [0.94, 1], y: [18, 0] }, { type: "spring", stiffness: 360, damping: 30 });
    let closed = false;
    const ctrl = {
      el: root, box,
      async close(instant) {
        if (closed) return; closed = true;
        document.removeEventListener("keydown", onKey);
        if (activeModal === ctrl) activeModal = null;
        const xi = $(".modal__close svg", root);
        if (xi && !instant) animate(xi, { rotate: 90 }, { duration: 0.3 });
        if (!instant) {
          await Promise.all([animate(bd, { opacity: 0 }, { duration: 0.25 }), animate(box, { opacity: 0, scale: 0.96, y: 10 }, { duration: 0.22 })]);
        }
        root.remove();
        if (!activeModal) lockScroll(false);
        prevFocus && prevFocus.focus && prevFocus.focus({ preventScroll: true });
        onClose && onClose();
      },
    };
    const onKey = (e) => {
      if (e.key === "Escape") ctrl.close();
      if (e.key === "Tab") {
        const f = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', box).filter((x) => !x.disabled && x.offsetParent);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
        else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    bd.addEventListener("click", () => ctrl.close());
    root.addEventListener("click", (e) => e.target.closest("[data-close]") && ctrl.close());
    activeModal = ctrl;
    setTimeout(() => ($("[autofocus]", box) || $(".modal__close", box) || box).focus?.({ preventScroll: true }), 60);
    onOpen && onOpen(ctrl);
    return ctrl;
  }

  /* ---------- Button state machine: idle → loading → success | error ---------- */
  function setIcon(btn, name, animKf) {
    const holder = $(".btn__icon", btn);
    if (!holder) return;
    const el = svg(name);
    holder.replaceChildren(el);
    if (animKf) animate(el, animKf, { duration: 0.45 });
    if (name === "check") {
      const p = $("path", el);
      if (p && p.getTotalLength) { const L = p.getTotalLength(); p.style.strokeDasharray = L; animate(p, { strokeDashoffset: [L, 0] }, { duration: 0.45, delay: 0.05 }); }
    }
  }
  function btnState(btn, state, label) {
    if (!btn.dataset.idleLabel) {
      btn.dataset.idleLabel = $(".btn__label", btn)?.textContent || "";
      btn.dataset.idleIcon = $(".btn__icon svg", btn)?.getAttribute("class")?.match(/lucide-([\w-]+)/)?.[1] || "";
    }
    const w0 = btn.getBoundingClientRect().width;
    btn.dataset.state = state;
    const lbl = $(".btn__label", btn);
    const map = {
      idle: [btn.dataset.idleIcon, btn.dataset.idleLabel, { scale: [0.5, 1], opacity: [0, 1] }],
      loading: ["loader-circle", btn.dataset.loading || "Processing", { scale: [0.4, 1], opacity: [0, 1] }],
      success: ["check", btn.dataset.success || "Done", { scale: [0.3, 1.2, 1] }],
      error: ["circle-alert", btn.dataset.error || "Try again", { rotate: [0, -14, 12, -8, 6, 0] }],
    };
    const [icon, text, kf] = map[state];
    if (icon) setIcon(btn, icon, kf);
    if (lbl) { lbl.textContent = label || text; animate(lbl, { opacity: [0, 1], y: [6, 0] }, { duration: 0.3 }); }
    btn.setAttribute("aria-busy", state === "loading");
    if (!btn.classList.contains("btn--block") && !btn.classList.contains("btn--icon")) {
      const w1 = btn.getBoundingClientRect().width;
      if (Math.abs(w1 - w0) > 1) animate(btn, { width: [w0 + "px", w1 + "px"] }, { duration: 0.35 }).then(() => (btn.style.width = ""));
    }
  }
  async function runButton(btn, task, { resetAfter = 2200 } = {}) {
    btnState(btn, "loading");
    try {
      const r = await task();
      btnState(btn, "success");
      setTimeout(() => btnState(btn, "idle"), resetAfter);
      return r;
    } catch (err) {
      btnState(btn, "error");
      setTimeout(() => btnState(btn, "idle"), resetAfter);
      throw err;
    }
  }
  // Simulated request — rejects when the device is offline so the error state is real.
  const fakeRequest = (ms = 1400) => new Promise((res, rej) => setTimeout(() => (navigator.onLine === false ? rej(new Error("offline")) : res(true)), reduced ? 500 : ms));

  /* ---------- Input masks ---------- */
  function applyMask(value, mask) {
    let out = "", vi = 0;
    const raw = value.replace(/[^0-9A-Za-z]/g, "");
    for (let mi = 0; mi < mask.length && vi < raw.length; mi++) {
      const m = mask[mi], c = raw[vi];
      if (m === "#") { if (/\d/.test(c)) { out += c; vi++; } else { vi++; mi--; } }
      else if (m === "A") { if (/[a-z]/i.test(c)) { out += c.toUpperCase(); vi++; } else { vi++; mi--; } }
      else if (m === "*") { out += c.toUpperCase(); vi++; }
      else { out += m; if (c === m) vi++; }
    }
    return out;
  }
  function bindMask(input, getMask) {
    const run = () => {
      const mask = getMask();
      if (!mask) return;
      const atEnd = input.selectionStart === input.value.length;
      input.value = applyMask(input.value, mask);
      if (atEnd) input.setSelectionRange(input.value.length, input.value.length);
    };
    input.addEventListener("input", run);
    input._remask = run;
    if (!input.getAttribute("maxlength") && getMask()) input.maxLength = getMask().length;
  }
  function initMasks(root = document) {
    $$("input[data-mask]", root).forEach((i) => {
      if (i._masked) return; i._masked = true;
      bindMask(i, () => i.dataset.mask);
      if (!i.placeholder) i.placeholder = i.dataset.mask.replace(/#/g, "0").replace(/A/g, "X");
    });
    $$("input[data-letters]", root).forEach((i) => i.addEventListener("input", () => { i.value = i.value.replace(/[^\p{L}\s'.-]/gu, ""); }));
  }

  /* ---------- Popover helper (dropdown under/over its trigger) ---------- */
  function popOpen(pop, trigger) {
    pop.classList.add("is-open");
    const r = trigger.getBoundingClientRect();
    const below = innerHeight - r.bottom - (innerWidth < 992 ? 80 : 16);
    pop.classList.toggle("is-up", below < Math.min(pop.offsetHeight, 340) && r.top > below);
    animate(pop, { opacity: [0, 1], scale: [0.97, 1], y: [pop.classList.contains("is-up") ? 6 : -6, 0] }, { duration: 0.25 });
  }
  function popClose(pop) {
    return animate(pop, { opacity: 0, scale: 0.98 }, { duration: 0.16 }).then(() => pop.classList.remove("is-open"));
  }
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const hl = (text, q) => {
    if (!q) return esc(text);
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    return i < 0 ? esc(text) : esc(text.slice(0, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length));
  };

  // Shared listbox keyboard behaviour
  function listKeys(e, list, onPick, onClose) {
    const items = $$(".opt-item", list).filter((x) => x.style.display !== "none");
    let i = items.findIndex((x) => x.classList.contains("is-active"));
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      i = e.key === "ArrowDown" ? Math.min(items.length - 1, i + 1) : Math.max(0, i - 1);
      items.forEach((x) => x.classList.remove("is-active"));
      if (items[i]) { items[i].classList.add("is-active"); items[i].scrollIntoView({ block: "nearest" }); }
    } else if (e.key === "Enter") { e.preventDefault(); items[i] ? onPick(items[i]) : items[0] && onPick(items[0]); }
    else if (e.key === "Escape") { e.preventDefault(); onClose(); }
  }

  /* ---------- Custom select (searchable for long lists) ---------- */
  function enhanceSelect(sel) {
    if (sel._enh) return; sel._enh = true;
    const searchable = sel.hasAttribute("data-search") || sel.options.length > 8;
    const ph = sel.dataset.placeholder || "Select";
    const icon = sel.dataset.icon;
    const wrap = document.createElement("div");
    wrap.className = "cselect";
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);
    sel.hidden = true;
    sel.tabIndex = -1;
    const control = document.createElement("div");
    control.className = "control";
    control.innerHTML = `<button type="button" class="cselect__trigger" aria-haspopup="listbox" aria-expanded="false" ${sel.id ? `aria-labelledby="${sel.id}-lbl"` : ""}>
      ${icon ? ico(icon) : ""}<span class="val is-ph">${ph}</span>${ico("chevron-down", "chev")}</button>`;
    wrap.appendChild(control);
    const pop = document.createElement("div");
    pop.className = "pop";
    pop.innerHTML = `${searchable ? `<div class="pop__search">${ico("search")}<input type="text" placeholder="Search…" aria-label="Search options"></div>` : ""}
      <div class="pop__list" role="listbox"></div><div class="pop__empty">${ico("search")}<div>No matches</div></div>`;
    wrap.appendChild(pop);
    const trig = $(".cselect__trigger", control), val = $(".val", trig), list = $(".pop__list", pop), search = $(".pop__search input", pop), empty = $(".pop__empty", pop);
    const opts = [...sel.options].filter((o) => o.value !== "");
    const build = (q = "") => {
      let n = 0, html = "", lastGroup = null;
      opts.forEach((o) => {
        const g = o.parentElement.tagName === "OPTGROUP" ? o.parentElement.label : null;
        if (q && !o.text.toLowerCase().includes(q.toLowerCase())) return;
        if (g && g !== lastGroup && !q) { html += `<div class="pop__group">${g}</div>`; lastGroup = g; }
        n++;
        html += `<button type="button" class="opt-item" role="option" data-v="${esc(o.value)}" aria-selected="${o.value === sel.value}">
          ${o.dataset.icon ? ico(o.dataset.icon) : ""}<span>${hl(o.text, q)}</span>${ico("check", "tick")}</button>`;
      });
      list.innerHTML = html;
      empty.classList.toggle("is-on", n === 0);
    };
    const sync = () => {
      const o = sel.selectedOptions[0];
      const has = o && o.value !== "";
      val.textContent = has ? o.text : ph;
      val.classList.toggle("is-ph", !has);
    };
    let open = false;
    const close = () => { if (!open) return; open = false; trig.setAttribute("aria-expanded", "false"); popClose(pop); };
    const show = () => {
      open = true; build(); trig.setAttribute("aria-expanded", "true"); popOpen(pop, trig);
      const s = $('[aria-selected="true"]', list); s && s.scrollIntoView({ block: "nearest" });
      if (search) { search.value = ""; setTimeout(() => search.focus({ preventScroll: true }), 30); }
    };
    const pick = (item) => {
      sel.value = item.dataset.v;
      sel.dispatchEvent(new Event("change", { bubbles: true }));
      sync();
      animate(val, { opacity: [0, 1], x: [-6, 0] }, { duration: 0.3 });
      close(); trig.focus({ preventScroll: true });
    };
    trig.addEventListener("click", () => (open ? close() : show()));
    trig.addEventListener("keydown", (e) => {
      if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) { e.preventDefault(); show(); }
      else if (open) listKeys(e, list, pick, close);
    });
    search && search.addEventListener("input", () => build(search.value.trim()));
    search && search.addEventListener("keydown", (e) => listKeys(e, list, pick, close));
    list.addEventListener("click", (e) => { const it = e.target.closest(".opt-item"); it && pick(it); });
    document.addEventListener("click", (e) => !wrap.contains(e.target) && close());
    sel.addEventListener("change", sync);
    sel._sync = sync;
    sync();
  }

  /* ---------- Dial-code select with flags ---------- */
  const flag = (iso) => `<img class="flag" src="https://flagcdn.com/w40/${iso.toLowerCase()}.png" alt="" loading="lazy" width="22" height="16">`;
  function enhancePhone(box) {
    if (box._enh) return; box._enh = true;
    const input = $("input[type=tel]", box);
    let country = D.countries.find((c) => c.iso === (box.dataset.default || "OM"));
    const hidden = document.createElement("input");
    hidden.type = "hidden"; hidden.name = (input.name || "phone") + "_code";
    box.appendChild(hidden);
    const trig = document.createElement("button");
    trig.type = "button"; trig.className = "dial-trigger";
    trig.setAttribute("aria-haspopup", "listbox"); trig.setAttribute("aria-expanded", "false"); trig.setAttribute("aria-label", "Country dialing code");
    box.insertBefore(trig, input);
    const pop = document.createElement("div");
    pop.className = "pop pop--dial";
    pop.innerHTML = `<div class="pop__search">${ico("search")}<input type="text" placeholder="Search country or code" aria-label="Search country"></div>
      <div class="pop__list" role="listbox"></div><div class="pop__empty">No country found</div>`;
    box.parentElement.style.position = "relative";
    box.after(pop);
    const list = $(".pop__list", pop), search = $("input", pop), empty = $(".pop__empty", pop);
    const maskFor = () => D.phoneMasks[country.iso] || "### ### ### ###";
    const paint = () => {
      trig.innerHTML = `${flag(country.iso)}<span>+${country.dial}</span>${ico("chevron-down", "chev")}`;
      hidden.value = "+" + country.dial;
      input.placeholder = maskFor().replace(/#/g, "0");
      input.maxLength = maskFor().length;
      input.value = applyMask(input.value, maskFor());
      box.dataset.iso = country.iso;
    };
    const row = (c, q) => `<button type="button" class="opt-item" role="option" data-iso="${c.iso}" aria-selected="${c.iso === country.iso}">
      ${flag(c.iso)}<span>${hl(c.name, q)}</span><span class="code">+${c.dial}</span></button>`;
    const build = (q = "") => {
      const qq = q.toLowerCase().replace(/^\+/, "");
      const match = (c) => !qq || c.name.toLowerCase().includes(qq) || c.dial.startsWith(qq) || c.iso.toLowerCase() === qq;
      const gulf = D.gcc.map((i) => D.countries.find((c) => c.iso === i)).filter(match);
      const rest = D.countries.filter((c) => !D.gcc.includes(c.iso) && match(c));
      let h = "";
      if (gulf.length) h += `<div class="pop__group">Gulf region</div>` + gulf.map((c) => row(c, q)).join("");
      if (rest.length) h += `<div class="pop__group">All countries</div>` + rest.map((c) => row(c, q)).join("");
      list.innerHTML = h;
      empty.classList.toggle("is-on", !gulf.length && !rest.length);
    };
    let open = false;
    const close = () => { if (!open) return; open = false; trig.setAttribute("aria-expanded", "false"); popClose(pop); };
    const show = () => {
      open = true; build(); search.value = ""; trig.setAttribute("aria-expanded", "true"); popOpen(pop, trig);
      const s = $('[aria-selected="true"]', list); s && s.scrollIntoView({ block: "nearest" });
      setTimeout(() => search.focus({ preventScroll: true }), 30);
    };
    const pick = (item) => {
      country = D.countries.find((c) => c.iso === item.dataset.iso);
      paint(); close();
      animate($(".flag", trig), { scale: [0.4, 1], rotate: [-20, 0] }, { duration: 0.4 });
      input.focus({ preventScroll: true });
      input.dispatchEvent(new Event("input", { bubbles: true }));
    };
    trig.addEventListener("click", () => (open ? close() : show()));
    search.addEventListener("input", () => build(search.value.trim()));
    search.addEventListener("keydown", (e) => listKeys(e, list, pick, close));
    list.addEventListener("click", (e) => { const it = e.target.closest(".opt-item"); it && pick(it); });
    document.addEventListener("click", (e) => !box.contains(e.target) && !pop.contains(e.target) && close());
    bindMask(input, maskFor);
    input._phoneMin = () => maskFor().replace(/[^#]/g, "").length;
    paint();
  }

  /* ---------- Form validation ---------- */
  const rules = {
    required: (v) => v.trim() !== "" || "This field is required",
    email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Enter a valid email address",
    min: (v, n) => !v || v.trim().length >= +n || `At least ${n} characters`,
    phone: (v, _, el) => !v || v.replace(/\D/g, "").length >= (el._phoneMin ? Math.min(el._phoneMin(), 7) : 7) || "Enter a complete phone number",
    date: (v) => {
      if (!v) return true;
      const [d, m, y] = v.split("/").map(Number);
      const dt = new Date(y, m - 1, d);
      return (v.length === 10 && dt.getDate() === d && dt.getMonth() === m - 1 && y > 1920 && dt < new Date()) || "Enter a valid date (DD/MM/YYYY)";
    },
    fdate: (v) => {
      if (!v) return true;
      const [d, m, y] = v.split("/").map(Number);
      const dt = new Date(y, m - 1, d), today = new Date(); today.setHours(0, 0, 0, 0);
      return (v.length === 10 && dt.getDate() === d && dt.getMonth() === m - 1 && dt >= today) || "Choose a valid upcoming date";
    },
    checked: (_, __, el) => el.checked || "Please confirm to continue",
    select: (v) => v !== "" || "Please choose an option",
  };
  function fieldOf(el) { return el.closest(".field") || el.closest(".check") || el.parentElement; }
  function showError(el, msg) {
    const f = fieldOf(el);
    if (el.type === "checkbox") {
      const c = el.closest(".check"); c.classList.toggle("is-invalid", !!msg);
      if (msg) animate($(".check__box", c), { x: [0, -5, 5, -3, 3, 0] }, { duration: 0.4 });
      return;
    }
    const was = f.classList.contains("is-invalid");
    f.classList.toggle("is-invalid", !!msg);
    f.classList.toggle("is-valid", !msg && el.value.trim() !== "" && el.type !== "radio");
    let err = $(":scope > .err", f) || (f.closest("form") && f.parentElement.querySelector(":scope > .err"));
    if (!err) { err = document.createElement("span"); err.className = "err"; f.appendChild(err); }
    const si = $(".state-ico", f);
    if (si) {
      const want = msg ? "circle-alert" : (el.value.trim() ? "circle-check" : "");
      if (si.dataset.icon !== want) {
        si.dataset.icon = want;
        si.replaceChildren(want ? svg(want) : "");
        animate(si, want ? { opacity: [0, 1], scale: [0.4, 1] } : { opacity: 0 }, { duration: 0.3 });
      }
    }
    if (msg) {
      err.innerHTML = `${ico("circle-alert")}<span></span>`; $("span", err).textContent = msg;
      if (!was) animate(err, { height: [0, "auto"], opacity: [0, 1] }, { duration: 0.3 }).then(() => (err.style.height = "auto"));
    } else if (was) {
      animate(err, { height: 0, opacity: 0 }, { duration: 0.25 });
    }
  }
  function validateEl(el) {
    const list = (el.dataset.rules || "").split("|").filter(Boolean);
    let msg = "";
    const v = el.type === "radio" ? ($$(`input[name="${el.name}"]:checked`, el.form)[0]?.value || "") : el.value;
    for (const r of list) {
      const [name, arg] = r.split(":");
      const res = rules[name] ? rules[name](v, arg, el) : true;
      if (res !== true) { msg = res; break; }
    }
    showError(el, msg);
    return !msg;
  }
  function initForm(form, onSubmit) {
    if (!form) return;
    const els = () => $$("[data-rules]", form).filter((el) => el.offsetParent !== null || el.type === "hidden" || el.closest(".cselect") || el.type === "checkbox");
    $$("[data-rules]", form).forEach((el) => {
      const ev = el.type === "checkbox" || el.tagName === "SELECT" || el.type === "radio" ? "change" : "blur";
      el.addEventListener(ev, () => validateEl(el));
      el.addEventListener("input", () => fieldOf(el).classList.contains("is-invalid") && validateEl(el));
    });
    form._validate = (scope = form) => {
      const list = $$("[data-rules]", scope).filter((el) => els().includes(el));
      const seen = new Set();
      let ok = true, first = null;
      list.forEach((el) => {
        if (el.type === "radio") { if (seen.has(el.name)) return; seen.add(el.name); }
        if (!validateEl(el)) { ok = false; first = first || el; }
      });
      if (first) {
        const target = first.closest(".cselect")?.querySelector(".cselect__trigger") || first;
        scrollToTarget(target, 140);
        setTimeout(() => target.focus({ preventScroll: true }), 300);
      }
      return ok;
    };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = $('[type="submit"]', form);
      if (!form._validate()) {
        if (btn) { animate($(".btn__icon svg", btn), { rotate: [0, -16, 14, -8, 0] }, { duration: 0.45 }); }
        toast("Please check the highlighted fields", "error");
        return;
      }
      onSubmit && onSubmit(form, btn);
    });
  }
  function resetForm(form) {
    form.reset();
    $$(".field", form).forEach((f) => f.classList.remove("is-valid", "is-invalid"));
    $$(".state-ico", form).forEach((s) => { s.replaceChildren(); s.dataset.icon = ""; s.style.opacity = 0; });
    $$("select", form).forEach((s) => s._sync && s._sync());
    $$(".err", form).forEach((e) => { e.style.height = 0; });
    $$("textarea[maxlength]", form).forEach((t) => t.dispatchEvent(new Event("input")));
  }

  /* ---------- Textarea counters / steppers ---------- */
  function initCounters(root = document) {
    $$("textarea[maxlength]", root).forEach((t) => {
      const c = t.closest(".field")?.querySelector(".counter");
      if (!c) return;
      const up = () => { c.textContent = `${t.value.length}/${t.maxLength}`; c.classList.toggle("is-max", t.value.length >= t.maxLength); };
      t.addEventListener("input", up); up();
    });
    $$("[data-stepper]", root).forEach((s) => {
      const out = $("output", s), input = $("input", s), min = +s.dataset.min || 0, max = +s.dataset.max || 99;
      const [dec, inc] = $$("button", s);
      const set = (v, dir) => {
        v = Math.max(min, Math.min(max, v));
        input.value = v; out.textContent = v; dec.disabled = v <= min; inc.disabled = v >= max;
        if (dir) animate(out, { y: [dir * 10, 0], opacity: [0, 1] }, { duration: 0.28 });
        input.dispatchEvent(new Event("change", { bubbles: true }));
      };
      dec.addEventListener("click", () => set(+input.value - 1, -1));
      inc.addEventListener("click", () => set(+input.value + 1, 1));
      set(+input.value || min);
    });
  }

  /* ---------- Accordion ---------- */
  function initAccordion(root = document) {
    $$("[data-acc]", root).forEach((acc) => {
      $$(".acc__item", acc).forEach((item) => {
        const btn = $(".acc__btn", item), panel = $(".acc__panel", item);
        btn.addEventListener("click", () => {
          const open = !item.classList.contains("is-open");
          $$(".acc__item.is-open", acc).forEach((o) => {
            if (o === item) return;
            o.classList.remove("is-open"); $(".acc__btn", o).setAttribute("aria-expanded", "false");
            animate($(".acc__panel", o), { height: 0 }, { duration: 0.35 });
          });
          item.classList.toggle("is-open", open);
          btn.setAttribute("aria-expanded", open);
          if (open) {
            animate(panel, { height: [0, panel.scrollHeight + "px"] }, { duration: 0.4 }).then(() => item.classList.contains("is-open") && (panel.style.height = "auto"));
            animate($("div", panel), { opacity: [0, 1], y: [-6, 0] }, { duration: 0.35, delay: 0.08 });
          } else {
            animate(panel, { height: [panel.scrollHeight + "px", 0] }, { duration: 0.35 });
          }
          smoother && setTimeout(() => ScrollTrigger.refresh(), 450);
        });
      });
    });
  }

  /* ---------- Tabs with sliding indicator ---------- */
  function moveInd(tabs, tab, instant) {
    const ind = $(".tabs__ind", tabs);
    if (!ind || !tab) return;
    const kf = { x: tab.offsetLeft, width: tab.offsetWidth };
    instant ? Object.assign(ind.style, { transform: `translateX(${kf.x}px)`, width: kf.width + "px" }) : animate(ind, { x: kf.x + "px", width: kf.width + "px" }, spring);
  }
  function initTabs(root = document) {
    $$("[data-tabs]", root).forEach((tabs) => {
      const all = $$(".tab", tabs);
      const sel = all.find((t) => t.getAttribute("aria-selected") === "true") || all[0];
      requestAnimationFrame(() => moveInd(tabs, sel, true));
      addEventListener("resize", () => moveInd(tabs, $('.tab[aria-selected="true"]', tabs), true));
      all.forEach((t) => t.addEventListener("click", () => {
        all.forEach((x) => x.setAttribute("aria-selected", x === t));
        moveInd(tabs, t);
        const i = $("svg", t); i && animate(i, { rotate: [0, -12, 0], scale: [1, 1.2, 1] }, { duration: 0.4 });
        tabs.dispatchEvent(new CustomEvent("tabchange", { detail: t.dataset.value }));
      }));
    });
  }

  /* ---------- Split headings into masked words (GSAP line-mask reveal) ---------- */
  function splitWords(el) {
    if (el._split) return el._split;
    const words = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const m = document.createElement("span"); m.className = "wm";
            const i = document.createElement("span"); i.className = "wi"; i.textContent = part;
            m.appendChild(i); frag.appendChild(m); words.push(i);
          });
          node.insertBefore(frag, n);
          node.removeChild(n);
        } else if (n.nodeType === 1 && !n.classList.contains("rotator")) walk(n);
      });
    };
    walk(el);
    el._split = words;
    return words;
  }
  function initSplit(root = document) {
    if (mobile) return;
    const els = $$("[data-split], .section .h2, .phead .h1", root).filter((e) => !e.closest(".modal"));
    els.forEach((el) => {
      const words = splitWords(el);
      if (reduced || !window.ScrollTrigger) return;
      gsap.set(words, { yPercent: 110, rotate: 4 });
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: () => gsap.to(words, { yPercent: 0, rotate: 0, duration: 1, ease: "expo.out", stagger: 0.045, delay: +(el.dataset.delay || 0) }),
      });
    });
  }

  /* ---------- Reveal on view ---------- */
  function initReveal(root = document) {
    if (mobile) {
      const targets = $$([
        "[data-reveal]", "#heroTitle", "[data-hero-in]", ".section .h2", ".phead .h1",
        "#bento > .tile", "#collage figure", ".brow", ".g-item", ".acc__item",
        "#abStrip figure", ".ab-team__img", ".ab-tl__item", "#demoForm",
        ".svc__img", ".post__img", ".eitem__img",
      ].join(","), root)
        .filter((el) => el.hasAttribute("data-reveal") || !el.parentElement.closest("[data-reveal]"));
      if (prefersReduced || conn.saveData || !window.gsap || !window.IntersectionObserver) {
        targets.forEach((el) => { el.style.opacity = 1; });
        return;
      }
      // Rich phones get native-scroll parallax. Revert its transforms as soon as the budget falls.
      let parallax;
      function updateParallax() {
        if (parallax) { parallax.revert(); parallax = null; }
        if (motionLevel !== 2 || !window.ScrollTrigger) return;
        parallax = gsap.context(() => {
          $$("#hcMedia img, .phead__img img, .coach__img img", root).forEach((img) => {
            gsap.fromTo(img, { scale: 1.14, yPercent: -3 }, {
              scale: 1.09, yPercent: 3, ease: "none",
              scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            });
          });
        });
      }
      updateParallax();
      window.addEventListener("mojo:motionchange", updateParallax);
      const observer = new IntersectionObserver((entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting) continue;
          observer.unobserve(target);
          target.style.opacity = 1;
          if (!motionLevel) {
            gsap.fromTo(target, { y: 8 }, { y: 0, duration: 0.28, clearProps: "transform" });
            continue;
          }
          const rich = motionLevel === 2;
          gsap.fromTo(target, { opacity: 0, y: rich ? 38 : 22 }, {
            opacity: 1, y: 0, duration: rich ? 0.72 : 0.48, ease: "power2.out",
            clearProps: "transform",
          });
          if (target.matches(".tile, .g-item, #collage figure, #abStrip figure, .svc__img, .post__img")) {
            const image = target.querySelector("img");
            if (image) gsap.from(image, {
              scale: rich ? 1.2 : 1.1, duration: rich ? 1 : 0.65, ease: "power3.out", clearProps: "transform",
            });
          }
          if (rich && target.matches("#heroTitle, .section .h2, .phead .h1")) {
            gsap.from(splitWords(target), {
              yPercent: 85, duration: 0.72, stagger: 0.055, ease: "power3.out", clearProps: "transform",
            });
          }
          if (rich && target.dataset.reveal === "stagger") {
            gsap.from([...target.children].slice(0, 4), {
              y: 8, duration: 0.3, stagger: 0.04, clearProps: "transform",
            });
          }
        }
      });
      targets.forEach((el) => observer.observe(el));
      return;
    }
    const els = $$("[data-reveal]", root);
    if (reduced || !window.ScrollTrigger) { els.forEach((e) => (e.style.opacity = 1)); return; }
    els.forEach((el) => {
      const kids = el.dataset.reveal === "stagger" ? [...el.children] : null;
      if (kids) { el.style.opacity = 1; gsap.set(kids, { opacity: 0, y: 28 }); }
      ScrollTrigger.create({
        trigger: el, start: "top 86%", once: true,
        onEnter: () => kids
          ? gsap.to(kids, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 })
          : gsap.fromTo(el, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1, ease: "expo.out", delay: +(el.dataset.delay || 0) }),
      });
    });
  }

  /* ---------- Count-up numbers ---------- */
  function initCounts(root = document) {
    $$("[data-count]", root).forEach((el) => {
      const to = +el.dataset.count, suf = el.dataset.suffix || "";
      if (reduced || !window.ScrollTrigger) { el.textContent = to + suf; return; }
      el.textContent = "0" + suf;
      const o = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: () => gsap.to(o, { v: to, duration: 1.8, ease: "expo.out", onUpdate: () => (el.textContent = Math.round(o.v) + suf) }),
      });
    });
  }

  /* ---------- Small interactions ---------- */
  function initInteractions() {
    document.addEventListener("click", (e) => {
      const la = e.target.closest(".link-arrow");
      if (la) { la.classList.remove("is-go"); void la.offsetWidth; la.classList.add("is-go"); }
      const cp = e.target.closest("[data-copy]");
      if (cp) {
        e.preventDefault();
        navigator.clipboard?.writeText(cp.dataset.copy).then(() => {
          const holder = $(".copy-ico", cp) || cp;
          const old = $("svg", holder);
          const ok = svg("check");
          old && old.replaceWith(ok);
          animate(ok, { scale: [0.3, 1.2, 1], rotate: [-45, 0] }, { duration: 0.4 });
          toast("Copied to clipboard", "info", 2200);
          setTimeout(() => { const back = svg("copy"); ok.replaceWith(back); animate(back, { opacity: [0, 1], scale: [0.6, 1] }, { duration: 0.3 }); }, 1600);
        });
      }
      // Animate icons on buttons/links when activated (not on hover)
      const act = e.target.closest(".btn:not([type=submit]):not([data-state]) , .icon-btn");
      if (act && !act.closest(".modal__head")) {
        const i = $("svg", act);
        if (i) {
          const n = i.getAttribute("class") || "";
          const kf = /arrow-right|arrow-up-right|send/.test(n) ? { x: [0, 6, 0], y: n.includes("up-right") || n.includes("send") ? [0, -6, 0] : 0 }
            : /chevron-left|arrow-left/.test(n) ? { x: [0, -6, 0] }
            : /calendar|phone|mail/.test(n) ? { rotate: [0, -14, 12, -6, 0] }
            : { scale: [1, 0.8, 1.15, 1] };
          animate(i, kf, { duration: 0.45 });
        }
      }
    });
  }

  function initFooter() {
    const top = $("#toTop");
    top && top.addEventListener("click", () => {
      const i = $(".totop__ico svg", top);
      animate(i, { y: [0, -14, 14, 0], opacity: [1, 0, 0, 1] }, { duration: 0.6 });
      scrollToTarget(0);
    });
    if (!reduced && window.ScrollTrigger) {
    }
  }

  function initNewsletter() {
    const f = $("#newsForm");
    initForm(f, async (form, btn) => {
      await runButton(btn, () => fakeRequest(1200));
      toast("You're subscribed — welcome to the Mojo community");
      setTimeout(() => resetForm(form), 1600);
    });
  }

  /* ---------- Program detail modal (shared) ---------- */
  function openProgram(id) {
    const p = D.programs.find((x) => x.id === id);
    if (!p) return;
    modal({
      title: p.title, size: "wide",
      html: `<div class="modal__hero"><img src="${p.img}" alt="${p.title}"></div>
        <p class="muted">${p.body}</p>
        <div class="kv"><div><small>Duration</small><b>${p.duration}</b></div><div><small>Level</small><b>${p.level}</b></div><div><small>Days</small><b>Sat – Thu</b></div></div>
        <ul class="checks">${p.points.map((x) => `<li>${ico("circle-check")}<span>${x}</span></li>`).join("")}</ul>`,
      foot: `<button class="btn btn--ghost" data-close>Close</button>
        <a class="btn" href="booking.html?program=${p.id}"><span class="btn__icon">${ico("calendar-check")}</span><span class="btn__label">Book this</span></a>`,
      onOpen: (m) => animate($$(".checks li", m.el), { opacity: [0, 1], x: [-8, 0] }, { delay: stagger(0.06, { startDelay: 0.2 }), duration: 0.4 }),
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    // Triggers must be created from the top; the saved position is restored after load
    window.scrollTo(0, 0);
    buildShell();
    renderIcons();
    initScroll();
    initTopNav();
    initBottomNav();
    initMasks();
    $$("select[data-cselect]").forEach(enhanceSelect);
    $$("[data-phone]").forEach(enhancePhone);
    initCounters();
    initAccordion();
    initTabs();
    initSplit();
    initReveal();
    initCounts();
    initInteractions();
    initFooter();
    document.addEventListener("click", (e) => {
      const p = e.target.closest("[data-program]");
      if (p) { e.preventDefault(); openProgram(p.dataset.program); }
    });
    window.dispatchEvent(new Event("mojo:ready"));
    const restore = () => {
      let y = 0;
      try { y = +sessionStorage.getItem(SCROLL_KEY) || 0; } catch (e) {}
      if (location.hash) y = 0;
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      if (y > 0) {
        if (smoother) smoother.scrollTop(y);
        else window.scrollTo(0, y);
        if (window.ScrollTrigger) requestAnimationFrame(() => ScrollTrigger.update());
      }
    };
    document.readyState === "complete" ? setTimeout(restore, 60) : addEventListener("load", () => setTimeout(restore, 60));
  }

  window.UI = {
    $, $$, animate, stagger, spring, reduced, mobile, svg, ico, renderIcons, toast, modal, btnState, runButton, fakeRequest,
    initForm, resetForm, splitWords, initAccordion, initTabs, initCounters, validateEl, showError, enhanceSelect, enhancePhone, initMasks, initReveal, openProgram, openStatus, omanNow,
    scrollToTarget, lockScroll, flag, moveInd,
  };

  // Page scripts render dynamic markup first (deferred), core enhances on DOMContentLoaded.
  document.readyState === "complete" ? boot() : document.addEventListener("DOMContentLoaded", boot);
})();
