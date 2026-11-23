/* ════════════════════════════════════════════════════════════
   EDIT YOUR DETAILS HERE — everything on the page reads from this.
   Leave a value as null / '' and that part of the page hides itself
   or shows "to be announced".
   ════════════════════════════════════════════════════════════ */
const CONFIG = {
  // Wedding date & time, IST
  weddingDate: '2027-01-27T22:00:00+05:30',
  muhurat: 'Wedding 10:00 p.m. onwards',

  venueName: 'Botiyon ka Bas, Kherwa',
  venueAddress: 'Kherwa, Pali\nRajasthan',
  mapQuery: 'Botiyon ka bas, Kherwa, Pali, Rajasthan',          // used for the embedded map
  mapLink: 'https://maps.app.goo.gl/uLQ2JEhzBJKKmwVP9?g_st=aw', // exact pin for "View Location"

  // Background music — put a song file at this path (e.g. music/background.mp3).
  // If the file is missing, a built-in Rajasthani-style instrumental plays instead.
  music: 'music/background.mp3',

  whatsappNumber: '918806595177',
  phoneDisplay: '+91 88065 95177',

  events: [
    { hi: 'पीठी · हल्दी', name: 'Haldi', icon: 'i-haldi', accent: '#E3A112',
      desc: 'Turmeric, laughter and songs of the women of the house.',
      when: 'Tue, 26 Jan 2027 · 10:00 a.m. onwards' },
    { hi: 'महिला संगीत', name: 'Sangeet', icon: 'i-hand', accent: '#C2185B',
      desc: 'Ghoomar, folk songs and dancing late into the night.',
      when: 'Tue, 26 Jan 2027 · 8:00 p.m. onwards' },
    { hi: 'बारात प्रस्थान', name: 'Baraat Prasthan', icon: 'i-horse', accent: '#7A1020',
      desc: 'The baraat sets out with dhol, safas and the groom on his ghodi.',
      when: 'Wed, 27 Jan 2027 · 4:00 p.m.' },
    { hi: 'शुभ विवाह · पाणिग्रहण', name: 'Wedding', icon: 'i-fire', accent: '#0F6B66',
      desc: 'Seven sacred rounds around the holy fire.',
      when: 'Wed, 27 Jan 2027 · 10:00 p.m. onwards' },
  ],
};

/* ──────────────────────────────────────────────────────────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const date = CONFIG.weddingDate ? new Date(CONFIG.weddingDate) : null;
const fmt = (opts) => date ? date.toLocaleDateString('en-IN', { ...opts, timeZone: 'Asia/Kolkata' }) : '';

/* 1 · Fill text */
(function fill() {
  const values = {
    dateLong: date ? fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Wedding date to be announced',
    dateShort: date ? fmt({ day: 'numeric', month: 'long', year: 'numeric' }) : 'Shubh Vivah',
    muhurat: CONFIG.muhurat,
    venueName: CONFIG.venueName || 'Venue to be announced',
    venueAddress: CONFIG.venueAddress,
    phoneLine: CONFIG.phoneDisplay ? `Or call us on ${CONFIG.phoneDisplay}` : '',
  };
  $$('[data-c]').forEach((el) => { el.textContent = values[el.dataset.c] ?? ''; });
})();

/* 2 · Map */
(function map() {
  const q = CONFIG.mapQuery;
  if (!q) return;
  const enc = encodeURIComponent(q);
  $('#mapLink').href = CONFIG.mapLink || `https://www.google.com/maps/search/?api=1&query=${enc}`;
  $('#dirLink').href = `https://www.google.com/maps/dir/?api=1&destination=${enc}`;
  $('#venueActions').hidden = false;
  const box = $('#mapBox');
  box.innerHTML = `<iframe title="Map of the wedding venue" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
    src="https://maps.google.com/maps?q=${enc}&z=15&hl=en&output=embed"></iframe>`;
  box.hidden = false;
})();

