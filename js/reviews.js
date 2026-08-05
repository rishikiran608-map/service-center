/* =========================================================
   IFB Service Center Anantapur — reviews.js
   Manages seeded + user-submitted reviews via localStorage
   ========================================================= */

const REVIEWS_KEY = 'ifb_reviews';

const SEED_REVIEWS = [
  {
    id: 'seed_1',
    name: 'Rajesh Kumar',
    rating: 5,
    comment: 'Excellent service! My IFB front-load washing machine was making a terrible noise. The technician diagnosed the drum bearing issue in minutes and fixed it same day. Very professional and transparent about the cost. Highly recommend!',
    appliance: 'Front Load Washing Machine',
    photo: 'images/service-washing-machine.png',
    date: '2026-06-14',
  },
  {
    id: 'seed_2',
    name: 'Priya Reddy',
    rating: 5,
    comment: 'Washing machine stopped spinning during cycle — technician arrived within 2 hours! Motor capacitor replaced and drum descaled at no extra charge. Great service, very honest pricing.',
    appliance: 'Top Load Washing Machine',
    photo: 'images/justdial/photo5.jpg',
    date: '2026-05-28',
  },
  {
    id: 'seed_3',
    name: 'Venkatesh Naidu',
    rating: 5,
    comment: 'Got my Samsung front-load control board PCB repaired. They used genuine components and gave a 90-day warranty on the repair. The technician explained everything clearly. Very good experience.',
    appliance: 'Front Load Washing Machine',
    photo: 'images/justdial/photo2.jpg',
    date: '2026-05-10',
  },
  {
    id: 'seed_4',
    name: 'Lakshmi Devi',
    rating: 5,
    comment: 'IFB washing machine unboxing and installation done perfectly. The team was punctual, neat, and showed us how to use all the settings. They even advised on anti-vibration leveling. 5 stars without hesitation!',
    appliance: 'Installation & Setup',
    photo: 'images/justdial/photo1.jpg',
    date: '2026-04-22',
  },
  {
    id: 'seed_5',
    name: 'Suresh Babu',
    rating: 5,
    comment: 'Signed up for their Washing Machine AMC plan. Best decision — two free preventive services, priority response, and tub descaling. Saved a lot compared to paying per visit. Very trustworthy team.',
    appliance: 'Washing Machine AMC',
    photo: 'images/service-center-store.png',
    date: '2026-03-18',
  },
  {
    id: 'seed_6',
    name: 'Anitha Sharma',
    rating: 5,
    comment: 'My semi-automatic washing machine spin tub was stuck and drain valve leaking. Fixed in about 45 minutes with a genuine replacement part. Fair pricing and no hidden charges.',
    appliance: 'Semi-Automatic Machine',
    photo: 'images/justdial/photo4.jpg',
    date: '2026-02-05',
  },
];

// ── Load reviews: seeds + Firestore cloud + localStorage fallback ──
async function loadReviewsAsync() {
  let cloudReviews = [];
  if (window.FirebaseReviews) {
    cloudReviews = await FirebaseReviews.loadReviews();
  }
  const stored = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
  const seedIds  = new Set(SEED_REVIEWS.map(r => r.id));
  const cloudIds = new Set(cloudReviews.map(r => r.id));
  // Only keep localStorage items that aren't already in seeds or cloud
  const localOnly = stored.filter(r => !seedIds.has(r.id) && !cloudIds.has(r.id));
  return [...cloudReviews, ...localOnly, ...SEED_REVIEWS]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

// ── Sync load (returns seeds + localStorage only — no await) ──
function loadReviews() {
  const stored = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
  const seedIds = new Set(SEED_REVIEWS.map(r => r.id));
  const userReviews = stored.filter(r => !seedIds.has(r.id));
  return [...SEED_REVIEWS, ...userReviews].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ── Save a new review to Firestore + localStorage ─────────────
async function saveReview(review) {
  // Save to localStorage immediately (fast, works offline)
  const stored = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
  stored.push(review);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(stored));

  // Also save to Firestore for cross-device visibility
  if (window.FirebaseReviews) {
    await FirebaseReviews.saveReview(review);
  }
}

// Sync version (used by places that can't await)
function saveReviewSync(review) {
  const stored = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
  stored.push(review);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(stored));
  if (window.FirebaseReviews) FirebaseReviews.saveReview(review).catch(console.warn);
}

