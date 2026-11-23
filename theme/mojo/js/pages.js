/* ==========================================================================
   Mojo Equestrian — Page logic
   Phase 1 (on script run): render data-driven markup
   Phase 2 (on "mojo:ready"): GSAP scroll scrubbing & interactions
   ========================================================================== */
(() => {
  const D = window.MOJO, U = window.UI, { $, $$, ico, animate, stagger } = U;
  const page = document.body.dataset.page;
  const useScrollEffects = () => window.gsap && window.ScrollTrigger && !U.reduced && !U.mobile;
  const desktop = "(min-width: 992px)";

  /* ======================= Availability (shared by hero & booking) ======================= */
  function slotsFor(date) {
    const now = U.omanNow();
    const today = date.toDateString() === now.toDateString();
    const time = [now.getHours(), now.getMinutes()].map(n => String(n).padStart(2, "0")).join(":");
    return D.contact.slots.split(",").map(s => s.trim())
      .filter(s => s >= D.contact.open && s < D.contact.close)
      .map(t => ({ t, full: today && t <= time }));
  }
  const dayOpen = date => !D.contact.closed.includes(date.getDay()) && slotsFor(date).some(slot => !slot.full);

  const R = {
    board(el) {
      if (!el) return;
      el.insertAdjacentHTML("beforeend", D.achievements.map((a, i) => {
        const m = a;
        return `<div class="brow${i === D.achievements.length - 1 ? " is-top" : ""}" role="row">
          <span class="brow__pos" role="cell">${String(i + 1).padStart(2, "0")}</span>
          <span class="brow__season" role="cell" data-final="${a.year.replace(/\s/g, "")}">${a.year.replace(/\s/g, "")}</span>
          <span class="brow__img" role="cell"><img src="${m.img}" alt="" loading="lazy"></span>
          <span class="brow__txt" role="cell"><b>${a.title}</b><p>${a.text}</p></span>
          <span class="brow__res brow__res--${m.tone}" role="cell">${ico(m.icon)}${m.res}</span>
        </div>`;
      }).join(""));
    },
    sponsors(el) {
      if (!el) return;
      const logos = D.sponsors.map((x) => `<img src="${x.src}" alt="${x.name}" loading="lazy">`).join("");
      el.innerHTML = `<div class="logos__track">${logos}${logos}${logos}</div>`;
    },
    faq(el) {
      if (!el) return;
      el.innerHTML = D.faqs.map((f, i) => `
        <div class="acc__item"><button class="acc__btn" aria-expanded="false" aria-controls="faq${i}">
          <span class="acc__n">${String(i + 1).padStart(2, "0")}</span><span>${f.q}</span><span class="pm" aria-hidden="true"></span></button>
        <div class="acc__panel" id="faq${i}" role="region"><div>${f.a}</div></div></div>`).join("");
      el.setAttribute("data-reveal", "stagger");
    },
    pageHeaderParallax() {
      const img = $(".phead__img img");
      if (img && useScrollEffects()) {
        gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 2, ease: "expo.out" });
        gsap.to(img, { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".phead", start: "top top", end: "bottom top", scrub: true } });
        gsap.to(".phead__in", { y: -50, opacity: 0.3, ease: "none", scrollTrigger: { trigger: ".phead", start: "top top", end: "bottom top", scrub: true } });
      }
      animate($$(".phead__in > :not(.h1)"), { opacity: [0, 1], y: [18, 0] }, { delay: stagger(0.08, { startDelay: 0.35 }), duration: 0.9 });
    },
  };

  /* ======================= Shared inits ======================= */
  // Results board: rows flip in like a split-flap display, seasons scramble then settle
  function initBoard() {
    const board = $("#board");
    if (!board || !useScrollEffects()) return;
    const rows = $$(".brow", board);
    gsap.set(rows, { rotateX: -92, opacity: 0, transformPerspective: 900 });
    const scramble = (el) => {
      const final = el.dataset.final, chars = "0123456789";
      const o = { p: 0 };
      gsap.to(o, {
        p: 1, duration: 0.55, ease: "power2.out",
        onUpdate: () => {
          const keep = Math.floor(o.p * final.length);
          el.textContent = [...final].map((c, k) => (k < keep || !/\d/.test(c) ? c : chars[(Math.random() * 10) | 0])).join("");
        },
        onComplete: () => (el.textContent = final),
      });
    };
    ScrollTrigger.create({
      trigger: board, start: "top 90%", once: true,
      onEnter: () => {
        gsap.from($(".board__head", board), { y: -20, opacity: 0, duration: 0.6, ease: "expo.out" });
        rows.forEach((r, i) => {
          const d = 0.05 + i * 0.12;
          gsap.to(r, { rotateX: 0, opacity: 1, duration: 0.8, ease: "back.out(1.4)", delay: d });
          gsap.delayedCall(d + 0.1, () => scramble($(".brow__season", r)));
          gsap.from($(".brow__img", r), { clipPath: "inset(0 100% 0 0 round 12px)", duration: 0.9, ease: "expo.inOut", delay: d + 0.2 });
          gsap.from($(".brow__res", r), { scale: 0.4, opacity: 0, duration: 0.7, ease: "back.out(2.2)", delay: d + 0.45 });
          gsap.from($(".brow__res svg", r), { rotate: -120, duration: 0.8, ease: "back.out(2)", delay: d + 0.5 });
        });
      },
    });
  }

  // Partner logos: seamless GSAP loop
  function initLogos() {
    const box = $("#sponsors");
    if (!box || !D.sponsors.length) return;
    const track = $(".logos__track", box);
    box.appendChild(track.cloneNode(true)).setAttribute("aria-hidden", "true");
    if (!window.gsap || U.reduced) return;
    const tracks = $$(".logos__track", box);
    const loop = gsap.to(tracks, { xPercent: -100, ease: "none", repeat: -1, duration: () => track.offsetWidth / 45 });
    box.addEventListener("mouseenter", () => gsap.to(loop, { timeScale: 0.25, duration: 0.6 }));
    box.addEventListener("mouseleave", () => gsap.to(loop, { timeScale: 1, duration: 0.6 }));
    if (window.ScrollTrigger) ScrollTrigger.create({ trigger: box, start: "top bottom", end: "bottom top", onToggle: (st) => (st.isActive ? loop.play() : loop.pause()) });
  }

  function lightbox(list, start) {
    let i = start;
    const m = U.modal({
      bare: true, size: "media", label: "Image viewer",
      html: `<div class="lightbox"><img class="lightbox__img" alt="">
        <div class="lightbox__bar"><span class="chip chip--dark" id="lbTag"></span><span class="lb-count" id="lbCount"></span>
          <span class="flex gap-1"><button class="icon-btn" id="lbPrev" aria-label="Previous">${ico("chevron-left")}</button>
          <button class="icon-btn" id="lbNext" aria-label="Next">${ico("chevron-right")}</button>
          <button class="icon-btn" data-close aria-label="Close">${ico("x")}</button></span></div></div>`,
    });
    const img = $(".lightbox__img", m.el);
    const show = (dir = 0) => {
      const it = list[i];
      img.src = it.src; img.alt = it.tag;
      $("#lbTag", m.el).textContent = it.tag;
      $("#lbCount", m.el).textContent = `${i + 1} / ${list.length}`;
      if (dir) animate(img, { opacity: [0, 1], x: [dir * 40, 0] }, { duration: 0.4 });
    };
    const go = (d) => { i = (i + d + list.length) % list.length; show(d); animate($(d > 0 ? "#lbNext svg" : "#lbPrev svg", m.el), { x: [0, d * 5, 0] }, { duration: 0.3 }); };
    $("#lbPrev", m.el).onclick = () => go(-1);
    $("#lbNext", m.el).onclick = () => go(1);
    const key = (e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    document.addEventListener("keydown", key);
    let sx = null;
    img.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    img.addEventListener("touchend", (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); sx = null; });
    const obs = new MutationObserver(() => { if (!document.body.contains(m.el)) { document.removeEventListener("keydown", key); obs.disconnect(); } });
    obs.observe(document.body, { childList: true });
    show();
  }

  function successModal({ title, text, ref, actions = "" }) {
    U.modal({
      label: title, html: `<div class="modal-center">
        <div class="modal-icon" id="okIcon">${ico("check")}</div>
        <h3 class="h3" style="font-size:1.25rem">${title}</h3><p>${text}</p>
        ${ref ? `<button class="chip" data-copy="${ref}" style="height:36px;margin-top:6px;cursor:copy"><span class="copy-ico">${ico("copy")}</span>Ref ${ref}</button>` : ""}
        <div class="flex wrap gap-1 mt-2" style="justify-content:center">${actions || '<button class="btn" data-close autofocus><span class="btn__label">Done</span></button>'}</div></div>`,
      bare: false, title: "",
      onOpen: (m) => {
        const box = $("#okIcon", m.el), p = $("path", box);
        animate(box, { scale: [0.4, 1.08, 1] }, { duration: 0.55 });
        if (p && p.getTotalLength) { const L = p.getTotalLength(); p.style.strokeDasharray = L; animate(p, { strokeDashoffset: [L, 0] }, { duration: 0.5, delay: 0.2 }); }
      },
    });
  }
  async function submitRequest(form, extra = {}) {
    const body = new FormData(form);
    if (body.has("addon")) body.set("addon", body.getAll("addon").join(", "));
    body.set("action", "mojo_request");
    body.set("kind", form.id);
    body.set("nonce", MOJO_WP.nonce);
    for (const [key, value] of Object.entries(extra)) body.set(key, value);
    const response = await fetch(MOJO_WP.ajax, { method: "POST", body });
    if (response.status === 403) throw new Error("Refresh this page and submit again.");
    if (response.status === 422) throw new Error("Check the information entered and try again.");
    if (response.status === 429) throw new Error("Please wait a moment before submitting again.");
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error("Submission failed");
    return result.data.reference;
  }

  // Grid filtering: fade out in place → swap → stagger in. Items never leave the layout flow,
  // so nothing can overlap the tabs or the footer; the grid height eases between states.
  let filterRun = 0;
  function flipFilter(container, items, test, emptyEl) {
    const visible = items.filter(test);
    const run = ++filterRun;
    const showEmpty = () => {
      if (!emptyEl) return;
      const was = emptyEl.classList.contains("is-on");
      emptyEl.classList.toggle("is-on", !visible.length);
      if (!visible.length && !was) animate(emptyEl, { opacity: [0, 1], y: [10, 0] }, { duration: 0.4 });
    };
    const apply = () => items.forEach((it) => (it.style.display = test(it) ? "" : "none"));
    if (!window.gsap || U.reduced) { apply(); showEmpty(); return visible.length; }
    gsap.killTweensOf([container, ...items]);
    const current = items.filter((it) => it.style.display !== "none");
    gsap.to(current, {
      opacity: 0, y: -10, duration: 0.18, ease: "power2.in",
      onComplete: () => {
        if (run !== filterRun) return;
        const h0 = container.offsetHeight;
        apply(); showEmpty();
        const h1 = container.offsetHeight;
        gsap.set(items, { clearProps: "transform" });
        gsap.fromTo(container, { height: h0, overflow: "clip" }, { height: h1, duration: 0.45, ease: "power3.inOut", clearProps: "height,overflow", onComplete: () => window.ScrollTrigger && ScrollTrigger.refresh() });
        gsap.fromTo(visible, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out", stagger: 0.05, clearProps: "transform" });
      },
    });
    return visible.length;
  }

  /* ======================= HOME ======================= */
  const home = {
    render() {
      // scoreboard digits
      $$("[data-roll]").forEach((el) => {
        const str = el.dataset.roll, suf = el.dataset.suffix || "";
        el.setAttribute("aria-label", str + suf);
        el.innerHTML = [...str].map(() => `<span class="digit"><span class="digit__col">${[...Array(20).keys()].map((k) => `<span>${k % 10}</span>`).join("")}</span></span>`).join("") + (suf ? `<span>${suf}</span>` : "");
      });
      // gallery (kept) — each column repeats so no column ever runs short
      const g = $("#gallery"), cols = [[], [], []];
      D.gallery.forEach((it, i) => cols[i % 3].push({ ...it, i }));
      g.innerHTML = cols.map((c) => `<div class="gallery__col">${[...c, ...c].map((it) => `
        <button class="g-item" data-g="${it.i}" style="--ar:${it.ar}" aria-label="Open image: ${it.tag}"><img src="${it.src}" alt="${it.tag}" loading="lazy"><span class="chip chip--dark g-item__tag">${it.tag}</span></button>`).join("")}</div>`).join("");
      R.board($("#board"));
      R.faq($("#faq"));
      $("#faq").removeAttribute("data-reveal");
      R.sponsors($("#sponsors"));
    },

    init() {
      home.status();
      home.motion();
      home.intro();
      initBoard();
      initLogos();
      $("#gallery").addEventListener("click", (e) => { const b = e.target.closest("[data-g]"); b && lightbox(D.gallery, +b.dataset.g); });
      U.initForm($("#demoForm"), async (form, btn) => {
        try {
          const ref = await U.runButton(btn, () => submitRequest(form));
          
          setTimeout(() => { successModal({ title: "Thank you!", text: "Your demo request is in. We'll call you within one working day to arrange your visit.", ref }); U.resetForm(form); }, 700);
        } catch (error) { U.toast(navigator.onLine ? (error.message || "Please try again.") : "Reconnect to send your request.", "error"); }
      });
      home.digits();
      if (!useScrollEffects()) return;

      // Hero: pinned scrub — full-screen photo shrinks into a rounded frame
      const mmh = gsap.matchMedia();
      mmh.add("(min-width: 768px)", () => {
        const navH = () => $("#topnav").offsetHeight;
        const tl = gsap.timeline({ scrollTrigger: { trigger: "#hero", start: () => `top ${navH()}px`, end: "+=80%", scrub: 0.8, pin: true, invalidateOnRefresh: true,
          onToggle: (st) => document.documentElement.classList.toggle("nav-lock", st.isActive) } });
        tl.fromTo("#hcMedia", { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(9% 5% 9% 5% round 28px)", ease: "power2.inOut", duration: 1 }, 0)
          .fromTo("#hcMedia img", { scale: 1.18 }, { scale: 1, ease: "none", duration: 1 }, 0)
          .to("#hcIn", { y: -70, opacity: 0, ease: "power1.in", duration: 0.55 }, 0)
          .to(".hc__scroll", { opacity: 0, duration: 0.15 }, 0)
          .fromTo("#hcCap", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3 }, 0.7);
      });
      mmh.add("(max-width: 767.98px)", () => {
        gsap.to("#hcMedia img", { yPercent: 8, scale: 1.08, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
        gsap.to("#hcIn", { y: -40, ease: "none", scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true } });
      });

      // ===== Scroll-linked choreography (every section follows the scroll) =====
      const scrub = (trigger, start, end, s = 0.8) => ({ trigger, start, end, scrub: s });

      // Bento: each tile rises and opens from its own corner as it scrolls in
      $$("#bento .tile").forEach((tile, i) => {
        const st = scrub(tile, "top bottom", "top 62%");
        gsap.fromTo(tile, { y: 90, clipPath: "inset(18% 12% 0% 12% round 18px)" }, { y: 0, clipPath: "inset(0% 0% 0% 0% round 18px)", ease: "power2.out", scrollTrigger: st });
        const img = $("img", tile);
        if (img) gsap.fromTo(img, { scale: 1.35 }, { scale: 1, ease: "none", scrollTrigger: st });
        const txt = $$(".tile__body, .tile__bib, .tile__go, .ico, .big, .link-w", tile);
        gsap.fromTo(txt, { y: 30, opacity: 0 }, { y: 0, opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: scrub(tile, "top 92%", "top 68%") });
      });

      // About us: photos wipe open in sequence, text items slide in with the scroll
      $$("#collage figure").forEach((f, i) => gsap.fromTo(f, { clipPath: "inset(100% 0% 0% 0% round 14px)" }, { clipPath: "inset(0% 0% 0% 0% round 14px)", ease: "none", scrollTrigger: scrub("#collage", `top ${95 - i * 6}%`, `top ${55 - i * 6}%`) }));
      gsap.to("#collage .c1 img", { yPercent: -8, scale: 1.12, ease: "none", scrollTrigger: scrub("#collage", "top bottom", "bottom top", true) });
      gsap.fromTo("#collage .c2, #collage .c3", { y: 40 }, { y: -40, ease: "none", scrollTrigger: scrub("#collage", "top bottom", "bottom top", true) });
      const aboutCol = $("#collage").parentElement.querySelector("[data-reveal]");
      gsap.fromTo($$(".checks li", aboutCol), { x: -40, opacity: 0 }, { x: 0, opacity: 1, ease: "none", stagger: 0.15, scrollTrigger: scrub(aboutCol, "top 80%", "top 40%") });
      gsap.fromTo($$(".stat", aboutCol), { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: "none", stagger: 0.12, scrollTrigger: scrub($(".stats", aboutCol), "top 95%", "top 65%") });

      // Achievements: the whole board lifts and settles into place
      gsap.fromTo("#board", { y: 80, scale: 0.94, transformOrigin: "50% 0%" }, { y: 0, scale: 1, ease: "none", scrollTrigger: scrub("#board", "top bottom", "top 60%") });

      // Highlights: columns drift at different speeds, each photo opens as it reaches view
      const gal = $("#gallery");
      $$("#gallery .gallery__col").forEach((c, i) => {
        const span = () => Math.min(Math.max(0, c.scrollHeight - gal.clientHeight), gal.clientHeight * 0.32);
        const up = i % 2 === 0;
        gsap.fromTo(c, { y: () => (up ? 0 : -span()) }, { y: () => (up ? -span() : 0), ease: "none", scrollTrigger: { trigger: gal, start: "top bottom", end: "bottom top", scrub: 1.2 + i * 0.3, invalidateOnRefresh: true } });
      });
      $$("#gallery .g-item").forEach((g) => gsap.fromTo(g, { clipPath: "inset(100% 0% 0% 0% round 14px)" }, { clipPath: "inset(0% 0% 0% 0% round 14px)", ease: "none", scrollTrigger: scrub(g, "top bottom", "top 78%", 0.6) }));

      // Key staff: portrait opens, photo settles, text and signature follow the scroll
      const coach = $(".coach");
      gsap.fromTo(".coach__img", { clipPath: "inset(0% 0% 100% 0% round 20px)" }, { clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "none", scrollTrigger: scrub(coach, "top 90%", "top 40%") });
      gsap.fromTo(".coach__img img", { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: scrub(coach, "top 90%", "center 50%") });
      const coachBody = $(".coach__img", coach).nextElementSibling;
      gsap.fromTo($$(":scope > *:not(.coach__sig)", coachBody), { y: 50, opacity: 0 }, { y: 0, opacity: 1, ease: "none", stagger: 0.12, scrollTrigger: scrub(coach, "top 80%", "top 35%") });
      gsap.fromTo(".coach .coach__sig", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: scrub(".coach .coach__sig", "top 92%", "top 65%") });

      // FAQ: questions slide in one after another with the scroll
      $$("#faq .acc__item").forEach((it) => gsap.fromTo(it, { x: 70, opacity: 0 }, { x: 0, opacity: 1, ease: "none", scrollTrigger: scrub(it, "top 98%", "top 78%", 0.6) }));
      gsap.fromTo(".askpill", { x: -40, opacity: 0 }, { x: 0, opacity: 1, ease: "none", scrollTrigger: scrub(".askpill", "top 95%", "top 75%") });

      // Join today: background drifts, steps and form rise with the scroll
      gsap.fromTo(".demo3__img img", { yPercent: -12 }, { yPercent: 0, ease: "none", scrollTrigger: scrub("#demo", "top bottom", "bottom top", true) });
      $$("#dsteps li").forEach((li, i) => gsap.fromTo(li, { x: -60, opacity: 0 }, { x: 0, opacity: 1, ease: "none", scrollTrigger: scrub("#dsteps", `top ${92 - i * 6}%`, `top ${62 - i * 6}%`) }));
      gsap.fromTo("#demoForm", { y: 100, clipPath: "inset(12% 0% 0% 0% round 20px)" }, { y: 0, clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "none", scrollTrigger: scrub("#demoForm", "top bottom", "top 55%") });
    },

    status() {
      const st = U.openStatus();
      $("#liveStatus").textContent = st.label;
      $("#liveDot").classList.toggle("is-closed", !st.open);
    },

    intro() {
      if (U.mobile || U.reduced || !window.gsap) return;
      const words = U.splitWords($("#heroTitle"));
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo("#hcMedia img", { scale: 1.35 }, { scale: 1.18, duration: 2.6, ease: "power3.out" }, 0)
        .from("#hcMedia", { opacity: 0, duration: 1.2, ease: "power2.out" }, 0)
        .from(home.chars(words), { yPercent: 110, rotateX: -85, opacity: 0, transformPerspective: 600, duration: 1.1, stagger: 0.035, ease: "back.out(1.6)" }, 0.35)
        .from("[data-hero-in]", { y: 22, opacity: 0, duration: 1, stagger: 0.1 }, 0.55)
        .from(".hc__scroll", { y: -12, opacity: 0, duration: 0.8 }, 1.1);
    },

    // Split already-split words into characters (for the hero title)
    chars(words) {
      const out = [];
      words.forEach((w) => {
        const t = w.textContent; w.textContent = "";
        [...t].forEach((c) => { const sp = document.createElement("span"); sp.className = "ch"; sp.textContent = c; w.appendChild(sp); out.push(sp); });
      });
      return out;
    },

    // Page-wide choreography for the homepage
    motion() {
      if (!useScrollEffects()) return;
      // Scroll progress bar
      const bar = document.createElement("span"); bar.className = "scrollbar"; document.body.appendChild(bar);
      gsap.to(bar, { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 } });

      // Eyebrows: dash draws in, label slides
      $$("main .eyebrow").filter((e) => !e.closest(".hc")).forEach((e) => {
        gsap.set(e, { "--ew": 0 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: e, start: "top 90%", once: true } });
        tl.to(e, { "--ew": 1, duration: 0.6, ease: "expo.out" }).from(e, { x: -10, opacity: 0, duration: 0.6, ease: "expo.out" }, 0);
      });

      // Gallery: items open one by one; columns skew with scroll velocity
      const cols = $$("#gallery .gallery__col");
      const skew = cols.map((c) => gsap.quickTo(c, "skewY", { duration: 0.5, ease: "power3" }));
      let rest;
      ScrollTrigger.create({
        trigger: "#gallery", start: "top bottom", end: "bottom top",
        onUpdate: (st) => {
          const v = gsap.utils.clamp(-4, 4, st.getVelocity() / -400);
          skew.forEach((q, i) => q(v * (i % 2 ? -1 : 1)));
          clearTimeout(rest); rest = setTimeout(() => skew.forEach((q) => q(0)), 140);
        },
      });

    },

    // Scoreboard: digits roll like a stadium board
    digits() {
      $$("[data-roll]").forEach((el) => {
        const str = el.dataset.roll, cols = $$(".digit__col", el);
        const to = (c, i) => -(10 + +str[i]) * c.firstElementChild.offsetHeight;
        if (U.reduced || !window.ScrollTrigger) { cols.forEach((c, i) => (c.style.transform = `translateY(${to(c, i)}px)`)); return; }
        ScrollTrigger.create({
          trigger: el, start: "top 98%", once: true,
          onEnter: () => cols.forEach((c, i) => gsap.fromTo(c, { y: 0 }, { y: to(c, i), duration: 0.9 + (cols.length - i) * 0.12, ease: "power3.inOut" })),
        });
      });
    },

  };

  /* ======================= ABOUT ======================= */
  const about = {
    render() { R.sponsors($("#sponsors")); },
    init() {
      R.pageHeaderParallax();
      initLogos();
      const items = $$(".ab-tl__item");
      if (!useScrollEffects()) { items.forEach((i) => i.classList.add("is-on")); window.gsap && gsap.set("#abTlFill", { scaleX: 1, scaleY: 1 }); return; }
      // Story strip: each photo drifts at its own pace
      $$("#abStrip img").forEach((img, i) => gsap.fromTo(img, { yPercent: -4 - i * 3 }, { yPercent: 4 + i * 3, ease: "none", scrollTrigger: { trigger: "#abStrip", start: "top bottom", end: "bottom top", scrub: true } }));
      gsap.from("#abStrip figure", { clipPath: "inset(100% 0 0 0 round 20px)", duration: 1.2, ease: "expo.inOut", stagger: 0.12, scrollTrigger: { trigger: "#abStrip", start: "top 85%", once: true } });
      // Pillars photo parallax
      gsap.fromTo("#abPillarImg img", { yPercent: -6 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: "#abPillarImg", start: "top bottom", end: "bottom top", scrub: true } });
      // Timeline: line draws with scroll, dots light up as it passes
      const mm = gsap.matchMedia();
      const light = (prog) => items.forEach((it, i) => it.classList.toggle("is-on", prog >= (i / Math.max(1, items.length - 1)) * 0.92));
      const tl = { trigger: "#abTl", start: "top 75%", end: "bottom 55%", scrub: 0.6, onUpdate: (st) => light(st.progress) };
      mm.add(desktop, () => { gsap.fromTo("#abTlFill", { scaleX: 0, scaleY: 1 }, { scaleX: 1, ease: "none", scrollTrigger: tl }); });
      mm.add("(max-width: 991.98px)", () => { gsap.fromTo("#abTlFill", { scaleY: 0, scaleX: 1 }, { scaleY: 1, ease: "none", scrollTrigger: tl }); });
      items.forEach((it) => {
        gsap.from(it.querySelectorAll("time, h3, p"), { y: 20, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: it, start: "top 85%", once: true } });
      });
    },
  };

  /* ======================= SERVICES ======================= */
  const services = {
    render() {
      $("#svcGrid").innerHTML = D.programs.map((p) => `
        <article class="svc" id="${p.id}" data-cat="${p.cat}" data-q="${(p.title + " " + p.short).toLowerCase()}">
          <div class="svc__img"><img src="${p.img}" alt="${p.title}" loading="lazy"><span class="chip chip--orange">${ico(p.icon)}${p.cat[0].toUpperCase() + p.cat.slice(1)}</span></div>
          <div class="svc__body"><h3 class="h3">${p.title}</h3><p>${p.short}</p></div>
          <div class="svc__foot">
            <div class="svc__meta"><span>${ico("clock")}${p.duration}</span><span>${ico("users")}${p.level}</span></div>
            <button class="btn btn--sm btn--ghost" data-program="${p.id}"><span class="btn__label">Details</span><span class="btn__icon">${ico("arrow-up-right")}</span></button>
          </div>
        </article>`).join("");
      const counts = { all: D.programs.length };
      D.programs.forEach((p) => (counts[p.cat] = (counts[p.cat] || 0) + 1));
      $$("#svcTabs .count").forEach((c) => (c.textContent = counts[c.dataset.c] || 0));
    },
    init() {
      R.pageHeaderParallax();
      const items = $$("#svcGrid .svc"), search = $("#svcSearch"), empty = $("#svcEmpty");
      let cat = "all", q = "";
      const apply = () => flipFilter($("#svcGrid"), items, (it) => (cat === "all" || it.dataset.cat === cat) && (!q || it.dataset.q.includes(q)), empty);
      $("#svcTabs").addEventListener("tabchange", (e) => { cat = e.detail; apply(); });
      let t;
      search.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => { q = search.value.trim().toLowerCase(); apply(); }, 180); });
      $("#svcReset")?.addEventListener("click", () => { search.value = ""; q = ""; $('#svcTabs .tab[data-value="all"]').click(); });
      if (!U.reduced) animate(items, { opacity: [0, 1], y: [20, 0] }, { delay: stagger(0.06, { startDelay: 0.2 }), duration: 0.55 });
      const h = location.hash.slice(1);
      if (h && D.programs.some((p) => p.id === h)) setTimeout(() => U.openProgram(h), 500);
      window.addEventListener("hashchange", () => { const id = location.hash.slice(1); D.programs.some((p) => p.id === id) && U.openProgram(id); });
    },
  };

  /* ======================= EVENTS ======================= */
  const events = {
    render() {},
    init() {
      R.pageHeaderParallax();
      const sel = $("#evType");
      $$("[data-pick]").forEach((b) => b.addEventListener("click", () => {
        $$(".pkg").forEach((p) => p.classList.toggle("is-pick", p === b.closest(".pkg")));
        sel.value = b.dataset.pick; sel.dispatchEvent(new Event("change", { bubbles: true }));
        U.validateEl(sel);
        const form = $("#eventForm");
        U.scrollToTarget(form, 100);
        U.toast(`${b.closest(".pkg").querySelector("h3").textContent} selected`, "info", 2400);
      }));
      sel.addEventListener("change", () => $$(".pkg").forEach((p) => p.classList.toggle("is-pick", p.dataset.pkg === sel.value)));
      U.initForm($("#eventForm"), async (form, btn) => {
        try {
          const ref = await U.runButton(btn, () => submitRequest(form));
          setTimeout(() => {
            successModal({ title: "Inquiry received", text: `Thanks — our events team will get back to you about your ${sel.selectedOptions[0].text.toLowerCase()} within 24 hours.`, ref });
            U.resetForm(form); $$(".pkg").forEach((p) => p.classList.remove("is-pick"));
          }, 700);
        } catch (error) { U.toast(navigator.onLine ? (error.message || "Please try again.") : "Reconnect to send your request.", "error"); }
      });
      if (useScrollEffects()) $$(".eitem").forEach((e) => gsap.from(e, { opacity: 0, y: 30, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: e, start: "top 88%" } }));
    },
  };

  /* ======================= BOOKING (wizard) ======================= */
  const booking = {
    render() {
      const bookable = D.programs.filter((p) => p.bookable === "yes");
      $("#progChoices").innerHTML = bookable.map((p) => `
        <label class="rcard"><input type="radio" name="program" value="${p.id}" data-rules="required">
          <span class="rcard__in"><span class="rcard__img"><img src="${p.img}" alt="" loading="lazy"></span>
          <span class="rcard__txt"><b>${p.title}</b><small>${ico("clock")}${p.duration} · ${p.level}</small></span><span class="radio__dot"></span></span></label>`).join("");
      const nat = $("#nationality");
      nat.innerHTML = `<option value="">Select nationality</option><optgroup label="Gulf region">${D.gcc.map((iso) => { const c = D.countries.find((x) => x.iso === iso); return `<option value="${c.iso}">${c.name}</option>`; }).join("")}</optgroup>
        <optgroup label="All countries">${D.countries.filter((c) => !D.gcc.includes(c.iso)).map((c) => `<option value="${c.iso}">${c.name}</option>`).join("")}</optgroup>`;
    },
    init() {
      R.pageHeaderParallax();
      const form = $("#bookForm"), steps = $$(".wstep", form), bars = $$(".steps__item");
      let step = 0;
      const state = { date: null, time: null };
      U.initForm(form, null);
      // Enter = next step (capture so the generic submit validator doesn't run on hidden steps)
      form.addEventListener("submit", (e) => { e.preventDefault(); e.stopImmediatePropagation(); $("#nextBtn").click(); }, true);

      // Preselect program from URL
      const pre = new URLSearchParams(location.search).get("program");
      const options = $$("input[name=program]", form);
      const preInput = options.find(option => option.value === pre);
      if (!options.length) {
        $("#nextBtn").disabled = true;
        $("input[name=ltype]", form)?.closest(".field")?.before("Booking is temporarily unavailable.");
        return;
      }
      (preInput || options[0]).checked = true;

      // ---- Step navigation
      const paintSteps = () => {
        bars.forEach((b, i) => {
          b.classList.toggle("is-current", i === step);
          b.classList.toggle("is-done", i < step);
          const n = $(".n", b);
          n.replaceChildren(i < step ? U.svg("check") : document.createTextNode(i + 1));
          animate($(".steps__bar i", b), { scaleX: i < step ? 1 : i === step ? 0.5 : 0 }, { duration: 0.5 });
        });
        $("#backBtn").style.visibility = step === 0 ? "hidden" : "visible";
        $("#wzCount").textContent = `Step ${step + 1} of ${steps.length}`;
        $("#wzName").textContent = ["Program", "Date & time", "Rider details", "Review & confirm"][step];
        const next = $("#nextBtn");
        $(".btn__label", next).textContent = step === steps.length - 1 ? "Confirm booking" : "Continue";
        next.dataset.idleLabel = $(".btn__label", next).textContent;
      };
      const goTo = (n) => {
        const dir = n > step ? 1 : -1, from = steps[step], to = steps[n];
        animate(from, { opacity: 0, x: -24 * dir }, { duration: 0.2 }).then(() => {
          from.classList.remove("is-active");
          to.classList.add("is-active");
          animate(to, { opacity: [0, 1], x: [24 * dir, 0] }, { duration: 0.4 });
          animate($$(":scope > *", to), { opacity: [0, 1], y: [10, 0] }, { delay: stagger(0.05), duration: 0.35 });
        });
        step = n; paintSteps(); summary();
        const top = $("#wizardTop");
        U.scrollToTarget(top, 90);
      };
      const validStep = () => {
        if (step === 1) {
          if (!state.date) { U.toast("Pick a date for your lesson", "warn"); animate("#cal", { x: [0, -6, 6, -3, 0] }, { duration: 0.4 }); return false; }
          if (!state.time) { U.toast("Choose a time slot", "warn"); animate("#slots", { x: [0, -6, 6, -3, 0] }, { duration: 0.4 }); return false; }
          return true;
        }
        const ok = form._validate(steps[step]);
        if (!ok) U.toast("Please check the highlighted fields", "error");
        return ok;
      };
      $("#nextBtn").addEventListener("click", async () => {
        if (!validStep()) return;
        if (step < steps.length - 1) return goTo(step + 1);
        const btn = $("#nextBtn");
        try {
          const ref = await U.runButton(btn, () => submitRequest(form, { date: [state.date.getFullYear(), String(state.date.getMonth()+1).padStart(2,"0"), String(state.date.getDate()).padStart(2,"0")].join("-"), time: state.time }));
          setTimeout(() => successModal({
            title: "Booking request received", ref,
            text: `${progTitle()} on ${fmtDate(state.date)} at ${state.time}. Our team will confirm availability.`,
            actions: `<a class="btn btn--ghost" href="${MOJO_WP.home}"><span class="btn__icon">${ico("house")}</span><span class="btn__label">Home</span></a><button class="btn" data-close><span class="btn__label">Done</span></button>`,
          }), 700);
        } catch (error) { U.toast(navigator.onLine ? (error.message || "Please try again.") : "Reconnect to send your request.", "error"); }
      });
      $("#backBtn").addEventListener("click", () => step > 0 && goTo(step - 1));
      bars.forEach((b, i) => b.addEventListener("click", () => { if (i < step) goTo(i); }));
      form.addEventListener("click", (e) => { const ed = e.target.closest("[data-goto]"); if (ed) { e.preventDefault(); goTo(+ed.dataset.goto); } });

      // ---- Calendar (Sat-first week)
      const cal = $("#cal");
      const today = U.omanNow(); today.setHours(0, 0, 0, 0);
      const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + 60);
      let view = new Date(today.getFullYear(), today.getMonth(), 1);
      const fmt = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
      const fmtDate = (d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
      const drawCal = (dir = 0) => {
        const first = new Date(view), startPad = (first.getDay() + 1) % 7; // Sat = 0
        const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
        let h = "";
        for (let i = 0; i < startPad; i++) h += `<span class="cal__day is-empty"></span>`;
        for (let d = 1; d <= days; d++) {
          const dt = new Date(view.getFullYear(), view.getMonth(), d);
          const off = dt < today || dt > maxDate || !dayOpen(dt);
          const sel = state.date && +dt === +state.date;
          h += `<button type="button" class="cal__day${+dt === +today ? " is-today" : ""}" data-d="${+dt}" ${off ? "disabled" : ""} aria-pressed="${!!sel}" aria-label="${dt.toDateString()}">${d}</button>`;
        }
        $(".cal__grid", cal).innerHTML = h;
        const title = $(".cal__title span", cal);
        title.textContent = fmt.format(view);
        $("#calPrev").disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
        $("#calNext").disabled = new Date(view.getFullYear(), view.getMonth() + 1, 1) > maxDate;
        if (dir) {
          animate(title, { y: [dir * 20, 0], opacity: [0, 1] }, { duration: 0.35 });
          animate($(".cal__grid", cal), { x: [dir * 30, 0], opacity: [0, 1] }, { duration: 0.35 });
        }
      };
      $("#calPrev").onclick = () => { view.setMonth(view.getMonth() - 1); drawCal(-1); };
      $("#calNext").onclick = () => { view.setMonth(view.getMonth() + 1); drawCal(1); };
      cal.addEventListener("click", (e) => {
        const b = e.target.closest(".cal__day[data-d]");
        if (!b) return;
        state.date = new Date(+b.dataset.d); state.time = null;
        $$(".cal__day", cal).forEach((x) => x.setAttribute("aria-pressed", x === b));
        animate(b, { scale: [0.85, 1] }, { type: "spring", stiffness: 500, damping: 20 });
        drawSlots(); summary();
      });

      // ---- Time slots (shared availability rules — see slotsFor at top)
      const drawSlots = () => {
        const box = $("#slots");
        if (!state.date) { box.innerHTML = `<p class="muted" style="grid-column:1/-1;font-size:14px">Pick a date to see available times.</p>`; return; }
        box.innerHTML = slotsFor(state.date).map((s) =>
          `<label class="slot"><input type="radio" name="slot" value="${s.t}" ${s.full ? "disabled" : ""}><span>${s.t}</span></label>`).join("");
        animate($$(".slot", box), { opacity: [0, 1], y: [8, 0] }, { delay: stagger(0.03), duration: 0.3 });
      };
      $("#slots").addEventListener("change", (e) => { state.time = e.target.value; animate(e.target.nextElementSibling, { scale: [0.9, 1] }, { type: "spring", stiffness: 500, damping: 18 }); summary(); });
      drawCal(); drawSlots();

      // Arriving from the hero quick-booking bar: pre-fill riders & date, open at step 2
      const qs = new URLSearchParams(location.search);
      const riders = Math.min(6, Math.max(1, +qs.get("riders") || 1));
      if (riders > 1) {
        const st = $("[data-stepper]", form);
        $("input", st).value = riders; $("output", st).textContent = riders;
        $$("button", st)[0].disabled = false; $$("button", st)[1].disabled = riders >= 6;
      }
      const qd = +qs.get("date");
      if (qd && preInput) {
        const d = new Date(qd);
        const ok = d >= today && d <= maxDate && dayOpen(d);
        if (ok) { state.date = d; view = new Date(d.getFullYear(), d.getMonth(), 1); drawCal(); drawSlots(); }
        else setTimeout(() => U.toast("No lesson times are available that day — please pick another date", "warn"), 900);
        setTimeout(() => goTo(1), 300);
      }

      // ---- Live summary
      const progTitle = () => D.programs.find((p) => p.id === form.querySelector("input[name=program]:checked")?.value)?.title || "";
      const summary = () => {
        const v = {
          sProgram: progTitle(),
          sType: form.querySelector("input[name=ltype]:checked")?.value || "",
          sRiders: form.riders.value + (form.riders.value === "1" ? " rider" : " riders"),
          sDate: state.date ? fmtDate(state.date) : "",
          sTime: state.time || "",
          sName: form.fullname.value.trim(),
          sPhone: form.phone.value ? `${form.querySelector("[name=phone_code]")?.value || ""} ${form.phone.value}` : "",
          sEmail: form.email.value.trim(),
          sLevel: form.querySelector("input[name=rlevel]:checked")?.value || "",
        };
        Object.entries(v).forEach(([id, val]) => {
          $$(`[data-s="${id}"]`).forEach((el) => {
            const next = val || "—";
            if (el.textContent !== next) {
              el.textContent = next; el.classList.toggle("is-empty", !val);
              if (val) animate(el, { opacity: [0, 1], x: [6, 0] }, { duration: 0.3 });
            }
          });
        });
      };
      form.addEventListener("change", summary);
      form.addEventListener("input", summary);
      paintSteps(); summary();
    },
  };

  /* ======================= CONTACT ======================= */
  const contact = {
    render() {
      const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const todayIdx = (U.omanNow().getDay() + 1) % 7;
      $("#hours").innerHTML = days.map((d, i) => `<div class="${i === todayIdx ? "is-today" : ""}"><span>${d}${i === todayIdx ? " · Today" : ""}</span><span>${D.contact.closed.includes((i + 6) % 7) ? "Closed" : D.contact.open + " – " + D.contact.close}</span></div>`).join("");
    },
    init() {
      R.pageHeaderParallax();
      const st = U.openStatus();
      $("#cStatus").textContent = st.label;
      $("#cDot").classList.toggle("is-closed", !st.open);
      U.initForm($("#contactForm"), async (form, btn) => {
        try {
          await U.runButton(btn, () => submitRequest(form));
          U.toast("Message sent — we'll reply within one working day");
          setTimeout(() => U.resetForm(form), 1800);
        } catch (error) { U.toast(navigator.onLine ? (error.message || "Please try again.") : "Reconnect to send your request.", "error"); }
      });
    },
  };

  const pages = { home, about, services, events, booking, contact };
  const P = pages[page];
  if (!P) return;
  P.render && P.render();
  window.addEventListener("mojo:ready", () => {
    P.init && P.init();
    // a single refresh happens in core after load (then scroll is restored)
  });
})();