/* 3 · WhatsApp RSVP */
(function rsvp() {
  const msg = 'Ram Ram Sa! 🙏 We would be delighted to attend the wedding of Hitesh & Jinal.\nName:\nNumber of guests:';
  const url = CONFIG.whatsappNumber
    ? `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`
    : `https://wa.me/?text=${encodeURIComponent(msg)}`;
  $$('.js-wa').forEach((a) => { a.href = url; a.target = '_blank'; a.rel = 'noopener'; });
})();

/* 4 · Ceremonies */
(function events() {
  $('#eventGrid').innerHTML = CONFIG.events.map((e) => `
    <li class="event reveal" style="--accent:${e.accent}">
      <div class="event-ico"><svg aria-hidden="true"><use href="#${e.icon}"/></svg></div>
      <p class="event-hi">${e.hi}</p>
      <h4>${e.name}</h4>
      <p class="desc">${e.desc}</p>
      <p class="when">${e.when || 'Date &amp; time to be shared'}</p>
    </li>`).join('');
})();

/* 5 · Countdown */
(function countdown() {
  if (!date || isNaN(date)) return;
  const box = $('#countdown');
  box.hidden = false;
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    let s = Math.max(0, Math.floor((date - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    $('#cdD').textContent = d; $('#cdH').textContent = pad(h);
    $('#cdM').textContent = pad(m); $('#cdS').textContent = pad(s);
  };
  tick(); setInterval(tick, 1000);
})();

/* 6 · Reveal on scroll + active nav */
(function observe() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  $$('.reveal').forEach((el) => io.observe(el));

  const links = $$('.nav a');
  const nav = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main > [id]').forEach((s) => nav.observe(s));
})();

/* 7 · Falling marigold & rose petals */
function petals(count = 36) {
  if (reduceMotion) return;
  const box = $('#petals');
  const colors = ['#F4A823', '#E0701A', '#C2185B', '#F7B733', '#D94A6A'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = 5 + Math.random() * 5 + 's';
    p.style.animationDelay = Math.random() * 3 + 's';
    p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
    p.style.setProperty('--rot', (360 + Math.random() * 540) + 'deg');
    p.addEventListener('animationend', () => p.remove());
    box.appendChild(p);
  }
}

/* 8 · Background music
   Plays CONFIG.music if that file exists; otherwise falls back to a gentle
   built-in instrumental (tanpura drone + santoor melody in Raag Bhupali + soft dholak),
   generated live in the browser — no file needed. */
function makeRaagSynth(ctx) {
  const master = ctx.createGain();
  master.gain.value = 0;
  // simple reverb from a generated impulse response
  const verb = ctx.createConvolver();
  const len = ctx.sampleRate * 2.6, ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
  }
  verb.buffer = ir;
  const wet = ctx.createGain(); wet.gain.value = 0.35;
  master.connect(ctx.destination);
  verb.connect(wet).connect(ctx.destination);
  const bus = ctx.createGain();
  bus.connect(master); bus.connect(verb);

  const SA = 146.83; // D3
  const hz = (semi) => SA * Math.pow(2, semi / 12);
  const BPM = 84, EIGHTH = 60 / BPM / 2;

  // Bhupali: S R G P D (0 2 4 7 9), upper octave +12. null = rest.
  const S = 12, R = 14, G = 16, P = 19, D = 21, S2 = 24, R2 = 26, Pl = 7, Dl = 9;
  const tune = [
    G, P, D, S2, D, P, G, R,      S, R, G, P, G, null, null, null,
    G, P, D, P, D, S2, R2, S2,    D, P, G, P, D, null, null, null,
    S2, D, P, G, P, D, S2, D,     P, G, R, S, R, G, null, null,
    G, R, G, P, D, P, G, R,       S, null, Dl, S, S, null, null, null,
    Pl, Dl, S, R, G, null, R, G,  P, G, R, S, Dl, null, S, null,
    G, G, P, P, D, D, S2, null,   R2, S2, D, P, G, R, S, null,
  ];
  // dholak (keherwa, 8 eighths): 1 = low "dha", 2 = high "ta", 0 = rest
  const dhol = [1, 0, 2, 2, 1, 2, 1, 2];
  const tanpura = [Pl - 12, 0, 0, -12]; // Pa Sa Sa Sa(low), one every 4 eighths

  function pluck(t, f, vel = 0.22, dur = 1.6) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4200;
    g.connect(lp).connect(bus);
    [[1, 1, 'triangle'], [2, 0.35, 'sine'], [3, 0.15, 'sine'], [1.003, 0.4, 'triangle']].forEach(([m, a, type]) => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type; o.frequency.value = f * m; og.gain.value = a;
      o.connect(og).connect(g); o.start(t); o.stop(t + dur + 0.05);
    });
  }
  function drone(t, f) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + EIGHTH * 7);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100; lp.Q.value = 6;
    lp.frequency.setValueAtTime(2200, t); lp.frequency.exponentialRampToValueAtTime(600, t + EIGHTH * 6);
    g.connect(lp).connect(bus);
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
    o.connect(g); o.start(t); o.stop(t + EIGHTH * 7 + 0.05);
  }
  let noise;
  function drum(t, kind) {
    if (kind === 1) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.25);
      g.gain.setValueAtTime(0.32, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      o.connect(g).connect(master); o.start(t); o.stop(t + 0.4);
    } else {
      if (!noise) {
        noise = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
        const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      const s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = noise; bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = 3;
      g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      s.connect(bp).connect(g).connect(master); s.start(t); s.stop(t + 0.12);
    }
  }

  let step = 0, next = 0, timer = null;
  function schedule() {
    while (next < ctx.currentTime + 0.25) {
      const n = tune[step % tune.length];
      const bar = Math.floor(step / 8);
      if (n !== null) pluck(next, hz(n), step % 2 ? 0.16 : 0.22);
      if (step % 4 === 0) drone(next, hz(tanpura[(step / 4) % 4]));
      if (bar >= 2) { const k = dhol[step % 8]; if (k) drum(next, k); } // drums join after 2 bars
      next += EIGHTH; step++;
    }
  }
  return {
    play() {
      if (timer) return;
      next = ctx.currentTime + 0.1;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2.5);
      timer = setInterval(schedule, 60); schedule();
    },
    pause() {
      clearInterval(timer); timer = null;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(0, ctx.currentTime);
    },
    get playing() { return !!timer; },
  };
}

