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
const ojHistory = [];
let ojCurrentProduct = null;

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
function addMsg(text,from){
  const body = document.querySelector('.oj-body');
  if(!body) return;
  const d = document.createElement('div');
  d.className='msg '+from; d.textContent=text;
  body.appendChild(d); body.scrollTop=body.scrollHeight;
  return d;
}
function addTyping(){
  const body = document.querySelector('.oj-body');
  if(!body) return null;
  const d = document.createElement('div');
  d.className='msg oj pm-typing-msg';
  d.innerHTML = '<div class="pm-typing"><span></span><span></span><span></span></div>';
  body.appendChild(d); body.scrollTop=body.scrollHeight;
  return d;
}
async function askOJ(msg){
  openOJ();
  addMsg(msg,'me');
  ojHistory.push({role:'me', content: msg});
  const typing = addTyping();
  try{
    const res = await fetch('/api/oj', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({ messages: ojHistory, product: ojCurrentProduct }),
    });
    if(!res.ok) throw new Error('bad status');
    const data = await res.json();
    typing?.remove();
    const reply = data.reply || getReply(msg);
    addMsg(reply,'oj');
    ojHistory.push({role:'oj', content: reply});
  }catch(err){
    typing?.remove();
    const reply = getReply(msg);
    addMsg(reply,'oj');
    ojHistory.push({role:'oj', content: reply});
  }
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

/* ================================================================
   PRODUCT DETAIL MODAL — opens alongside OJ, never replaces it
   ================================================================ */
const PRODUCT_COPY = {
  'agbada-blue': {
    fabric: '<b>Fabric:</b> premium damask & aso-oke, hand-embroidered satin trim.',
    desc: 'A statement ceremonial agbada — heavy, lustrous drape with hand-embroidery across the chest. Built for owambe, weddings, and the moments you want to be remembered in.',
    sizes: ['S','M','L','XL','XXL','Custom'],
  },
  'obsidian-agbada': {
    fabric: '<b>Fabric:</b> matte obsidian weave, structured shoulder.',
    desc: 'Agbada without the shine — a deep matte black weave with a structured, modern silhouette. Quiet luxury for the man who doesn’t need to shout.',
    sizes: ['S','M','L','XL','XXL','Custom'],
  },
  'jalabia-ivory': {
    fabric: '<b>Fabric:</b> featherweight ivory cotton-blend, hand-finished collar.',
    desc: 'Heritage Al-Turath jalabia, refined for daily wear. Breathable, light against the skin, with a hand-finished collar that holds its shape all day.',
    sizes: ['S','M','L','XL','XXL'],
  },
  'al-turath-collection': {
    fabric: '<b>Fabric:</b> your choice of premium cotton, linen, or silk-blend.',
    desc: 'Custom Al-Turath jalabia, cut to your exact measurements. Pure heritage tailoring, modern fit — built piece by piece for you.',
    sizes: ['Custom'],
  },
  'sahel-kaftan': {
    fabric: '<b>Fabric:</b> relaxed linen-cotton weave.',
    desc: 'The easiest entry point into the OJ wardrobe — a breathable two-piece kaftan built for everyday elegance, not just special occasions.',
    sizes: ['S','M','L','XL','XXL'],
  },
  'kembe-classic': {
    fabric: '<b>Fabric:</b> tailored in your choice of fabric.',
    desc: 'A made-to-measure kaftan set, fitted for comfort and quiet refinement. Every seam built around your frame.',
    sizes: ['Custom'],
  },
  'suede-suit': {
    fabric: '<b>Fabric:</b> genuine suede, soft hand-feel.',
    desc: 'Bold, rare, unmistakably premium. Genuine suede with structured tailoring — limited runs, made for the man who wants to stand apart.',
    sizes: ['S','M','L','XL','XXL'],
  },
  'signature-suit': {
    fabric: '<b>Fabric:</b> finest wool blend, full canvas construction.',
    desc: 'OJ’s flagship tailored suit. Full canvas construction, hand-finished buttonholes — built to outlast trends.',
    sizes: ['S','M','L','XL','XXL','Custom'],
  },
  'onyx-suit': {
    fabric: '<b>Fabric:</b> deep onyx-tone wool blend.',
    desc: 'Sharp, modern, made-to-measure. A precise silhouette in deep onyx tones for the man who means business.',
    sizes: ['Custom'],
  },
};