// ── Render stars ──────────────────────────────────────────
function renderStars(rating) {
  let res = '';
  for (let i = 0; i < 5; i++) {
    if (i < rating) res += '<i data-lucide="star" class="filled"></i>';
    else res += '<i data-lucide="star" class="empty"></i>';
  }
  return res;
}

// ── Render a single review card ───────────────────────────
function buildReviewCard(review, compact = false) {
  const initials = review.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const formattedDate = new Date(review.date).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  const appBadge = review.appliance
    ? `<span style="display:inline-block;background:var(--blue-50);color:var(--blue-600);border-radius:50px;padding:.15rem .6rem;font-size:.75rem;font-weight:600;margin-bottom:.5rem">${review.appliance}</span>`
    : '';
  const photoMarkup = review.photo
    ? `<img src="${review.photo}" class="review-attached-photo" alt="Customer review photo" onclick="openReviewLightbox('${review.photo}')" title="Click to view full photo" />`
    : '';

  return `
    <div class="review-card reveal">
      <div class="stars" aria-label="${review.rating} out of 5 stars">${renderStars(review.rating)}</div>
      ${appBadge}
      <p class="review-text">${escapeHtml(review.comment)}</p>
      ${photoMarkup}
      <div class="reviewer">
        <div class="reviewer-avatar" aria-hidden="true">${initials}</div>
        <div>
          <div class="reviewer-name">${escapeHtml(review.name)}</div>
          <div class="reviewer-date">${formattedDate}</div>
        </div>
      </div>
    </div>`;
}

// ── Open Lightbox for Review Photos ──────────────────────
function openReviewLightbox(src) {
  const modal = document.getElementById('reviewLightbox');
  const img = document.getElementById('reviewLightboxImg');
  if (modal && img) {
    img.src = src;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closeReviewLightbox');
  const modal = document.getElementById('reviewLightbox');
  if (closeBtn && modal) {
    const closeLightbox = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };
    closeBtn.addEventListener('click', closeLightbox);
    modal.addEventListener('click', e => {
      if (e.target === modal) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeLightbox();
    });
  }
});

// ── Escape HTML to prevent XSS ────────────────────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ── Render all reviews into a container ──────────────────
function renderReviews(containerId, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const reviews = loadReviews();
  const toShow = limit ? reviews.slice(0, limit) : reviews;
  container.innerHTML = toShow.map(r => buildReviewCard(r)).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
  // Re-trigger scroll reveal for new cards
  if (typeof initScrollReveal === 'function') initScrollReveal();
}

