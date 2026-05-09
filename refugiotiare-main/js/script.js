// /pagina/js/script.js

// =========================
// CONFIGURAÇÕES GLOBAIS
// =========================
const CONFIG = {
  testimonials: {
    autoPlay: false,
    interval: 10000,
    totalItems: 6
  },
  transformations: {
    autoPlay: false,
    interval: 10000,
    totalItems: 7
  },
  about: {
    autoPlay: true,
    interval: 8000,
    totalItems: 3
  },
  pixKey: 'doe@gritoanimal.fun'
};

// =========================
// ✅ ALTERAÇÃO: PIX -> REDIRECIONAR
// (Botão 1, Botão 2, Botão 3)
// =========================
const EXTERNAL_DONATION_URL = "https://livepix.gg/fga"; // <-- troque aqui se precisar

function openExternalDonation() {
  // Dispara evento no Meta Pixel (se existir), sem quebrar caso não exista
  try {
    if (typeof fbq === "function") {
      fbq("trackCustom", "DonateClick", { destination: EXTERNAL_DONATION_URL });
    }
  } catch (e) {}

  window.open(EXTERNAL_DONATION_URL, "_blank", "noopener,noreferrer");
}

// ⚠️ ESSA FUNÇÃO É CHAMADA PELO HTML (onclick="copyPixKey()") EM VÁRIOS BOTÕES
function copyPixKey() {
  openExternalDonation();
}

// Liga o botão "Copiar Chave PIX" (classe .copy-btn) para também redirecionar
function initializePIXCopy() {
  const copyBtn = document.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openExternalDonation();
    });
  }

  // (Opcional extra de segurança) Se algum elemento tiver [data-donate], redireciona também
  document.querySelectorAll('[data-donate="true"]').forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openExternalDonation();
    });
  });
}

// =========================
// ESTADO DA APLICAÇÃO
// =========================
let currentTestimonial = 0;
let currentTransformation = 0;
let currentAbout = 0;
let testimonialInterval = null;
let transformationInterval = null;
let aboutInterval = null;

// =========================
// INICIALIZAÇÃO
// =========================
document.addEventListener('DOMContentLoaded', function() {
  initializeProgressiveImageLoading();
  initializeCarousel();
  initializeTransformationCarousel();
  initializeAboutCarousel();
  initializeDonationGoal();
  initializeAnimations();
  initializePIXCopy();
  initializeFixedButton();
  initializeWhatsAppCarousel();

  console.log('Site da Fundação Grito Animal carregado com sucesso!');
});

