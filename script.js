/* Image series: click the arrows to cycle through the images in a block.
   Works for any number of [data-series] blocks on a page. */

document.querySelectorAll('[data-series]').forEach(function (series) {
  var images = Array.prototype.slice.call(series.querySelectorAll('.series-img'));
  if (images.length === 0) return;

  var counter = series.querySelector('.cur');
  var total   = series.querySelector('.total');
  var index   = 0;

  if (total) total.textContent = images.length;

  function show(n) {
    index = (n + images.length) % images.length;
    images.forEach(function (img, i) {
      img.classList.toggle('is-active', i === index);
    });
    if (counter) counter.textContent = index + 1;
  }

  var prev = series.querySelector('.prev');
  var next = series.querySelector('.next');
  if (prev) prev.addEventListener('click', function () { show(index - 1); });
  if (next) next.addEventListener('click', function () { show(index + 1); });

  show(0);
});

/* Works page: Academic / Creative filter buttons. */
(function () {
  var filters = document.querySelector('.work-filters');
  if (!filters) return;

  var buttons = Array.prototype.slice.call(filters.querySelectorAll('[data-filter]'));
  var works = Array.prototype.slice.call(document.querySelectorAll('.work[data-type]'));

  function markLastVisible() {
    var last = null;
    works.forEach(function (work) {
      work.classList.remove('is-last-visible');
      if (!work.classList.contains('is-hidden')) last = work;
    });
    if (last) last.classList.add('is-last-visible');
  }

  function applyFilter(type) {
    works.forEach(function (work) {
      var match = type === 'all' || work.getAttribute('data-type') === type;
      work.classList.toggle('is-hidden', !match);
    });
    markLastVisible();
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var type = button.getAttribute('data-filter');
      buttons.forEach(function (btn) {
        var active = btn === button;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      applyFilter(type);
    });
  });

  markLastVisible();
})();

/* Light / dark theme toggle. Preference is stored in localStorage. */
(function () {
  var root = document.documentElement;
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.theme-toggle'));
  if (buttons.length === 0) return;

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function syncButtons(theme) {
    var isLight = theme === 'light';
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', isLight ? 'true' : 'false');
      button.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
      var icon = button.querySelector('.theme-icon');
      if (icon) icon.textContent = isLight ? '\u263D' : '\u2600';
    });
  }

  function applyTheme(theme) {
    var light = theme === 'light';
    if (light) root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    root.style.backgroundColor = light ? '#F3F1E4' : '#16160b';
    root.style.colorScheme = light ? 'light' : 'dark';
    try { localStorage.setItem('theme', theme); } catch (e) {}
    syncButtons(theme);
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
    });
  });

  syncButtons(currentTheme());
})();