// ── Rating stats ──────────────────────────────────────────
function renderStats(statsId) {
  const el = document.getElementById(statsId);
  if (!el) return;
  const reviews = loadReviews();
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const dist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: Math.round(reviews.filter(r => r.rating === star).length / reviews.length * 100)
  }));
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap;margin-bottom:2rem">
      <div style="text-align:center">
        <div style="font-family:var(--font-display);font-size:4rem;font-weight:700;color:var(--gray-900);line-height:1">${avg}</div>
        <div style="color:#f59e0b;font-size:1.4rem;margin:.2rem 0;display:flex;justify-content:center;gap:2px">${renderStars(Math.round(parseFloat(avg)))}</div>
        <div style="font-size:.85rem;color:var(--gray-500)">${reviews.length} reviews</div>
      </div>
      <div style="flex:1;min-width:220px">
        ${dist.map(d => `
          <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.4rem">
            <span style="font-size:.82rem;color:var(--gray-600);width:42px;display:inline-flex;align-items:center;gap:2px">${d.star} <i data-lucide="star" style="width:0.85rem;height:0.85rem;fill:currentColor"></i></span>
            <div style="flex:1;height:8px;background:var(--gray-200);border-radius:4px;overflow:hidden">
              <div style="height:100%;width:${d.pct}%;background:#f59e0b;border-radius:4px"></div>
            </div>
            <span style="font-size:.78rem;color:var(--gray-400);width:28px">${d.count}</span>
          </div>`).join('')}
      </div>
    </div>`;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ── Star Picker UI ────────────────────────────────────────
function initStarPicker(pickerId, inputId) {
  const picker = document.getElementById(pickerId);
  const input = document.getElementById(inputId);
  if (!picker || !input) return;
  let current = 0;
  picker.innerHTML = [1,2,3,4,5].map(n =>
    `<button type="button" class="star-btn" data-val="${n}" aria-label="${n} star"><i data-lucide="star"></i></button>`
  ).join('');
  if (typeof lucide !== 'undefined') lucide.createIcons();
  const btns = picker.querySelectorAll('.star-btn');
  function paint(val) {
    btns.forEach(b => b.classList.toggle('selected', parseInt(b.dataset.val) <= val));
  }
  btns.forEach(b => {
    b.addEventListener('mouseenter', () => paint(parseInt(b.dataset.val)));
    b.addEventListener('mouseleave', () => paint(current));
    b.addEventListener('click', () => {
      current = parseInt(b.dataset.val);
      input.value = current;
      paint(current);
    });
  });
}

// ── Review Submission Form ────────────────────────────────
function initReviewForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  let reviewPhotoBase64 = '';
  const photoZone = document.getElementById('reviewPhotoZone');
  const photoInput = document.getElementById('reviewPhotoInput');
  const photoPreview = document.getElementById('reviewPhotoPreview');
  const photoImg = document.getElementById('reviewPhotoImg');
  const removeBtn = document.getElementById('btnRemoveReviewPhoto');

  if (photoZone && photoInput) {
    photoZone.addEventListener('click', () => photoInput.click());
    photoZone.addEventListener('dragover', e => {
      e.preventDefault();
      photoZone.classList.add('dragover');
    });
    photoZone.addEventListener('dragleave', () => photoZone.classList.remove('dragover'));
    photoZone.addEventListener('drop', e => {
      e.preventDefault();
      photoZone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    photoInput.addEventListener('change', e => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }

  function handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      reviewPhotoBase64 = e.target.result;
      if (photoImg && photoPreview) {
        photoImg.src = reviewPhotoBase64;
        photoPreview.style.display = 'inline-block';
        if (photoZone) photoZone.style.display = 'none';
      }
    };
    reader.readAsDataURL(file);
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      reviewPhotoBase64 = '';
      if (photoInput) photoInput.value = '';
      if (photoPreview) photoPreview.style.display = 'none';
      if (photoZone) photoZone.style.display = 'block';
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const rating = parseInt(form.querySelector('#ratingValue')?.value || 0);
    if (!rating) {
      alert('Please select a star rating before submitting.');
      return;
    }
    const review = {
      id: 'user_' + Date.now(),
      name: form.querySelector('#reviewerName').value.trim(),
      rating,
      appliance: form.querySelector('#reviewAppliance').value,
      comment: form.querySelector('#reviewComment').value.trim(),
      photo: reviewPhotoBase64,
      date: new Date().toISOString().split('T')[0],
    };
    saveReview(review);
    const msg = document.getElementById('reviewSuccess');
    if (msg) msg.classList.add('show');
    
    // Reset form & photo upload state
    form.reset();
    reviewPhotoBase64 = '';
    if (photoPreview) photoPreview.style.display = 'none';
    if (photoZone) photoZone.style.display = 'block';
    document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('selected'));
    
    // Re-render
    if (typeof renderReviewsSorted === 'function') {
      const sortVal = document.getElementById('reviewSort')?.value || 'newest';
      renderReviewsSorted(sortVal);
    } else {
      renderReviews('reviewsGrid');
    }
    renderStats('reviewStats');
    setTimeout(() => { if (msg) msg.classList.remove('show'); }, 4000);
  });
}