// =========================
// CARREGAMENTO PROGRESSIVO DE IMAGENS
// =========================
function initializeProgressiveImageLoading() {
  const imagePriority = [
    'imagens/logosemfundo.png',
    'imagens/bannernovo.webp',
    'imagens/logo.webp',

    'imagens/cachorro.webp',
    'imagens/obra.webp',
    'imagens/cachorros.webp',

    'imagens/antesdepois/antes1.webp',
    'imagens/antesdepois/depois1.webp',
    'imagens/antesdepois/antes2.webp',
    'imagens/antesdepois/depois2.webp',
    'imagens/antesdepois/antes3.webp',
    'imagens/antesdepois/depois3.webp',
    'imagens/antesdepois/antes4.webp',
    'imagens/antesdepois/depois4.webp',
    'imagens/antesdepois/antes5.webp',
    'imagens/antesdepois/depois5.webp',
    'imagens/antesdepois/antes6.webp',
    'imagens/antesdepois/depois6.webp',
    'imagens/antesdepois/antes7.webp',
    'imagens/antesdepois/depois7.jpg',

    'imagens/adotantes/1.webp',
    'imagens/adotantes/2.webp',
    'imagens/adotantes/3.webp',
    'imagens/adotantes/4.webp',
    'imagens/adotantes/5.webp',
    'imagens/adotantes/6.webp',

    'imagens/pixxx.png',
  ];

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => reject(src);
      img.src = src;
    });
  }

  async function loadImagesInBatches() {
    const batchSize = 3;
    const delayBetweenBatches = 100;

    for (let i = 0; i < imagePriority.length; i += batchSize) {
      const batch = imagePriority.slice(i, i + batchSize);

      const promises = batch.map(src => loadImage(src).catch(err => {
        console.warn(`Falha ao carregar imagem: ${src}`, err);
        return null;
      }));

      await Promise.all(promises);

      if (i + batchSize < imagePriority.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }

    console.log('✅ Todas as imagens foram carregadas progressivamente!');
  }

  const criticalImages = [
    'imagens/logosemfundo.png',
    'imagens/bannernovo.webp',
    'imagens/logo.webp'
  ];

  Promise.all(criticalImages.map(src => loadImage(src).catch(err => {
    console.warn(`Falha ao carregar imagem crítica: ${src}`, err);
    return null;
  }))).then(() => {
    console.log('✅ Imagens críticas carregadas!');
    loadImagesInBatches();
  });

  function preloadCarouselImages() {
    const carouselImages = [
      'imagens/antesdepois/antes1.webp', 'imagens/antesdepois/depois1.webp',
      'imagens/antesdepois/antes2.webp', 'imagens/antesdepois/depois2.webp',
      'imagens/antesdepois/antes3.webp', 'imagens/antesdepois/depois3.webp',
      'imagens/antesdepois/antes4.webp', 'imagens/antesdepois/depois4.webp',
      'imagens/antesdepois/antes5.webp', 'imagens/antesdepois/depois5.webp',
      'imagens/antesdepois/antes6.webp', 'imagens/antesdepois/depois6.webp',
      'imagens/antesdepois/antes7.webp', 'imagens/antesdepois/depois7.jpg',
      'imagens/adotantes/1.webp', 'imagens/adotantes/2.webp',
      'imagens/adotantes/3.webp', 'imagens/adotantes/4.webp',
      'imagens/adotantes/5.webp', 'imagens/adotantes/6.webp'
    ];

    carouselImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  setTimeout(preloadCarouselImages, 500);
}

// =========================
// CAROUSEL DE DEPOIMENTOS
// =========================
function initializeCarousel() {
  createCarouselIndicators();
  showTestimonial(0);

  if (CONFIG.testimonials.autoPlay) {
    startAutoPlay();
  }

  document.addEventListener('keydown', handleKeyboardNavigation);

  const carousel = document.getElementById('testimonialsCarousel');
  if (carousel) {
    if (CONFIG.testimonials.autoPlay) {
      carousel.addEventListener('mouseenter', stopAutoPlay);
      carousel.addEventListener('mouseleave', startAutoPlay);
    }
    initializeTestimonialTouch(carousel);
  }
}

// =========================
// CAROUSEL DE TRANSFORMAÇÕES
// =========================
function initializeTransformationCarousel() {
  createTransformationIndicators();

  if (CONFIG.transformations.autoPlay) {
    startTransformationAutoPlay();
  }

  const transformationCarousel = document.getElementById('transformationCarousel');
  if (transformationCarousel) {
    transformationCarousel.addEventListener('mouseenter', stopTransformationAutoPlay);
    transformationCarousel.addEventListener('mouseleave', startTransformationAutoPlay);
    initializeTransformationTouch(transformationCarousel);
  }
}

function createTransformationIndicators() {
  const indicatorsContainer = document.getElementById('transformationIndicators');
  if (!indicatorsContainer) return;

  indicatorsContainer.innerHTML = '';

  for (let i = 0; i < CONFIG.transformations.totalItems; i++) {
    const indicator = document.createElement('div');
    indicator.className = `transformation-indicator ${i === 0 ? 'active' : ''}`;
    indicator.addEventListener('click', () => goToTransformation(i));
    indicator.setAttribute('aria-label', `Ir para história ${i + 1}`);
    indicator.setAttribute('role', 'button');
    indicator.setAttribute('tabindex', '0');

    indicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToTransformation(i);
      }
    });

    indicatorsContainer.appendChild(indicator);
  }
}

function showTransformation(index) {
  const transformations = document.querySelectorAll('.transformation-item');
  const indicators = document.querySelectorAll('.transformation-indicator');

  transformations.forEach(item => item.classList.remove('active'));
  indicators.forEach(indicator => indicator.classList.remove('active'));

  if (transformations[index]) transformations[index].classList.add('active');
  if (indicators[index]) indicators[index].classList.add('active');

  currentTransformation = index;
}

function nextTransformation() {
  const next = (currentTransformation + 1) % CONFIG.transformations.totalItems;
  goToTransformation(next);
}

function prevTransformation() {
  const prev = currentTransformation === 0 ? CONFIG.transformations.totalItems - 1 : currentTransformation - 1;
  goToTransformation(prev);
}

function goToTransformation(index) {
  if (index >= 0 && index < CONFIG.transformations.totalItems) {
    showTransformation(index);
  }
}

function startTransformationAutoPlay() {
  if (transformationInterval) clearInterval(transformationInterval);

  transformationInterval = setInterval(() => {
    nextTransformation();
  }, CONFIG.transformations.interval);
}

