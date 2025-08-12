import React, { useState, useEffect, useRef } from "react";

export default function AccessibleCarousel({
  slides = [],
  ariaLabel = "Carousel",
  loop = true,
  autoPlay = false,
  interval = 5000,
  initialIndex = 0,
  showDots = true,
  showPlayPause = true,
  className = "",
  onIndexChange = () => {},
}) {
  // Clamp interval to minimum 2000ms
  const autoplayInterval = Math.max(2000, interval);

  // State management
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Refs
  const autoplayTimer = useRef(null);
  const carouselRef = useRef(null);
  const trackRef = useRef(null);

  // Reset index when slides change
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, Math.max(slides.length - 1, 0)));
  }, [slides.length]);

  // Handle autoplay
  useEffect(() => {
    if (!autoPlay || !isPlaying || slides.length <= 1) return;

    autoplayTimer.current = setInterval(() => {
      goToNext();
    }, autoplayInterval);

    return () => {
      if (autoplayTimer.current) {
        clearInterval(autoplayTimer.current);
      }
    };
  }, [autoPlay, isPlaying, currentIndex, slides.length, autoplayInterval]);

  // Notify parent of index changes
  useEffect(() => {
    onIndexChange(currentIndex);
  }, [currentIndex, onIndexChange]);

  // Navigation functions
  const goToSlide = (index) => {
    const newIndex = loop
      ? ((index % slides.length) + slides.length) % slides.length
      : Math.max(0, Math.min(slides.length - 1, index));

    setCurrentIndex(newIndex);
  };

  const goToPrev = () => {
    goToSlide(currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide(currentIndex + 1);
  };

  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying);
  };

  // Drag handling
  const handleDragStart = (clientX) => {
    if (slides.length <= 1) return;

    setIsDragging(true);
    setDragStartX(clientX);
    if (autoPlay && isPlaying) {
      clearInterval(autoplayTimer.current);
    }
  };

  const handleDragMove = (clientX) => {
    if (!isDragging) return;

    const offset = clientX - dragStartX;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // Threshold for swipe
    const threshold = trackRef.current?.clientWidth * 0.2 || 50;

    if (dragOffset > threshold) {
      goToPrev();
    } else if (dragOffset < -threshold) {
      goToNext();
    }

    setDragOffset(0);

    // Resume autoplay if needed
    if (autoPlay && !isPlaying) {
      autoplayTimer.current = setInterval(() => {
        goToNext();
      }, autoplayInterval);
      setIsPlaying(true);
    }
  };

  // Event handlers for mouse/touch
  const handleMouseDown = (e) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goToNext();
    }
  };

  // Calculate transform value
  const getTransformValue = () => {
    const dragPercent =
      (dragOffset / (trackRef.current?.clientWidth || 1)) * 100;
    return `translateX(calc(-${currentIndex * 100}% + ${dragPercent}%))`;
  };

  // Handle empty slides
  if (slides.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ minHeight: "300px" }}
        aria-label={ariaLabel}
        role="region"
      >
        <p className="text-gray-500">No slides available</p>
      </div>
    );
  }

  return (
    <div
      ref={carouselRef}
      className={`relative overflow-hidden rounded-lg ${className}`}
      aria-label={ariaLabel}
      role="region"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {/* Slides track */}
      <div
        ref={trackRef}
        className="flex transition-transform duration-300 ease-in-out"
        style={{
          transform: getTransformValue(),
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
          >
            <img
              src={slide.image}
              alt={slide.description}
              className="block w-full h-auto object-contain max-h-[70vh]"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      {(loop || currentIndex > 0) && (
        <button
          onClick={goToPrev}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          disabled={!loop && currentIndex === 0}
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
      )}

      {(loop || currentIndex < slides.length - 1) && (
        <button
          onClick={goToNext}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          disabled={!loop && currentIndex === slides.length - 1}
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
      )}

      {/* Play/Pause button */}
      {showPlayPause && autoPlay && (
        <button
          onClick={toggleAutoplay}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      )}

      {/* Dots navigation */}
      {showDots && slides.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2"
          role="tablist"
          aria-label="Slide navigation"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={currentIndex === index}
              role="tab"
              className={`w-3 h-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                currentIndex === index
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      <div className="absolute top-2 left-2 bg-black/30 text-white text-sm px-2 py-1 rounded">
        <span aria-live="polite">
          {currentIndex + 1} of {slides.length}
        </span>
      </div>
    </div>
  );
}
