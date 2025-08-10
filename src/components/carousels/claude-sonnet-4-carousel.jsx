import React, { useState, useEffect, useRef, useCallback } from "react";

export default function ClaudeSonnet4Carousel(props) {
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const intervalRef = useRef(null);
  const trackRef = useRef(null);
  const clampedInterval = Math.max(2000, interval);

  const goToSlide = useCallback(
    (index) => {
      const newIndex = Math.max(0, Math.min(index, slides.length - 1));
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        onIndexChange?.(newIndex);
      }
    },
    [currentIndex, slides.length, onIndexChange]
  );

  const goNext = useCallback(() => {
    if (slides.length === 0) return;
    if (loop) {
      const nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    } else if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, slides.length, loop, goToSlide]);

  const goPrev = useCallback(() => {
    if (slides.length === 0) return;
    if (loop) {
      const prevIndex =
        currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
      goToSlide(prevIndex);
    } else if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, slides.length, loop, goToSlide]);

  const pauseAutoPlay = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    if (!autoPlay || slides.length <= 1) return;
    setIsPlaying(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goNext, clampedInterval);
  }, [autoPlay, slides.length, goNext, clampedInterval]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseAutoPlay();
    } else {
      startAutoPlay();
    }
  }, [isPlaying, pauseAutoPlay, startAutoPlay]);

  useEffect(() => {
    if (isPlaying && autoPlay && slides.length > 1) {
      startAutoPlay();
    } else {
      pauseAutoPlay();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, autoPlay, slides.length, startAutoPlay, pauseAutoPlay]);

  const handlePointerDown = useCallback(
    (e) => {
      if (slides.length <= 1) return;
      setIsDragging(true);
      setDragStart(e.clientX || e.touches?.[0]?.clientX || 0);
      setDragOffset(0);
      pauseAutoPlay();
    },
    [slides.length, pauseAutoPlay]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging || slides.length <= 1) return;
      const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
      const offset = currentX - dragStart;
      setDragOffset(offset);
    },
    [isDragging, dragStart, slides.length]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging || slides.length <= 1) return;
    setIsDragging(false);

    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        goPrev();
      } else {
        goNext();
      }
    }

    setDragOffset(0);
  }, [isDragging, dragOffset, goPrev, goNext, slides.length]);

  if (slides.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">No slides to display</p>
      </div>
    );
  }

  const canGoPrev = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < slides.length - 1;

  const translateX = isDragging
    ? -currentIndex * 100 +
      (dragOffset / (trackRef.current?.offsetWidth || 1)) * 100
    : -currentIndex * 100;

  return (
    <div
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}
      aria-label={ariaLabel}
      role="region"
    >
      <div className="relative aspect-video overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(${translateX}%)`,
            width: `${slides.length * 100}%`,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full"
              style={{ width: `${100 / slides.length}%` }}
            >
              <img
                src={slide.image}
                alt={slide.description}
                className="w-full h-full object-cover select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors"
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
          onClick={goNext}
          disabled={!canGoNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors"
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
      </div>

      <div className="flex items-center justify-between p-4">
        {showDots && (
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex
                    ? "bg-white"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {showPlayPause && autoPlay && slides.length > 1 && (
          <button
            onClick={togglePlayPause}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors ml-auto"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
