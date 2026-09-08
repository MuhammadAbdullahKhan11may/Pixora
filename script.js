const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('navbar--scrolled');
  } else {
    navbar.classList.remove('navbar--scrolled');
  }
});
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('is-open');
  navToggle.classList.toggle('is-active');
});

// Close menu when a link is tapped
document.querySelectorAll('.navbar__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.classList.remove('is-active');
  });
});
const sections = document.querySelectorAll('section[id], header[id]');
const navLinksList = document.querySelectorAll('.navbar__link[data-nav-link]');

const setActiveLink = () => {
  let currentId = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100; // matches navbar height + buffer
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentId = section.getAttribute('id');
    }
  });

  navLinksList.forEach(link => {
    link.classList.remove('navbar__link--active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('navbar__link--active');
    }
  });
};

window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);
/* ===== Trending Section ===== */
const trendTrack = document.getElementById('trendTrack');
const trendPrev = document.getElementById('trendPrev');
const trendNext = document.getElementById('trendNext');
const trendCurrent = document.getElementById('trendCurrent');
const trendTotal = document.getElementById('trendTotal');
const trendProgress = document.getElementById('trendProgress');
const trendCards = document.querySelectorAll('.trending__card');

trendTotal.textContent = String(trendCards.length).padStart(2, '0');

// Play / pause videos
trendCards.forEach(card => {
  const video = card.querySelector('.trending__video');
  const playBtn = card.querySelector('.trending__play');
  const durationEl = card.querySelector('.trending__duration');

  video.muted = true;

  video.addEventListener('loadedmetadata', () => {
    const mins = Math.floor(video.duration / 60);
    const secs = Math.floor(video.duration % 60).toString().padStart(2, '0');
    if (durationEl) durationEl.textContent = `${mins}:${secs}`;
  });

  const playThis = () => {
    video.play().catch(() => {});
    card.classList.add('is-playing');
  };

  const pauseThis = () => {
    video.pause();
    video.currentTime = 0;
    card.classList.remove('is-playing');
  };

  // Hover to auto-play (desktop)
  card.addEventListener('mouseenter', playThis);
  card.addEventListener('mouseleave', pauseThis);

  // Tap to play/pause (touch devices, no hover)
  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    video.paused ? playThis() : pauseThis();
  });

  video.addEventListener('pause', () => card.classList.remove('is-playing'));
  video.addEventListener('ended', () => card.classList.remove('is-playing'));
});

// Arrow scroll
const scrollByCard = (direction) => {
  const cardWidth = trendCards[0].getBoundingClientRect().width + 20; // + gap
  trendTrack.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
};

trendNext.addEventListener('click', () => scrollByCard(1));
trendPrev.addEventListener('click', () => scrollByCard(-1));

// Update counter + progress bar on scroll
const updateTrendState = () => {
  const cardWidth = trendCards[0].getBoundingClientRect().width + 20;
  const index = Math.round(trendTrack.scrollLeft / cardWidth);
  trendCurrent.textContent = String(Math.min(index + 1, trendCards.length)).padStart(2, '0');

  const maxScroll = trendTrack.scrollWidth - trendTrack.clientWidth;
  const progress = maxScroll > 0 ? (trendTrack.scrollLeft / maxScroll) * 100 : 0;
  trendProgress.style.width = `${Math.max(progress, 4)}%`;
};

trendTrack.addEventListener('scroll', updateTrendState);
window.addEventListener('load', updateTrendState);
window.addEventListener('resize', updateTrendState);
/* ===== Features Section — scroll-triggered entrance ===== */
const featuresSection = document.querySelector('.features');

if (featuresSection) {
  const featuresObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        featuresSection.classList.add('is-visible');
        featuresObserver.unobserve(featuresSection);
      }
    });
  }, { threshold: 0.3 });

  featuresObserver.observe(featuresSection);
}
/* ===== Featured Photography — scroll-triggered entrance ===== */
const featuredPhotoSection = document.querySelector('.featured-photography');

