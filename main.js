/* ================================================
   TWOLANES — main.js
   Handles: partial loading, scroll effects,
            mobile menu, reveal animations, forms
   ================================================ */

/* --------------------------------------------------
   PARTIAL TEMPLATES (fallback if fetch not available)
   -------------------------------------------------- */
   const HEADER_HTML = `<header class="header" id="header">
   <nav class="nav container">
     <a href="index.html" class="logo">
       <div class="logo-mark"><span></span><span></span><span></span></div>
       TWOLANES
     </a>
     <ul class="nav-links" id="navLinks">
       <li><a href="index.html#fuer-wen">Für wen?</a></li>
       <li><a href="index.html#nischen">Nischen</a></li>
       <li><a href="index.html#vertrauen">Vertrauen</a></li>
       <li><a href="influencer-anmelden.html" class="nav-cta">Influencer werden</a></li>
     </ul>
     <button class="menu-toggle" id="menuToggle" aria-label="Menü öffnen">
       <span></span><span></span><span></span>
     </button>
   </nav>
 </header>`;
 
 const FOOTER_HTML = `<footer class="footer">
   <div class="container">
     <div class="footer-grid">
       <div class="footer-brand">
         <a href="index.html" class="logo">
           <div class="logo-mark"><span></span><span></span><span></span></div>
           TWOLANES
         </a>
         <p>Wir verbinden authentische Micro-Influencer mit starken Marken. Dein Partner für Influencer Marketing & Social Media Management.</p>
       </div>
       <div class="footer-col">
         <div class="footer-col-title">Navigation</div>
         <ul>
           <li><a href="index.html#fuer-wen">Für Influencer</a></li>
           <li><a href="index.html#fuer-wen">Für Unternehmen</a></li>
           <li><a href="index.html#nischen">Unsere Nischen</a></li>
           <li><a href="index.html#vertrauen">Warum wir?</a></li>
           <li><a href="influencer-anmelden.html">Influencer anmelden</a></li>
         </ul>
       </div>
       <div class="footer-col">
         <div class="footer-col-title">Kontakt</div>
         <ul>
           <li><a href="mailto:hello@twolanes.de">hello@twolanes.de</a></li>
           <li><a href="#" target="_blank" rel="noopener">Instagram</a></li>
           <li><a href="#" target="_blank" rel="noopener">TikTok</a></li>
           <li><a href="#" target="_blank" rel="noopener">LinkedIn</a></li>
         </ul>
       </div>
     </div>
     <div class="footer-bottom">
       <span>© 2025 TwoLanes. Alle Rechte vorbehalten.</span>
       <div class="footer-legal">
         <a href="#">Impressum</a>
         <a href="#">Datenschutz</a>
         <a href="#">AGB</a>
         <a href="#">Cookie-Einstellungen</a>
       </div>
     </div>
   </div>
 </footer>`;
 
 /* --------------------------------------------------
    LOAD PARTIAL  (tries fetch first, falls back to inline)
    -------------------------------------------------- */
 async function loadPartial(placeholderId, url, fallbackHTML) {
   const el = document.getElementById(placeholderId);
   if (!el) return;
 
   try {
     const res = await fetch(url);
     if (!res.ok) throw new Error('fetch failed');
     el.innerHTML = await res.text();
   } catch {
     // Local file:// protocol or missing file → use inline template
     el.innerHTML = fallbackHTML;
   }
 }
 
 /* --------------------------------------------------
    SCROLL HEADER
    -------------------------------------------------- */
 function initScrollHeader() {
   const handleScroll = () => {
     const header = document.getElementById('header');
     if (header) {
       header.classList.toggle('scrolled', window.scrollY > 50);
     }
   };
   window.addEventListener('scroll', handleScroll, { passive: true });
   handleScroll(); // run once on init
 }
 
 /* --------------------------------------------------
    MOBILE MENU
    -------------------------------------------------- */
 function initMobileMenu() {
   document.addEventListener('click', (e) => {
     const toggle = e.target.closest('#menuToggle');
     const links  = document.getElementById('navLinks');
     if (!links) return;
 
     if (toggle) {
       const isOpen = links.classList.toggle('open');
       toggle.classList.toggle('active', isOpen);
       toggle.setAttribute('aria-expanded', isOpen);
       return;
     }
 
     // Close if clicking a link or outside the menu
     if (e.target.closest('.nav-links a') || !e.target.closest('.nav')) {
       links.classList.remove('open');
       const t = document.getElementById('menuToggle');
       if (t) { t.classList.remove('active'); t.setAttribute('aria-expanded', false); }
     }
   });
 }
 
 /* --------------------------------------------------
    SCROLL REVEAL
    -------------------------------------------------- */
 function initReveal() {
   const els = document.querySelectorAll('.reveal');
   if (!els.length) return;
 
   // Stagger delay for grid children
   const staggerSelectors = [
     { sel: '.nischen-grid .nische-card', delay: 55 },
     { sel: '.trust-grid .trust-card',    delay: 80 },
     { sel: '.split-grid .split-card',    delay: 120 },
   ];
 
   staggerSelectors.forEach(({ sel, delay }) => {
     document.querySelectorAll(sel).forEach((el, i) => {
       el.dataset.delay = i * delay;
     });
   });
 
   const observer = new IntersectionObserver((entries) => {
     entries.forEach((entry) => {
       if (!entry.isIntersecting) return;
       const delay = parseInt(entry.target.dataset.delay || '0', 10);
       setTimeout(() => entry.target.classList.add('visible'), delay);
       observer.unobserve(entry.target);
     });
   }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
 
   els.forEach(el => observer.observe(el));
 }
 
 /* --------------------------------------------------
    COUNTER ANIMATION (hero stats)
    -------------------------------------------------- */
 function animateCounter(el, target, suffix = '') {
   const duration = 1400;
   const start    = performance.now();
   const update   = (now) => {
     const progress = Math.min((now - start) / duration, 1);
     // Ease out quart
     const eased = 1 - Math.pow(1 - progress, 4);
     el.textContent = Math.round(eased * target) + suffix;
     if (progress < 1) requestAnimationFrame(update);
   };
   requestAnimationFrame(update);
 }
 
 function initCounters() {
   const counters = document.querySelectorAll('[data-count]');
   if (!counters.length) return;
 
   const observer = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
       if (!entry.isIntersecting) return;
       const el     = entry.target;
       const target = parseInt(el.dataset.count, 10);
       const suffix = el.dataset.suffix || '';
       animateCounter(el, target, suffix);
       observer.unobserve(el);
     });
   }, { threshold: 0.5 });
 
   counters.forEach(el => observer.observe(el));
 }
 
 /* --------------------------------------------------
    REGISTRATION FORM
    -------------------------------------------------- */
 function initForm() {
   const form    = document.getElementById('anmeldeForm');
   const success = document.getElementById('formSuccess');
   if (!form) return;
 
   form.addEventListener('submit', (e) => {
     e.preventDefault();
 
     const btn = form.querySelector('[type="submit"]');
     btn.disabled = true;
     btn.textContent = 'Wird gesendet…';
 
     // Simulate async send (replace with real fetch to backend)
     setTimeout(() => {
       form.style.display = 'none';
       if (success) {
         success.classList.add('visible');
         success.scrollIntoView({ behavior: 'smooth', block: 'center' });
       }
     }, 1000);
   });
 }
 
 /* --------------------------------------------------
    SMOOTH ACTIVE NAV LINKS
    -------------------------------------------------- */
 function initActiveNav() {
   const sections = document.querySelectorAll('section[id]');
   if (!sections.length) return;
 
   const observer = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
       if (!entry.isIntersecting) return;
       const links = document.querySelectorAll(`.nav-links a[href*="#${entry.target.id}"]`);
       links.forEach(l => l.classList.add('active'));
       document.querySelectorAll('.nav-links a:not([href*="#' + entry.target.id + '"])')
         .forEach(l => l.classList.remove('active'));
     });
   }, { rootMargin: '-40% 0px -40% 0px' });
 
   sections.forEach(s => observer.observe(s));
 }
 
 /* --------------------------------------------------
    BOOTSTRAP
    -------------------------------------------------- */
 document.addEventListener('DOMContentLoaded', async () => {
   // Load partials (async — rest of init runs after)
   await Promise.all([
     loadPartial('header-placeholder', 'partials/header.html', HEADER_HTML),
     loadPartial('footer-placeholder', 'partials/footer.html', FOOTER_HTML),
   ]);
 
   // Init all modules
   initScrollHeader();
   initMobileMenu();
   initReveal();
   initCounters();
   initForm();
   initActiveNav();
 });