function stopTransformationAutoPlay() {
  if (transformationInterval) {
    clearInterval(transformationInterval);
    transformationInterval = null;
  }
}

// =========================
// CAROUSEL QUEM SOMOS
// =========================
function initializeAboutCarousel() {
  createAboutIndicators();
  initializeAboutTouch();

  if (CONFIG.about.autoPlay) {
    startAboutAutoPlay();
  }
}

function createAboutIndicators() {
  const indicatorsContainer = document.querySelector('.about-indicators');
  if (!indicatorsContainer) return;

  indicatorsContainer.innerHTML = '';
  for (let i = 0; i < CONFIG.about.totalItems; i++) {
    const indicator = document.createElement('span');
    indicator.className = 'about-indicator';
    if (i === 0) indicator.classList.add('active');
    indicator.onclick = () => goToAbout(i);
    indicatorsContainer.appendChild(indicator);
  }
}

function showAbout(index) {
  const slides = document.querySelectorAll('.about-slide');
  const indicators = document.querySelectorAll('.about-indicator');

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  indicators.forEach((indicator, i) => {
    indicator.classList.toggle('active', i === index);
  });

  currentAbout = index;
}

function nextAbout() {
  const next = (currentAbout + 1) % CONFIG.about.totalItems;
  goToAbout(next);
}

function prevAbout() {
  const prev = currentAbout === 0 ? CONFIG.about.totalItems - 1 : currentAbout - 1;
  goToAbout(prev);
}

function goToAbout(index) {
  if (index >= 0 && index < CONFIG.about.totalItems) {
    showAbout(index);
    if (CONFIG.about.autoPlay) {
      stopAboutAutoPlay();
      startAboutAutoPlay();
    }
  }
}

function startAboutAutoPlay() {
  if (aboutInterval) clearInterval(aboutInterval);

  aboutInterval = setInterval(() => {
    nextAbout();
  }, CONFIG.about.interval);
}

function stopAboutAutoPlay() {
  if (aboutInterval) {
    clearInterval(aboutInterval);
    aboutInterval = null;
  }
}

function initializeAboutTouch() {
  const carousel = document.getElementById('aboutCarousel');
  if (!carousel) return;

  let startX = 0;
  let startY = 0;
  let endX = 0;
  let isDragging = false;

  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    stopAboutAutoPlay();
  }, { passive: true });

  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(currentY - startY);

    if (diffY > diffX) {
      isDragging = false;
      return;
    }

    e.preventDefault();
  }, { passive: false });

  carousel.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    endX = e.changedTouches[0].clientX;
    handleAboutSwipe();
    isDragging = false;

    if (CONFIG.about.autoPlay) startAboutAutoPlay();
  }, { passive: true });

  carousel.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    stopAboutAutoPlay();
    e.preventDefault();
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  carousel.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    endX = e.clientX;
    handleAboutSwipe();
    isDragging = false;

    if (CONFIG.about.autoPlay) startAboutAutoPlay();
  });

  carousel.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  function handleAboutSwipe() {
    const diffX = startX - endX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) nextAbout();
      else prevAbout();
    }
  }
}

// =========================
// META DE DOAÇÃO (VALORES FIXOS)
// =========================
function initializeDonationGoal() {
  const goalConfig = {
    targetAmount: 50000,
    currentAmount: 22279,
  };

  updateDonationUI(goalConfig.currentAmount, goalConfig.targetAmount);
}

function updateDonationUI(currentAmount, targetAmount) {
  const percentage = Math.min(Math.floor((currentAmount / targetAmount) * 100), 100);

  const formattedAmount = formatCurrency(currentAmount);
  const formattedTarget = formatCurrency(targetAmount);

  const amountElement = document.getElementById('amountRaised');
  const percentageElement = document.getElementById('progressPercentage');

  if (amountElement) amountElement.textContent = formattedAmount;
  if (percentageElement) percentageElement.textContent = percentage + '%';

  updateProgressCircle(percentage);

  console.log(`💰 Meta de doação atualizada: ${formattedAmount} (${percentage}% da meta de ${formattedTarget})`);
}

