/**
 * Real interactive behavior goes here (menu toggles, sliders, animations).
 * Keep this separate from include.js, which only exists for local preview.
 * Everything in this file DOES ship to WordPress later — it becomes the
 * inline/enqueued JS attached to your shortcodes.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav: hamburger opens the .ee-nav__menu drawer (see nav.css,
  // max-width: 1300px). Closes on link click, Escape, or resizing back
  // past the breakpoint so it can't get stuck open if you rotate a tablet.
  const navToggle = document.querySelector('.ee-nav__toggle');
  const navMenu = document.querySelector('.ee-nav__menu');

  if (navToggle && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      navMenu.classList.add('is-open');
      navToggle.classList.add('is-active');
      navToggle.setAttribute('aria-expanded', 'true');
    };

    navToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navMenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1300) closeMenu();
    });
  }

  // Home page only: the nav starts transparent with white text/logo over the
  // wavy background photo. Once you've scrolled past ~60% of that photo's
  // height, switch the sticky nav to its normal light (opaque bg, dark text)
  // state — and back again when scrolling back up above that point.
  const topbg = document.querySelector('.ee-home-topbg');
  const bgImg = document.querySelector('.ee-home-topbg__img');
  const nav = document.querySelector('.ee-nav');
  const navLogo = document.querySelector('.ee-nav__logo-img');

  if (topbg && bgImg && nav && navLogo) {
    const imgTop = window.scrollY + bgImg.getBoundingClientRect().top;
    let ticking = false;

    const updateNavMode = () => {
      const threshold = imgTop + bgImg.offsetHeight * 0.6;
      const isLight = window.scrollY > threshold;
      nav.classList.toggle('ee-nav--light', isLight);
      navLogo.src = isLight ? 'assets/img/E-icon-black.svg' : 'assets/img/E-icon-white.svg';
      ticking = false;
    };

    updateNavMode();
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavMode);
        ticking = true;
      }
    }, { passive: true });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Home page: full-screen logo intro on load. After ~4.4s — the burst
  // animation's own runtime (see extravaganza-logo-v3.html) plus a small
  // buffer — fade the overlay out and reveal the hero content AND the
  // in-page hero logo together. The in-page logo is a separate instance
  // of the same animation that started at the same moment on load, so
  // it's already resting at its own finished frame once revealed — it
  // stays hidden (opacity: 0, see index4.css) until this exact moment so
  // it doesn't show through as a second copy playing behind/beside the
  // full-screen one in the meantime.
  const heroIntro = document.querySelector('.ee-hero-intro');
  const heroContent = document.querySelector('.ee-hero__content');
  const heroLogo = document.querySelector('.ee-hero .ee-hero__logo-anim');

  if (heroIntro && heroContent) {
    if (reduceMotion) {
      heroIntro.remove();
      heroContent.classList.add('is-visible');
      if (heroLogo) heroLogo.classList.add('is-visible');
    } else {
      window.setTimeout(() => {
        heroIntro.classList.add('is-done');
        heroContent.classList.add('is-visible');
        if (heroLogo) heroLogo.classList.add('is-visible');
      }, 4500);
    }
  }

  // Home page: each major section "shoots in" toward its resting position
  // every time it scrolls into view, and resets when it scrolls back out —
  // so it replays each time, scrolling either direction.
  const revealEls = document.querySelectorAll('.ee-reveal');
  if (revealEls.length && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Home page: soft background blobs drift at a fraction of scroll speed
  // (classic parallax — background moves slower than the foreground).
  const blobs = document.querySelector('.ee-blobs');
  const topbgImg = document.querySelector('.ee-home-topbg__img');

  if ((blobs || topbgImg) && !reduceMotion) {
    let parallaxTicking = false;
    const updateParallax = () => {
      if (blobs) {
        blobs.style.transform = `translateY(${window.scrollY * 0.15}px)`;
      }
      if (topbgImg) {
        // Capped scroll input: this image sits inside .ee-home-topbg, which
        // (unlike .ee-blobs/.ee-home-body) has no overflow:hidden to clip
        // it — .ee-nav's position:sticky needs that ancestor left alone.
        // Capping keeps the lag effect near the top of the page instead of
        // letting the offset (and the risk of it overflowing the footer)
        // grow unbounded the further down the page you scroll. Kept a lot
        // slower than the blobs (small factor, same cap).
        const cappedScroll = Math.min(window.scrollY, 800);
        // Below 1300px (nav.css) the image switches to a height-driven
        // "zoom" crop, centered horizontally with left: 50% — this inline
        // transform overwrites that entirely, so the -50% X has to be
        // re-applied here alongside the parallax Y or the photo snaps to
        // one side (it isn't wide enough at the transform's basis to still
        // cover the viewport once translateX drops out).
        const isZoomed = window.innerWidth <= 1300;
        const x = isZoomed ? '-50%' : '0';
        topbgImg.style.transform = `translate(${x}, ${cappedScroll * 0.05}px)`;
      }
      parallaxTicking = false;
    };
    updateParallax();
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        window.requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  // Home page: the hero and intro text occupy the exact same spot inside
  // the sticky .ee-hero-stage__pin. Two sequential phases over the scroll
  // distance through .ee-hero-stage's height — the background (photo)
  // stays put throughout both, since the pin doesn't release until the
  // very end:
  //   phase 1 (first half of the scroll): hero fades 1 -> 0, intro stays
  //     invisible.
  //   phase 2 (second half): hero stays gone, intro fades 0 -> 1 in the
  //     same spot.
  // Only once both phases finish does the pin release and the page
  // continue scrolling normally from the intro's resting position.
  const stage = document.querySelector('.ee-hero-stage');
  const pin = document.querySelector('.ee-hero-stage__pin');
  const heroEl = document.querySelector('.ee-hero-stage__pin .ee-hero');
  const introOverlay = document.querySelector('.ee-intro-overlay');
  const balloonsFrame = document.querySelector('.ee-intro__balloons');
  const heroLogoFrame = document.querySelector('.ee-hero-stage__pin .ee-hero__logo-anim');
  const photobooth = document.querySelector('.ee-intro__photobooth');

  // Same story as the balloons: the logo animation's own scroll observer
  // can't see the outer page's fade state, so it's retriggered here via
  // postMessage — every time you scroll back UP into the hero being fully
  // visible again (not on every frame it's partially visible).
  let heroWasHidden = false;
  const replayHeroLogo = () => {
    if (!heroLogoFrame) return;
    heroLogoFrame.contentWindow.postMessage('ex-replay', '*');
  };

  // The balloon iframe listens for these postMessages rather than using its
  // own scroll observer, which would otherwise fire (and finish) immediately
  // on page load while still invisible at opacity: 0. postMessage works
  // across frames even under the file:// same-origin restrictions that
  // block direct contentDocument access between separate local files.
  // Reset once you've scrolled back well away from the intro, so it's
  // ready to play again the next time you scroll back down to it.
  let balloonsPlayed = false;
  const playBalloons = () => {
    if (balloonsPlayed || !balloonsFrame) return;
    balloonsFrame.contentWindow.postMessage('exb-play', '*');
    balloonsPlayed = true;
  };
  const resetBalloons = () => {
    if (!balloonsPlayed || !balloonsFrame) return;
    balloonsFrame.contentWindow.postMessage('exb-reset', '*');
    balloonsPlayed = false;
  };

  if (stage && pin && heroEl && introOverlay) {
    if (reduceMotion) {
      heroEl.style.opacity = 0;
      introOverlay.style.opacity = 1;
    } else {
      const pinTopOffset = parseFloat(getComputedStyle(pin).top) || 0;
      let stageTicking = false;

      const updateStage = () => {
        const stageRect = stage.getBoundingClientRect();
        const scrolledIntoStage = Math.max(0, pinTopOffset - stageRect.top);
        const maxScroll = Math.max(1, stage.offsetHeight - pin.offsetHeight);
        const progress = Math.min(scrolledIntoStage / maxScroll, 1);
        // Hero fades out over the first 60% of the scroll; intro starts
        // fading in at 40% (while hero is already ~2/3 faded, not fully
        // gone yet) and finishes at 100% — a brief overlap instead of a
        // hard cut, so intro appears once hero is "mostly" faded rather
        // than waiting for it to hit zero.
        const heroPhase = Math.min(progress / 0.6, 1);
        const introPhase = Math.max(0, Math.min((progress - 0.4) / 0.6, 1));
        heroEl.style.opacity = 1 - heroPhase;
        introOverlay.style.opacity = introPhase;

        if (introPhase > 0.7) {
          playBalloons();
        } else if (introPhase < 0.3) {
          resetBalloons();
        }

        // Photobooth strip: doesn't appear at all until the intro text is
        // halfway faded in (50%), then its frames fade in one at a time via
        // the CSS transition-delay stagger.
        if (photobooth) {
          photobooth.classList.toggle('is-visible', introPhase >= 0.5);
        }

        const heroFullyHidden = heroPhase >= 1;
        if (heroWasHidden && !heroFullyHidden) replayHeroLogo();
        heroWasHidden = heroFullyHidden;

        stageTicking = false;
      };

      updateStage();
      window.addEventListener('scroll', () => {
        if (!stageTicking) {
          window.requestAnimationFrame(updateStage);
          stageTicking = true;
        }
      }, { passive: true });
      window.addEventListener('resize', updateStage);
    }
  }

  // Accordions (delivery-setup.html "What's included" / "Where we deliver"):
  // intercept the native instant open/close so it can slide smoothly
  // instead. The [open] attribute is still what CSS keys off of, so this
  // stays a progressive enhancement — with JS off, <details> just toggles
  // instantly as normal.
  document.querySelectorAll('.ee-accordion').forEach((acc) => {
    const summary = acc.querySelector('summary');
    const body = acc.querySelector('.ee-accordion__body');
    if (!summary || !body) return;

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      if (acc.hasAttribute('open')) {
        body.style.height = body.scrollHeight + 'px';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { body.style.height = '0px'; });
        });
        body.addEventListener('transitionend', function onEnd(ev) {
          if (ev.propertyName !== 'height') return;
          body.removeEventListener('transitionend', onEnd);
          acc.removeAttribute('open');
          body.style.height = '';
        });
      } else {
        acc.setAttribute('open', '');
        const targetHeight = body.scrollHeight;
        body.style.height = '0px';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { body.style.height = targetHeight + 'px'; });
        });
        body.addEventListener('transitionend', function onEnd(ev) {
          if (ev.propertyName !== 'height') return;
          body.removeEventListener('transitionend', onEnd);
          body.style.height = '';
        });
      }
    });
  });

  // Gallery page: category filter + sort. Sorting re-orders the actual DOM
  // nodes (rather than CSS order) so the dense grid re-tiles cleanly around
  // whichever items the filter has hidden.
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryFilter = document.getElementById('galleryFilter');
  const gallerySort = document.getElementById('gallerySort');

  if (galleryGrid && galleryFilter && gallerySort) {
    const items = Array.from(galleryGrid.querySelectorAll('.ee-gallery__item'));

    const applyFilter = () => {
      const value = galleryFilter.value;
      items.forEach((item) => {
        const matches = value === 'all' || item.dataset.category === value;
        item.classList.toggle('is-hidden', !matches);
      });
    };

    const applySort = () => {
      const value = gallerySort.value;
      const sorted = [...items].sort((a, b) => {
        if (value === 'recent') return b.dataset.date.localeCompare(a.dataset.date);
        if (value === 'oldest') return a.dataset.date.localeCompare(b.dataset.date);
        const titleA = a.querySelector('.ee-gallery__caption-title').textContent;
        const titleB = b.querySelector('.ee-gallery__caption-title').textContent;
        return value === 'az' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
      });
      sorted.forEach((item) => galleryGrid.appendChild(item));
    };

    galleryFilter.addEventListener('change', applyFilter);
    gallerySort.addEventListener('change', applySort);
    applySort();
  }
});
