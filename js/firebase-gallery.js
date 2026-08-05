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

  /* -- Bookings Collection ------------------------------------ */
  const LS_BOOKINGS_KEY = "ifb_local_cloud_bookings_v1";

  function getLocalBookings() {
    return JSON.parse(localStorage.getItem(LS_BOOKINGS_KEY) || "[]");
  }

  function saveLocalBooking(data) {
    const list = getLocalBookings();
    const id = "local_" + Date.now();
    list.unshift({ ...data, id, date: data.date || new Date().toISOString().split("T")[0] });
    localStorage.setItem(LS_BOOKINGS_KEY, JSON.stringify(list));
    return id;
  }

  function updateLocalBookingStatus(id, status) {
    const list = getLocalBookings();
    const item = list.find(x => x.id === id);
    if (item) {
      item.status = status;
      localStorage.setItem(LS_BOOKINGS_KEY, JSON.stringify(list));
      return true;
    }
    return false;
  }

  function deleteLocalBooking(id) {
    const list = getLocalBookings();
    const filtered = list.filter(x => x.id !== id);
    localStorage.setItem(LS_BOOKINGS_KEY, JSON.stringify(filtered));
    return true;
  }

  /* -- Bookings Collection ------------------------------------ */
  async function loadBookings() {
    if (!_ready) return getLocalBookings();
    try {
      var snap = await _db.collection("bookings")
                          .orderBy("createdAt", "desc")
                          .get();
      return snap.docs.map(function(doc) {
        var d = doc.data();
        return {
          id:          doc.id,
          name:        d.name        || "",
          phone:       d.phone       || "",
          location:    d.location    || "",
          mapsLink:    d.mapsLink    || "",
          appliance:   d.appliance   || "",
          issue:       d.issue       || "",
          time:        d.time        || "",
          photo:       d.photo       || "",
          status:      d.status      || "pending",
          date:        d.date        || "",
          createdAt:   d.createdAt   ? d.createdAt.toDate() : null
        };
      });
    } catch (e) {
      console.warn("FirebaseGallery: loadBookings failed (falling back to LocalStorage):", e);
      return getLocalBookings();
    }
  }

  async function saveBooking(data) {
    if (!_ready) return saveLocalBooking(data);
    try {
      var docRef = await _db.collection("bookings").add({
        name:        data.name        || "",
        phone:       data.phone       || "",
        location:    data.location    || "",
        mapsLink:    data.mapsLink    || "",
        appliance:   data.appliance   || "",
        issue:       data.issue       || "",
        time:        data.time        || "",
        photo:       data.photo       || "",
        status:      data.status      || "pending",
        date:        data.date        || new Date().toISOString().split("T")[0],
        createdAt:   firebase.firestore.FieldValue.serverTimestamp()
      });
      return docRef.id;
    } catch (e) {
      console.warn("FirebaseGallery: saveBooking failed (falling back to LocalStorage):", e);
      return saveLocalBooking(data);
    }
  }

  async function updateBookingStatus(docId, status) {
    if (docId.startsWith("local_")) {
      return updateLocalBookingStatus(docId, status);
    }
    if (!_ready) return false;
    try {
      await _db.collection("bookings").doc(docId).update({ status: status });
      return true;
    } catch (e) {
      console.warn("FirebaseGallery: updateBookingStatus failed (falling back to LocalStorage):", e);
      return updateLocalBookingStatus(docId, status);
    }
  }

  async function deleteBooking(docId) {
    if (docId.startsWith("local_")) {
      return deleteLocalBooking(docId);
    }
    if (!_ready) return false;
    try {
      await _db.collection("bookings").doc(docId).delete();
      return true;
    } catch (e) {
      console.warn("FirebaseGallery: deleteBooking failed (falling back to LocalStorage):", e);
      return deleteLocalBooking(docId);
    }
  }

  /* -- Public API -------------------------------------------- */
  window.FirebaseGallery = {
    init:       init,
    loadWorks:  loadWorks,
    saveWork:   saveWork,
    deleteWork: deleteWork,
    loadBookings: loadBookings,
    saveBooking:  saveBooking,
    updateBookingStatus: updateBookingStatus,
    deleteBooking: deleteBooking,
    isReady:    function() { return _ready; }
  };
})();
