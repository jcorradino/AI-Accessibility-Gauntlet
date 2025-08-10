import React, { useState, useEffect, useRef } from "react";

export default function DeepseekV3Carousel({
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
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, Math.min(initialIndex, slides.length - 1))
  );
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const trackRef = useRef(null);
  const intervalRef = useRef(null);
  const minSwipeDistance = 50;
  const clampedInterval = Math.max(2000, interval);

  const goToSlide = (index) => {
    const newIndex = loop
      ? (index + slides.length) % slides.length
      : Math.max(0, Math.min(index, slides.length - 1));
    setCurrentIndex(newIndex);
    onIndexChange?.(newIndex);
  };

  const goNext = () => {
    goToSlide(currentIndex + 1);
  };

  const goPrev = () => {
    goToSlide(currentIndex - 1);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      goNext();
    } else if (distance < -minSwipeDistance) {
      goPrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(goNext, clampedInterval);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, currentIndex, clampedInterval]);

  useEffect(() => {
    setIsPlaying(autoPlay);
  }, [autoPlay]);

  if (slides.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 h-48 ${className}`}
      >
        <p className="text-gray-500">No slides to display</p>
      </div>
    );
  }

  const isPrevDisabled = !loop && currentIndex === 0;
  const isNextDisabled = !loop && currentIndex === slides.length - 1;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      aria-label={ariaLabel}
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
            style={{ width: `${100 / slides.length}%` }}
          >
            <img
              src={slide.image}
              alt={slide.description}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <button
        onClick={goPrev}
        disabled={isPrevDisabled}
        className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full ${
          isPrevDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-black/70"
        }`}
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
        onClick={goNext}
        disabled={isNextDisabled}
        className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full ${
          isNextDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-black/70"
        }`}
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

      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-4" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {showPlayPause && (
        <button
          onClick={togglePlayPause}
          className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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
    </div>
  );
}
