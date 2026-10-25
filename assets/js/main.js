/* ============================================================
   FORMA / ESPACIO — Main JavaScript
   Interactions, Animations, Form Handling
   ============================================================ */

(function () {
  'use strict';

  /* ---- SCROLL PROGRESS BAR ---- */
  const progressBar = document.getElementById('progressBar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(progress));
  }

  /* ---- NAVIGATION ---- */
  const nav = document.getElementById('mainNav');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let lastScroll = 0;

  function updateNav() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScroll = scrollY;
  }

  // Mobile menu toggle
  menuToggle.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.contains('mobile-menu--open');
    mobileMenu.classList.toggle('mobile-menu--open');
    menuToggle.classList.toggle('nav__burger--open');
    menuToggle.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('mobile-menu--open');
      menuToggle.classList.remove('nav__burger--open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Active nav section tracking
  const navLinks = document.querySelectorAll('.nav__link[data-nav]');
  const sections = document.querySelectorAll('[data-section]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        current = section.getAttribute('data-section');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('nav__link--active', link.getAttribute('data-nav') === current);
    });
  }

  /* ---- SCROLL-TRIGGERED ANIMATIONS ---- */
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---- SCROLL EVENT HANDLER (throttled) ---- */
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        updateNav();
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial calls
  updateProgress();
  updateNav();

  /* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = nav.offsetHeight + 20;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ---- DISCIPLINES — HOVER IMAGE SWAP ---- */
  const disciplineItems = document.querySelectorAll('.discipline-item');
  const disciplineImages = document.querySelectorAll('.disciplines__image');

  disciplineItems.forEach(function (item) {
    // Hover: swap image
    item.addEventListener('mouseenter', function () {
      const disc = this.getAttribute('data-discipline');
      disciplineImages.forEach(function (img) {
        img.classList.toggle(
          'disciplines__image--active',
          img.getAttribute('data-discipline-img') === disc
        );
      });
    });

    // Click: toggle detail
    item.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Close all others
      disciplineItems.forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        other.classList.remove('discipline-item--active');
        other.querySelector('.discipline-item__detail').setAttribute('aria-hidden', 'true');
      });

      if (!isExpanded) {
        this.setAttribute('aria-expanded', 'true');
        this.classList.add('discipline-item--active');
        this.querySelector('.discipline-item__detail').setAttribute('aria-hidden', 'false');
      }
    });
  });

  /* ---- PROJECT MODAL ---- */
  const modal = document.getElementById('projectModal');
  const modalClose = modal.querySelector('.modal__close');

  // Project data store
  const projectData = {
    'casa-silencio': {
      number: '01',
      title: 'CASA SILENCIO',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      category: 'Arquitectura residencial',
      location: 'Valencia, España',
      year: '2025',
      status: 'En desarrollo',
      description: 'Un proyecto residencial que explora la relación entre el silencio arquitectónico y la naturaleza mediterránea. La vivienda se organiza alrededor de patios que filtran la luz y el sonido, creando una secuencia de espacios contemplativos.',
      gallery: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
      ]
    },
    'materia-viva': {
      number: '02',
      title: 'MATERIA VIVA',
      image: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=1400&q=80',
      category: 'Instalación artística',
      location: 'Barcelona, España',
      year: '2025',
      status: 'Completado',
      description: 'Instalación site-specific que investiga las propiedades expresivas de los materiales orgánicos. Piezas de madera, piedra y arcilla interactúan con la luz natural, transformándose a lo largo del día.',
      gallery: [
        'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1495195129352-aeb325a55b65?auto=format&fit=crop&w=800&q=80'
      ]
    },
    'umbral': {
      number: '03',
      title: 'UMBRAL',
      image: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&w=1400&q=80',
      category: 'Espacio expositivo',
      location: 'Madrid, España',
      year: '2024',
      status: 'Completado',
      description: 'Diseño de un espacio expositivo que redefine la experiencia del visitante. El recorrido se articula mediante umbrales —transiciones espaciales que alteran la percepción de la escala, la luz y el vacío.',
      gallery: [
        'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80'
      ]
    },
    'paisaje-interior': {
      number: '04',
      title: 'PAISAJE INTERIOR',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1400&q=80',
      category: 'Investigación espacial',
      location: 'Lisboa, Portugal',
      year: '2024',
      status: 'Completado',
      description: 'Proyecto de investigación que documenta cómo los paisajes interiores —la organización del espacio doméstico, los objetos, la luz— reflejan las formas de habitar de una cultura.',
      gallery: [
        'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?auto=format&fit=crop&w=800&q=80'
      ]
    },
    'forma-habitada': {
      number: '05',
      title: 'FORMA HABITADA',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
      category: 'Diseño de interiores',
      location: 'Valencia, España',
      year: '2023',
      status: 'Completado',
      description: 'Intervención interior que transforma una vivienda existente en un espacio fluido y contemplativo. Materiales nobles, luz controlada y una paleta reducida crean un entorno que invita a la pausa.',
      gallery: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80'
      ]
    }
  };

  function openModal(projectId) {
    var data = projectData[projectId];
    if (!data) return;

    modal.querySelector('.modal__hero-img').src = data.image;
    modal.querySelector('.modal__hero-img').alt = data.title;
    modal.querySelector('.modal__number').textContent = data.number;
    modal.querySelector('.modal__title').textContent = data.title;
    modal.querySelector('.modal__meta').textContent =
      data.category + ' · ' + data.location + ' · ' + data.year;
    modal.querySelector('.modal__description').textContent = data.description;
    modal.querySelector('[data-field="category"]').textContent = data.category;
    modal.querySelector('[data-field="location"]').textContent = data.location;
    modal.querySelector('[data-field="year"]').textContent = data.year;
    modal.querySelector('[data-field="status"]').textContent = data.status;

    // Gallery
    var galleryEl = modal.querySelector('.modal__gallery');
    galleryEl.innerHTML = '';
    data.gallery.forEach(function (src) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = data.title + ' — galería';
      img.loading = 'lazy';
      galleryEl.appendChild(img);
    });

    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind project click events
  document.querySelectorAll('[data-project]').forEach(function (item) {
    item.addEventListener('click', function (e) {
      // Don't open if they clicked a specific inner link going elsewhere
      if (e.target.closest('.project-item__link')) {
        e.preventDefault();
      }
      openModal(this.getAttribute('data-project'));
    });
  });

  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modal.classList.contains('modal--open')) {
        closeModal();
      }
      if (mobileMenu.classList.contains('mobile-menu--open')) {
        mobileMenu.classList.remove('mobile-menu--open');
        menuToggle.classList.remove('nav__burger--open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }
  });

  /* ---- ARCHIVE FILTERS ---- */
  const filterButtons = document.querySelectorAll('.archive__filter');
  const archiveCards = document.querySelectorAll('.archive-card');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');

      // Update active state
      filterButtons.forEach(function (b) { b.classList.remove('archive__filter--active'); });
      this.classList.add('archive__filter--active');

      // Filter cards
      archiveCards.forEach(function (card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden-card');
        } else {
          card.classList.add('hidden-card');
        }
      });
    });
  });

  /* ---- CONTACT FORM VALIDATION ---- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors();

      var valid = true;
      var fields = [
        { id: 'contact-name', msg: 'Por favor, introduce tu nombre.' },
        { id: 'contact-email', msg: 'Por favor, introduce un correo electrónico válido.', type: 'email' },
        { id: 'contact-type', msg: 'Por favor, selecciona un tipo de proyecto.' },
        { id: 'contact-message', msg: 'Por favor, escribe un mensaje.' }
      ];

      fields.forEach(function (f) {
        var input = document.getElementById(f.id);
        var value = input.value.trim();
        var group = input.closest('.form-group');
        var error = group.querySelector('.form-error');

        if (!value) {
          valid = false;
          group.classList.add('form-group--error');
          error.textContent = f.msg;
        } else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          valid = false;
          group.classList.add('form-group--error');
          error.textContent = f.msg;
        }
      });

      if (!valid) return;

      // Show loading state
      submitBtn.classList.add('contact__submit--loading');

      // NOTE: No backend integration. Show a clear message.
      // Replace this block with a real fetch() call to your form endpoint.
      setTimeout(function () {
        submitBtn.classList.remove('contact__submit--loading');
        formStatus.textContent =
          'Formulario preparado. Conecta un servicio de backend (Formspree, Netlify Functions, etc.) para habilitar el envío real.';
        formStatus.className = 'form-status form-status--error';
      }, 800);
    });

    // Clear errors on input
    contactForm.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('input', function () {
        var group = this.closest('.form-group');
        group.classList.remove('form-group--error');
        group.querySelector('.form-error').textContent = '';
      });
    });
  }

  function clearErrors() {
    contactForm.querySelectorAll('.form-group').forEach(function (g) {
      g.classList.remove('form-group--error');
      g.querySelector('.form-error').textContent = '';
    });
    formStatus.textContent = '';
    formStatus.className = 'form-status';
  }

  /* ---- COOKIE BANNER ---- */
  var cookieBanner = document.getElementById('cookieBanner');
  var cookieAccept = document.getElementById('cookieAccept');
  var cookieReject = document.getElementById('cookieReject');
  var cookiePrefs = document.getElementById('cookiePrefs');

  function getCookieConsent() {
    try { return localStorage.getItem('cookie-consent'); } catch (e) { return null; }
  }

  function setCookieConsent(value) {
    try { localStorage.setItem('cookie-consent', value); } catch (e) { /* noop */ }
  }

  if (!getCookieConsent()) {
    setTimeout(function () {
      cookieBanner.classList.add('cookie-banner--visible');
    }, 1500);
  } else {
    cookieBanner.classList.add('cookie-banner--hidden');
  }

  cookieAccept.addEventListener('click', function () {
    setCookieConsent('accepted');
    cookieBanner.classList.remove('cookie-banner--visible');
    setTimeout(function () { cookieBanner.classList.add('cookie-banner--hidden'); }, 500);
  });

  cookieReject.addEventListener('click', function () {
    setCookieConsent('rejected');
    cookieBanner.classList.remove('cookie-banner--visible');
    setTimeout(function () { cookieBanner.classList.add('cookie-banner--hidden'); }, 500);
  });

  if (cookiePrefs) {
    cookiePrefs.addEventListener('click', function () {
      setCookieConsent(null);
      try { localStorage.removeItem('cookie-consent'); } catch (e) { /* noop */ }
      cookieBanner.classList.remove('cookie-banner--hidden');
      cookieBanner.classList.add('cookie-banner--visible');
    });
  }

  /* ---- DYNAMIC YEAR ---- */
  var yearEl = document.getElementById('yearDisplay');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
