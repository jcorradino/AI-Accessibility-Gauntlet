import React, { useState, useEffect, useRef } from "react";

export default function Carousel({
  slides = [],
  ariaLabel = "Image carousel",
  loop = true,
  autoPlay = true,
  interval = 5000,
  initialIndex = 0,
  showDots = true,
  showPlayPause = true,
  className = "",
  onIndexChange,
}) {
  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(0, initialIndex), Math.max(0, slides.length - 1))
  );
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const timerRef = useRef(null);
  const trackRef = useRef(null);
  const clampedInterval = Math.max(2000, interval);

  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, onIndexChange]);

  useEffect(() => {
    if (isPlaying && slides.length > 1) {
      timerRef.current = setInterval(() => {
        goToNext();
      }, clampedInterval);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentIndex, slides.length, clampedInterval]);

  const pauseAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const goToPrevious = () => {
    pauseAutoPlay();
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return loop ? slides.length - 1 : 0;
      }
      return prev - 1;
    });
  };

  const goToNext = () => {
    pauseAutoPlay();
    setCurrentIndex((prev) => {
      if (prev === slides.length - 1) {
        return loop ? 0 : slides.length - 1;
      }
      return prev + 1;
    });
  };

  const goToSlide = (index) => {
    pauseAutoPlay();
    setCurrentIndex(index);
  };

  const handleDragStart = (e) => {
    pauseAutoPlay();
    setIsDragging(true);
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    setDragStart(clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    setDragOffset(clientX - dragStart);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 50;
    if (dragOffset > threshold) {
      goToPrevious();
    } else if (dragOffset < -threshold) {
      goToNext();
    }
    setDragOffset(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100">
        <p className="text-gray-500">No slides available</p>
      </div>
    );
  }

  const canGoPrev = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < slides.length - 1;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      aria-label={ariaLabel}
    >
      <div
        ref={trackRef}
        className="relative flex transition-transform duration-300 ease-in-out cursor-grab active:cursor-grabbing"
        style={{
          transform: `translateX(calc(-${
            currentIndex * 100
          }% + ${dragOffset}px))`,
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0">
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
        onClick={goToPrevious}
        disabled={!canGoPrev}
        className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full transition-opacity ${
          canGoPrev ? "hover:bg-black/70" : "opacity-50 cursor-not-allowed"
        }`}
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6"
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

      <button
        onClick={goToNext}
        disabled={!canGoNext}
        className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full transition-opacity ${
          canGoNext ? "hover:bg-black/70" : "opacity-50 cursor-not-allowed"
        }`}
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6"
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

      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-8" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {showPlayPause && slides.length > 1 && (
        <button
          onClick={togglePlayPause}
          className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isPlaying ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