function updateProgressCircle(percentage) {
  const circle = document.querySelector('.progress-ring-circle');
  if (circle) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatNumber(number) {
  return new Intl.NumberFormat('pt-BR').format(number);
}

// =========================
// TOUCH SUPPORT DEPOIMENTOS
// =========================
function initializeTestimonialTouch(carousel) {
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let isDragging = false;

  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    if (CONFIG.testimonials.autoPlay) stopAutoPlay();
  });

  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(currentY - startY);

    if (diffY > diffX) {
      isDragging = false;
      return;
    }
  });

  carousel.addEventListener('touchend', (e) => {
    if (!isDragging) return;

    endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) nextTestimonial();
      else prevTestimonial();
    }

    isDragging = false;
    if (CONFIG.testimonials.autoPlay) startAutoPlay();
  });

  carousel.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    if (CONFIG.testimonials.autoPlay) stopAutoPlay();
  });

  carousel.addEventListener('mouseup', (e) => {
    if (!isDragging) return;

    endX = e.clientX;
    const diffX = startX - endX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) nextTestimonial();
      else prevTestimonial();
    }

    isDragging = false;
    if (CONFIG.testimonials.autoPlay) startAutoPlay();
  });

  carousel.addEventListener('selectstart', (e) => {
    if (isDragging) e.preventDefault();
  });
}

// =========================
// TOUCH SUPPORT TRANSFORMAÇÕES
// =========================
function initializeTransformationTouch(carousel) {
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let isDragging = false;

  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    stopTransformationAutoPlay();
  });

  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(currentY - startY);

    if (diffY > diffX) {
      isDragging = false;
      return;
    }
  });

  carousel.addEventListener('touchend', (e) => {
    if (!isDragging) return;

    endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) nextTransformation();
      else prevTransformation();
    }

    isDragging = false;
    startTransformationAutoPlay();
  });

  carousel.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    stopTransformationAutoPlay();
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  carousel.addEventListener('mouseup', (e) => {
    if (!isDragging) return;

    endX = e.clientX;
    const diffX = startX - endX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) nextTransformation();
      else prevTransformation();
    }

    isDragging = false;
    startTransformationAutoPlay();
  });

  carousel.addEventListener('selectstart', (e) => {
    if (isDragging) e.preventDefault();
  });
}

// =========================
// INDICADORES E CONTROLE DEPOIMENTOS
// =========================
function createCarouselIndicators() {
  const indicatorsContainer = document.getElementById('testimonialIndicators');
  if (!indicatorsContainer) return;

  indicatorsContainer.innerHTML = '';

  for (let i = 0; i < CONFIG.testimonials.totalItems; i++) {
    const indicator = document.createElement('div');
    indicator.className = `testimonial-indicator ${i === 0 ? 'active' : ''}`;
    indicator.addEventListener('click', () => goToTestimonial(i));
    indicator.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
    indicator.setAttribute('role', 'button');
    indicator.setAttribute('tabindex', '0');

    indicator.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToTestimonial(i);
      }
    });

    indicatorsContainer.appendChild(indicator);
  }
}

function showTestimonial(index) {
  const testimonials = document.querySelectorAll('.testimonial-item');
  const indicators = document.querySelectorAll('.testimonial-indicator');

  testimonials.forEach(item => item.classList.remove('active'));
  indicators.forEach(indicator => indicator.classList.remove('active'));

  if (testimonials[index]) testimonials[index].classList.add('active');
  if (indicators[index]) indicators[index].classList.add('active');

  currentTestimonial = index;
}

function nextTestimonial() {
  const next = (currentTestimonial + 1) % CONFIG.testimonials.totalItems;
  goToTestimonial(next);
}

function prevTestimonial() {
  const prev = currentTestimonial === 0 ? CONFIG.testimonials.totalItems - 1 : currentTestimonial - 1;
  goToTestimonial(prev);
}

function goToTestimonial(index) {
  if (index >= 0 && index < CONFIG.testimonials.totalItems) {
    showTestimonial(index);
    if (CONFIG.testimonials.autoPlay) restartAutoPlay();
  }
}

function startAutoPlay() {
  if (CONFIG.testimonials.autoPlay) {
    stopAutoPlay();
    testimonialInterval = setInterval(nextTestimonial, CONFIG.testimonials.interval);
  }
}

function stopAutoPlay() {
  if (testimonialInterval) {
    clearInterval(testimonialInterval);
    testimonialInterval = null;
  }
}

function restartAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

function handleKeyboardNavigation(e) {
  const carousel = document.getElementById('testimonialsCarousel');
  if (!carousel) return;

  const isCarouselFocused =
    carousel.contains(document.activeElement) ||
    document.activeElement.classList.contains('testimonial-btn') ||
    document.activeElement.classList.contains('testimonial-indicator');

  if (isCarouselFocused) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prevTestimonial();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextTestimonial();
        break;
      case 'Home':
        e.preventDefault();
        goToTestimonial(0);
        break;
      case 'End':
        e.preventDefault();
        goToTestimonial(CONFIG.testimonials.totalItems - 1);
        break;
    }
  }
}

