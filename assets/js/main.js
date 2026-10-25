/* ============================================================
   ARQstudio — Main JavaScript
   Interactions, animations and form handling
   ============================================================ */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progressBar = document.getElementById('progressBar');
  const nav = document.getElementById('mainNav');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const modal = document.getElementById('projectModal');
  let modalTrigger = null;

  function updateProgress() {
    if (!progressBar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(progress));
  }

  function updateNav() {
    if (nav) nav.classList.toggle('nav--scrolled', window.scrollY > 80);
  }

  function setScrollLock() {
    const menuOpen = mobileMenu && mobileMenu.classList.contains('mobile-menu--open');
    const modalOpen = modal && modal.classList.contains('modal--open');
    document.body.style.overflow = menuOpen || modalOpen ? 'hidden' : '';
  }

  function setMenuOpen(open, restoreFocus) {
    if (!menuToggle || !mobileMenu) return;
    mobileMenu.classList.toggle('mobile-menu--open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    mobileMenu.inert = !open;
    menuToggle.classList.toggle('nav__burger--open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    setScrollLock();

    if (open) {
      const firstLink = mobileMenu.querySelector('a');
      if (firstLink) firstLink.focus();
    } else if (restoreFocus) {
      menuToggle.focus();
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true', false);
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false, false);
      });
    });

    mobileMenu.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab') return;
      const focusable = Array.from(mobileMenu.querySelectorAll('a[href], button:not([disabled])'))
        .filter(function (element) { return element.getClientRects().length > 0; });
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  const navLinks = document.querySelectorAll('.nav__link[data-nav]');
  const sections = document.querySelectorAll('[data-section]');

  function updateActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 200) {
        current = section.getAttribute('data-section');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('nav__link--active', link.getAttribute('data-nav') === current);
    });
  }

  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('js');
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add('revealed');
    });
  }

  let ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    window.requestAnimationFrame(function () {
      updateProgress();
      updateNav();
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }, { passive: true });

  updateProgress();
  updateNav();
  updateActiveNav();

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      event.preventDefault();
      const offset = (nav ? nav.offsetHeight : 0) + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      if (anchor.classList.contains('skip-link')) target.focus({ preventScroll: true });
    });
  });

  const disciplineItems = document.querySelectorAll('.discipline-item');
  const disciplineImages = document.querySelectorAll('.disciplines__image');

  disciplineItems.forEach(function (item) {
    function activateImage() {
      const discipline = item.getAttribute('data-discipline');
      disciplineImages.forEach(function (image) {
        image.classList.toggle(
          'disciplines__image--active',
          image.getAttribute('data-discipline-img') === discipline
        );
      });
    }

    item.addEventListener('mouseenter', activateImage);
    item.addEventListener('focus', activateImage);
    item.addEventListener('click', function () {
      const expanded = item.getAttribute('aria-expanded') === 'true';
      disciplineItems.forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        other.classList.remove('discipline-item--active');
        const detail = other.querySelector('.discipline-item__detail');
        if (detail) detail.setAttribute('aria-hidden', 'true');
      });

      if (!expanded) {
        item.setAttribute('aria-expanded', 'true');
        item.classList.add('discipline-item--active');
        const detail = item.querySelector('.discipline-item__detail');
        if (detail) detail.setAttribute('aria-hidden', 'false');
      }
    });
  });

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
    umbral: {
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

  if (modal) {
    const modalClose = modal.querySelector('.modal__close');
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function openModal(projectId, trigger) {
      const data = projectData[projectId];
      if (!data || !modalClose) return;

      modalTrigger = trigger;
      const image = modal.querySelector('.modal__hero-img');
      if (image) {
        image.src = data.image;
        image.alt = data.title;
      }
      const text = {
        '.modal__number': data.number,
        '.modal__title': data.title,
        '.modal__meta': data.category + ' · ' + data.location + ' · ' + data.year,
        '.modal__description': data.description,
        '[data-field="category"]': data.category,
        '[data-field="location"]': data.location,
        '[data-field="year"]': data.year,
        '[data-field="status"]': data.status
      };
      Object.keys(text).forEach(function (selector) {
        const element = modal.querySelector(selector);
        if (element) element.textContent = text[selector];
      });

      const gallery = modal.querySelector('.modal__gallery');
      if (gallery) {
        gallery.replaceChildren();
        data.gallery.forEach(function (src) {
          const image = document.createElement('img');
          image.src = src;
          image.alt = data.title + ' — galería';
          image.loading = 'lazy';
          image.decoding = 'async';
          gallery.appendChild(image);
        });
      }

      modal.inert = false;
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('modal--open');
      setScrollLock();
      modalClose.focus();
    }

    function closeModal(restoreFocus) {
      modal.classList.remove('modal--open');
      modal.setAttribute('aria-hidden', 'true');
      modal.inert = true;
      setScrollLock();
      if (restoreFocus && modalTrigger && modalTrigger.isConnected) modalTrigger.focus();
      modalTrigger = null;
    }

    document.querySelectorAll('[data-project]').forEach(function (project) {
      const trigger = project.querySelector('.project-item__link');
      if (trigger) {
        trigger.addEventListener('click', function () {
          openModal(project.getAttribute('data-project'), trigger);
        });
      }
    });

    if (modalClose) {
      modalClose.addEventListener('click', function () {
        closeModal(true);
      });
    }
    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeModal(true);
    });
    modal.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab') return;
      const focusable = Array.from(modal.querySelectorAll(focusableSelector)).filter(function (element) {
        return element.getClientRects().length > 0;
      });
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (modal && modal.classList.contains('modal--open')) {
      const closeButton = modal.querySelector('.modal__close');
      if (closeButton) closeButton.click();
    }
    if (mobileMenu && mobileMenu.classList.contains('mobile-menu--open')) {
      setMenuOpen(false, true);
    }
  });

  const filterButtons = document.querySelectorAll('.archive__filter');
  const archiveCards = document.querySelectorAll('.archive-card');
  const archiveResults = document.getElementById('archiveResults');

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const filter = button.getAttribute('data-filter');
      let visibleCount = 0;
      filterButtons.forEach(function (item) {
        const selected = item === button;
        item.classList.toggle('archive__filter--active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      archiveCards.forEach(function (card) {
        const visible = filter === 'all' || card.getAttribute('data-category') === filter;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (archiveResults) {
        archiveResults.textContent = visibleCount + (visibleCount === 1 ? ' resultado' : ' resultados');
      }
    });
  });

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitButton = document.getElementById('submitBtn');

  if (contactForm) {
    function clearErrors() {
      contactForm.querySelectorAll('.form-group').forEach(function (group) {
        group.classList.remove('form-group--error');
        const field = group.querySelector('input, select, textarea');
        const error = group.querySelector('.form-error');
        if (field) field.setAttribute('aria-invalid', 'false');
        if (error) error.textContent = '';
      });
      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }
    }

    contactForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (submitButton && submitButton.disabled) return;
      clearErrors();

      const validations = [
        { id: 'contact-name', message: 'Introduce un nombre de al menos 2 caracteres.' },
        { id: 'contact-email', message: 'Introduce un correo electrónico válido.' },
        { id: 'contact-type', message: 'Selecciona un tipo de proyecto.' },
        { id: 'contact-message', message: 'Escribe un mensaje de al menos 10 caracteres.' }
      ];
      let firstInvalid = null;
      let missingField = false;
      validations.forEach(function (validation) {
        const field = document.getElementById(validation.id);
        if (!field) {
          missingField = true;
          return;
        }
        const value = field.value.trim();
        const invalid = !value || !field.validity.valid;
        if (!invalid) return;
        firstInvalid = firstInvalid || field;
        field.setAttribute('aria-invalid', 'true');
        const group = field.closest('.form-group');
        if (group) {
          group.classList.add('form-group--error');
          const error = group.querySelector('.form-error');
          if (error) error.textContent = validation.message;
        }
      });

      if (missingField) {
        if (formStatus) {
          formStatus.textContent = 'El formulario no se puede enviar porque faltan campos necesarios en la página.';
          formStatus.className = 'form-status form-status--error';
        }
        return;
      }
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }
      if (!formStatus) return;

      const endpoint = (contactForm.getAttribute('data-endpoint') || '').trim();
      if (!endpoint) {
        formStatus.textContent = 'El formulario está validado, pero no se ha enviado: falta configurar un endpoint HTTPS de Formspree en data-endpoint.';
        formStatus.className = 'form-status form-status--error';
        return;
      }

      let endpointUrl;
      try {
        endpointUrl = new URL(endpoint, window.location.href);
      } catch (error) {
        formStatus.textContent = 'No se pudo enviar: el endpoint del formulario no es una URL válida.';
        formStatus.className = 'form-status form-status--error';
        return;
      }
      if (endpointUrl.protocol !== 'https:') {
        formStatus.textContent = 'No se pudo enviar: el endpoint del formulario debe usar HTTPS.';
        formStatus.className = 'form-status form-status--error';
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('contact__submit--loading');
      }
      contactForm.setAttribute('aria-busy', 'true');
      formStatus.textContent = 'Enviando…';
      formStatus.className = 'form-status';

      try {
        const response = await fetch(endpointUrl.href, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(contactForm)
        });
        if (!response.ok) throw new Error('El proveedor respondió con HTTP ' + response.status);
        contactForm.reset();
        formStatus.textContent = 'Tu mensaje se ha enviado correctamente.';
        formStatus.className = 'form-status form-status--success';
      } catch (error) {
        console.error('No se pudo enviar el formulario de contacto.', error);
        formStatus.textContent = 'No se pudo enviar el mensaje. Comprueba tu conexión o inténtalo más tarde.';
        formStatus.className = 'form-status form-status--error';
      } finally {
        contactForm.removeAttribute('aria-busy');
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove('contact__submit--loading');
        }
      }
    });

    contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        const group = field.closest('.form-group');
        if (group) {
          group.classList.remove('form-group--error');
          const error = group.querySelector('.form-error');
          if (error) error.textContent = '';
        }
        field.setAttribute('aria-invalid', 'false');
      });
      field.setAttribute('aria-invalid', 'false');
    });
  }

  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieReject = document.getElementById('cookieReject');
  const cookiePrefs = document.getElementById('cookiePrefs');
  const cookieStatus = document.getElementById('cookieStatus');
  let cookieStorageUnavailable = false;

  function getCookieConsent() {
    try {
      const value = window.localStorage.getItem('cookie-consent');
      return value === 'accepted' || value === 'rejected' ? value : null;
    } catch (error) {
      cookieStorageUnavailable = true;
      return null;
    }
  }

  function showCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.classList.remove('cookie-banner--hidden');
    cookieBanner.classList.add('cookie-banner--visible');
    cookieBanner.setAttribute('aria-hidden', 'false');
  }

  function hideCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.classList.remove('cookie-banner--visible');
    cookieBanner.setAttribute('aria-hidden', 'true');
    window.setTimeout(function () {
      if (cookieBanner.getAttribute('aria-hidden') === 'true') {
        cookieBanner.classList.add('cookie-banner--hidden');
      }
    }, reduceMotion ? 0 : 400);
  }

  function saveCookieConsent(value) {
    try {
      window.localStorage.setItem('cookie-consent', value);
      if (cookieStatus) cookieStatus.textContent = 'Preferencia guardada en este navegador.';
      hideCookieBanner();
    } catch (error) {
      cookieStorageUnavailable = true;
      if (cookieStatus) cookieStatus.textContent = 'No se pudo guardar la preferencia. Puede que vuelva a aparecer en otra visita.';
      showCookieBanner();
    }
  }

  if (cookieBanner) {
    if (getCookieConsent()) {
      cookieBanner.classList.add('cookie-banner--hidden');
      cookieBanner.setAttribute('aria-hidden', 'true');
    } else {
      showCookieBanner();
      if (cookieStorageUnavailable && cookieStatus) {
        cookieStatus.textContent = 'El navegador no permite guardar preferencias; esta ventana puede volver a aparecer.';
      }
    }
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      saveCookieConsent('accepted');
    });
  }
  if (cookieReject) {
    cookieReject.addEventListener('click', function () {
      saveCookieConsent('rejected');
    });
  }
  if (cookiePrefs) {
    cookiePrefs.addEventListener('click', function () {
      if (cookieStatus) cookieStatus.textContent = '';
      if (cookieBanner) {
        showCookieBanner();
        if (cookieAccept) cookieAccept.focus();
      }
    });
  }

  const yearDisplay = document.getElementById('yearDisplay');
  if (yearDisplay) yearDisplay.textContent = new Date().getFullYear();
})();
