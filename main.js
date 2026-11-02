// Tour list: hide past shows, add "Add to calendar" links, and publish
// schema.org event data — all driven by the <li class="show"> items in index.html.
(function () {
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function icsText(str) { return String(str).replace(/[\\;,]/g, function (c) { return '\\' + c; }); }
  function slug(str) { return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  function icsFor(show) {
    var d = show.date.replace(/-/g, '');
    var now = new Date();
    var stamp = now.getUTCFullYear() + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate()) + 'T' +
                pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds()) + 'Z';
    var when;
    if (show.time) {
      var hm = show.time.split(':');
      var end = (parseInt(hm[0], 10) + 3) % 24; // assume a ~3h evening
      when = ['DTSTART;TZID=Europe/Dublin:' + d + 'T' + pad(+hm[0]) + pad(+hm[1]) + '00',
              'DTEND;TZID=Europe/Dublin:' + d + 'T' + pad(end) + pad(+hm[1]) + '00'];
    } else {
      var next = new Date(show.date + 'T12:00:00');
      next.setDate(next.getDate() + 1);
      when = ['DTSTART;VALUE=DATE:' + d,
              'DTEND;VALUE=DATE:' + next.getFullYear() + pad(next.getMonth() + 1) + pad(next.getDate())];
    }
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Jamie McIntyre//Tour//EN', 'CALSCALE:GREGORIAN',
            'BEGIN:VEVENT',
            'UID:' + show.date + '-' + slug(show.city) + '@jamiemcintyre',
            'DTSTAMP:' + stamp]
      .concat(when)
      .concat(['SUMMARY:' + icsText('Jamie McIntyre — ' + show.city),
               'LOCATION:' + icsText(show.venue + ', ' + show.place),
               'URL:' + show.tickets,
               'DESCRIPTION:' + icsText('Tickets: ' + show.tickets),
               'END:VEVENT', 'END:VCALENDAR'])
      .join('\r\n');
  }

  var events = [];
  var items = document.querySelectorAll('#shows .show');
  items.forEach(function (li) {
    if (new Date(li.dataset.date + 'T23:59:59') < today) {
      li.remove();
      return;
    }
    var link = li.querySelector('a.btn');
    var show = {
      date: li.dataset.date,
      time: li.dataset.time || '',
      city: li.dataset.city,
      venue: li.dataset.venue,
      place: li.dataset.place,
      tickets: link ? link.href : ''
    };
    var label = li.querySelector('.show__date').textContent;

    var cal = document.createElement('a');
    cal.className = 'show__cal';
    cal.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsFor(show));
    cal.download = 'jamie-mcintyre-' + slug(show.city) + '-' + show.date + '.ics';
    cal.textContent = 'Add to calendar';
    cal.setAttribute('aria-label', 'Add ' + show.city + ', ' + label + ' to your calendar');
    li.querySelector('.show__where').appendChild(cal);

    events.push({
      '@type': 'MusicEvent',
      name: 'Jamie McIntyre — ' + show.city,
      startDate: show.date + (show.time ? 'T' + show.time : ''),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      performer: { '@type': 'MusicGroup', name: 'Jamie McIntyre' },
      image: new URL('assets/og.png', location.href).href,
      location: { '@type': 'Place', name: show.venue, address: show.place },
      offers: { '@type': 'Offer', url: show.tickets }
    });
  });

  if (events.length === 0) {
    document.getElementById('shows-empty').hidden = false;
  } else {
    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify(events);
    document.head.appendChild(ld);
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