// =========================
// ANIMAÇÕES E EFEITOS
// =========================
function initializeAnimations() {
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    const animatedElements = document.querySelectorAll(
      '.stat-item, .testimonial-item, .value-item, .footer-section'
    );

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      observer.observe(el);
    });
  }

  initializeParallax();
}

function handleIntersection(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const element = entry.target;

      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';

      setTimeout(() => {
        entry.target.style.transition = '';
      }, 600);
    }
  });
}

function initializeParallax() {
  return; // desabilitado
}

// =========================
// UTILITÁRIOS
// =========================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function isMobile() {
  return window.innerWidth <= 768;
}

function trackEvent(eventName, properties = {}) {
  console.log(`Event: ${eventName}`, properties);
}

// =========================
// EVENT LISTENERS GERAIS
// =========================
window.addEventListener('resize', debounce(() => {
  if (CONFIG.testimonials.autoPlay) {
    if (isMobile()) stopAutoPlay();
    else startAutoPlay();
  }
}, 250));

document.addEventListener('visibilitychange', () => {
  if (CONFIG.testimonials.autoPlay) {
    if (document.hidden) stopAutoPlay();
    else startAutoPlay();
  }
});

// =========================
// ACESSIBILIDADE
// =========================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && CONFIG.testimonials.autoPlay) {
    stopAutoPlay();
  }
  handleTabTrap(e);
});

function handleTabTrap(e) {
  if (e.key !== 'Tab') return;

  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
}

// =========================
// PERFORMANCE - IMAGENS
// =========================
function optimizeImageLoading() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (img.complete) img.classList.add('loaded');
    else {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
      });
    }
  });
}
optimizeImageLoading();

// =========================
// FUNÇÕES EXPOSTAS GLOBALMENTE
// =========================
window.nextTestimonial = nextTestimonial;
window.prevTestimonial = prevTestimonial;
window.nextTransformation = nextTransformation;
window.prevTransformation = prevTransformation;
window.nextAbout = nextAbout;
window.prevAbout = prevAbout;
window.goToAbout = goToAbout;
window.copyPixKey = copyPixKey;

// =========================
// ERROR HANDLING
// =========================
window.addEventListener('error', (e) => {
  console.error('Erro JavaScript:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Promise rejeitada:', e.reason);
  e.preventDefault();
});

// =========================
// INICIALIZAÇÃO FINAL
// =========================
window.RefugioTiaReLoaded = true;

console.log('🐕 Refúgio da Tia Rê - Sistema carregado com sucesso! 🐱');
console.log('Versão: 1.0.0');
console.log('Desenvolvido com ❤️ para salvar vidas');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // navigator.serviceWorker.register('/sw.js');
  });
}

// =========================
// MODAL DE DOAÇÃO
// =========================
let selectedDonationAmount = null;
let donationType = 'unica';

function openDonationModal() {
  const modal = document.getElementById('donationModal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal.style.display = 'flex';
    switchDonationTab('unica');
    goToStep1();
  }
}

function closeDonationModal() {
  const modal = document.getElementById('donationModal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    selectedDonationAmount = null;

    document.querySelectorAll('.donation-btn').forEach(btn => {
      btn.classList.remove('selected');
    });

    const customAmountInput = document.getElementById('customAmount');
    if (customAmountInput) customAmountInput.value = '';

    resetDonationForm();
  }

  hideDonationLoading();
}

function goToStep1() {
  const step1 = document.getElementById('donationStep1');
  const step2Unica = document.getElementById('donationStep2Unica');
  const step2Mensal = document.getElementById('donationStep2Mensal');
  const tabs = document.getElementById('donationTabs');
  const typeIndicator = document.getElementById('donationTypeIndicator');

  if (step1) step1.style.display = 'block';
  if (step2Unica) step2Unica.style.display = 'none';
  if (step2Mensal) step2Mensal.style.display = 'none';
  if (tabs) tabs.style.display = 'flex';
  if (typeIndicator) typeIndicator.style.display = 'none';

  hideDonationLoading();
}

