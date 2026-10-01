(function() {
  "use strict";

  var navList = document.querySelector('.sidebar nav ul');
  var links = document.querySelectorAll('.sidebar nav a');
  var sections = document.querySelectorAll('main > section[id]');
  var activeId = null;
  var ticking = false;

  if (!navList || !sections.length) {
    return;
  }

  // The current section is the last one whose top has passed the upper third of the viewport
  function currentSectionId() {
    var line = window.innerHeight * 0.35;
    var id = sections[0].id;

    sections.forEach(function(section) {
      if (section.getBoundingClientRect().top <= line) {
        id = section.id;
      }
    });

    // A short final section never reaches the line, so the page bottom selects it
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      id = sections[sections.length - 1].id;
    }

    return id;
  }

  function setActive(id) {
    if (id === activeId) {
      return;
    }
    activeId = id;

    links.forEach(function(link) {
      var isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'true');

        // Keep the active link in view when the mobile nav row scrolls sideways
        if (navList.scrollWidth > navList.clientWidth) {
          navList.scrollLeft = link.offsetLeft - (navList.clientWidth - link.offsetWidth) / 2;
        }
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function update() {
    ticking = false;
    setActive(currentSectionId());
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();

})();
