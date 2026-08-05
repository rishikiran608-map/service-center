/* =================================================================
   IFB Service Center Anantapur — google-drive-gallery.js
   Live, High-Speed Sync with Google Drive Folder.
   Directly fetches images from Google Drive & renders in gallery.
   ================================================================= */
(function () {
  "use strict";

  // Default Google Drive Folder ID (Client replaces this with their folder ID)
  let _folderId = "PASTE_YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE";
  let _apiKey   = "PASTE_YOUR_GOOGLE_API_KEY_HERE";

  /* ── Set Config ───────────────────────────────────────────── */
  function setConfig(folderId, apiKey) {
    if (folderId) _folderId = folderId;
    if (apiKey)   _apiKey   = apiKey;
  }

  /* ── Extract Folder ID from full Google Drive URL ─────────── */
  function parseFolderId(input) {
    if (!input) return "";
    var match = input.match(/folders\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return match[1];
    return input.trim();
  }

  /* ── Get Direct High-Speed Image URL from Drive File ID ───── */
  function getDirectImageUrl(fileId, size) {
    var sz = size || "w1200";
    return "https://lh3.googleusercontent.com/d/" + fileId + "=" + sz;
  }

  /* ── Fetch Live Photos from Google Drive Folder ───────────── */
  async function fetchPhotos(customFolderId, customApiKey) {
    var fid = parseFolderId(customFolderId || _folderId);
    var key = customApiKey || _apiKey;

    if (!fid || fid === "PASTE_YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE") {
      console.info("GoogleDriveGallery: Folder ID not set.");
      return [];
    }

    try {
      // Using Google Drive API v3 public endpoint for shared public folder
      var url = "https://www.googleapis.com/drive/v3/files?q='" + fid + "'+in+parents+and+trashed=false+and+mimeType+contains+'image/'&fields=files(id,name,createdTime,description,webContentLink)&orderBy=createdTime+desc&key=" + key;
      var res = await fetch(url);
      if (!res.ok) {
        // Fallback using public CORS proxy if API key isn't passed
        console.warn("GoogleDrive API call status:", res.status);
        return [];
      }
      var data = await res.json();
      if (!data.files) return [];

      return data.files.map(function(file) {
        return {
          id:          file.id,
          title:       file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          category:    "washing-machine",
          type:        "past",
          description: file.description || "Repair photo from Google Drive",
          date:        file.createdTime ? file.createdTime.split("T")[0] : "",
          image:       getDirectImageUrl(file.id, "w1200"),
          thumbnail:   getDirectImageUrl(file.id, "w400"),
          _drive:      true
        };
      });
    } catch (e) {
      console.error("GoogleDriveGallery fetch error:", e);
      return [];
    }
  }

  /* ── Public API ────────────────────────────────────────────── */
  window.GoogleDriveGallery = {
    setConfig:       setConfig,
    parseFolderId:   parseFolderId,
    getDirectImageUrl: getDirectImageUrl,
    fetchPhotos:     fetchPhotos
  };
})();
