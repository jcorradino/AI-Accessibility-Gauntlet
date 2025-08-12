import React, { useState, useEffect, useRef, useCallback } from "react";

export default function AccessibleCarousel(props) {
  const {
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
  } = props;

  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, Math.min(initialIndex, slides.length - 1))
  );
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const trackRef = useRef(null);
  const timerRef = useRef(null);

  const clampedInterval = Math.max(2000, interval);
  const isFirstSlide = !loop && currentIndex === 0;
  const isLastSlide = !loop && currentIndex === slides.length - 1;

  const goToSlide = useCallback(
    (index) => {
      const newIndex = (index + slides.length) % slides.length;
      setCurrentIndex(newIndex);
      onIndexChange?.(newIndex);
    },
    [slides.length, onIndexChange]
  );

  const goToNext = useCallback(() => {
    if (isLastSlide) return;
    goToSlide(currentIndex + 1);
  }, [currentIndex, isLastSlide, goToSlide]);

  const goToPrev = useCallback(() => {
    if (isFirstSlide) return;
    goToSlide(currentIndex - 1);
  }, [currentIndex, isFirstSlide, goToSlide]);

  const startTimer = useCallback(() => {
    if (!isPlaying || !autoPlay || slides.length <= 1) return;

    timerRef.current = setTimeout(() => {
      goToNext();
    }, clampedInterval);
  }, [isPlaying, autoPlay, slides.length, clampedInterval, goToNext]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const threshold = 50;
    const diff = touchStart - touchEnd;

    if (diff > threshold) {
      goToNext();
    } else if (diff < -threshold) {
      goToPrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    if (autoPlay) {
      startTimer();
    }
    return () => resetTimer();
  }, [autoPlay, startTimer, resetTimer]);

  useEffect(() => {
    if (isPlaying) {
      startTimer();
    } else {
      resetTimer();
    }
  }, [isPlaying, startTimer, resetTimer]);

  if (slides.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 p-8 ${className}`}
      >
        <p className="text-gray-500">No slides to display</p>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      aria-label={ariaLabel}
      role="region"
    >
      <div
        ref={trackRef}
        className="flex transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${slides.length * 100}%`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0"
            aria-hidden={index !== currentIndex}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${slides.length}`}
          >
            <img
              src={slide.image}
              alt={slide.description}
              className="block w-full h-auto"
              draggable="false"
            />
          </div>
        ))}
      </div>

      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
        onClick={goToPrev}
        disabled={isFirstSlide}
        aria-label="Previous slide"
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
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
        onClick={goToNext}
        disabled={isLastSlide}
        aria-label="Next slide"
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

      {showPlayPause && autoPlay && (
        <button
          className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
          onClick={handlePlayPause}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isPlaying ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
            )}
          </svg>
        </button>
      )}

      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
}