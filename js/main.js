/* ====================================================
   Oliver's Garden Hotel — Main JavaScript
   ==================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ─── NAV: Scroll effect ─── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ─── NAV: Menú hamburguesa (mobile) ─── */
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('abierto');
      navLinks.classList.toggle('abierto');
      document.body.style.overflow = navLinks.classList.contains('abierto') ? 'hidden' : '';
    });

    // Cerrar al hacer click en un enlace
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('abierto');
        navLinks.classList.remove('abierto');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── HERO: Ken Burns effect ─── */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.3;
      heroBg.style.transform = `scale(1.05) translateY(${parallax}px)`;
    }, { passive: true });
  }

  /* ─── SCROLL REVEAL ─── */
  const observerOpciones = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || (i * 80);
        setTimeout(function () {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, observerOpciones);

  // Elementos a animar
  const animables = document.querySelectorAll(
    '.amenidad-card, .contacto-item, .galeria-item, .stat-item, .nosotros-grid'
  );

  animables.forEach(function (el, index) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
    el.dataset.delay = index * 70;
    observer.observe(el);
  });

  /* ─── SMOOTH SCROLL (fallback para Safari) ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  /* ─── GALERÍA: Lightbox simple ─── */
  const galeriaItems = document.querySelectorAll('.galeria-item');

  galeriaItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const img = item.querySelector('img');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.92);
        display: flex; align-items: center; justify-content: center;
        cursor: zoom-out; padding: 24px;
        animation: fadeIn 0.2s ease;
      `;

      const style = document.createElement('style');
      style.textContent = '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }';
      document.head.appendChild(style);

      const imgClone = document.createElement('img');
      imgClone.src = img.src;
      imgClone.alt = img.alt;
      imgClone.style.cssText = `
        max-width: 90vw; max-height: 90vh;
        object-fit: contain; border-radius: 12px;
        box-shadow: 0 24px 80px rgba(0,0,0,0.6);
      `;

      const cerrar = document.createElement('button');
      cerrar.innerHTML = '×';
      cerrar.style.cssText = `
        position: fixed; top: 20px; right: 24px;
        background: rgba(255,255,255,0.15); border: none;
        color: #fff; font-size: 32px; cursor: pointer;
        width: 48px; height: 48px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.2s;
      `;
      cerrar.onmouseenter = function () { cerrar.style.background = 'rgba(255,255,255,0.25)'; };
      cerrar.onmouseleave = function () { cerrar.style.background = 'rgba(255,255,255,0.15)'; };

      overlay.appendChild(imgClone);
      overlay.appendChild(cerrar);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      function cerrarLightbox() {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      }

      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) cerrarLightbox();
      });
      cerrar.addEventListener('click', cerrarLightbox);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') cerrarLightbox();
      }, { once: true });
    });
  });

  /* ─── WhatsApp: Tracking de clics (preparado para analytics) ─── */
  document.querySelectorAll('[data-wa]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const tipo = btn.dataset.wa;
      // Google Analytics (si está disponible)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
          event_category: 'reservas',
          event_label: tipo
        });
      }
    });
  });

});
