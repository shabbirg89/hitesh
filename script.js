/* ════════════════════════════════════════════════════════════
   EDIT YOUR DETAILS HERE — everything on the page reads from this.
   Leave a value as null / '' and that part of the page hides itself
   or shows "to be announced".
   ════════════════════════════════════════════════════════════ */
const CONFIG = {
  // Wedding (phera) date & time, local IST. Example: '2027-02-14T19:15:00+05:30'
  weddingDate: null,
  muhurat: '',                 // e.g. 'Phera Muhurat 7:15 p.m. · Godhuli Lagna'

  venueName: '',               // e.g. 'Shri Rajpurohit Samaj Bhawan'
  venueAddress: '',            // multi-line OK: 'Line 1\nCity, Rajasthan 342001'
  mapQuery: '',                // place name or 'lat,lng' for the map embed

  whatsappNumber: '',          // digits with country code, e.g. '919876543210'
  phoneDisplay: '',            // e.g. '+91 98765 43210'

  // Ceremonies — set `when` once dates are final.
  events: [
    { hi: 'गणेश स्थापना', name: 'Ganesh Sthapana', icon: 'i-ganesh', accent: '#E0701A',
      desc: 'Invoking Vighnaharta’s blessings to begin the celebrations.', when: '' },
    { hi: 'मायरा', name: 'Mayra (Bhaat)', icon: 'i-pot', accent: '#C2185B',
      desc: 'The maternal family arrives bearing gifts and blessings.', when: '' },
    { hi: 'पीठी · हल्दी', name: 'Pithi & Haldi', icon: 'i-haldi', accent: '#E3A112',
      desc: 'Turmeric, laughter and songs of the women of the house.', when: '' },
    { hi: 'मेहंदी · महिला संगीत', name: 'Mehendi & Sangeet', icon: 'i-hand', accent: '#2F7D4A',
      desc: 'Henna, ghoomar and folk songs late into the night.', when: '' },
    { hi: 'निकासी · तोरण', name: 'Nikasi & Toran', icon: 'i-horse', accent: '#7A1020',
      desc: 'The baraat sets out and the groom strikes the toran.', when: '' },
    { hi: 'पाणिग्रहण · फेरे', name: 'Phere', icon: 'i-fire', accent: '#B0164E',
      desc: 'Seven sacred rounds around the holy fire.', when: '' },
    { hi: 'प्रीतिभोज', name: 'Preetibhoj', icon: 'i-thali', accent: '#0F6B66',
      desc: 'A traditional Rajasthani feast with family and friends.', when: '' },
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
  $('#mapLink').href = `https://www.google.com/maps/search/?api=1&query=${enc}`;
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

/* 8 · Entry gate */
(function gate() {
  const el = $('#gate');
  const open = () => {
    el.classList.add('open');
    document.body.classList.remove('gate-up');
    petals();
    setTimeout(() => el.classList.add('gone'), reduceMotion ? 0 : 1800);
  };
  $('#gateBtn').addEventListener('click', open);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !el.classList.contains('open')) open(); });
  $('#gateBtn').focus({ preventScroll: true });
})();
