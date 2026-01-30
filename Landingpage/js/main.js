// ===================================
// KORA AGENCY - JAVASCRIPT PREMIUM
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('🚀 Kora Agency - Website cargado correctamente');
    console.log('💜 Diseño premium activado');

    // ===================================
    // SMOOTH SCROLL PARA ENLACES INTERNOS
    // ===================================
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // SCROLL INDICATOR
    // ===================================
    
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.querySelector('.about-section');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Ocultar el indicador después de scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }

    // ===================================
    // HEADER SCROLL EFFECT
    // ===================================
    
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Añadir sombra al header cuando se hace scroll
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
            header.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(10, 10, 10, 0.95)';
        }
        
        // Ocultar/mostrar header en scroll (opcional)
        // if (currentScroll > lastScroll && currentScroll > 500) {
        //     header.style.transform = 'translateY(-100%)';
        // } else {
        //     header.style.transform = 'translateY(0)';
        // }
        
        lastScroll = currentScroll;
    });

    // ===================================
    // EFECTO PARALLAX EN HERO
    // ===================================
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-content');
        
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = Math.max(1 - (scrolled / window.innerHeight), 0);
        }
    });

    // ===================================
    // ANIMACIONES AL HACER SCROLL
    // ===================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observar elementos que queremos animar
    const animatedElements = document.querySelectorAll(
        '.service-card, .benefit-card, .process-step, .about-image'
    );
    
    animatedElements.forEach((element, index) => {
        // Establecer estado inicial
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        
        // Comenzar a observar
        observer.observe(element);
    });

    // Agregar clase cuando el elemento es visible
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // COUNTER ANIMATION PARA STATS
    // ===================================
    
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Observar stats para animar cuando sean visibles
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber) {
                    const text = statNumber.textContent;
                    const number = parseInt(text);
                    if (!isNaN(number)) {
                        statNumber.textContent = '0';
                        animateCounter(statNumber, number);
                        entry.target.classList.add('counted');
                    }
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });

    // ===================================
    // MANEJO DEL FORMULARIO DE CONTACTO
    // ===================================
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Obtener los datos del formulario
            const formData = {
                name: document.getElementById('name').value.trim(),
                company: document.getElementById('company').value.trim(),
                email: document.getElementById('email').value.trim(),
                whatsapp: document.getElementById('whatsapp').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Validar antes de enviar
            if (!validateForm(formData)) {
                return;
            }
            
            // Deshabilitar el botón mientras se envía
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            console.log('📧 Datos del formulario:', formData);
            
            // Aquí puedes agregar la lógica para enviar los datos a tu backend
            // Ejemplo:
            // try {
            //     const response = await fetch('tu-api-endpoint', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify(formData)
            //     });
            //     
            //     if (response.ok) {
            //         showNotification('¡Gracias! Nos pondremos en contacto pronto.', 'success');
            //         contactForm.reset();
            //     } else {
            //         throw new Error('Error al enviar');
            //     }
            // } catch (error) {
            //     showNotification('Error al enviar. Por favor, intentá de nuevo.', 'error');
            // }
            
            // Simulación de envío (eliminar en producción)
            setTimeout(() => {
                showNotification('¡Gracias por tu consulta! Nos pondremos en contacto dentro de las próximas 24 horas.', 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Track del evento (si tenés analytics)
                trackEvent('Form', 'Submit', 'Contact Form');
            }, 1500);
        });
    }

    // ===================================
    // VALIDACIÓN DEL FORMULARIO
    // ===================================
    
    function validateForm(data) {
        // Validar nombre
        if (data.name.length < 2) {
            showNotification('Por favor, ingresá tu nombre completo.', 'error');
            return false;
        }
        
        // Validar email
        if (!validateEmail(data.email)) {
            showNotification('Por favor, ingresá un email válido.', 'error');
            return false;
        }
        
        // Validar teléfono
        if (!validatePhone(data.whatsapp)) {
            showNotification('Por favor, ingresá un número de WhatsApp válido.', 'error');
            return false;
        }
        
        // Validar mensaje
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
        const cleanPhone = phone.replace(/\D/g, '');
        return re.test(phone) && cleanPhone.length >= 10 && cleanPhone.length <= 15;
    }

    // Validación en tiempo real
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('whatsapp');
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    
    function addRealtimeValidation(input, validator) {
        input.addEventListener('blur', function() {
            if (this.value && !validator(this.value)) {
                this.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                this.style.background = 'rgba(239, 68, 68, 0.05)';
            } else if (this.value) {
                this.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                this.style.background = 'rgba(34, 197, 94, 0.05)';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-color)';
            this.style.background = 'rgba(255, 255, 255, 0.08)';
        });
    }
    
    if (emailInput) addRealtimeValidation(emailInput, validateEmail);
    if (phoneInput) addRealtimeValidation(phoneInput, validatePhone);
    
    if (nameInput) {
        addRealtimeValidation(nameInput, (val) => val.length >= 2);
    }
    
    if (messageInput) {
        // Contador de caracteres
        const maxLength = 500;
        messageInput.addEventListener('input', function() {
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
    
    // Puedes activar esto para un efecto más premium
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
        
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }
    
    // Descomentar para activar el cursor personalizado
    // if (window.innerWidth > 768) createCustomCursor();

    // ===================================
    // PRELOADER (OPCIONAL)
    // ===================================
    
    window.addEventListener('load', () => {
        document.body.style.overflow = 'auto';
        console.log('✅ Todos los recursos cargados');
    });

});

// ===================================
// FUNCIONES GLOBALES
// ===================================

// Sistema de notificaciones mejorado
function showNotification(message, type = 'success') {
    // Remover notificaciones anteriores
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear el elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Agregar icono según el tipo
    const icon = type === 'success' ? '✓' : '⚠';
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
    `;
    
    // Estilos inline
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' 
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
        fontSize: '0.95rem'
    });
    
    document.body.appendChild(notification);
    
    // Remover después de 4 segundos con animación
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 4000);
}

// Tracking de eventos (para Google Analytics u otra plataforma)
function trackEvent(category, action, label) {
    console.log(`📊 Tracking: ${category} - ${action} - ${label}`);
    
    // Si tenés Google Analytics configurado:
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    // Si tenés Facebook Pixel:
    if (typeof fbq !== 'undefined') {
        fbq('track', action, { category, label });
    }
}

// Función para detectar si el usuario está en mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para copiar texto al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copiado al portapapeles', 'success');
    }).catch(() => {
        showNotification('Error al copiar', 'error');
    });
}

// Agregar estilos de animación para notificaciones
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
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
    
    .notification-message {
        flex: 1;
    }
`;
document.head.appendChild(animationStyle);

// Log final
console.log('💜 Kora Agency - Sistema completo inicializado');