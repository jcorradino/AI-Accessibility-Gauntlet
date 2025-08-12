// AccessibleCarousel.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";

export default function AccessibleCarousel({
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
  // Clamp interval
  const safeInterval = Math.max(2000, interval);

  const [current, setCurrent] = useState(() => {
    const i = Number.isInteger(initialIndex) ? initialIndex : 0;
    return Math.min(Math.max(i, 0), slides.length - 1);
  });
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const timerRef = useRef(null);
  const trackRef = useRef(null);
  const startXRef = useRef(null);
  const isInteractingRef = useRef(false);

  const goTo = useCallback(
    (i) => {
      const max = slides.length - 1;
      let newIndex = i;
      if (loop) {
        newIndex = (i + slides.length) % slides.length;
      } else {
        newIndex = Math.min(Math.max(i, 0), max);
      }
      setCurrent(newIndex);
    },
    [slides.length, loop]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay handling
  const startTimer = useCallback(() => {
    if (!isPlaying || slides.length < 2) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      next();
    }, safeInterval);
  }, [isPlaying, safeInterval, next, slides.length]);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  // (re)start timer when playing state changes
  useEffect(() => {
    if (isPlaying) {
      startTimer();
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [isPlaying, startTimer, stopTimer]);

  // Notify parent
  useEffect(() => {
    if (typeof onIndexChange === "function") {
      onIndexChange(current);
    }
  }, [current, onIndexChange]);

  // Pause on interaction (mouse/focus/pointer)
  const pauseOnInteraction = () => {
    isInteractingRef.current = true;
    stopTimer();
  };
  const resumeAfterInteraction = () => {
    isInteractingRef.current = false;
    if (isPlaying) startTimer();
  };

  // Swipe / drag handling
  const onPointerDown = (e) => {
    pauseOnInteraction();
    startXRef.current = e.clientX ?? e.touches?.[0]?.clientX;
    // capture pointer events for the whole document
    const moveHandler = (ev) => {
      // prevent scrolling while dragging
      ev.preventDefault();
    };
    const upHandler = (ev) => {
      const endX = ev.clientX ?? ev.changedTouches?.[0]?.clientX;
      const diff = startXRef.current - endX;
      const threshold = 50; // px
      if (diff > threshold) {
        next();
      } else if (diff < -threshold) {
        prev();
      }
      document.removeEventListener("pointermove", moveHandler);
      document.removeEventListener("pointerup", upHandler);
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("touchend", upHandler);
      resumeAfterInteraction();
    };
    document.addEventListener("pointermove", moveHandler);
    document.addEventListener("pointerup", upHandler);
    document.addEventListener("touchmove", moveHandler, { passive: false });
    document.addEventListener("touchend", upHandler);
  };

  if (!slides || slides.length === 0) {
    return (
      <div
        className={`flex items-center justify-center py-8 ${className}`}
        role="region"
        aria-label={ariaLabel}
      >
        <p className="text-gray-500">No slides available.</p>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={pauseOnInteraction}
      onMouseLeave={resumeAfterInteraction}
      onFocus={pauseOnInteraction}
      onBlur={resumeAfterInteraction}
    >
      {/* Slides track */}
      <div
        ref={trackRef}
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onPointerDown={onPointerDown}
        onTouchStart={onPointerDown}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="flex-none w-full flex-shrink-0"
            aria-hidden={idx !== current}
          >
            <img
              src={slide.image}
              alt={slide.description}
              className="block w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>

      {/* Prev button */}
      <button
        type="button"
        onClick={prev}
        disabled={!loop && current === 0}
        className={`
          absolute left-2 top-1/2 -translate-y-1/2
          bg-white/70 hover:bg-white text-gray-800
          p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500
          disabled:opacity-40 disabled:pointer-events-none
        `}
        aria-label="Previous slide"
      >
        &#9664;
      </button>

      {/* Next button */}
      <button
        type="button"
        onClick={next}
        disabled={!loop && current === slides.length - 1}
        className={`
          absolute right-2 top-1/2 -translate-y-1/2
          bg-white/70 hover:bg-white text-gray-800
          p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500
          disabled:opacity-40 disabled:pointer-events-none
        `}
        aria-label="Next slide"
      >
        &#9654;
      </button>

      {/* Play / Pause toggle */}
      {showPlayPause && (
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          className={`
            absolute top-2 right-2
            bg-white/70 hover:bg-white text-gray-800
            p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500
          `}
          aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
      )}

      {/* Dots navigation */}
      {showDots && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={`
                w-3 h-3 rounded-full
                ${idx === current ? "bg-indigo-600" : "bg-gray-300"}
                focus:outline-none focus:ring-2 focus:ring-indigo-500
              `}
              aria-label={`Slide ${idx + 1} of ${slides.length}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