function goToStep2() {
  const customAmountInput = document.getElementById('customAmount');
  const customAmount = customAmountInput ? parseFloat(customAmountInput.value) : 0;

  let amount = selectedDonationAmount;
  if (customAmount && customAmount > 0) amount = customAmount;

  if (!amount || amount <= 0) {
    alert('Por favor, selecione um valor ou digite um valor personalizado.');
    return;
  }

  if (amount < 10) {
    alert('O valor mínimo para doação é de R$ 10,00.');
    return;
  }

  if (amount > 7000) {
    alert('O valor maximo para doação é de R$ 7.000.');
    return;
  }

  selectedDonationAmount = amount;

  const tabs = document.getElementById('donationTabs');
  const typeIndicator = document.getElementById('donationTypeIndicator');
  const typeText = document.getElementById('selectedDonationTypeText');

  if (tabs) tabs.style.display = 'none';
  if (typeIndicator) typeIndicator.style.display = 'block';
  if (typeText) typeText.textContent = donationType === 'mensal' ? 'Doação Mensal' : 'Doação Única';

  const step1 = document.getElementById('donationStep1');
  if (step1) step1.style.display = 'none';

  if (donationType === 'mensal') {
    const step2Mensal = document.getElementById('donationStep2Mensal');
    if (step2Mensal) {
      step2Mensal.style.display = 'block';
      const amountDisplayMensal = document.getElementById('selectedAmountDisplayMensal');
      if (amountDisplayMensal) amountDisplayMensal.textContent = formatCurrency(amount);
    }
    const step2Unica = document.getElementById('donationStep2Unica');
    if (step2Unica) step2Unica.style.display = 'none';
  } else {
    const step2Unica = document.getElementById('donationStep2Unica');
    if (step2Unica) {
      step2Unica.style.display = 'block';
      const amountDisplay = document.getElementById('selectedAmountDisplay');
      if (amountDisplay) amountDisplay.textContent = formatCurrency(amount);
    }
    const step2Mensal = document.getElementById('donationStep2Mensal');
    if (step2Mensal) step2Mensal.style.display = 'none';
  }

  updateAmountDisplay();
}

function handleAdministrativeFee() {
  updateAmountDisplay();
}

function updateAmountDisplay() {
  if (donationType !== 'unica') return;

  const feeCheckbox = document.getElementById('addAdministrativeFee');
  const amountDisplay = document.getElementById('selectedAmountDisplay');
  if (!amountDisplay || !selectedDonationAmount) return;

  let totalAmount = selectedDonationAmount;
  if (feeCheckbox && feeCheckbox.checked) totalAmount += 4.99;

  amountDisplay.textContent = formatCurrency(totalAmount);
}

function goBackToStep1() {
  goToStep1();
}

function selectDonationAmount(amount) {
  selectedDonationAmount = amount;

  document.querySelectorAll('.donation-btn').forEach(btn => btn.classList.remove('selected'));
  if (typeof event !== "undefined" && event?.target) event.target.classList.add('selected');

  const customAmountInput = document.getElementById('customAmount');
  if (customAmountInput) customAmountInput.value = '';
}

function handleCustomAmount() {
  const customAmountInput = document.getElementById('customAmount');
  if (customAmountInput && customAmountInput.value) {
    document.querySelectorAll('.donation-btn').forEach(btn => btn.classList.remove('selected'));
    selectedDonationAmount = null;
  }
}

function handleAnonymousDonation() {
  const checkbox = document.getElementById('donateAnonymously');
  const nameInput = document.getElementById('donorName');

  if (checkbox && checkbox.checked) {
    if (nameInput) {
      nameInput.value = 'Anonimo';
      nameInput.disabled = true;
    }
  } else {
    if (nameInput) {
      nameInput.value = '';
      nameInput.disabled = false;
    }
  }
}

function resetDonationForm() {
  const nameInput = document.getElementById('donorName');
  const phoneInput = document.getElementById('donorPhone');
  const messageInput = document.getElementById('donorMessage');
  const anonymousCheckbox = document.getElementById('donateAnonymously');

  if (nameInput) {
    nameInput.value = '';
    nameInput.disabled = false;
  }
  if (phoneInput) phoneInput.value = '';
  if (messageInput) {
    messageInput.value = '';
    updateCharCount();
  }
  if (anonymousCheckbox) anonymousCheckbox.checked = false;

  const nameInputMensal = document.getElementById('donorNameMensal');
  const phoneInputMensal = document.getElementById('donorPhoneMensal');
  const emailInputMensal = document.getElementById('donorEmailMensal');
  const documentInputMensal = document.getElementById('donorDocumentMensal');

  if (nameInputMensal) nameInputMensal.value = '';
  if (phoneInputMensal) phoneInputMensal.value = '';
  if (emailInputMensal) emailInputMensal.value = '';
  if (documentInputMensal) documentInputMensal.value = '';
}

