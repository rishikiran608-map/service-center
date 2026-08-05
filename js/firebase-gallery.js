/* =================================================================
   IFB Service Center Anantapur - firebase-gallery.js
   Cloud gallery: stores photos as compressed base64 in Firestore.
   No Firebase Storage needed (works on free Spark plan).
   ================================================================= */
(function () {
  "use strict";

  let _db = null;
  let _ready = false;

  /* -- Init --------------------------------------------------- */
  function init() {
    try {
      var cfg = window.IFB_FIREBASE_CONFIG;
      if (!cfg || cfg.apiKey === "PASTE_YOUR_apiKey_HERE") {
        console.info("FirebaseGallery: config not set, using localStorage only.");
        return false;
      }
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      _db    = firebase.firestore();
      _ready = true;
      console.info("FirebaseGallery: ready (Firestore only, no Storage).");
      return true;
    } catch (e) {
      console.warn("FirebaseGallery init error:", e);
      return false;
    }
  }

  /* -- Load cloud works from Firestore ----------------------- */
  async function loadWorks() {
    if (!_ready) return [];
    try {
      var snap = await _db.collection("works")
                          .orderBy("createdAt", "desc")
                          .get();
      return snap.docs.map(function(doc) {
        var d = doc.data();
        return {
          id:          doc.id,
          title:       d.title       || "",
          type:        d.type        || "past",
          category:    d.category    || "washing-machine",
          description: d.description || "",
          date:        d.date        || "",
          image:       d.imageBase64 || d.imageUrl || d.image || "",
          _cloud:      true
        };
      });
    } catch (e) {
      console.warn("FirebaseGallery: failed to load works:", e);
      return [];
    }
  }

  /* -- Compress image file to base64 (max 800px, JPEG 0.6) --- */
  function compressImage(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function(evt) {
        var img = new Image();
        img.onload = function() {
          var MAX = 800;
          var w = img.width, h = img.height;
          if (w > MAX || h > MAX) {
            if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
            else       { w = Math.round(w * MAX / h); h = MAX; }
          }
          var canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          var base64 = canvas.toDataURL("image/jpeg", 0.6);
          resolve(base64);
        };
        img.onerror = reject;
        img.src = evt.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* -- Save a new work to Firestore -------------------------- */
  async function saveWork(workData, imageFile) {
    if (!_ready) return null;
    try {
      var imageBase64 = workData.image || "";

      // Compress the file if one was uploaded
      if (imageFile) {
        imageBase64 = await compressImage(imageFile);
      }

      var docRef = await _db.collection("works").add({
        title:       workData.title       || "",
        type:        workData.type        || "past",
        category:    workData.category    || "washing-machine",
        description: workData.description || "",
        date:        workData.date        || new Date().toISOString().split("T")[0],
        imageBase64: imageBase64,
        createdAt:   firebase.firestore.FieldValue.serverTimestamp()
      });

      return {
        id:     docRef.id,
        title:  workData.title,
        type:   workData.type,
        category: workData.category,
        description: workData.description,
        date:   workData.date,
        image:  imageBase64,
        _cloud: true
      };
    } catch (e) {
      console.error("FirebaseGallery: saveWork failed:", e);
      return null;
    }
  }

  /* -- Delete a work from Firestore -------------------------- */
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

  /* -- Public API -------------------------------------------- */
  window.FirebaseGallery = {
    init:       init,
    loadWorks:  loadWorks,
    saveWork:   saveWork,
    deleteWork: deleteWork,
    isReady:    function() { return _ready; }
  };
})();
