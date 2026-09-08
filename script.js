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