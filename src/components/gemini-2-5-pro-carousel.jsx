import React, { useState, useEffect, useRef, useCallback } from "react";

export default function Gemini25ProCarousel({
  slides,
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
  // --- PROPS VALIDATION & DEFAULTS ---
  if (!slides || slides.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        No slides to display.
      </div>
    );
  }
  const slideCount = slides.length;
  const effectiveInterval = Math.max(interval, 2000);
  const safeInitialIndex = Math.max(0, Math.min(initialIndex, slideCount - 1));

  // --- STATE ---
  const [currentIndex, setCurrentIndex] = useState(safeInitialIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isInteracted, setIsInteracted] = useState(false);

  // --- REFS ---
  const trackRef = useRef(null);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const dragDelta = useRef(0);
  const autoplayIntervalRef = useRef(null);

  // --- NAVIGATION LOGIC ---
  const goToSlide = useCallback(
    (index) => {
      if (trackRef.current) {
        trackRef.current.style.transition = "transform 500ms ease-in-out";
      }
      setCurrentIndex(index);
    },
    [setCurrentIndex]
  );

  const goToNext = useCallback(() => {
    const nextIndex = loop
      ? (currentIndex + 1) % slideCount
      : Math.min(currentIndex + 1, slideCount - 1);
    goToSlide(nextIndex);
  }, [currentIndex, slideCount, loop, goToSlide]);

  const goToPrev = useCallback(() => {
    const prevIndex = loop
      ? (currentIndex - 1 + slideCount) % slideCount
      : Math.max(currentIndex - 1, 0);
    goToSlide(prevIndex);
  }, [currentIndex, slideCount, loop, goToSlide]);

  // --- HANDLERS ---
  const handleInteraction = () => {
    if (!isInteracted) setIsInteracted(true);
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
    }
  };

  const handlePrevClick = () => {
    handleInteraction();
    goToPrev();
  };

  const handleNextClick = () => {
    handleInteraction();
    goToNext();
  };

  const handleDotClick = (index) => {
    handleInteraction();
    goToSlide(index);
  };

  const handlePlayPauseClick = () => {
    handleInteraction();
    setIsPlaying((prev) => !prev);
  };

  // --- DRAG/SWIPE HANDLERS ---
  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    handleInteraction();
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current || !trackRef.current) return;
    const trackWidth = trackRef.current.offsetWidth / slideCount;
    dragDelta.current = e.clientX - dragStartX.current;
    const baseTranslate = -currentIndex * trackWidth;
    trackRef.current.style.transform = `translateX(${
      baseTranslate + dragDelta.current
    }px)`;
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    const dragThreshold = 50;
    if (Math.abs(dragDelta.current) > dragThreshold) {
      if (dragDelta.current < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    } else {
      if (trackRef.current) {
        trackRef.current.style.transition = "transform 500ms ease-in-out";
        trackRef.current.style.transform = `translateX(-${
          currentIndex * 100
        }%)`;
      }
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, onIndexChange]);

  useEffect(() => {
    if (isPlaying && !isInteracted) {
      autoplayIntervalRef.current = setInterval(goToNext, effectiveInterval);
    } else {
      clearInterval(autoplayIntervalRef.current);
    }
    return () => clearInterval(autoplayIntervalRef.current);
  }, [isPlaying, isInteracted, goToNext, effectiveInterval]);

  // --- RENDER ---
  const isPrevDisabled = !loop && currentIndex === 0;
  const isNextDisabled = !loop && currentIndex === slideCount - 1;

  return (
    <div
      className={`relative w-full select-none ${className}`}
      aria-label={ariaLabel}
      role="region"
      aria-roledescription="carousel"
    >
      <div
        className="touch-pan-y overflow-hidden rounded-lg"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: "transform 500ms ease-in-out",
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
              aria-hidden={currentIndex !== index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slideCount}`}
            >
              <img
                src={slide.image}
                alt={slide.description}
                className="pointer-events-none h-auto w-full object-cover"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handlePrevClick}
        disabled={isPrevDisabled}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-opacity hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={handleNextClick}
        disabled={isNextDisabled}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-opacity hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {showPlayPause && (
        <button
          onClick={handlePlayPauseClick}
          aria-label={
            isPlaying && !isInteracted ? "Pause autoplay" : "Start autoplay"
          }
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-opacity hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          {isPlaying && !isInteracted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14.25 6.08333H12.75V17.9167H14.25V6.08333ZM11.25 6.08333H9.75V17.9167H11.25V6.08333Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10.6221 8.41633C10.025 8.04397 9.25 8.52038 9.25 9.24235V14.7576C9.25 15.4796 10.025 15.956 10.6221 15.5837L15.1523 12.826C15.7213 12.4698 15.7213 11.5302 15.1523 11.174L10.6221 8.41633Z" />
            </svg>
          )}
        </button>
      )}

      {showDots && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={currentIndex === index ? "true" : "false"}
              className={`h-3 w-3 rounded-full transition-colors ${
                currentIndex === index
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              } focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
