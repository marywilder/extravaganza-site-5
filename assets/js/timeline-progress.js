/* Scroll-progress timeline (see assets/css/timeline-progress.css for why
   this is its own file rather than part of main.js/site.css — only
   our-process.html and our-story.html load it). Grows .ee-timeline__progress
   to meet each dot, and marks a dot active, as it crosses the viewport's
   vertical center. */
(function () {
  var timeline = document.querySelector('.ee-timeline');
  var track = document.querySelector('.ee-timeline__track');
  var progress = document.querySelector('.ee-timeline__progress');
  var dots = document.querySelectorAll('.ee-timeline__dot');
  if (!timeline || !track || !progress || !dots.length) return;

  var firstDot = dots[0];
  var lastDot = dots[dots.length - 1];
  var spanTop = 0;
  var spanHeight = 0;
  var ticking = false;

  // Anchors the track/progress line to run exactly from the first dot's
  // center to the last dot's — not the full .ee-timeline container,
  // which includes padding-block and would run past the last dot.
  //
  // The final dot is the burst svg (see .ee-timeline__dot--final) —
  // ending the line at ITS center (like every other dot) ran it
  // straight through the burst shape, showing through the gaps
  // between spikes. Stopping a bit short of the dot's top edge
  // instead — near where the burst's own points start — reads as the
  // line ending right before the burst rather than piercing it.
  var lastIsBurst = lastDot.classList.contains('ee-timeline__dot--final');
  var layout = function () {
    var timelineRect = timeline.getBoundingClientRect();
    var firstRect = firstDot.getBoundingClientRect();
    var lastRect = lastDot.getBoundingClientRect();
    spanTop = (firstRect.top + firstRect.height / 2) - timelineRect.top;
    spanHeight = lastIsBurst
      ? (lastRect.top - timelineRect.top) - spanTop + 4
      : (lastRect.top + lastRect.height / 2) - timelineRect.top - spanTop;
    track.style.top = spanTop + 'px';
    track.style.height = spanHeight + 'px';
    progress.style.top = spanTop + 'px';
  };

  var update = function () {
    var vh = window.innerHeight;
    var timelineRect = timeline.getBoundingClientRect();
    var scrolledPast = (vh * 0.5 - timelineRect.top) - spanTop;
    var fraction = Math.min(1, Math.max(0, scrolledPast / spanHeight));
    // px, not %: .ee-timeline has no explicit height (it's auto,
    // sized by its content), so a percentage height on this
    // absolutely-positioned element doesn't resolve against
    // spanHeight — it was resolving against something taller,
    // which is why the filled line kept overshooting past the
    // burst even once the (correctly px-sized) grey track behind
    // it stopped short of it.
    progress.style.height = (fraction * spanHeight) + 'px';

    dots.forEach(function (dot) {
      var dotRect = dot.getBoundingClientRect();
      dot.classList.toggle('is-active', dotRect.top < vh * 0.5);
    });

    ticking = false;
  };

  layout();
  update();
  // Re-measure once everything (webfonts especially — Elsie swapping
  // in for the fallback serif reflows row heights) has actually
  // settled. Without this, the track/progress line was measured
  // against the pre-swap layout and ended up overshooting past the
  // final dot once the real font landed.
  window.addEventListener('load', function () { layout(); update(); });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { layout(); update(); });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', function () {
    layout();
    update();
  });
})();