function updateCharCount() {
  const messageInput = document.getElementById('donorMessage');
  const charCount = document.getElementById('charCount');
  if (messageInput && charCount) charCount.textContent = messageInput.value.length;
}

document.addEventListener('DOMContentLoaded', function() {
  const messageInput = document.getElementById('donorMessage');
  if (messageInput) messageInput.addEventListener('input', updateCharCount);

  const phoneInput = document.getElementById('donorPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      else value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      e.target.value = value;
    });
  }

  const phoneInputMensal = document.getElementById('donorPhoneMensal');
  if (phoneInputMensal) {
    phoneInputMensal.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      else value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      e.target.value = value;
    });
  }

  const documentInput = document.getElementById('donorDocumentMensal');
  if (documentInput) {
    documentInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }
      e.target.value = value;
    });
  }
});

function generateContribution() {
  let nome, telefone, email, cpf, mensagem;

  if (donationType === 'mensal') {
    const nameInput = document.getElementById('donorNameMensal');
    const phoneInput = document.getElementById('donorPhoneMensal');
    const emailInput = document.getElementById('donorEmailMensal');
    const documentInput = document.getElementById('donorDocumentMensal');

    nome = nameInput ? nameInput.value.trim() : '';
    telefone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
    email = emailInput ? emailInput.value.trim() : '';
    cpf = documentInput ? documentInput.value.replace(/\D/g, '') : '';
    mensagem = '';

    if (!nome || nome === '') { alert('Por favor, preencha seu nome completo.'); return; }
    if (!telefone || telefone.length < 11) { alert('Por favor, preencha um telefone válido.'); return; }
    if (!cpf || cpf.length !== 11) { alert('Por favor, preencha um CPF válido.'); return; }
  } else {
    const nameInput = document.getElementById('donorName');
    const phoneInput = document.getElementById('donorPhone');
    const messageInput = document.getElementById('donorMessage');

    nome = nameInput ? nameInput.value.trim() : '';
    telefone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
    mensagem = messageInput ? messageInput.value.trim() : '';
    email = '';
    cpf = '';

    if (!nome || nome === '') { alert('Por favor, preencha seu nome ou marque a opção "Doar anonimamente".'); return; }
    if (!telefone || telefone.length < 11) telefone = '000000000';
  }

  if (!selectedDonationAmount || selectedDonationAmount <= 0) {
    alert('Por favor, selecione um valor válido.');
    return;
  }

  let finalAmount = selectedDonationAmount;
  if (donationType === 'unica') {
    const feeCheckbox = document.getElementById('addAdministrativeFee');
    if (feeCheckbox && feeCheckbox.checked) finalAmount += 4.99;
  }

  const step1 = document.getElementById('donationStep1');
  const step2Unica = document.getElementById('donationStep2Unica');
  const step2Mensal = document.getElementById('donationStep2Mensal');

  if (step1) step1.style.display = 'none';
  if (step2Unica) step2Unica.style.display = 'none';
  if (step2Mensal) step2Mensal.style.display = 'none';

  setTimeout(() => {
    showDonationLoading();
  }, 50);

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {};
  ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term'].forEach(param => {
    const value = urlParams.get(param);
    if (value) utmParams[param] = value;
  });

  const endpoint = donationType === 'mensal' ? 'gerarpixrecorrente/index.php' : 'gerarpix/index.php';
  let pixUrl = `${endpoint}?amount=${finalAmount}&nome=${encodeURIComponent(nome)}&telefone=${encodeURIComponent(telefone)}`;

  if (donationType === 'mensal') {
    pixUrl += `&email=${encodeURIComponent(email)}&cpf=${encodeURIComponent(cpf)}`;
  }

  if (donationType === 'unica' && mensagem) {
    pixUrl += `&mensagem=${encodeURIComponent(mensagem)}`;
  }

  Object.keys(utmParams).forEach(key => {
    pixUrl += `&${key}=${encodeURIComponent(utmParams[key])}`;
  });

  setTimeout(() => {
    window.location.href = pixUrl;
  }, 500);
}

function scrollToDonation() {
  openDonationModal();
}

function showDonationLoading() {
  const loading = document.getElementById('donationLoading');
  const step1 = document.getElementById('donationStep1');
  const step2 = document.getElementById('donationStep2');

  if (loading) {
    loading.style.display = 'flex';
    if (step1) step1.style.display = 'none';
    if (step2) step2.style.display = 'none';
  }
}

