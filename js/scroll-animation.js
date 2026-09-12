/**
 * Mutawwifmu Kalkulator Umroh - Scroll Animation & Micro-Interactions
 * Modern, performant, and anti-slop compliant scroll behaviors.
 * Respects prefers-reduced-motion and utilizes CSS Scroll-Driven APIs with fallbacks.
 */

(function () {
  'use strict';

  function initScrollExperience() {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Setup Hairline Scroll Progress Bar
    let progressContainer = document.querySelector('.scroll-progress-container');
    if (!progressContainer) {
      progressContainer = document.createElement('div');
      progressContainer.className = 'scroll-progress-container';
      progressContainer.setAttribute('aria-hidden', 'true');
      progressContainer.innerHTML = '<div class="scroll-progress-bar" id="scroll-progress-bar"></div>';
      document.body.prepend(progressContainer);
    }
    const progressBar = document.getElementById('scroll-progress-bar');

    // Enable scroll animation styling on body
    document.body.classList.add('has-scroll-anim');

    const stickySummary = document.querySelector('.sticky-summary');
    const heroInner = document.querySelector('.hero-inner');

    if (stickySummary) {
      document.body.classList.add('has-sticky-summary');
    }

    // If reduced motion is requested, reveal everything immediately and keep it simple
    if (isReducedMotion) {
      if (stickySummary) {
        stickySummary.classList.add('is-visible');
      }
      return;
    }

    // 3. Staggered Scroll Reveal for Sections & Cards
    const revealTargets = document.querySelectorAll(
      '.calc-card, .progress-card, .info-callout, .cta-banner-card, .faq-section, .checklist-phase-card'
    );

    revealTargets.forEach(function (el) {
      el.classList.add('scroll-reveal');
    });

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          threshold: 0.08,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      revealTargets.forEach(function (target) {
        // If element is already in viewport on initial load, reveal immediately
        const rect = target.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          target.classList.add('is-revealed');
        } else {
          revealObserver.observe(target);
        }
      });

      // 4. Active Step Tracker (Scroll Spy for Workflow Steps)
      const stepCards = document.querySelectorAll('.calc-card[id^="card-step-"]');
      if (stepCards.length > 0) {
        const stepObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                stepCards.forEach(function (c) {
                  c.classList.remove('is-active-step');
                });
                entry.target.classList.add('is-active-step');
              }
            });
          },
          {
            root: null,
            threshold: 0.25,
            rootMargin: '-20% 0px -45% 0px'
          }
        );

        stepCards.forEach(function (card) {
          stepObserver.observe(card);
        });
      }
    } else {
      // Fallback for older browsers without IntersectionObserver
      revealTargets.forEach(function (target) {
        target.classList.add('is-revealed');
      });
    }

    // 5. Throttled Scroll Listener for Dynamic UI Transitions
    const supportsCssScrollTimeline = window.CSS && CSS.supports && CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');
    let ticking = false;
    let isStickyVisible = false;

    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Fallback progress bar update if CSS scroll-driven is not supported
      if (!supportsCssScrollTimeline && progressBar && docHeight > 0) {
        const progress = Math.min(1, Math.max(0, scrollY / docHeight));
        progressBar.style.transform = `scaleX(${progress})`;
      }

      // Sticky Summary Bar visibility threshold with smooth hysteresis:
      // Entering threshold: scrollY > 240px (past hero main focus)
      // Exit threshold when scrolling back up: scrollY < 120px (near top)
      // The 120px buffer prevents any jumpy flip-flopping near the threshold.
      if (stickySummary) {
        if (scrollY > 240 && !isStickyVisible) {
          isStickyVisible = true;
          stickySummary.classList.add('is-visible');
        } else if (scrollY < 120 && isStickyVisible) {
          isStickyVisible = false;
          stickySummary.classList.remove('is-visible');
        }
      }

      // Subtle Hero Parallax on desktop viewports
      if (heroInner && window.innerWidth >= 768) {
        if (scrollY <= 600) {
          const translateY = scrollY * 0.1;
          const opacity = Math.max(0, 1 - (scrollY / 720));
          heroInner.style.transform = `translate3d(0, ${translateY}px, 0)`;
          heroInner.style.opacity = opacity.toString();
        } else if (heroInner.style.transform) {
          heroInner.style.transform = '';
          heroInner.style.opacity = '';
        }
      }

      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    handleScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollExperience);
  } else {
    initScrollExperience();
  }
})();
