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
    box.querySelector('img').src = (e.relatedTarget.getAttribute('data-full') || e.relatedTarget.getAttribute('src'));
  });
  // Hero video: play / pause
  document.querySelectorAll('[data-gw-video-toggle]').forEach(function (btn) {
    var v = document.getElementById(btn.getAttribute('data-gw-video-toggle'));
    btn.addEventListener('click', function () {
      if (v.paused) { v.play(); btn.textContent = '❚❚'; btn.setAttribute('aria-label', 'Pause video'); }
      else { v.pause(); btn.textContent = '▶'; btn.setAttribute('aria-label', 'Play video'); }
    });
  });
  // Press kit: screener form
  var form = document.getElementById('gwScreenerForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.querySelector('[type=email]').value || 'your inbox';
    form.innerHTML = '<div class="d-flex flex-column gap-2 py-4"><span class="badge gw-badge align-self-start">Request received</span><p class="m-0">We will send a screener link to <b></b> shortly.</p></div>';
    form.querySelector('b').textContent = email;
  });
});
