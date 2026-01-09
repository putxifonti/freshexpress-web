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
    debug: true // Activar debug per veure els events
  };

  // Estat
  let eventQueue = [];
  let sessionId = null;
  let pageLoadTime = Date.now();
  let lastActivity = Date.now();
  let consentGiven = true; // Activat per defecte per capturar tots els events

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
    // Per Data Broker, activem el tracking automàticament
    // L'usuari pot desactivar-ho a la configuració
    const consent = localStorage.getItem('freshexpress_tracking_consent');
    if (consent === 'false') {
      consentGiven = false;
      return false;
    }
    
    // Activar automàticament si no s'ha desactivat
    if (!consent) {
      localStorage.setItem('freshexpress_tracking_consent', 'true');
    }
    consentGiven = true;
    return true;
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
    // Sempre registrar events (el tracking està activat per defecte)
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
      const target = e.target.closest('a, button, [data-tracking-id]') || e.target;
      const clickX = (e.clientX / window.innerWidth) * 100;
      const clickY = (e.clientY / window.innerHeight) * 100;

      // Detectar identificador personalitzat
      const trackingId = target.dataset?.trackingId || target.closest('[data-tracking-id]')?.dataset?.trackingId;
      const trackingCategory = target.dataset?.trackingCategory || target.closest('[data-tracking-category]')?.dataset?.trackingCategory;
      
      // Event bàsic de click
      trackEvent('click', target, {
        x: Math.round(clickX),
        y: Math.round(clickY),
        button: e.button,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        trackingId: trackingId || null,
        trackingCategory: trackingCategory || null,
        elementType: target.tagName?.toLowerCase(),
        elementText: target.textContent?.trim().substring(0, 50) || ''
      });

      // Si té tracking-id específic, enviar event addicional
      if (trackingId) {
        trackEvent('button_click', target, {
          buttonId: trackingId,
          category: trackingCategory || 'unknown',
          page: window.location.pathname
        });
      }

      // Tracking específic per elements importants
      if (target.closest('[data-product-id]')) {
        const productEl = target.closest('[data-product-id]');
        trackEvent('product_click', target, {
          productId: productEl.dataset.productId,
          productName: productEl.dataset.productName || '',
          productPrice: productEl.dataset.productPrice || '',
          productCategory: productEl.dataset.productCategory || ''
        });
      }

      if (target.closest('[data-eco]')) {
        trackEvent('eco_interaction', target, {
          ecoType: target.closest('[data-eco]').dataset.eco
        });
      }

      if (target.closest('.add-to-cart, [data-action="add-to-cart"]')) {
        const productEl = target.closest('[data-product-id]') || target.closest('[data-product]');
        trackEvent('add_to_cart', target, {
          productId: productEl?.dataset.productId || productEl?.dataset.product || '',
          productName: productEl?.dataset.productName || '',
          productPrice: productEl?.dataset.productPrice || ''
        });
      }

      // Tracking de categoria de productes
      if (target.closest('[data-category]')) {
        const categoryEl = target.closest('[data-category]');
        trackEvent('category_click', target, {
          category: categoryEl.dataset.category
        });
      }

      // Tracking de cerca amb text
      if (target.closest('[data-search]') || target.matches('input[type="search"], .search-input')) {
        // Només capturar quan es fa submit o enter
        return; // Gestionat amb form tracking i event listener específic
      }

      // Tracking de checkout_start (botó de cistella)
      if (target.matches('#checkout-btn, .checkout-btn, [data-action="checkout"]')) {
        trackEvent('checkout_start', target);
      }

      // Tracking de compra completada (checkout finalitzar)
      if (target.closest('[data-action="purchase"], .purchase-btn, #finalitzar-btn, button[type="submit"]')) {
        const form = target.closest('form');
        if (form && form.action && form.action.includes('finalitzar')) {
          trackEvent('purchase', target);
        }
      }

      // Tracking de remove from cart
      if (target.closest('.remove-btn, [data-action="remove"]')) {
        const cartItem = target.closest('[data-cart-id]');
        trackEvent('remove_from_cart', target, {
          cartId: cartItem?.dataset.cartId || '',
          productName: cartItem?.querySelector('h4')?.textContent || ''
        });
      }

      // Tracking de quantity change
      if (target.closest('.qty-btn, [data-action="increase"], [data-action="decrease"]')) {
        const action = target.closest('[data-action]')?.dataset.action;
        const cartItem = target.closest('[data-cart-id]');
        const qtyDisplay = cartItem?.querySelector('.qty-display');
        trackEvent('quantity_change', target, {
          cartId: cartItem?.dataset.cartId || '',
          action: action || 'change',
          currentQty: qtyDisplay?.textContent || '1'
        });
      }
    });

    // Intersection Observer per product impressions (només productes visibles)
    const impressionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const card = entry.target;
          const alreadyTracked = card.dataset.impressionTracked;
          if (!alreadyTracked) {
            trackEvent('product_impression', card, {
              productId: card.dataset.productId,
              productName: card.dataset.productName || '',
              productPrice: card.dataset.productPrice || ''
            });
            card.dataset.impressionTracked = 'true';
          }
        }
      });
    }, { threshold: 0.5 }); // 50% visible

    // Observar productes existents
    document.querySelectorAll('[data-product-id]').forEach(function(card) {
      impressionObserver.observe(card);
    });

    // Observer per nous productes afegits dinàmicament
    const productObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            // Observar el node si és un producte
            if (node.dataset && node.dataset.productId) {
              impressionObserver.observe(node);
            }
            // Buscar productes dins del node
            const productCards = node.querySelectorAll ? 
              node.querySelectorAll('[data-product-id]') : [];
            productCards.forEach(function(card) {
              impressionObserver.observe(card);
            });
          }
        });
      });
    });

    // Observar canvis al DOM per detectar nous productes
    productObserver.observe(document.body, { childList: true, subtree: true });
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

    // Tracking d'errors de formulari
    document.addEventListener('invalid', function(e) {
      const target = e.target;
      trackEvent('form_error', target, {
        fieldName: target.name,
        fieldType: target.type,
        validationMessage: target.validationMessage
      });
    }, true);

    // Tracking de cerca amb text
    document.querySelectorAll('input[type="search"], .search-input, [data-search]').forEach(function(input) {
      let searchTimeout;
      input.addEventListener('keyup', function(e) {
        if (e.key === 'Enter' && input.value.trim()) {
          trackEvent('search_performed', input, {
            searchTerm: input.value.trim(),
            searchLength: input.value.trim().length
          });
        }
      });

      // Tracking de cerca després de pausa de 1.5s
      input.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        if (input.value.trim().length >= 3) {
          searchTimeout = setTimeout(function() {
            trackEvent('search_interaction', input, {
              searchTerm: input.value.trim(),
              searchLength: input.value.trim().length
            });
          }, 1500);
        }
      });
    });
  }

  // Inicialització
  function init() {
    log('Iniciant sistema de tracking');

    // Activar consentiment automàticament
    checkConsent();
    
    log('Tracking activat, consentGiven:', consentGiven);

    // Configurar listeners
    setupClickTracking();
    setupScrollTracking();
    setupTimeTracking();
    setupFormTracking();

    // Tracking global d'errors JavaScript
    window.addEventListener('error', function(e) {
      trackEvent('javascript_error', null, {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack?.substring(0, 200) // Només primers 200 caràcters
      });
    });

    // Tracking d'errors de promeses no capturades
    window.addEventListener('unhandledrejection', function(e) {
      trackEvent('promise_rejection', null, {
        reason: e.reason?.toString() || 'Unknown rejection',
        promise: 'UnhandledPromiseRejection'
      });
    });

    // Registrar pageview inicial
    trackEvent('pageview', null, {
      title: document.title,
      referrer: document.referrer,
      path: window.location.pathname,
      fullUrl: window.location.href,
      timestamp: new Date().toISOString()
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
      flush: sendEvents,
      trackLogin: function(userId) {
        trackEvent('login', null, { userId, timestamp: new Date().toISOString() });
      },
      trackLogout: function() {
        trackEvent('logout', null, { timestamp: new Date().toISOString() });
      },
      trackCheckoutComplete: function(orderData) {
        trackEvent('checkout_complete', null, {
          orderId: orderData.orderId,
          total: orderData.total,
          items: orderData.items || [],
          timestamp: new Date().toISOString()
        });
      },
      trackError: function(errorType, errorData) {
        trackEvent('application_error', null, {
          errorType,
          ...errorData,
          timestamp: new Date().toISOString()
        });
      }
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
