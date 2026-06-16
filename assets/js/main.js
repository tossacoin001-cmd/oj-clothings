/* OJ CLOTHINGS — MAIN JS */

const WA = "https://wa.me/2349167728000?text=Hello%20OJ%20Clothings%2C%20I%27d%20like%20to%20make%20an%20enquiry";

/* ---- Page Transition ---- */
function goTo(href){
  const c = document.getElementById('curtain');
  if(c) c.classList.add('active');
  document.body.classList.add('page-out');
  setTimeout(()=>{ window.location.href = href; }, 450);
}

document.addEventListener('click', e=>{
  const a = e.target.closest('a[href]');
  if(!a) return;
  const href = a.getAttribute('href');
  if(!href || href.startsWith('#') || href.startsWith('http') ||
     href.startsWith('//') || href.startsWith('tel:') ||
     href.startsWith('mailto:') || href.startsWith('wa.') ||
     a.target === '_blank') return;
  e.preventDefault();
  goTo(href);
});

/* ---- Active Nav ---- */
(function(){
  const raw = window.location.pathname.split('/').pop();
  const p = raw.replace(/\.html$/, '') || 'index';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href = (a.getAttribute('href')||'').split('?')[0];
    const h = href.split('/').pop().replace(/\.html$/,'') || 'index';
    if(h === p) a.classList.add('active');
  });
})();

/* ---- Scroll Progress ---- */
(function(){
  const bar = document.getElementById('progress-bar');
  if(!bar) return;
  window.addEventListener('scroll',()=>{
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max>0 ? window.scrollY/max*100 : 0)+'%';
  },{passive:true});
})();

/* ---- Sticky Nav ---- */
(function(){
  const nav = document.querySelector('header.nav');
  if(!nav) return;
  const tick=()=> nav.classList.toggle('solid', window.scrollY > 60);
  window.addEventListener('scroll', tick, {passive:true});
  tick();
})();

/* ---- Custom Cursor ---- */
(function(){
  if(window.matchMedia('(hover:none)').matches) return;
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if(!dot||!ring) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{ mx=e.clientX; my=e.clientY;
    dot.style.left=mx+'px'; dot.style.top=my+'px';
  });
  (function loop(){ rx+=(mx-rx)*.11; ry+=(my-ry)*.11;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.col-card,.prod,.occ,.fab,.chip').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('hover'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('hover'));
  });
  document.addEventListener('mouseleave',()=>{dot.style.opacity=0;ring.style.opacity=0});
  document.addEventListener('mouseenter',()=>{dot.style.opacity=1;ring.style.opacity=1});
})();

/* ---- Scroll Reveal ---- */
(function(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }});
  },{threshold:0.1,rootMargin:'0px 0px -50px 0px'});
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el=>obs.observe(el));
})();

/* ---- Mobile Menu ---- */
function toggleMenu(){
  const ov = document.querySelector('.mob-overlay');
  const mn = document.querySelector('.mob-nav');
  const bg = document.querySelector('.burger');
  if(!ov||!mn) return;
  const open = mn.classList.toggle('open');
  ov.classList.toggle('open', open);
  bg && bg.classList.toggle('open', open);
}
function closeMenu(){
  document.querySelector('.mob-overlay')?.classList.remove('open');
  document.querySelector('.mob-nav')?.classList.remove('open');
  document.querySelector('.burger')?.classList.remove('open');
}
document.querySelector('.mob-overlay')?.addEventListener('click', closeMenu);
document.querySelector('.mob-close')?.addEventListener('click', closeMenu);

/* ---- Theme ---- */
function toggleTheme(){
  const l = document.body.classList.toggle('light');
  localStorage.setItem('oj-theme', l?'light':'dark');
}
if(localStorage.getItem('oj-theme')==='light') document.body.classList.add('light');

/* ---- OJ Concierge ---- */
function openOJ(){
  const p = document.querySelector('.oj-panel');
  const f = document.querySelector('.fab-cluster');
  if(!p) return;
  p.classList.add('open');
  if(f) f.style.opacity='0';
}
function closeOJ(){
  const p = document.querySelector('.oj-panel');
  const f = document.querySelector('.fab-cluster');
  if(p) p.classList.remove('open');
  if(f) f.style.removeProperty('opacity');
}
function askOJ(msg){
  openOJ();
  addMsg(msg,'me');
  setTimeout(()=> addMsg(getReply(msg),'oj'), 750);
}
function addMsg(text,from){
  const body = document.querySelector('.oj-body');
  if(!body) return;
  const d = document.createElement('div');
  d.className='msg '+from; d.textContent=text;
  body.appendChild(d); body.scrollTop=body.scrollHeight;
}
function getReply(msg){
  const m = msg.toLowerCase();
  if(/agbada/.test(m)) return 'Our Agbada collection runs from ₦185,000 (ready-to-wear) up to ₦850,000 for bespoke ceremonial pieces — crafted in premium damask, aso-oke, and hand-embroidered satin. Want to see options?';
  if(/jalabia|al.turath/.test(m)) return 'The Al-Turath Jalabia starts from ₦92,000 ready-to-wear and ₦200,000+ for custom pieces. Pure heritage, refined for the modern man. Shall I connect you with our team?';
  if(/kaftan/.test(m)) return 'Kaftans from ₦74,000 — the Sahel two-piece is a current favourite. Relaxed luxury for everyday elegance. Would you like to know more?';
  if(/suit|suede/.test(m)) return 'Tailored suits from ₦160,000 (made-to-measure) to ₦800,000 for premium suede and signature pieces. Custom measurements available in-store or virtually.';
  if(/price|cost|much/.test(m)) return 'Prices range from ₦74,000 (ready-to-wear kaftans) to ₦850,000 (bespoke agbada). Our team on WhatsApp can give you an exact quote.';
  if(/store|location|where|address/.test(m)) return 'Two Lekki stores: Admiralty Mall (Lekki Phase 1) and Ikota Shopping Complex (VGC). Both open Mon–Sat, 9am–7pm.';
  if(/ship|deliver|worldwide/.test(m)) return 'Yes — we ship worldwide. Lagos delivery: 24–48hrs. International: 5–10 working days. Every piece is carefully packaged.';
  if(/fitting|measure|mtm|custom|bespoke/.test(m)) return 'We offer in-store fittings at both Lekki locations and virtual measurements via WhatsApp. Our tailor will guide you through every detail.';
  if(/order|buy|purchase/.test(m)) return "To place an order, chat our team on WhatsApp. We'll confirm your measurements, fabric choice, and timeline personally.";
  return 'Thank you for reaching out to OJ Clothings. Our team can assist with collections, sizing, and bespoke orders. For immediate help, chat us on WhatsApp — we respond within minutes.';
}
function sendOJ(){
  const inp = document.querySelector('.oj-input input');
  if(!inp||!inp.value.trim()) return;
  askOJ(inp.value.trim()); inp.value='';
}
document.querySelector('.oj-input input')?.addEventListener('keydown',e=>{ if(e.key==='Enter') sendOJ(); });

/* ---- Collection filter (collections.html) ---- */
function filterProducts(cat){
  document.querySelectorAll('.filter-btn').forEach(b=> b.classList.toggle('active', b.dataset.cat===cat));
  document.querySelectorAll('.prod-item').forEach(p=>{
    const show = cat==='all' || p.dataset.cat===cat;
    p.style.display = show ? '' : 'none';
    if(show) setTimeout(()=> p.classList.add('in'),10);
    else p.classList.remove('in');
  });
}
