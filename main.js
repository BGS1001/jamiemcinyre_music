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

  // Swap the illustration for a real photo when <section class="hero" data-photo="..."> is set.
  var hero = document.querySelector('.hero');
  var src = hero.dataset.photo;
  if (src) {
    var photo = new Image();
    photo.onload = function () {
      hero.style.setProperty('--hero-photo', 'url("' + src + '")');
      hero.classList.add('has-photo');
    };
    photo.src = src;
  }

  // Gentle fade-in of sections as they scroll into view.
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');
    var targets = document.querySelectorAll('.section__title, .release, .listen, .show, .about__text, .follow__inner');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }
})();
