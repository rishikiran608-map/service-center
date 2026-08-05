/* =========================================================
   IFB Service Center Anantapur — contact.js
   Builds WhatsApp deep-link with GPS Location & Issue Photo
   ========================================================= */

(function () {
  const WA_NUMBER = '919133576669';

  function buildWAMessage(data) {
    let msg = [
      '🔧 *New Service Request — IFB Service Center Anantapur*',
      '',
      `👤 *Name:* ${data.name}`,
      `📱 *Phone:* ${data.phone}`,
      `📍 *Location:* ${data.location}`,
    ];

    if (data.mapsLink) {
      msg.push(`🗺️ *Google Maps Pin:* ${data.mapsLink}`);
    }

    msg.push(`🏠 *Appliance:* ${data.appliance}`);
    msg.push(`📋 *Issue Details:* ${data.issue}`);
    msg.push(`🕐 *Preferred Time:* ${data.time}`);

    if (data.hasPhoto) {
      msg.push('');
      msg.push('📷 *Problem Photo Attached!* (Please tap attachment button in WhatsApp chat to attach your photo)');
    }

    msg.push('');
    msg.push('_Sent via Website Service Form_');

    return msg.join('\n');
  }

  function initContactForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    let gpsMapsLink = '';
    let hasPhotoAttached = false;

    // ── GPS Location Detection ──────────────────────────────
    const btnDetect = document.getElementById('btnDetectLocation');
    const locationInput = document.getElementById('contactLocation');
    const locationStatus = document.getElementById('locationStatus');

    if (btnDetect && locationInput) {
      btnDetect.addEventListener('click', function () {
        if (!navigator.geolocation) {
          alert('Geolocation is not supported by your browser.');
          return;
        }

        btnDetect.classList.add('loading');
        btnDetect.innerHTML = '⏳ Locating...';
        if (locationStatus) locationStatus.textContent = 'Detecting your GPS location...';

        navigator.geolocation.getCurrentPosition(
          function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            gpsMapsLink = `https://maps.google.com/?q=${lat},${lng}`;

            if (!locationInput.value.trim()) {
              locationInput.value = `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            } else if (!locationInput.value.includes('GPS Pin:')) {
              locationInput.value += ` [GPS Pin: ${lat.toFixed(4)}, ${lng.toFixed(4)}]`;
            }

            btnDetect.classList.remove('loading');
            btnDetect.innerHTML = '✅ GPS Attached';
            if (locationStatus) locationStatus.textContent = '📍 Google Maps location pin linked successfully!';
          },
          function (error) {
            btnDetect.classList.remove('loading');
            btnDetect.innerHTML = '📍 Detect GPS';
            if (locationStatus) locationStatus.textContent = 'Could not fetch GPS. Please type your location manually.';
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });
    }

    // ── Photo Attachment Handling ───────────────────────────
    const photoZone = document.getElementById('contactPhotoZone');
    const photoInput = document.getElementById('contactPhotoInput');
    const photoPreview = document.getElementById('contactPhotoPreview');
    const photoImg = document.getElementById('contactPhotoImg');
    const removeBtn = document.getElementById('btnRemoveContactPhoto');

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
          handleFile(e.dataTransfer.files[0]);
        }
      });

      photoInput.addEventListener('change', e => {
        if (e.target.files && e.target.files[0]) {
          handleFile(e.target.files[0]);
        }
      });
    }

    function handleFile(file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        if (photoImg && photoPreview) {
          photoImg.src = e.target.result;
          photoPreview.style.display = 'inline-block';
          if (photoZone) photoZone.style.display = 'none';
          hasPhotoAttached = true;
        }
      };
      reader.readAsDataURL(file);
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        hasPhotoAttached = false;
        if (photoInput) photoInput.value = '';
        if (photoPreview) photoPreview.style.display = 'none';
        if (photoZone) photoZone.style.display = 'block';
      });
    }

    // ── Form Submit & Redirect to WhatsApp ──────────────────
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameEl     = form.querySelector('#contactName') || form.querySelector('#cName');
      const phoneEl    = form.querySelector('#contactPhone') || form.querySelector('#cPhone');
      const locationEl = form.querySelector('#contactLocation') || form.querySelector('#cLocation');
      const applianceEl= form.querySelector('#contactAppliance') || form.querySelector('#cAppliance');
      const issueEl    = form.querySelector('#contactIssue') || form.querySelector('#cIssue');
      const timeEl     = form.querySelector('#contactTime') || form.querySelector('#cTime');

      const data = {
        name:      nameEl ? nameEl.value.trim() : '',
        phone:     phoneEl ? phoneEl.value.trim() : '',
        location:  locationEl ? locationEl.value.trim() : '',
        mapsLink:  gpsMapsLink,
        appliance: applianceEl ? applianceEl.value : '',
        issue:     issueEl ? issueEl.value.trim() : '',
        time:      timeEl ? timeEl.value : '',
        hasPhoto:  hasPhotoAttached
      };

      if (!data.name || !data.phone || !data.location || !data.appliance || !data.issue) {
        alert('Please fill in all required fields including your service location.');
        return;
      }

      const text = encodeURIComponent(buildWAMessage(data));
      const waUrl = `https://wa.me/${WA_NUMBER}?text=${text}`;

      // Show success feedback
      const success = document.getElementById('contactSuccess');
      if (success) success.classList.add('show');

      // Small delay so user sees the feedback, then open WhatsApp
      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        form.reset();
        hasPhotoAttached = false;
        gpsMapsLink = '';
        if (photoPreview) photoPreview.style.display = 'none';
        if (photoZone) photoZone.style.display = 'block';
        if (btnDetect) btnDetect.innerHTML = '📍 Detect GPS';
        if (locationStatus) locationStatus.textContent = '';
        if (success) setTimeout(() => success.classList.remove('show'), 3000);
      }, 600);
    });
  }

  // ── Init on DOM ready ───────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initContactForm('contactForm');
  });
})();