const music = (function () {
  const audio = $('#bgm');
  const btn = $('#musicBtn');
  let ctx = null, synth = null, mode = null; // mode: 'file' | 'synth'

  const playing = () => (mode === 'file' ? !audio.paused : !!synth && synth.playing);
  const sync = () => {
    const on = playing();
    btn.hidden = false;
    btn.classList.toggle('off', !on);
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
  };
  const useSynth = () => {
    if (!ctx) return;
    mode = 'synth';
    synth = synth || makeRaagSynth(ctx);
    ctx.resume().then(() => { synth.play(); sync(); });
  };

  audio.addEventListener('play', () => mode === 'file' && sync());
  audio.addEventListener('pause', () => mode === 'file' && sync());
  btn.addEventListener('click', () => {
    if (mode === 'file') { audio.paused ? audio.play().catch(() => {}) : audio.pause(); return; }
    if (synth && synth.playing) synth.pause(); else useSynth();
    sync();
  });

  return {
    // Must be called from the tap/click so the browser allows sound.
    start() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) { ctx = new AC(); ctx.resume(); }
      if (!CONFIG.music) return useSynth();
      audio.src = CONFIG.music;
      audio.volume = 0.55;
      mode = 'file';
      audio.play().then(sync).catch(useSynth);
    },
  };
})();

/* 9 · Entry gate */
(function gate() {
  const el = $('#gate');
  const open = () => {
    el.classList.add('open');
    document.body.classList.remove('gate-up');
    petals();
    music.start();
    setTimeout(() => el.classList.add('gone'), reduceMotion ? 0 : 1800);
  };
  $('#gateBtn').addEventListener('click', open);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !el.classList.contains('open')) open(); });
  $('#gateBtn').focus({ preventScroll: true });
})();
