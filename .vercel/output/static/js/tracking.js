/**
 * FreshExpress Tracking Script
 * Sistema de recollida de dades ètic i transparent
 * Exercici 4 - Data Broker
 */

(function() {
  'use strict';

  // Configuració
  const CONFIG = {
    endpoint: '/api/track',
    batchSize: 10,
    batchInterval: 5000, // 5 segons
    sessionTimeout: 30 * 60 * 1000, // 30 minuts
    enableClickTracking: true,
    enableScrollTracking: true,
    enableTimeTracking: true,
    enableFormTracking: true,
    debug: false
  };

  // Estat
  let eventQueue = [];
  let sessionId = null;
  let pageLoadTime = Date.now();
  let lastActivity = Date.now();
  let consentGiven = false;

  // Utilitats
  function log(...args) {
    if (CONFIG.debug) {
      console.log('[FreshExpress Tracking]', ...args);
    }
  }

  function getResolution() {
    return `${window.screen.width}x${window.screen.height}`;
  }

  function getScrollDepth() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
  }

  function getElementCategory(element) {
    // Determinar categoria de l'element
    if (element.closest('nav, header')) return 'navigation';
    if (element.closest('footer')) return 'footer';
    if (element.closest('form')) return 'form';
    if (element.closest('.product, [data-product]')) return 'product';
    if (element.closest('.cart, [data-cart]')) return 'cart';
    if (element.closest('.eco, [data-eco], .sostenible')) return 'eco';
    if (element.closest('button, a, [role="button"]')) return 'interactive';
    return 'content';
  }

  function getElementIdentifier(element) {
    // Crear identificador únic per l'element
    if (element.id) return `#${element.id}`;
    if (element.dataset.trackingId) return element.dataset.trackingId;
    
    const classList = Array.from(element.classList).slice(0, 3).join('.');
    if (classList) return `.${classList}`;
    
    const tag = element.tagName.toLowerCase();
    const text = element.textContent?.trim().slice(0, 30) || '';
    return `${tag}:${text}`;
  }

  // Gestió de consentiment
  function checkConsent() {
    // Verificar si l'usuari ha donat consentiment
    const consent = localStorage.getItem('freshexpress_tracking_consent');
    if (consent === 'true') {
      consentGiven = true;
      return true;
    }
    
    // Si no hi ha consentiment explícit, no recollim dades
    return false;
  }

  function giveConsent() {
    localStorage.setItem('freshexpress_tracking_consent', 'true');
    consentGiven = true;
    log('Consentiment de tracking atorgat');
    trackEvent('consent_given', 'system', { timestamp: new Date().toISOString() });
  }

  function revokeConsent() {
    localStorage.removeItem('freshexpress_tracking_consent');
    consentGiven = false;
    eventQueue = [];
    log('Consentiment de tracking revocat');
  }

  // Tracking d'events
  function trackEvent(type, element = null, data = {}) {
    if (!consentGiven) {
      log('Event ignorat (sense consentiment):', type);
      return;
    }

    const event = {
      type,
      element: element ? getElementIdentifier(element) : null,
      category: element ? getElementCategory(element) : 'system',
      url: window.location.href,
      previousUrl: document.referrer,
      timestamp: Date.now(),
      resolution: getResolution(),
      timeOnPage: Date.now() - pageLoadTime,
      data
    };

    eventQueue.push(event);
    lastActivity = Date.now();
    log('Event registrat:', event);

    // Enviar immediatament si la cua és gran
    if (eventQueue.length >= CONFIG.batchSize) {
      sendEvents();
    }
  }

  // Enviament d'events
  async function sendEvents() {
    if (eventQueue.length === 0) return;

    const eventsToSend = eventQueue.splice(0, CONFIG.batchSize);
    
    try {
      const response = await fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          events: eventsToSend
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        // Re-encuar events fallits
        eventQueue = eventsToSend.concat(eventQueue);
        log('Error enviant events, re-encuats');
      } else {
        const result = await response.json();
        log('Events enviats:', result);
        if (result.sessionId) {
          sessionId = result.sessionId;
        }
      }
    } catch (error) {
      // Re-encuar events fallits
      eventQueue = eventsToSend.concat(eventQueue);
      log('Error de xarxa:', error);
    }
  }

  // Listeners d'events
  function setupClickTracking() {
    if (!CONFIG.enableClickTracking) return;

    document.addEventListener('click', function(e) {
      const target = e.target;
      const clickX = (e.clientX / window.innerWidth) * 100;
      const clickY = (e.clientY / window.innerHeight) * 100;

      trackEvent('click', target, {
        x: Math.round(clickX),
        y: Math.round(clickY),
        button: e.button,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey
      });

      // Tracking específic per elements importants
      if (target.closest('[data-product-id]')) {
        const productEl = target.closest('[data-product-id]');
        trackEvent('product_click', target, {
          productId: productEl.dataset.productId,
          productName: productEl.dataset.productName || ''
        });
      }

      if (target.closest('[data-eco]')) {
        trackEvent('eco_interaction', target, {
          ecoType: target.closest('[data-eco]').dataset.eco
        });
      }

      if (target.closest('.add-to-cart, [data-action="add-to-cart"]')) {
        trackEvent('add_to_cart', target);
      }
    });
  }

  function setupScrollTracking() {
    if (!CONFIG.enableScrollTracking) return;

    let lastScrollDepth = 0;
    let scrollTimeout;

    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        const depth = getScrollDepth();
        if (depth > lastScrollDepth + 25) { // Cada 25%
          lastScrollDepth = Math.floor(depth / 25) * 25;
          trackEvent('scroll', null, {
            depth: lastScrollDepth,
            direction: 'down'
          });
        }
      }, 200);
    });
  }

  function setupTimeTracking() {
    if (!CONFIG.enableTimeTracking) return;

    // Tracking de temps en pàgina
    let timeIntervals = [10, 30, 60, 120, 300]; // segons
    timeIntervals.forEach(function(seconds) {
      setTimeout(function() {
        if (document.visibilityState === 'visible') {
          trackEvent('time_on_page', null, {
            seconds,
            scrollDepth: getScrollDepth()
          });
        }
      }, seconds * 1000);
    });

    // Tracking de sortida
    window.addEventListener('beforeunload', function() {
      const timeOnPage = Date.now() - pageLoadTime;
      trackEvent('page_exit', null, {
        timeOnPage,
        scrollDepth: getScrollDepth()
      });
      
      // Enviament síncron en sortir
      if (eventQueue.length > 0 && navigator.sendBeacon) {
        navigator.sendBeacon(CONFIG.endpoint, JSON.stringify({
          events: eventQueue
        }));
      }
    });

    // Tracking de visibilitat
    document.addEventListener('visibilitychange', function() {
      trackEvent(document.hidden ? 'page_hidden' : 'page_visible', null, {
        timeOnPage: Date.now() - pageLoadTime
      });
    });
  }

  function setupFormTracking() {
    if (!CONFIG.enableFormTracking) return;

    document.addEventListener('submit', function(e) {
      const form = e.target;
      if (form.tagName !== 'FORM') return;

      trackEvent('form_submit', form, {
        formId: form.id,
        formAction: form.action,
        formName: form.name || form.id
      });
    });

    // Tracking de focus en camps de formulari
    document.addEventListener('focusin', function(e) {
      const target = e.target;
      if (!target.matches('input, textarea, select')) return;

      trackEvent('form_field_focus', target, {
        fieldType: target.type,
        fieldName: target.name
      });
    });
  }

  // Inicialització
  function init() {
    log('Iniciant sistema de tracking');

    // Verificar consentiment
    if (!checkConsent()) {
      log('No hi ha consentiment, tracking desactivat');
      // Exposar funció per donar consentiment
      window.FreshExpressTracking = {
        giveConsent,
        revokeConsent,
        isEnabled: () => consentGiven
      };
      return;
    }

    // Configurar listeners
    setupClickTracking();
    setupScrollTracking();
    setupTimeTracking();
    setupFormTracking();

    // Registrar pageview inicial
    trackEvent('pageview', null, {
      title: document.title,
      referrer: document.referrer
    });

    // Interval d'enviament de lots
    setInterval(sendEvents, CONFIG.batchInterval);

    // API pública
    window.FreshExpressTracking = {
      trackEvent,
      giveConsent,
      revokeConsent,
      isEnabled: () => consentGiven,
      getSessionId: () => sessionId,
      flush: sendEvents
    };

    log('Sistema de tracking inicialitzat');
  }

  // Iniciar quan el DOM estigui llest
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
