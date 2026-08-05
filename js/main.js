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
          <a href="tel:+919133576669" class="btn btn-secondary btn-sm"><i data-lucide="phone"></i> Call Now</a>
          <a href="https://wa.me/919133576669" target="_blank" rel="noopener" class="btn btn-primary btn-sm"><i data-lucide="message-square"></i> WhatsApp</a>
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
            <a href="https://wa.me/${BUSINESS.wa}" class="social-link" aria-label="WhatsApp" target="_blank"><i data-lucide="message-square"></i></a>
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
      <span class="fab-icon"><i data-lucide="message-square" style="color: #fff;"></i></span>
      <span class="fab-label">WhatsApp</span>
    </a>
    <a href="tel:+919133576669" class="fab fab-call" id="fabCall" aria-label="Call us">
      <span class="fab-icon"><i data-lucide="phone" style="color: #fff;"></i></span>
      <span class="fab-label">Call Now</span>
    </a>`;
  document.body.appendChild(wrap);
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
