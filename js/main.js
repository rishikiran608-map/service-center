/* =========================================================
   IFB Service Center Anantapur — main.js
   Shared: header, footer, nav, floating buttons, scroll reveal
   ========================================================= */

const BUSINESS = {
  name:    'IFB Service Center Anantapur',
  phone:   '+91 91335 76669',
  wa:      '919133576669',
  address: 'Anantapur, Andhra Pradesh',
  email:   'vvsservices91@gmail.com',
  hours: {
    weekday: 'Mon – Sat: 9:00 AM – 7:00 PM',
    sunday:  'Sunday:   10:00 AM – 2:00 PM',
  },
  social: {
    facebook:  '#',
    instagram: '#',
    youtube:   '#',
  }
};

// ── Mark active nav link ──────────────────────────────────
function markActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ── Inject Header ─────────────────────────────────────────
function injectHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  header.innerHTML = `
    <div class="container">
      <div class="header-inner">
        <a href="index.html" class="logo" aria-label="IFB Service Center Anantapur Home">
          <div class="logo-icon"><i data-lucide="wrench"></i></div>
          <div class="logo-text">IFB <span>Service</span> Center</div>
        </a>

        <nav class="nav-links" id="navLinks" role="navigation" aria-label="Primary navigation">
          <a href="index.html">Home</a>
          <a href="about.html">About</a>
          <a href="services.html">Services</a>
          <a href="gallery.html">Gallery</a>
          <a href="reviews.html">Reviews</a>
          <a href="contact.html">Contact</a>
        </nav>

        <div class="header-cta" id="headerCta">
          <a href="tel:+919133576669" class="btn btn-secondary btn-sm"><svg class="official-call-icon" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg> Call Now</a>
          <a href="https://wa.me/919133576669" target="_blank" rel="noopener" class="btn btn-primary btn-sm"><svg class="official-wa-icon" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3.2 496l133.9-35.2c32.7 17.8 69.3 27.2 106.7 27.2 122.4 0 222-99.6 222-222 0-59.3-23.2-115-65-156.9zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-79.8 20.9 21.3-77.8-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-82.8 184.6-184.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg> WhatsApp</a>
        </div>

        <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">
          <i data-lucide="menu"></i>
        </button>
      </div>
    </div>`;

  // Mobile toggle
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const cta = document.getElementById('headerCta');

  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    cta.classList.toggle('open', open);
    toggle.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons();
    toggle.setAttribute('aria-expanded', open);
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      cta.classList.remove('open');
      toggle.innerHTML = '<i data-lucide="menu"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  markActiveNav();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ── Inject Footer ─────────────────────────────────────────
function injectFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <!-- Brand -->
        <div class="footer-col">
          <div class="footer-logo">
            <div class="logo">
              <div class="logo-icon" style="background:linear-gradient(135deg,#1a4d8f,#3b82f6)"><i data-lucide="wrench" style="width:1.1rem;height:1.1rem;color:#fff"></i></div>
              <div class="logo-text" style="color:#fff">IFB <span style="color:#fb923c">Service</span> Center</div>
            </div>
          </div>
          <p>Anantapur's most trusted appliance repair service since 2010. Genuine parts, certified technicians, and 90-day repair warranty.</p>
          <div class="social-row">
            <a href="${BUSINESS.social.facebook}"  class="social-link" aria-label="Facebook"><i data-lucide="globe"></i></a>
            <a href="${BUSINESS.social.instagram}" class="social-link" aria-label="Instagram"><i data-lucide="camera"></i></a>
            <a href="${BUSINESS.social.youtube}"   class="social-link" aria-label="YouTube"><i data-lucide="video"></i></a>
            <a href="https://wa.me/${BUSINESS.wa}" class="social-link" aria-label="WhatsApp" target="_blank"><svg class="official-wa-icon" viewBox="0 0 448 512" style="width:1.25rem;height:1.25rem;margin:0"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3.2 496l133.9-35.2c32.7 17.8 69.3 27.2 106.7 27.2 122.4 0 222-99.6 222-222 0-59.3-23.2-115-65-156.9zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-79.8 20.9 21.3-77.8-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-82.8 184.6-184.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg></a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="gallery.html">Gallery</a></li>
            <li><a href="reviews.html">Reviews</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>

        <!-- Services -->
        <div class="footer-col">
          <h5>Our Services</h5>
          <ul>
            <li><a href="services.html#front-load">Front Load Washing Machine</a></li>
            <li><a href="services.html#top-load">Top Load &amp; Semi-Auto</a></li>
            <li><a href="services.html#installation">Installation &amp; Relocation</a></li>
            <li><a href="services.html#amc">Washing Machine AMC Plan</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-col">
          <h5>Contact Us</h5>

          <div class="footer-contact-item">
            <span class="icon"><i data-lucide="phone"></i></span>
            <a href="tel:+919133576669" style="color:rgba(255,255,255,.65)">${BUSINESS.phone}</a>
          </div>
          <div class="footer-contact-item">
            <span class="icon"><i data-lucide="mail"></i></span>
            <a href="mailto:${BUSINESS.email}" style="color:rgba(255,255,255,.65)">${BUSINESS.email}</a>
          </div>
          <div class="footer-contact-item">
            <span class="icon"><i data-lucide="clock"></i></span>
            <div>
              <div>${BUSINESS.hours.weekday}</div>
              <div>${BUSINESS.hours.sunday}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom" style="flex-direction:column;align-items:center;text-align:center;gap:.4rem">
        <div>© ${new Date().getFullYear()} IFB Service Center Anantapur. All rights reserved.</div>
        <div style="font-size:.74rem;color:rgba(255,255,255,.45);max-width:800px">Disclaimer: We are an independent appliance repair service center in Anantapur. All brand names, trademarks, and logos belong to their respective owners.</div>
      </div>
    </div>`;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ── Inject Floating Action Buttons ───────────────────────
function injectFABs() {
  const wrap = document.createElement('div');
  wrap.className = 'floating-actions';
  wrap.setAttribute('aria-label', 'Quick contact actions');
  wrap.innerHTML = `
    <a href="https://wa.me/${BUSINESS.wa}?text=Hi%2C%20I%20need%20appliance%20repair%20service."
       target="_blank" rel="noopener"
       class="fab fab-whatsapp" id="fabWhatsApp" aria-label="Chat on WhatsApp">
      <span class="fab-icon" style="display:flex;align-items:center;justify-content:center"><svg class="official-wa-icon" viewBox="0 0 448 512" style="width:1.35rem;height:1.35rem;color:#fff;margin:0"><path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3.2 496l133.9-35.2c32.7 17.8 69.3 27.2 106.7 27.2 122.4 0 222-99.6 222-222 0-59.3-23.2-115-65-156.9zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-79.8 20.9 21.3-77.8-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-82.8 184.6-184.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg></span>
      <span class="fab-label">WhatsApp</span>
    </a>
    <a href="tel:+919133576669" class="fab fab-call" id="fabCall" aria-label="Call us">
      <span class="fab-icon" style="display:flex;align-items:center;justify-content:center"><svg class="official-call-icon" viewBox="0 0 512 512" style="width:1.25rem;height:1.25rem;color:#fff;margin:0"><path fill="currentColor" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg></span>
      <span class="fab-label">Call Now</span>
    </a>`;
  document.body.appendChild(wrap);

  // Inject secret gear button if not present statically
  if (!document.getElementById('ownerSecretTrigger')) {
    const gearBtn = document.createElement('button');
    gearBtn.id = 'ownerSecretTrigger';
    gearBtn.ariaLabel = 'Settings';
    gearBtn.innerHTML = '⚙';
    document.body.appendChild(gearBtn);

    gearBtn.addEventListener('click', () => {
      // If we are already on index.html, we can just click the hidden trigger or open modal
      const isIndex = location.pathname.endsWith('index.html') || location.pathname.endsWith('/');
      if (isIndex && typeof handleOwnerTrigger === 'function') {
        handleOwnerTrigger();
      } else {
        window.location.href = 'index.html?openOwner=1';
      }
    });
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ── Scroll Reveal ─────────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  // Double rAF: wait for browser to finish layout/paint so that elements
  // already in viewport are correctly detected as intersecting.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0 });
      els.forEach((el, i) => {
        el.style.transitionDelay = (i * 0.07) + 's';
        io.observe(el);
      });
    });
  });
}

// ── Smooth Anchor Scroll ──────────────────────────────────
function initAnchorScroll() {
  document.querySelectorAll('a[href*="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname) return;
      const id = url.hash.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const headerH = document.getElementById('site-header')?.offsetHeight || 72;
      window.scrollTo({ top: target.offsetTop - headerH - 12, behavior: 'smooth' });
    });
  });
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectHeader();
  injectFooter();
  injectFABs();
  initScrollReveal();
  initAnchorScroll();
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
