import React, { useState, useEffect, useRef, useCallback } from "react";

export default function Qwen3CoderCarousel({
  slides = [],
  ariaLabel = "carousel",
  loop = true,
  autoPlay = false,
  interval = 5000,
  initialIndex = 0,
  showDots = true,
  showPlayPause = true,
  className = "",
  onIndexChange,
}) {
  // Clamp interval to minimum 2000ms
  const clampedInterval = Math.max(2000, interval);

  // State management
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  // Refs
  const trackRef = useRef(null);
  const autoPlayRef = useRef(null);
  const startXRef = useRef(0);
  const currentIndexRef = useRef(currentIndex);

  // Update ref when currentIndex changes
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Handle autoplay
  useEffect(() => {
    if (!autoPlay || !isPlaying || slides.length === 0) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= slides.length) {
          return loop ? 0 : prev;
        }
        return nextIndex;
      });
    }, clampedInterval);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, isPlaying, slides.length, loop, clampedInterval]);

  // Notify parent of index change
  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, onIndexChange]);

  // Navigation functions
  const goToSlide = useCallback(
    (index) => {
      if (index < 0 || index >= slides.length) return;
      setCurrentIndex(index);
    },
    [slides.length]
  );

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= slides.length) {
        return loop ? 0 : prev;
      }
      return nextIndex;
    });
  }, [slides.length, loop]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const prevIndex = prev - 1;
      if (prevIndex < 0) {
        return loop ? slides.length - 1 : prev;
      }
      return prevIndex;
    });
  }, [slides.length, loop]);

  // Event handlers for drag/swipe
  const handleDragStart = useCallback(
    (clientX) => {
      setIsDragging(true);
      setStartX(clientX);
      startXRef.current = clientX;
      if (autoPlay && isPlaying) {
        setIsPlaying(false);
      }
    },
    [autoPlay, isPlaying]
  );

  const handleDragMove = useCallback(
    (clientX) => {
      if (!isDragging) return;

      const delta = clientX - startXRef.current;
      const containerWidth = trackRef.current?.clientWidth || 1;
      const percentMoved = (delta / containerWidth) * 100;
      setTranslateX(-currentIndexRef.current * 100 + percentMoved);
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    const containerWidth = trackRef.current?.clientWidth || 1;
    const threshold = containerWidth * 0.2; // 20% threshold
    const delta = startXRef.current - startX;

    if (Math.abs(delta) > threshold) {
      if (delta > 0 && (currentIndexRef.current > 0 || loop)) {
        prevSlide();
      } else if (
        delta < 0 &&
        (currentIndexRef.current < slides.length - 1 || loop)
      ) {
        nextSlide();
      }
    }

    setTranslateX(-currentIndexRef.current * 100);
  }, [isDragging, loop, nextSlide, prevSlide, slides.length, startX]);

  // Mouse/Touch event handlers
  const handleMouseDown = useCallback(
    (e) => {
      handleDragStart(e.clientX);
    },
    [handleDragStart]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      handleDragMove(e.clientX);
    },
    [handleDragMove, isDragging]
  );

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const handleTouchStart = useCallback(
    (e) => {
      handleDragStart(e.touches[0].clientX);
    },
    [handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;
      handleDragMove(e.touches[0].clientX);
    },
    [handleDragMove, isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Play/Pause toggle
  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Handle empty slides case
  if (slides.length === 0) {
    return (
      <div className={`relative w-full overflow-hidden ${className}`}>
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
          <span className="text-gray-500">No slides available</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      aria-label={ariaLabel}
      role="region"
    >
      {/* Slides Track */}
      <div
        ref={trackRef}
        className="relative w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(${translateX}%)`,
            transition: isDragging ? "none" : "transform 300ms ease-in-out",
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
            >
              <div className="relative pb-[56.25%]">
                {" "}
                {/* 16:9 aspect ratio */}
                <img
                  src={slide.image}
                  alt={slide.description}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {(loop || currentIndex > 0) && (
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <svg
            className="w-5 h-5"
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
      )}

      {(loop || currentIndex < slides.length - 1) && (
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <svg
            className="w-5 h-5"
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
      )}

      {/* Play/Pause Button */}
      {showPlayPause && autoPlay && (
        <button
          onClick={togglePlayPause}
          className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full transition-colors"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}

      {/* Dots Navigation */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? "true" : "false"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
