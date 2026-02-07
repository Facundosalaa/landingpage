// ===================================
// KORA AGENCY - JAVASCRIPT PREMIUM (FIXED)
// - Fix header bug (no inline styles, uses .scrolled)
// - Fix smooth scroll offset (uses real header height)
// - Fix stats counter bug (keeps suffixes %, " días", and keeps 24/7 static)
// - Fix overlap bug (scroll indicator vs CTA/stats)
// - Keeps your animations, form handling, notifications, tracking, etc.
// ===================================

document.addEventListener('DOMContentLoaded', function () {
  console.log('🚀 Kora Agency - Website cargado correctamente');
  console.log('💜 Diseño premium activado');

  // ===================================
  // SMOOTH SCROLL (FIX OFFSET REAL)
  // ===================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerH = document.querySelector('header')?.offsetHeight ?? 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - (headerH + 16);

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ===================================
  // SCROLL INDICATOR (click + hide on scroll)
  // + FIX OVERLAP WITH CTA/STATS
  // ===================================
  const scrollIndicator = document.querySelector('.scroll-indicator');

  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function () {
      const aboutSection = document.querySelector('.about-section') || document.querySelector('#about');
      if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Hide after some scroll (keeps your behavior)
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 300) {
          scrollIndicator.style.opacity = '0';
          scrollIndicator.style.pointerEvents = 'none';
        } else {
          scrollIndicator.style.opacity = '1';
          scrollIndicator.style.pointerEvents = 'auto';
        }
      },
      { passive: true }
    );
  }

  // Overlap helper + auto-hide if overlaps CTA or Stats (fix "DESLIZÁ" bug)
  function rectsOverlap(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }

  function updateIndicatorOverlap() {
    const indicator = document.querySelector('.scroll-indicator');
    const stats = document.querySelector('.hero-stats');
    const cta = document.querySelector('.hero-cta');
    if (!indicator) return;

    if (!stats && !cta) return;

    // If already hidden by scrollY>300, no need to show/hide here
    // We'll only force-hide if overlapping while it is visible.
    const computedOpacity = window.getComputedStyle(indicator).opacity;
    if (parseFloat(computedOpacity) === 0) return;

    const rInd = indicator.getBoundingClientRect();
    const rStats = stats?.getBoundingClientRect();
    const rCta = cta?.getBoundingClientRect();

    const overlapsStats = rStats ? rectsOverlap(rInd, rStats) : false;
    const overlapsCta = rCta ? rectsOverlap(rInd, rCta) : false;

    if (overlapsStats || overlapsCta) {
      indicator.style.opacity = '0';
      indicator.style.pointerEvents = 'none';
    }
  }

  window.addEventListener('scroll', updateIndicatorOverlap, { passive: true });
  window.addEventListener('resize', updateIndicatorOverlap);
  setTimeout(updateIndicatorOverlap, 200);

  // ===================================
  // HEADER SCROLL EFFECT (FIX)
  // - Uses CSS class .scrolled (no inline styles)
  // ===================================
  const header = document.querySelector('header');

  function updateHeader() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 80);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // ===================================
  // EFECTO PARALLAX EN HERO (safe)
  // ===================================
  const heroContent = document.querySelector('.hero-content');

  function updateHeroParallax() {
    if (!heroContent) return;

    // Reduce parallax on mobile (avoids layout jitter)
    const isSmall = window.innerWidth <= 768;
    const scrolled = window.pageYOffset;

    if (scrolled < window.innerHeight) {
      const factor = isSmall ? 0.15 : 0.3;
      heroContent.style.transform = `translateY(${scrolled * factor}px)`;
      heroContent.style.opacity = String(Math.max(1 - scrolled / window.innerHeight, 0));
    }
  }

  window.addEventListener('scroll', updateHeroParallax, { passive: true });

  // ===================================
  // ANIMACIONES AL HACER SCROLL
  // ===================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  const animatedElements = document.querySelectorAll('.service-card, .benefit-card, .process-step, .about-image');

  animatedElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
    element.style.transition = `all 0.6s ease-out ${index * 0.08}s`;
    observer.observe(element);
  });

  // Style for animate-in
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ===================================
  // COUNTER ANIMATION PARA STATS (FIX)
  // - Supports suffixes via data-suffix
  // - Supports static values via data-static="true" (e.g. 24/7)
  // Requires HTML:
  //   <div class="stat-number" data-value="70" data-suffix="%">70%</div>
  //   <div class="stat-number" data-value="10" data-suffix=" días">10 días</div>
  //   <div class="stat-number" data-static="true">24/7</div>
  // ===================================
  function animateCounter(el, target, suffix = '', duration = 1600) {
    const start = 0;
    const steps = Math.max(1, Math.floor(duration / 16));
    const inc = (target - start) / steps;
    let current = start;
    let i = 0;

    const timer = setInterval(() => {
      i++;
      current += inc;

      if (i >= steps) {
        el.textContent = `${target}${suffix}`;
        clearInterval(timer);
        return;
      }

      el.textContent = `${Math.floor(current)}${suffix}`;
    }, 16);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const statNumber = entry.target.querySelector('.stat-number');
        if (!statNumber || entry.target.classList.contains('counted')) return;

        // Static (e.g., 24/7)
        if (statNumber.dataset.static === 'true') {
          entry.target.classList.add('counted');
          return;
        }

        const value = parseInt(statNumber.dataset.value ?? '', 10);
        const suffix = statNumber.dataset.suffix ?? '';

        if (!Number.isFinite(value)) {
          entry.target.classList.add('counted');
          return;
        }

        statNumber.textContent = `0${suffix}`;
        animateCounter(statNumber, value, suffix);
        entry.target.classList.add('counted');
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-item').forEach((stat) => statsObserver.observe(stat));

  // ===================================
  // MANEJO DEL FORMULARIO DE CONTACTO
  // ===================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = {
        name: document.getElementById('name')?.value.trim() ?? '',
        company: document.getElementById('company')?.value.trim() ?? '',
        email: document.getElementById('email')?.value.trim() ?? '',
        whatsapp: document.getElementById('whatsapp')?.value.trim() ?? '',
        message: document.getElementById('message')?.value.trim() ?? '',
      };

      if (!validateForm(formData)) return;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn?.textContent ?? 'Enviar';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      console.log('📧 Datos del formulario:', formData);

      // Simulación de envío (reemplazar por fetch real)
      setTimeout(() => {
        showNotification(
          '¡Gracias por tu consulta! Nos pondremos en contacto dentro de las próximas 24 horas.',
          'success'
        );
        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }

        trackEvent('Form', 'Submit', 'Contact Form');
      }, 1200);
    });
  }

  // ===================================
  // VALIDACIÓN DEL FORMULARIO
  // ===================================
  function validateForm(data) {
    if (data.name.length < 2) {
      showNotification('Por favor, ingresá tu nombre completo.', 'error');
      return false;
    }

    if (!validateEmail(data.email)) {
      showNotification('Por favor, ingresá un email válido.', 'error');
      return false;
    }

    if (!validatePhone(data.whatsapp)) {
      showNotification('Por favor, ingresá un número de WhatsApp válido.', 'error');
      return false;
    }

    if (data.message.length < 10) {
      showNotification('Por favor, contanos más sobre tu proyecto (mínimo 10 caracteres).', 'error');
      return false;
    }

    return true;
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^[\d\s\+\-\(\)]+$/;
    const clean = phone.replace(/\D/g, '');
    return re.test(phone) && clean.length >= 10 && clean.length <= 15;
  }

  // ===================================
  // VALIDACIÓN EN TIEMPO REAL
  // ===================================
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('whatsapp');
  const nameInput = document.getElementById('name');
  const messageInput = document.getElementById('message');

  function addRealtimeValidation(input, validator) {
    if (!input) return;

    input.addEventListener('blur', function () {
      if (this.value && !validator(this.value)) {
        this.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        this.style.background = 'rgba(239, 68, 68, 0.05)';
      } else if (this.value) {
        this.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        this.style.background = 'rgba(34, 197, 94, 0.05)';
      }
    });

    input.addEventListener('focus', function () {
      this.style.borderColor = 'var(--primary-color)';
      this.style.background = 'rgba(255, 255, 255, 0.08)';
    });
  }

  addRealtimeValidation(emailInput, validateEmail);
  addRealtimeValidation(phoneInput, validatePhone);
  addRealtimeValidation(nameInput, (val) => val.length >= 2);

  if (messageInput) {
    const maxLength = 500;

    messageInput.addEventListener('input', function () {
      const currentLength = this.value.length;
      if (currentLength > maxLength) {
        this.value = this.value.substring(0, maxLength);
      }
    });

    addRealtimeValidation(messageInput, (val) => val.length >= 10);
  }

  // ===================================
  // CURSOR PERSONALIZADO (OPCIONAL)
  // ===================================
  function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
      .custom-cursor {
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary-color);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
        transition: all 0.1s ease;
        mix-blend-mode: difference;
      }

      .custom-cursor.active {
        transform: translate(-50%, -50%) scale(1.5);
        background: var(--primary-color);
      }
    `;
    document.head.appendChild(cursorStyle);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  // Descomentar para activar
  // if (window.innerWidth > 768) createCustomCursor();

  // ===================================
  // PRELOADER (LOG)
  // ===================================
  window.addEventListener('load', () => {
    document.body.style.overflow = 'auto';
    console.log('✅ Todos los recursos cargados');
    // ensure overlap check after full layout
    updateIndicatorOverlap();
  });
});

// ===================================
// FUNCIONES GLOBALES
// ===================================

// Sistema de notificaciones mejorado
function showNotification(message, type = 'success') {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) existingNotification.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;

  const icon = type === 'success' ? '✓' : '⚠';
  notification.innerHTML = `
    <span class="notification-icon">${icon}</span>
    <span class="notification-message">${message}</span>
  `;

  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    background:
      type === 'success'
        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(16, 185, 129, 0.95) 100%)'
        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)',
    color: '#fff',
    borderRadius: '12px',
    zIndex: '10000',
    animation: 'slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    maxWidth: '400px',
    fontSize: '0.95rem',
  });

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    setTimeout(() => {
      if (notification.parentNode) document.body.removeChild(notification);
    }, 400);
  }, 4000);
}

// Tracking de eventos
function trackEvent(category, action, label) {
  console.log(`📊 Tracking: ${category} - ${action} - ${label}`);

  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }

  if (typeof fbq !== 'undefined') {
    fbq('track', action, { category, label });
  }
}

// Detectar mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Copiar texto al portapapeles
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => showNotification('Copiado al portapapeles', 'success'))
    .catch(() => showNotification('Error al copiar', 'error'));
}

// Agregar estilos de animación para notificaciones
const animationStyle = document.createElement('style');
animationStyle.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }

  .notification-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.1rem;
  }

  .notification-message { flex: 1; }
`;
document.head.appendChild(animationStyle);

console.log('💜 Kora Agency - Sistema completo inicializado');
