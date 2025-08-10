import React, { useEffect, useMemo, useRef, useState } from "react";

export default function Gpt5Carousel(props) {
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

  const count = Array.isArray(slides) ? slides.length : 0;

  // Defensive: empty state
  if (!count) {
    return (
      <div
        className={`w-full aspect-[16/9] flex items-center justify-center rounded-md border border-gray-300 bg-gray-50 text-gray-500 ${className}`}
        aria-label={ariaLabel || "Carousel placeholder"}
      >
        No slides available
      </div>
    );
  }

  // Clamp initial index to valid range
  const safeInitial = Math.min(
    Math.max(0, initialIndex | 0),
    Math.max(0, count - 1)
  );
  const [index, setIndex] = useState(safeInitial);
  const [isPlaying, setIsPlaying] = useState(Boolean(autoPlay));
  const [isDragging, setIsDragging] = useState(false);
  const [dragDx, setDragDx] = useState(0);

  const containerRef = useRef(null);
  const pointerIdRef = useRef(null);
  const startXRef = useRef(0);

  const effInterval = Math.max(
    2000,
    Number.isFinite(interval) ? interval : 5000
  );
  const canGoPrev = loop || index > 0;
  const canGoNext = loop || index < count - 1;

  const toIndex = (i) =>
    loop ? (i + count) % count : Math.min(Math.max(i, 0), count - 1);

  const goTo = (i) => {
    const next = toIndex(i);
    if (next !== index) setIndex(next);
  };
  const prev = () => {
    if (!canGoPrev) return;
    setIsPlaying(false);
    goTo(index - 1);
  };
  const next = () => {
    if (!canGoNext) return;
    setIsPlaying(false);
    goTo(index + 1);
  };

  // Announce index changes
  useEffect(() => {
    if (typeof onIndexChange === "function") {
      onIndexChange(index);
    }
  }, [index, onIndexChange]);

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying || isDragging || count <= 1) return;
    const id = setInterval(() => {
      if (loop) {
        setIndex((i) => (i + 1) % count);
      } else {
        setIndex((i) => (i < count - 1 ? i + 1 : i));
      }
    }, effInterval);
    return () => clearInterval(id);
  }, [isPlaying, effInterval, loop, isDragging, count]);

  // Pointer handlers scoped to the track wrapper
  const onPointerDown = (e) => {
    // Only left button or touch/pen
    if (e.pointerType === "mouse" && e.button !== 0) return;
    setIsPlaying(false);
    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    setDragDx(0);
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging || e.pointerId !== pointerIdRef.current) return;
    const dx = e.clientX - startXRef.current;
    setDragDx(dx);
  };

  const onPointerUpOrCancel = (e) => {
    if (e.pointerId !== pointerIdRef.current) return;
    const threshold = Math.max(
      40,
      (containerRef.current?.clientWidth || 300) * 0.08
    );
    const dx = dragDx;
    setIsDragging(false);
    setDragDx(0);
    pointerIdRef.current = null;

    if (Math.abs(dx) >= threshold) {
      if (dx > 0) {
        prev();
      } else {
        next();
      }
    }
  };

  // Compute translate with drag offset
  const percentOffset = useMemo(() => {
    const base = -index * 100;
    if (isDragging && containerRef.current) {
      const w = containerRef.current.clientWidth || 1;
      const dragPct = (dragDx / w) * 100;
      return base + dragPct;
    }
    return base;
  }, [index, isDragging, dragDx]);

  return (
    <section
      className={`relative select-none ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel || "Carousel"}
    >
      {/* Viewport */}
      <div
        ref={containerRef}
        className="overflow-hidden rounded-xl bg-black/5"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUpOrCancel}
        onPointerCancel={onPointerUpOrCancel}
        onMouseDown={() => setIsPlaying(false)}
        onKeyDown={() => setIsPlaying(false)}
        onTouchStart={() => setIsPlaying(false)}
      >
        {/* Track */}
        <div
          className="flex w-full touch-pan-y"
          style={{
            transform: `translateX(${percentOffset}%)`,
            transition: isDragging ? "none" : "transform 300ms ease",
          }}
        >
          {slides.map((s, i) => (
            <div key={i} className="w-full shrink-0 basis-full">
              <div className="relative w-full">
                <img
                  src={s.image}
                  alt={s.description || `Slide ${i + 1}`}
                  className="block w-full h-full object-cover aspect-[16/9]"
                  draggable="false"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
        <button
          type="button"
          className={`pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow ring-1 ring-black/10 transition hover:bg-white ${
            !canGoPrev ? "opacity-40 cursor-not-allowed" : ""
          }`}
          onClick={prev}
          aria-label="Previous slide"
          disabled={!canGoPrev}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          className={`pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow ring-1 ring-black/10 transition hover:bg-white ${
            !canGoNext ? "opacity-40 cursor-not-allowed" : ""
          }`}
          onClick={next}
          aria-label="Next slide"
          disabled={!canGoNext}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      {/* Bottom bar */}
      <div className="mt-3 flex items-center justify-between gap-3">
        {/* Dots */}
        {showDots && count > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            {slides.map((_, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    goTo(i);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={active ? "true" : undefined}
                  className={`h-2.5 w-2.5 rounded-full ring-1 ring-black/10 transition ${
                    active ? "bg-gray-900" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Play/Pause */}
        {showPlayPause && count > 1 && (
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-gray-800 active:bg-gray-700"
              aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
            >
              {isPlaying ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M8 5l12 7-12 7V5z" />
                  </svg>
                  Play
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Status (visually hidden text) */}
      <p className="sr-only">{`Slide ${index + 1} of ${count}`}</p>
    </section>
  );
}