if (featuredPhotoSection) {
  const featuredPhotoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        featuredPhotoSection.classList.add('is-visible');
        featuredPhotoObserver.unobserve(featuredPhotoSection);
      }
    });
  }, { threshold: 0.15 });

  featuredPhotoObserver.observe(featuredPhotoSection);
}
/* ===== Custom Cursor ===== */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  // Dot follows instantly
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Ring follows with lag (lerp)
  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  // Press feedback
  window.addEventListener('mousedown', () => cursorRing.classList.add('is-clicking'));
  window.addEventListener('mouseup', () => cursorRing.classList.remove('is-clicking'));

  // Hover state on interactive elements
  const hoverTargets = 'a, button, .trending__card, .featured-photography__item, .category__card, input, textarea';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursorRing.classList.add('is-hovering');
      cursorDot.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursorRing.classList.remove('is-hovering');
      cursorDot.classList.remove('is-hovering');
    }
  });

  // Hide cursor when leaving the window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
}
/* ===== Lenis Smooth Scroll ===== */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 1.5,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Make anchor links (navbar, footer, etc.) use Lenis's eased scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId.length > 1) {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -90, duration: 1.4 });
      }
    }
  });
});
/* ===== Number Counters ===== */
const countEls = document.querySelectorAll('[data-count-target]');

const animateCount = (el) => {
  const target = parseFloat(el.getAttribute('data-count-target'));
  const decimals = parseInt(el.getAttribute('data-count-decimals') || '0', 10);
  const suffix = el.getAttribute('data-count-suffix') || '';
  const duration = 1800;
  const startTime = performance.now();

  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutExpo(progress);
    const current = target * eased;

    el.textContent = `${current.toFixed(decimals)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = `${target.toFixed(decimals)}${suffix}`;
    }
  };

  requestAnimationFrame(tick);
};

if (countEls.length) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  countEls.forEach(el => countObserver.observe(el));
}
/* ===== Magnetic Buttons ===== */
const magneticEls = document.querySelectorAll('.magnetic');
const magneticRadius = 70;   // extra px of "pull field" beyond the button edges
const magneticStrength = 0.35;

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    magneticEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = Math.max(rect.width, rect.height) / 2 + magneticRadius;

      if (distance < maxDistance) {
        const pull = 1 - distance / maxDistance;
        el.style.transform = `translate(${dx * magneticStrength * pull}px, ${dy * magneticStrength * pull}px)`;
      } else {
        el.style.transform = 'translate(0, 0)';
      }
    });
  });
}
/* ===== Parallax Backgrounds ===== */
const parallaxEls = document.querySelectorAll('[data-parallax]');

function updateParallax() {
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
    const section = el.closest('section, header');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const offset = rect.top * speed;
    el.style.transform = `translateY(${offset}px)`;
  });
  requestAnimationFrame(updateParallax);
}
requestAnimationFrame(updateParallax);
/* ===== Text Reveal (word-by-word) ===== */
function splitTextReveal(el) {
  const html = el.innerHTML;
  const parts = html.split(/(<br\s*\/?>|<span[^>]*>|<\/span>)/gi);
  let wordIndex = 0;
  let insideSpan = false;

  const rebuilt = parts.map(part => {
    if (/^<br\s*\/?>$/i.test(part)) return part;
    if (/^<span[^>]*>$/i.test(part)) { insideSpan = true; return part; }
    if (/^<\/span>$/i.test(part)) { insideSpan = false; return part; }

    return part.split(' ').filter(w => w.length).map(word => {
      wordIndex++;
      return `<span class="text-reveal__word"><span class="text-reveal__word-inner" style="transition-delay:${(wordIndex - 1) * 0.06}s">${word}</span></span>`;
    }).join(' ');
  }).join('');

  el.innerHTML = rebuilt;
}

document.querySelectorAll('.text-reveal, .text-reveal--immediate').forEach(splitTextReveal);

// Hero title — reveals immediately on load
document.querySelectorAll('.text-reveal--immediate').forEach(el => {
  setTimeout(() => el.classList.add('is-revealed'), 150);
});

// All other headlines — reveal on scroll into view
const textRevealEls = document.querySelectorAll('.text-reveal');
if (textRevealEls.length) {
  const textRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        textRevealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  textRevealEls.forEach(el => textRevealObserver.observe(el));
}
/* ===== Category — scroll-triggered entrance ===== */
const categorySection = document.querySelector('.category');

if (categorySection) {
  const categoryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        categorySection.classList.add('is-visible');
        categoryObserver.unobserve(categorySection);
      }
    });
  }, { threshold: 0.15 });

  categoryObserver.observe(categorySection);
}