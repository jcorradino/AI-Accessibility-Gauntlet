// __FILE_NAME__
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * Accessible, single-file, Tailwind-styled carousel.
 *
 * API
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

export default function __COMPONENT_NAME__({
  slides = [],
  ariaLabel = "Image carousel",
  loop = true,
  autoPlay = false,
  interval = 5000,
  initialIndex = 0,
  showDots = true,
  showPlayPause = true,
  className = "",
  onIndexChange,
}) {
  const count = Array.isArray(slides) ? slides.length : 0;
  const intervalMs = Math.max(
    2000,
    Number.isFinite(interval) ? interval : 5000
  );

  // Stable base id for aria-controls relationships
  const baseIdRef = useRef("carousel-" + Math.random().toString(36).slice(2));
  const baseId = baseIdRef.current;

  // Index management with clamping
  const safeInitialIndex = useMemo(() => {
    if (!count) return 0;
    return Math.min(Math.max(0, Number(initialIndex) || 0), count - 1);
  }, [count, initialIndex]);

  const [index, setIndex] = useState(safeInitialIndex);

  useEffect(() => {
    // When slides change, keep index in bounds
    setIndex((i) => (count ? Math.min(i, count - 1) : 0));
  }, [count]);

  // Pause state: user toggled pause (Play/Pause button) and implicit pause via interaction
  const [userPaused, setUserPaused] = useState(!autoPlay);
  const [interactPaused, setInteractPaused] = useState(false);
  const isPaused = userPaused || interactPaused;

  // Refs for pointer dragging
  const viewportRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const dragPxRef = useRef(0);
  const [dragPx, setDragPx] = useState(0);

  // Announce changes for screen readers
  const announcement = count
    ? `Slide ${index + 1} of ${count}: ${slides[index]?.description || ""}`
    : "No slides available";

  const goTo = useCallback(
    (nextIdx) => {
      if (!count) return;
      let newIndex = nextIdx;

      if (loop) {
        newIndex = (nextIdx + count) % count;
      } else {
        newIndex = Math.min(Math.max(0, nextIdx), count - 1);
      }
      if (newIndex !== index) setIndex(newIndex);
    },
    [count, index, loop]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // onIndexChange callback
  useEffect(() => {
    if (typeof onIndexChange === "function") onIndexChange(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Autoplay timer
  useEffect(() => {
    if (!autoPlay || isPaused || count <= 1) return;
    const id = setInterval(() => {
      // Functional update avoids stale closures
      setIndex((i) => {
        if (!count) return 0;
        const nextIdx = i + 1;
        return loop ? nextIdx % count : Math.min(nextIdx, count - 1);
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [autoPlay, isPaused, intervalMs, count, loop]);

  // Keyboard navigation on viewport
  const onKeyDown = (e) => {
    if (!count) return;
    const { key } = e;
    if (key === "ArrowRight") {
      setUserPaused(true); // Pause on interaction
      e.preventDefault();
      next();
    } else if (key === "ArrowLeft") {
      setUserPaused(true);
      e.preventDefault();
      prev();
    } else if (key === "Home") {
      setUserPaused(true);
      e.preventDefault();
      goTo(0);
    } else if (key === "End") {
      setUserPaused(true);
      e.preventDefault();
      goTo(count - 1);
    }
  };

  // Pointer (mouse/touch/pen) drag/swipe handlers
  const onPointerDown = (e) => {
    if (!viewportRef.current) return;
    isDraggingRef.current = true;
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
    startXRef.current = e.clientX;
    dragPxRef.current = 0;
    setDragPx(0);
    setUserPaused(true); // Pause on interaction
    setInteractPaused(true);
  };

  const onPointerMove = (e) => {
    if (!isDraggingRef.current || !viewportRef.current) return;
    const dx = e.clientX - startXRef.current;
    dragPxRef.current = dx;
    setDragPx(dx);
  };

  const endDrag = (e) => {
    if (!isDraggingRef.current || !viewportRef.current) return;
    const containerWidth = viewportRef.current.offsetWidth || 1;
    const thresholdPx = Math.max(40, containerWidth * 0.15);
    const dx = dragPxRef.current;

    if (dx <= -thresholdPx) {
      next();
    } else if (dx >= thresholdPx) {
      prev();
    }
    // Reset drag
    isDraggingRef.current = false;
    dragPxRef.current = 0;
    setDragPx(0);
    setInteractPaused(false);
  };

  const disablePrev = !loop && index === 0;
  const disableNext = !loop && index === count - 1;

  // Calculate transform percent, including drag offset
  const dragPercent =
    viewportRef.current && dragPx
      ? (dragPx / (viewportRef.current.offsetWidth || 1)) * 100
      : 0;
  const translatePercent = -index * 100 + dragPercent;

  if (count === 0) {
    return (
      <section
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        className={`w-full ${className}`}
      >
        <div className="relative overflow-hidden rounded-md border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
          <p>No slides to show.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={`relative w-full ${className}`}
    >
      {/* Live region for announcing current slide to screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Viewport */}
      <div
        id={`${baseId}-viewport`}
        ref={viewportRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => {
          // If pointer leaves while dragging, end drag gracefully
          if (isDraggingRef.current) endDrag(e);
        }}
        onFocus={() => setUserPaused(true)} // pause when focused
        className="overflow-hidden rounded-md outline-none focus-visible:ring focus-visible:ring-indigo-500 touch-pan-y"
        aria-describedby={`${baseId}-instructions`}
      >
        <p id={`${baseId}-instructions`} className="sr-only">
          Use left and right arrow keys to change slides. Press Home for first
          slide and End for last. Drag left or right on touch devices.
        </p>

        {/* Track */}
        <div
          className="flex w-full select-none"
          style={{
            transform: `translateX(${translatePercent}%)`,
          }}
        >
          {/* We animate with CSS transitions only when not dragging */}
          <style>{`
            #${baseId}-track {
              transition: transform 500ms ease-out;
            }
            @media (prefers-reduced-motion: reduce) {
              #${baseId}-track {
                transition: none !important;
              }
            }
          `}</style>
          <div
            id={`${baseId}-track`}
            className={`flex w-full ${isDraggingRef.current ? "" : ""}`}
            style={{
              transform: `translateX(${translatePercent}%)`,
              // When not dragging, we want transition; Tailwind can't toggle transitions via JS easily, so CSS above handles it.
            }}
          >
            {slides.map((s, i) => (
              <div
                key={i}
                id={`${baseId}-slide-${i}`}
                className="w-full flex-shrink-0"
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${count}`}
                aria-hidden={i === index ? "false" : "true"}
              >
                <img
                  src={s.image}
                  alt={s.description}
                  className="block w-full h-auto"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between">
        <div className="pointer-events-auto pl-2 sm:pl-3">
          <button
            type="button"
            onClick={() => {
              setUserPaused(true);
              prev();
            }}
            className="rounded-full bg-white/80 px-3 py-2 shadow ring-1 ring-black/10 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous slide"
            aria-controls={`${baseId}-viewport`}
            aria-disabled={disablePrev ? "true" : "false"}
            disabled={disablePrev}
          >
            <span aria-hidden="true">‹</span>
          </button>
        </div>
        <div className="pointer-events-auto pr-2 sm:pr-3">
          <button
            type="button"
            onClick={() => {
              setUserPaused(true);
              next();
            }}
            className="rounded-full bg-white/80 px-3 py-2 shadow ring-1 ring-black/10 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next slide"
            aria-controls={`${baseId}-viewport`}
            aria-disabled={disableNext ? "true" : "false"}
            disabled={disableNext}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>

      {/* Controls row */}
      <div className="mt-3 flex items-center justify-center gap-3">
        {showPlayPause && count > 1 && (
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-pressed={!isPaused ? "true" : "false"}
            aria-label={!isPaused ? "Pause autoplay" : "Start autoplay"}
          >
            <span aria-hidden="true">{isPaused ? "▶" : "⏸"}</span>
            <span className="sr-only">{isPaused ? "Play" : "Pause"}</span>
            <span aria-hidden="true" className="text-gray-700">
              {isPaused ? "Play" : "Pause"}
            </span>
          </button>
        )}

        {showDots && count > 1 && (
          <div
            role="group"
            aria-label="Slide navigation"
            className="flex items-center gap-2"
          >
            {slides.map((_, i) => {
              const selected = i === index;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setUserPaused(true);
                    goTo(i);
                  }}
                  className={`h-2.5 w-2.5 rounded-full ring-1 ring-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    selected ? "bg-indigo-600" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-controls={`${baseId}-slide-${i}`}
                  aria-current={selected ? "true" : undefined}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
