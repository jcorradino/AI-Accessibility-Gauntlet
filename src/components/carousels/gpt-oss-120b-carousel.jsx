import React, { useState, useEffect, useRef, useCallback } from "react";

export default function GptOss120bCarousel({
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
  const safeInterval = Math.max(interval, 2000);
  const slideCount = slides.length;

  // Clamp initial index
  const startIdx = Math.min(
    Math.max(initialIndex, 0),
    Math.max(slideCount - 1, 0)
  );

  const [current, setCurrent] = useState(startIdx);
  const [playing, setPlaying] = useState(autoPlay);
  const timerRef = useRef(null);
  const trackRef = useRef(null);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  // Notify parent
  useEffect(() => {
    if (typeof onIndexChange === "function") onIndexChange(current);
  }, [current, onIndexChange]);

  // Autoplay effect
  useEffect(() => {
    if (!playing || slideCount === 0) return;
    timerRef.current = setInterval(() => {
      goNext();
    }, safeInterval);
    return () => clearInterval(timerRef.current);
  }, [playing, current, slideCount, safeInterval]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => {
      if (prev === 0) return loop ? slideCount - 1 : 0;
      return prev - 1;
    });
  }, [loop, slideCount]);

  const goNext = useCallback(() => {
    setCurrent((prev) => {
      if (prev === slideCount - 1) return loop ? 0 : slideCount - 1;
      return prev + 1;
    });
  }, [loop, slideCount]);

  // Pause autoplay on any user interaction
  const pause = () => {
    setPlaying(false);
    clearInterval(timerRef.current);
  };

  // Pointer (mouse / touch) handling for swipe
  const onPointerDown = (e) => {
    pause();
    isDraggingRef.current = true;
    startXRef.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    trackRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDraggingRef.current) return;
    // Prevent default scrolling while dragging
    e.preventDefault();
  };

  const onPointerUp = (e) => {
    if (!isDraggingRef.current) return;
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? 0;
    const diff = endX - startXRef.current;
    const threshold = 50; // px
    if (diff > threshold) goPrev();
    else if (diff < -threshold) goNext();
    isDraggingRef.current = false;
    trackRef.current?.releasePointerCapture(e.pointerId);
  };

  // Render placeholder when no slides
  if (slideCount === 0) {
    return (
      <div
        className={`flex items-center justify-center p-8 bg-gray-100 text-gray-600 ${className}`}
        aria-label={ariaLabel}
      >
        No slides to display.
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      aria-label={ariaLabel}
    >
      {/* Slides track */}
      <div
        ref={trackRef}
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-full flex flex-col items-center"
          >
            <img
              src={slide.image}
              alt={slide.description}
              className="block w-full h-auto object-cover"
            />
            <p className="mt-2 text-center text-sm text-gray-800">
              {slide.description}
            </p>
          </div>
        ))}
      </div>

      {/* Prev button */}
      <button
        type="button"
        onClick={() => {
          pause();
          goPrev();
        }}
        disabled={!loop && current === 0}
        className={`
          absolute left-2 top-1/2 -translate-y-1/2
          bg-white/70 hover:bg-white rounded-full p-2
          disabled:opacity-40 disabled:pointer-events-none
          focus:outline-none focus:ring-2 focus:ring-indigo-500
        `}
        aria-label="Previous slide"
      >
        <svg
          className="w-5 h-5 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Next button */}
      <button
        type="button"
        onClick={() => {
          pause();
          goNext();
        }}
        disabled={!loop && current === slideCount - 1}
        className={`
          absolute right-2 top-1/2 -translate-y-1/2
          bg-white/70 hover:bg-white rounded-full p-2
          disabled:opacity-40 disabled:pointer-events-none
          focus:outline-none focus:ring-2 focus:ring-indigo-500
        `}
        aria-label="Next slide"
      >
        <svg
          className="w-5 h-5 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots navigation */}
      {showDots && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                pause();
                setCurrent(idx);
              }}
              className={`
                w-3 h-3 rounded-full
                ${idx === current ? "bg-indigo-600" : "bg-gray-300"}
                focus:outline-none focus:ring-2 focus:ring-indigo-500
              `}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Play / Pause toggle */}
      {showPlayPause && (
        <button
          type="button"
          onClick={() => {
            setPlaying((p) => !p);
          }}
          className={`
            absolute top-2 right-2
            bg-white/70 hover:bg-white rounded-full p-2
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          `}
          aria-label={playing ? "Pause autoplay" : "Play autoplay"}
        >
          {playing ? (
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
