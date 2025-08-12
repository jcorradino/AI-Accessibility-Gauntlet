// __FILE_NAME__
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Accessible, single-file, Tailwind-styled carousel.
 *
 * API:
 * export default function __COMPONENT_NAME__(props) {
 *   // props.slides: { image: string; description: string }[]
 *   // props.ariaLabel?: string
 *   // props.loop?: boolean               // default true
 *   // props.autoPlay?: boolean           // default false
 *   // props.interval?: number            // ms, default 5000, clamp to >= 2000
 *   // props.initialIndex?: number        // default 0
 *   // props.showDots?: boolean           // default true
 *   // props.showPlayPause?: boolean      // default true
 *   // props.className?: string
 *   // props.onIndexChange?: (i:number)=>void
 * }
 */

export default function __COMPONENT_NAME__(props) {
  const {
    slides = [],
    ariaLabel,
    loop = true,
    autoPlay = false,
    interval = 5000,
    initialIndex = 0,
    showDots = true,
    showPlayPause = true,
    className = "",
    onIndexChange,
  } = props;

  const slidesCount = slides.length;
  const hasSlides = slidesCount > 0;

  // Clamp initial index safely if slides change.
  const safeInitial = useMemo(() => {
    if (!hasSlides) return 0;
    return Math.min(Math.max(0, initialIndex | 0), slidesCount - 1);
  }, [hasSlides, slidesCount, initialIndex]);

  const [index, setIndex] = useState(safeInitial);

  // Keep index in range if slides array changes length.
  useEffect(() => {
    if (!hasSlides) {
      setIndex(0);
    } else if (index > slidesCount - 1) {
      setIndex(slidesCount - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slidesCount]);

  // Report index changes.
  const lastNotified = useRef(index);
  useEffect(() => {
    if (onIndexChange && lastNotified.current !== index) {
      lastNotified.current = index;
      onIndexChange(index);
    }
  }, [index, onIndexChange]);

  // Derived config
  const intervalMs = Math.max(
    2000,
    Number.isFinite(interval) ? interval : 5000
  );
  const shouldLoop = Boolean(loop);

  // Autoplay + pause logic
  const [isPlaying, setIsPlaying] = useState(Boolean(autoPlay));
  // Pause when user interacts (keyboard, pointer) for a short time, then resume if playing
  const [isHovering, setIsHovering] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const resumeTimerRef = useRef(null);

  const rootRef = useRef(null);
  const viewportRef = useRef(null);

  const temporarilyPause = (durationMs = 6000) => {
    // Only pause if autoplay was enabled by user/prop.
    if (!autoPlay) return;
    setIsPlaying(false);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      // Only resume if user isn't interacting anymore.
      if (!isHovering && !isFocusWithin && !isPointerDown) {
        setIsPlaying(true);
      }
    }, durationMs);
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const canGoPrev = shouldLoop || index > 0;
  const canGoNext = shouldLoop || index < slidesCount - 1;

  const goTo = (i) => {
    if (!hasSlides) return;
    const max = slidesCount - 1;
    let next = i;
    if (shouldLoop) {
      // Wrap
      next = (i + slidesCount) % slidesCount;
    } else {
      next = Math.min(Math.max(0, i), max);
    }
    setIndex(next);
  };

  const goPrev = () => {
    if (!canGoPrev) return;
    temporarilyPause();
    goTo(index - 1);
  };

  const goNext = () => {
    if (!canGoNext) return;
    temporarilyPause();
    goTo(index + 1);
  };

  // Keyboard navigation (Left/Right/Home/End)
  const onKeyDown = (e) => {
    // Let buttons handle their own Enter/Space behaviors.
    if (e.defaultPrevented) return;
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        goPrev();
        break;
      case "ArrowRight":
        e.preventDefault();
        goNext();
        break;
      case "Home":
        e.preventDefault();
        temporarilyPause();
        goTo(0);
        break;
      case "End":
        e.preventDefault();
        temporarilyPause();
        goTo(slidesCount - 1);
        break;
      default:
        break;
    }
  };

  // Focus within tracking
  const focusWithinCount = useRef(0);
  const handleFocusCapture = () => {
    focusWithinCount.current += 1;
    if (!isFocusWithin) setIsFocusWithin(true);
  };
  const handleBlurCapture = () => {
    // Slight delay to allow focus to move within the region
    setTimeout(() => {
      focusWithinCount.current = Math.max(0, focusWithinCount.current - 1);
      if (focusWithinCount.current === 0) {
        setIsFocusWithin(false);
      }
    }, 0);
  };

  // Pointer swipe/drag (basic threshold)
  const startX = useRef(0);
  const deltaX = useRef(0);

  const onPointerDown = (e) => {
    // Ignore non-primary buttons
    if (e.button !== 0 && e.pointerType !== "touch") return;
    setIsPointerDown(true);
    temporarilyPause();
    deltaX.current = 0;
    startX.current = e.clientX ?? (e.touches ? e.touches[0].clientX : 0);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e) => {
    if (!isPointerDown) return;
    const clientX = e.clientX ?? (e.touches ? e.touches[0].clientX : 0);
    deltaX.current = clientX - startX.current;
  };

  const onPointerUp = (e) => {
    if (!isPointerDown) return;
    setIsPointerDown(false);
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {}
    const threshold = 50; // px
    const d = deltaX.current;
    deltaX.current = 0;
    if (Math.abs(d) >= threshold) {
      if (d < 0) goNext();
      else goPrev();
    }
  };

  // Autoplay interval
  useEffect(() => {
    if (!hasSlides || slidesCount <= 1) return;
    if (!autoPlay) return; // Autoplay feature disabled
    if (!isPlaying) return;
    if (isHovering || isFocusWithin || isPointerDown) return;

    const id = setInterval(() => {
      if (!canGoNext && !shouldLoop && index === slidesCount - 1) {
        // Stop when reaching end if not looping
        setIsPlaying(false);
        return;
      }
      goTo(index + 1);
    }, intervalMs);

    return () => clearInterval(id);
  }, [
    autoPlay,
    isPlaying,
    isHovering,
    isFocusWithin,
    isPointerDown,
    intervalMs,
    slidesCount,
    index,
    canGoNext,
    shouldLoop,
    hasSlides,
  ]);

  // If reaching ends and loop is off, prevent tabbing to disabled buttons
  const prevDisabled = !canGoPrev;
  const nextDisabled = !canGoNext;

  const rootAriaLabel =
    ariaLabel ||
    (hasSlides ? "Image carousel" : "Image carousel (no slides available)");

  // Announce current slide politely for screen readers
  const liveMessage =
    hasSlides && slides[index]
      ? `Slide ${index + 1} of ${slidesCount}: ${slides[index].description}`
      : "No slides available.";

  // Utility: join class names
  const cx = (...arr) => arr.filter(Boolean).join(" ");

  // Placeholder when empty
  if (!hasSlides) {
    return (
      <section
        ref={rootRef}
        className={cx(
          "relative w-full rounded-lg border border-dashed border-neutral-300 p-6 text-center",
          "text-sm text-neutral-600 bg-neutral-50",
          className
        )}
        role="region"
        aria-roledescription="carousel"
        aria-label={rootAriaLabel}
      >
        <p className="mx-auto max-w-prose">
          No slides to show. Provide an array of{" "}
          <code className="px-1 py-0.5 rounded bg-neutral-200">
            {"{ image, description }"}
          </code>
          .
        </p>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      className={cx(
        "relative w-full select-none",
        "rounded-lg bg-white shadow-sm ring-1 ring-neutral-200",
        "focus-within:ring-2 focus-within:ring-indigo-500",
        className
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label={rootAriaLabel}
      onKeyDown={onKeyDown}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
    >
      {/* Live region for announcements */}
      <div className="sr-only" aria-live="polite">
        {liveMessage}
      </div>

      {/* Viewport */}
      <div
        ref={viewportRef}
        className={cx(
          "relative overflow-hidden w-full",
          // Make sure the viewport is keyboard focusable
          "outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        )}
        tabIndex={0}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        // Allow vertical page scroll while enabling horizontal swipe
        style={{ touchAction: "pan-y" }}
        aria-atomic="true"
        aria-live="off"
        role="group"
        aria-label={`Slides (${slidesCount} total)`}
      >
        {/* Track */}
        <div
          className={cx(
            "flex w-full h-full items-stretch",
            "transition-transform duration-500 ease-out",
            "motion-reduce:transition-none"
          )}
          style={{
            transform: `translateX(-${index * 100}%)`,
            // Ensure each slide takes full viewport width
            width: `${slidesCount * 100}%`,
          }}
          aria-controls="carousel-track"
        >
          {slides.map((s, i) => {
            const isActive = i === index;
            return (
              <div
                key={i}
                id={`carousel-slide-${i}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${slidesCount}`}
                aria-hidden={isActive ? "false" : "true"}
                className={cx(
                  "basis-full shrink-0 grow-0 relative",
                  // Hide non-active slides from tab order
                  !isActive && "pointer-events-none"
                )}
              >
                <img
                  src={s.image}
                  alt={s.description}
                  className="block w-full h-auto"
                  draggable={false}
                />
                {/* Optional description overlay for visual users, ensures good contrast */}
                <div
                  className={cx(
                    "absolute bottom-0 left-0 right-0",
                    "bg-gradient-to-t from-black/60 to-black/0",
                    "p-3"
                  )}
                >
                  <p className="inline-block rounded px-2 py-1 text-xs sm:text-sm text-white bg-black/60">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prev / Next Controls */}
        <div
          className={cx(
            "pointer-events-none absolute inset-0 flex items-center justify-between"
          )}
          aria-hidden="true"
        >
          <button
            type="button"
            onClick={goPrev}
            disabled={prevDisabled}
            className={cx(
              "pointer-events-auto m-2 sm:m-3 inline-flex items-center justify-center",
              "min-w-11 min-h-11 rounded-full bg-neutral-900/70 text-white",
              "backdrop-blur px-3 py-3",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
            )}
            aria-label="Previous slide"
            aria-controls={`carousel-slide-${index}`}
          >
            <span aria-hidden="true">‹</span>
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={nextDisabled}
            className={cx(
              "pointer-events-auto m-2 sm:m-3 inline-flex items-center justify-center",
              "min-w-11 min-h-11 rounded-full bg-neutral-900/70 text-white",
              "backdrop-blur px-3 py-3",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
            )}
            aria-label="Next slide"
            aria-controls={`carousel-slide-${index}`}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>

      {/* Bottom controls bar */}
      <div
        className={cx(
          "flex items-center justify-center gap-3 sm:gap-4 px-3 py-2 sm:py-3",
          "border-t border-neutral-200 bg-white/90"
        )}
      >
        {/* Play/Pause */}
        {showPlayPause && (
          <button
            type="button"
            onClick={() => {
              // Toggle play state; enabling sets playing true only if autoplay feature is on
              if (!autoPlay) {
                // If autoplay feature disabled by prop, ignore attempts to play
                return;
              }
              setIsPlaying((p) => !p);
            }}
            className={cx(
              "inline-flex items-center gap-1 rounded px-3 py-2 text-sm",
              "bg-neutral-800 text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500",
              "disabled:opacity-50"
            )}
            aria-pressed={!!isPlaying}
            aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
            title={isPlaying ? "Pause autoplay" : "Start autoplay"}
            disabled={!autoPlay || slidesCount <= 1}
          >
            <span aria-hidden="true">{isPlaying ? "❚❚" : "►"}</span>
            <span className="hidden sm:inline">
              {isPlaying ? "Pause" : "Play"}
            </span>
          </button>
        )}

        {/* Dots */}
        {showDots && slidesCount > 1 && (
          <div
            role="tablist"
            aria-label="Slide navigation"
            className="flex items-center gap-2"
          >
            {slides.map((_, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  role="tab"
                  aria-selected={active ? "true" : "false"}
                  aria-controls={`carousel-slide-${i}`}
                  aria-label={`Go to slide ${i + 1}`}
                  title={`Slide ${i + 1}`}
                  onClick={() => {
                    temporarilyPause();
                    goTo(i);
                  }}
                  className={cx(
                    "block h-3 w-3 rounded-full",
                    active ? "scale-110" : "opacity-60",
                    "transition-transform motion-reduce:transition-none",
                    active ? "bg-indigo-600" : "bg-neutral-400",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                  )}
                >
                  <span className="sr-only">
                    {active ? "Current slide" : `Go to slide ${i + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Status text */}
        <div className="ml-auto text-xs sm:text-sm text-neutral-600">
          <span aria-hidden="true">
            {index + 1} / {slidesCount}
          </span>
          <span className="sr-only">{liveMessage}</span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------
   Example usage (for reference only; remove or comment out in production):

import React from "react";
import __COMPONENT_NAME__ from "./__FILE_NAME__";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1754206352604-0a4f13ca2a22",
    description: "A serene, green valley is surrounded by trees.",
  },
  {
    image: "https://images.unsplash.com/photo-1566154247258-466b02048738",
    description: "Manhattan skyline at dusk",
  },
  {
    image: "https://images.unsplash.com/photo-1735736617534-533cf25e3770",
    description: "Market outside of Sensō-ji temple",
  },
  {
    image: "https://images.unsplash.com/photo-1749729163012-a9f552b8c3fe",
    description: "View of Český Krumlov, Czech Republic",
  },
  {
    image: "https://images.unsplash.com/photo-1751795195789-8dab6693475d",
    description: "View of Phare de Kermorvan - Le Conquet, France",
  },
];

export default function Demo() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <__COMPONENT_NAME__
        slides={slides}
        ariaLabel="Travel photography carousel"
        autoPlay={true}
        interval={5000}
        loop={true}
        showDots={true}
        showPlayPause={true}
        onIndexChange={(i) => console.log("Index:", i)}
      />
    </div>
  );
}
-------------------------- */
