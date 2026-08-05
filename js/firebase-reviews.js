/* =================================================================
   IFB Service Center Anantapur - firebase-reviews.js
   Cloud reviews: load from Firestore, save to Firestore.
   Reuses the FirebaseGallery.isReady() check (init is shared).
   ================================================================= */
(function () {
  "use strict";

  function _db() {
    return window.FirebaseGallery && window.FirebaseGallery.isReady()
      ? firebase.firestore()
      : null;
  }

  /* ── Load all cloud reviews ──────────────────────────────────── */
  async function loadReviews() {
    const db = _db();
    if (!db) return [];
    try {
      const snap = await db.collection("reviews")
                           .orderBy("createdAt", "desc")
                           .get();
      return snap.docs.map(doc => ({
        id:     doc.id,
        ...doc.data(),
        _cloud: true
      }));
    } catch (e) {
      console.warn("FirebaseReviews: failed to load:", e);
      return [];
    }
  }

  /* ── Save a new review to Firestore ─────────────────────────── */
  async function saveReview(reviewData) {
    const db = _db();
    if (!db) return false;
    try {
      await db.collection("reviews").add({
        name:      reviewData.name      || "Anonymous",
        rating:    reviewData.rating    || 5,
        comment:   reviewData.comment   || "",
        appliance: reviewData.appliance || "",
        date:      reviewData.date      || new Date().toISOString().split("T")[0],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return true;
    } catch (e) {
      console.error("FirebaseReviews: saveReview failed:", e);
      return false;
    }
  }

  /* ── Public API ─────────────────────────────────────────────── */
  window.FirebaseReviews = {
    loadReviews,
    saveReview
  };
})();
