document.addEventListener('DOMContentLoaded', function () {
  // Journey: tag filter
  document.querySelectorAll('[data-gw-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tag = btn.getAttribute('data-gw-filter');
      document.querySelectorAll('[data-gw-filter]').forEach(function (b) { b.classList.toggle('active', b === btn); });
      document.querySelectorAll('[data-gw-tag]').forEach(function (el) {
        el.classList.toggle('d-none', tag !== 'All' && el.getAttribute('data-gw-tag') !== tag);
      });
    });
  });
  // Posters: lightbox
  var box = document.getElementById('gwLightbox');
  if (box) box.addEventListener('show.bs.modal', function (e) {
    var t = e.relatedTarget, im = box.querySelector('img'), th = t.querySelector('img') || t;
    im.src = t.getAttribute('data-full') || th.getAttribute('src');
    im.alt = t.getAttribute('data-alt') || th.getAttribute('alt') || '';
  });
  // Hero video: play / pause
  document.querySelectorAll('[data-gw-video-toggle]').forEach(function (btn) {
    var v = document.getElementById(btn.getAttribute('data-gw-video-toggle'));
    if (!v) { btn.hidden = true; return; }
    btn.addEventListener('click', function () {
      if (v.paused) { v.play(); btn.textContent = '❚❚'; btn.setAttribute('aria-label', 'Pause video'); }
      else { v.pause(); btn.textContent = '▶'; btn.setAttribute('aria-label', 'Play video'); }
    });
  });
  // Respect reduced motion: stop autoplaying hero video
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video[autoplay]').forEach(function (v) {
      v.pause(); v.removeAttribute('autoplay');
      var b = document.querySelector('[data-gw-video-toggle="' + v.id + '"]');
      if (b) { b.textContent = '\u25B6'; b.setAttribute('aria-label', 'Play video'); }
    });
  }
  // Press kit: screener form
  var form = document.getElementById('gwScreenerForm');
  // Set to the deployed screener worker URL (see screener-worker/)
  var SCREENER_ENDPOINT = '';
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('[type=submit]');
    var email = form.querySelector('[type=email]').value;
    var note = form.querySelector('.gw-form-error');
    if (!note) {
      note = document.createElement('p');
      note.className = 'gw-form-error m-0';
      note.setAttribute('role', 'alert');
      btn.parentNode.appendChild(note);
    }
    note.textContent = '';
    if (!SCREENER_ENDPOINT) { note.textContent = 'Form is not connected yet. Please use the contact page.'; return; }
    btn.disabled = true;
    var payload = {};
    new FormData(form).forEach(function (v, k) { payload[k] = v; });
    fetch(SCREENER_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { if (!r.ok) throw new Error(); })
      .then(function () {
        form.innerHTML = '<div class="d-flex flex-column gap-2 py-4" role="status"><span class="badge gw-badge align-self-start">Request received</span><p class="m-0">We will send a screener link to <b></b> shortly.</p></div>';
        form.querySelector('b').textContent = email;
      })
      .catch(function () { btn.disabled = false; note.textContent = 'Something went wrong. Please try again or use the contact page.'; });
  });});