function injectProductModal(){
  if(document.querySelector('.pm-overlay')) return;
  const ov = document.createElement('div');
  ov.className = 'pm-overlay';
  ov.innerHTML = `
    <div class="product-modal">
      <button class="pm-close" onclick="closeProductModal()">&#x2715;</button>
      <div class="pm-img"><img alt=""></div>
      <div class="pm-body">
        <div class="pm-tag"></div>
        <div class="pm-name"></div>
        <div class="pm-price"></div>
        <div class="pm-desc"></div>
        <div class="pm-fabric"></div>
        <div>
          <div class="pm-label" style="margin-bottom:10px">Size</div>
          <div class="pm-sizes"></div>
        </div>
        <div class="pm-ctas">
          <button class="btn btn-solid pm-wa-btn">Reserve via WhatsApp</button>
          <a href="made-to-measure.html" class="btn btn-ghost">Book a Fitting</a>
          <button class="pm-ask-oj" onclick="askOJAboutProduct()">
            <img src="assets/img/logo.jpg" alt="OJ"> Ask OJ about this piece
          </button>
        </div>
        <div class="pm-measure">
          <button class="pm-measure-toggle" onclick="toggleMeasureForm()">+ Send My Measurements</button>
          <div class="pm-measure-form">
            <div class="pm-measure-grid">
              <input type="text" id="pmHeight" placeholder="Height (cm)">
              <input type="text" id="pmChest" placeholder="Chest (cm)">
              <input type="text" id="pmWaist" placeholder="Waist (cm)">
              <input type="text" id="pmShoulder" placeholder="Shoulder (cm)">
              <textarea id="pmNotes" placeholder="Fabric preference, occasion, or anything else..."></textarea>
            </div>
            <button class="btn btn-champagne" style="margin-top:12px;width:100%;justify-content:center" onclick="sendMeasurements()">Send to OJ Clothings</button>
          </div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{ if(e.target === ov) closeProductModal(); });
}

let pmSelectedSize = '';

function openProduct(el){
  injectProductModal();
  const id = el.dataset.id;
  const copy = PRODUCT_COPY[id] || {fabric:'', desc:'', sizes:['S','M','L','XL']};
  const img = el.querySelector('.prod-img img');
  const tag = el.querySelector('.tag');
  const name = el.querySelector('.pn')?.textContent || '';
  const price = el.querySelector('.pp')?.textContent || '';

  ojCurrentProduct = { id, name, price, fabric: copy.desc + ' ' + (copy.fabric||'').replace(/<\/?b>/g,'') };
  pmSelectedSize = '';

  const ov = document.querySelector('.pm-overlay');
  const modalImg = ov.querySelector('.pm-img img');
  if(img){ modalImg.src = img.src; modalImg.style.display=''; ov.querySelector('.pm-img').style.background=''; }
  else { modalImg.style.display='none'; ov.querySelector('.pm-img').style.background = getComputedStyle(el.querySelector('.prod-img')).background; }

  const pmTag = ov.querySelector('.pm-tag');
  pmTag.textContent = tag?.textContent || '';
  pmTag.style.display = tag ? '' : 'none';
  ov.querySelector('.pm-name').textContent = name;
  ov.querySelector('.pm-price').textContent = price;
  ov.querySelector('.pm-desc').textContent = copy.desc;
  ov.querySelector('.pm-fabric').innerHTML = copy.fabric;

  const sizesEl = ov.querySelector('.pm-sizes');
  sizesEl.innerHTML = '';
  copy.sizes.forEach(s=>{
    const b = document.createElement('button');
    b.className='pm-size-btn'; b.textContent=s;
    b.onclick = ()=>{ pmSelectedSize = s; sizesEl.querySelectorAll('.pm-size-btn').forEach(x=>x.classList.remove('active')); b.classList.add('active'); };
    sizesEl.appendChild(b);
  });

  ov.querySelector('.pm-wa-btn').onclick = ()=>{
    const sizeTxt = pmSelectedSize ? ` Size: ${pmSelectedSize}.` : '';
    const text = encodeURIComponent(`Hello OJ Clothings, I'd like to reserve: ${name} (${price}).${sizeTxt}`);
    window.open(`https://wa.me/2349167728000?text=${text}`, '_blank');
  };

  ov.querySelector('.pm-measure-form').classList.remove('open');
  ov.querySelector('.pm-measure-toggle').textContent = '+ Send My Measurements';

  ov.classList.add('open');
}
function closeProductModal(){
  document.querySelector('.pm-overlay')?.classList.remove('open');
  ojCurrentProduct = null;
}
function toggleMeasureForm(){
  const f = document.querySelector('.pm-measure-form');
  const t = document.querySelector('.pm-measure-toggle');
  const open = f.classList.toggle('open');
  t.textContent = open ? '− Hide Measurements' : '+ Send My Measurements';
}
function sendMeasurements(){
  const h = document.getElementById('pmHeight').value.trim();
  const c = document.getElementById('pmChest').value.trim();
  const w = document.getElementById('pmWaist').value.trim();
  const s = document.getElementById('pmShoulder').value.trim();
  const n = document.getElementById('pmNotes').value.trim();
  const name = ojCurrentProduct?.name || 'a piece';
  let msg = `Hello OJ Clothings, I'd like to send my measurements for: ${name}.`;
  if(h) msg += ` Height: ${h}cm.`;
  if(c) msg += ` Chest: ${c}cm.`;
  if(w) msg += ` Waist: ${w}cm.`;
  if(s) msg += ` Shoulder: ${s}cm.`;
  if(n) msg += ` Notes: ${n}.`;
  window.open(`https://wa.me/2349167728000?text=${encodeURIComponent(msg)}`, '_blank');
}
function askOJAboutProduct(){
  openOJ();
  const name = ojCurrentProduct?.name || 'this piece';
  askOJ(`Tell me about ${name}`);
}
