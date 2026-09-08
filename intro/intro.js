/* =========================================================
   Intro / Loading Animation — timing & state control only.
   All visual motion (bar fill, color reveal) lives in intro.css;
   this file just sequences the states and cleans up afterward.
   ========================================================= */

(function () {
  const intro = document.getElementById('intro');
  const barFill = document.getElementById('introBarFill');

  if (!intro || !barFill) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Lock page scroll while the intro is active
  document.body.classList.add('intro-lock-scroll');

  function removeIntro() {
    document.body.classList.remove('intro-lock-scroll');
    intro.classList.add('intro--hidden');
    intro.setAttribute('aria-hidden', 'true');

    // Take it out of the DOM entirely so it can never block
    // clicks/scroll/taps, even if some later CSS changes.
    window.setTimeout(function () {
      if (intro.parentNode) {
        intro.parentNode.removeChild(intro);
      }
    }, 50);
  }

  function startReveal() {
    intro.classList.add('intro--revealing');
  }

  // ---- Reduced motion: skip the full sequence, fade out quickly ----
  if (prefersReducedMotion) {
    intro.classList.add('intro--reduced');
    window.setTimeout(removeIntro, 300);
    return;
  }

  // ---- Full sequence: bar fill (3s, from CSS) -> reveal (1.8s, from CSS) ----
  function onBarFillDone(event) {
    if (event.animationName !== 'introBarFill') return;
    barFill.removeEventListener('animationend', onBarFillDone);
    startReveal();
  }

  function onRevealDone(event) {
    if (event.animationName !== 'introReveal') return;
    intro.removeEventListener('animationend', onRevealDone);
    removeIntro();
  }

  barFill.addEventListener('animationend', onBarFillDone);
  intro.addEventListener('animationend', onRevealDone);
})();