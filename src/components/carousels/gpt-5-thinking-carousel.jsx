// gpt5-carousel.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function Gpt5ThinkingCarousel(props) {
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

  const hasSlides = Array.isArray(slides) && slides.length > 0;
  const multi = slides.length > 1;
  const clampedInterval = Math.max(
    2000,
    Number.isFinite(interval) ? interval : 5000
  );
  const startIndex = useMemo(() => {
    if (!hasSlides) return 0;
    const n = slides.length - 1;
    const i = Number.isInteger(initialIndex) ? initialIndex : 0;
    return Math.min(Math.max(i, 0), n);
  }, [initialIndex, hasSlides, slides.length]);

  const [index, setIndex] = useState(startIndex);
  const [isPlaying, setIsPlaying] = useState(Boolean(autoPlay && multi));
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);

  const timerRef = useRef(null);
  const skipFirstOnChangeRef = useRef(true);
  const viewportRef = useRef(null);

  // If slides array length changes, keep index in range
  useEffect(() => {
    setIndex((prev) => {
      const n = Math.max(0, slides.length - 1);
      return Math.min(Math.max(prev, 0), n);
    });
  }, [slides.length]);

  // Expose index changes
  useEffect(() => {
    if (skipFirstOnChangeRef.current) {
      skipFirstOnChangeRef.current = false;
      return;
    }
    if (typeof onIndexChange === "function") onIndexChange(index);
  }, [index, onIndexChange]);

  // Autoplay
  useEffect(() => {
    if (!isPlaying || !multi) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      goNext();
    }, clampedInterval);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, index, clampedInterval, multi, loop, slides.length]);

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function pauseAutoplayFromUser() {
    if (isPlaying) setIsPlaying(false);
    clearTimer();
  }

  function goTo(i) {
    if (!hasSlides) return;
    const n = slides.length;
    if (loop) {
      const next = ((i % n) + n) % n; // wrap
      setIndex(next);
    } else {
      setIndex(Math.min(Math.max(i, 0), n - 1));
    }
  }

  function goPrev() {
    goTo(index - 1);
  }

  function goNext() {
    goTo(index + 1);
  }

  // Pointer / swipe
  function onPointerDown(e) {
    if (!multi) return;
    pauseAutoplayFromUser();
    setIsDragging(true);
    setDragX(0);
    if (e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    e.currentTarget.dataset.dragStartX = e.clientX || 0;
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const start = Number(e.currentTarget.dataset.dragStartX || 0);
    const dx = (e.clientX || 0) - start;
    setDragX(dx);
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    const dx = dragX;
    const threshold = 50; // px
    setIsDragging(false);
    setDragX(0);
    if (Math.abs(dx) > threshold) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }

  function onKeyDown(e) {
    if (!multi) return;
    if (e.key === "ArrowLeft") {
      pauseAutoplayFromUser();
      goPrev();
    } else if (e.key === "ArrowRight") {
      pauseAutoplayFromUser();
      goNext();
    }
  }

  const canPrev = loop || index > 0;
  const canNext = loop || index < slides.length - 1;

  if (!hasSlides) {
    return (
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel || "Carousel"}
        className={`w-full max-w-full rounded border border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500 ${className}`}
      >
        No slides to display.
      </div>
    );
  }

  const width = viewportRef.current?.offsetWidth || 1;
  const dragPercent = isDragging ? (dragX / width) * 100 : 0;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel || "Carousel"}
      className={`relative select-none ${className}`}
      onKeyDown={onKeyDown}
    >
      {/* Viewport */}
      <div
        ref={viewportRef}
        className="relative overflow-hidden rounded-lg bg-gray-100"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        tabIndex={0}
      >
        {/* Track */}
        <div
          className={`flex ${
            isDragging ? "" : "transition-transform duration-500 ease-out"
          }`}
          style={{
            width: `${slides.length * 100}%`,
            transform: `translateX(calc(${-index * 100}% + ${dragPercent}%))`,
          }}
          aria-live="polite"
        >
          {slides.map((slide, i) => (
            <div key={i} className="w-full shrink-0 grow-0 basis-full">
              <img
                src={slide.image}
                alt={slide.description || `Slide ${i + 1}`}
                className="block h-64 w-full object-cover sm:h-80 md:h-96"
                draggable={false}
              />
              <div className="sr-only">{slide.description}</div>
            </div>
          ))}
        </div>

        {/* Prev / Next */}
        {multi && (
          <>
            <button
              type="button"
              onClick={() => {
                pauseAutoplayFromUser();
                if (canPrev) goPrev();
              }}
              disabled={!canPrev}
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => {
                pauseAutoplayFromUser();
                if (canNext) goNext();
              }}
              disabled={!canNext}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white backdrop-blur hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 4.293a1 1 0 011.414 0L14 9.586a1 1 0 010 1.414l-5.293 5.293a1 1 0 11-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Controls row */}
      {multi && (
        <div className="mt-3 flex items-center justify-center gap-3">
          {showPlayPause && (
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
              className="rounded-full border border-gray-300 bg-white/80 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
          )}
          {showDots && (
            <div className="flex items-center gap-2">
              {slides.map((_, i) => {
                const active = i === index;
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={active ? "true" : undefined}
                    onClick={() => {
                      pauseAutoplayFromUser();
                      goTo(i);
                    }}
                    className={`h-2.5 w-2.5 rounded-full transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      active
                        ? "opacity-100 bg-indigo-600"
                        : "opacity-40 bg-gray-500 hover:opacity-70"
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