function hideDonationLoading() {
  const loading = document.getElementById('donationLoading');
  if (loading) loading.style.display = 'none';
}

document.addEventListener('click', function(event) {
  const modal = document.getElementById('donationModal');
  if (event.target === modal) closeDonationModal();
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') closeDonationModal();
});

function switchDonationTab(type) {
  donationType = type;

  const tabUnica = document.getElementById('tabUnica');
  const tabMensal = document.getElementById('tabMensal');

  if (tabUnica && tabMensal) {
    if (type === 'unica') {
      tabUnica.classList.add('active');
      tabMensal.classList.remove('active');
    } else {
      tabMensal.classList.add('active');
      tabUnica.classList.remove('active');
    }
  }
}

// Exporta funções para uso global
window.openDonationModal = openDonationModal;
window.closeDonationModal = closeDonationModal;
window.selectDonationAmount = selectDonationAmount;
window.handleCustomAmount = handleCustomAmount;
window.goToStep2 = goToStep2;
window.goBackToStep1 = goBackToStep1;
window.handleAnonymousDonation = handleAnonymousDonation;
window.generateContribution = generateContribution;
window.scrollToDonation = scrollToDonation;
window.switchDonationTab = switchDonationTab;
window.handleAdministrativeFee = handleAdministrativeFee;

// =========================
// MODAL DE DETALHES DAS DESPESAS
// =========================
function openExpensesModal() {
  const modal = document.getElementById('expensesModal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal.style.display = 'flex';
  }
}

function closeExpensesModal() {
  const modal = document.getElementById('expensesModal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

window.openExpensesModal = openExpensesModal;
window.closeExpensesModal = closeExpensesModal;

document.addEventListener('click', function(event) {
  const modal = document.getElementById('expensesModal');
  if (event.target === modal) closeExpensesModal();
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const expensesModal = document.getElementById('expensesModal');
    if (expensesModal && expensesModal.classList.contains('show')) closeExpensesModal();
  }
});

// =========================
// CONTROLE DO BOTÃO FIXO
// =========================
function initializeFixedButton() {
  const fixedBtn = document.querySelector('.fixed-donation-btn');
  const donationGoalSection = document.querySelector('.donation-goal-section');

  if (!fixedBtn || !donationGoalSection) return;

  function checkScroll() {
    const donationGoalSectionTop = donationGoalSection.offsetTop;
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    if (scrollPosition + windowHeight > donationGoalSectionTop + 100) {
      fixedBtn.classList.add('show');
    } else {
      fixedBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll();
}

// =========================
// CARROSSEL WHATSAPP
// =========================
function initializeWhatsAppCarousel() {
  const track = document.querySelector('.whatsapp-groups-track');
  const wrapper = document.querySelector('.whatsapp-groups-wrapper');
  const prevBtn = document.querySelector('.whatsapp-carousel-btn.prev');
  const nextBtn = document.querySelector('.whatsapp-carousel-btn.next');
  const dots = document.querySelectorAll('.whatsapp-carousel-dots .dot');

  if (!track || !prevBtn || !nextBtn || !wrapper) return;

  let currentIndex = 0;
  const totalItems = document.querySelectorAll('.group-item').length;

  function updateCarousel() {
    const itemWidth = wrapper.offsetWidth;
    const translateX = -currentIndex * itemWidth;
    track.style.transform = `translateX(${translateX}px)`;

    dots.forEach((dot, index) => {
      if (index === currentIndex) dot.classList.add('active');
      else dot.classList.remove('active');
    });

    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  function goToSlide(index) {
    if (index < 0) currentIndex = totalItems - 1;
    else if (index >= totalItems) currentIndex = 0;
    else currentIndex = index;

    updateCarousel();
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });

  let startX = 0;
  let startY = 0;
  let endX = 0;
  let isDragging = false;

  wrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(currentY - startY);

    if (diffY > diffX) {
      isDragging = false;
      return;
    }
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    if (!isDragging) return;

    endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) nextSlide();
      else prevSlide();
    }

    isDragging = false;
  }, { passive: true });

  wrapper.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    e.preventDefault();
  });

  wrapper.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  wrapper.addEventListener('mouseup', (e) => {
    if (!isDragging) return;

    endX = e.clientX;
    const diffX = startX - endX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) nextSlide();
      else prevSlide();
    }

    isDragging = false;
  });

  wrapper.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  wrapper.addEventListener('selectstart', (e) => {
    if (isDragging) e.preventDefault();
  });

  updateCarousel();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateCarousel();
    }, 250);
  });
}
