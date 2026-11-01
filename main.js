// Hide shows whose date has passed; show a fallback message if none remain.
(function () {
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var shows = document.querySelectorAll('#shows .show');
  var remaining = 0;
  shows.forEach(function (show) {
    var d = new Date(show.dataset.date + 'T23:59:59');
    if (d < today) {
      show.remove();
    } else {
      remaining++;
    }
  });
  if (remaining === 0) {
    document.getElementById('shows-empty').hidden = false;
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  // Solid nav once the hero is scrolled past.
  var nav = document.querySelector('.nav');
  var onScroll = function () {
    nav.classList.toggle('is-solid', window.scrollY > window.innerHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
