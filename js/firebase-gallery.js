/* =================================================================
   IFB Service Center Anantapur - firebase-gallery.js
   Cloud gallery: loads photos from Firestore, uploads to Storage.
   Falls back gracefully to localStorage if Firebase is not configured.
   ================================================================= */
(function () {
  "use strict";

  let _db = null;
  let _storage = null;
  let _ready = false;

  /* ── Init ───────────────────────────────────────────────────── */
  function init() {
    try {
      const cfg = window.IFB_FIREBASE_CONFIG;
      if (!cfg || cfg.apiKey === "PASTE_YOUR_apiKey_HERE") {
        console.info("FirebaseGallery: config not set — using localStorage only.");
        return false;
      }
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      _db      = firebase.firestore();
      _storage = firebase.storage();
      _ready   = true;
      console.info("FirebaseGallery: ready.");
      return true;
    } catch (e) {
      console.warn("FirebaseGallery init error:", e);
      return false;
    }
  }

  /* ── Load cloud works from Firestore ────────────────────────── */
  async function loadWorks() {
    if (!_ready) return [];
    try {
      const snap = await _db.collection("works")
                            .orderBy("createdAt", "desc")
                            .get();
      return snap.docs.map(doc => ({
        id:          doc.id,
        ...doc.data(),
        image:       doc.data().imageUrl || doc.data().image || "",
        _cloud:      true
      }));
    } catch (e) {
      console.warn("FirebaseGallery: failed to load works:", e);
      return [];
    }
  }

  /* ── Upload image file to Firebase Storage ──────────────────── */
  async function _uploadImage(file, docId) {
    const ref = _storage.ref("works/" + docId + "_" + file.name);
    await ref.put(file);
    return await ref.getDownloadURL();
  }

  /* ── Save a new work (+ optional image file) to Firestore ───── */
  async function saveWork(workData, imageFile) {
    if (!_ready) return null;
    try {
      /* Create doc first to obtain an ID */
      const docRef = await _db.collection("works").add({
        title:       workData.title       || "",
        type:        workData.type        || "past",
        category:    workData.category    || "washing-machine",
        description: workData.description || "",
        date:        workData.date        || new Date().toISOString().split("T")[0],
        imageUrl:    "",
        createdAt:   firebase.firestore.FieldValue.serverTimestamp()
      });

      /* Upload image if a file was chosen */
      let imageUrl = workData.image || "";
      if (imageFile) {
        imageUrl = await _uploadImage(imageFile, docRef.id);
        await docRef.update({ imageUrl });
      }

      return {
        id:     docRef.id,
        ...workData,
        image:  imageUrl,
        _cloud: true
      };
    } catch (e) {
      console.error("FirebaseGallery: saveWork failed:", e);
      return null;
    }
  }

  /* ── Delete a work from Firestore (+ optional Storage cleanup) ─ */
  async function deleteWork(docId) {
    if (!_ready) return false;
    try {
      await _db.collection("works").doc(docId).delete();
      return true;
    } catch (e) {
      console.error("FirebaseGallery: deleteWork failed:", e);
      return false;
    }
  }

  /* ── Public API ─────────────────────────────────────────────── */
  window.FirebaseGallery = {
    init,
    loadWorks,
    saveWork,
    deleteWork,
    isReady: () => _ready
  };
})();
