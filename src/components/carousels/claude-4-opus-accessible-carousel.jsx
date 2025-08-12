import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function COMPONENT_NAME(props) {
  const {
    slides = [],
    ariaLabel = 'Image carousel',
    loop = true,
    autoPlay = false,
    interval = 5000,
    initialIndex = 0,
    showDots = true,
    showPlayPause = true,
    className = '',
    onIndexChange
  } = props;

  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(0, initialIndex), Math.max(0, slides.length - 1))
  );
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  
  const trackRef = useRef(null);
  const intervalRef = useRef(null);
  const lastInteractionRef = useRef(null);
  const announcementRef = useRef(null);
  
  const clampedInterval = Math.max(2000, interval);

  const goToSlide = useCallback((index) => {
    const newIndex = Math.min(Math.max(0, index), slides.length - 1);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      onIndexChange?.(newIndex);
      
      // Announce slide change for screen readers
      if (announcementRef.current && slides[newIndex]) {
        announcementRef.current.textContent = `Slide ${newIndex + 1} of ${slides.length}: ${slides[newIndex].description}`;
      }
    }
  }, [currentIndex, slides, onIndexChange]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else if (loop && slides.length > 0) {
      goToSlide(slides.length - 1);
    }
  }, [currentIndex, loop, slides.length, goToSlide]);

  const goToNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    } else if (loop && slides.length > 0) {
      goToSlide(0);
    }
  }, [currentIndex, loop, slides.length, goToSlide]);

  const pauseAutoPlay = useCallback(() => {
    lastInteractionRef.current = Date.now();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    if (!isPlaying || slides.length <= 1) return;
    
    pauseAutoPlay();
    intervalRef.current = setInterval(() => {
      goToNext();
    }, clampedInterval);
  }, [isPlaying, slides.length, clampedInterval, goToNext, pauseAutoPlay]);

  useEffect(() => {
    if (isPlaying && !isDragging) {
      startAutoPlay();
    } else {
      pauseAutoPlay();
    }
    
    return () => pauseAutoPlay();
  }, [isPlaying, isDragging, startAutoPlay, pauseAutoPlay]);

  const handleDragStart = (e) => {
    if (slides.length <= 1) return;
    
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    setIsDragging(true);
    setDragStartX(clientX);
    setDragOffset(0);
    pauseAutoPlay();
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const offset = clientX - dragStartX;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const threshold = 50;
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    
    setDragOffset(0);
    
    // Resume autoplay after interaction
    if (autoPlay) {
      setTimeout(() => {
        if (Date.now() - lastInteractionRef.current > 1000) {
          setIsPlaying(true);
        }
      }, 1000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      pauseAutoPlay();
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      pauseAutoPlay();
      goToNext();
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (slides.length === 0) {
    return (
      <div className={`bg-gray-100 p-8 text-center text-gray-500 ${className}`}>
        No slides available
      </div>
    );
  }

  const canGoPrev = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < slides.length - 1;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      role="region"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      onKeyDown={handleKeyDown}
    >
      {/* Screen reader announcement */}
      <div
        ref={announcementRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Slides track */}
      <div
        ref={trackRef}
        className="relative flex transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
          transition: isDragging ? 'none' : undefined
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
          <div
            key={index}
            className="w-full flex-shrink-0"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
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

      {/* Previous button */}
      <button
        className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all ${
          !canGoPrev ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => {
          pauseAutoPlay();
          goToPrevious();
        }}
        disabled={!canGoPrev}
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next button */}
      <button
        className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all ${
          !canGoNext ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => {
          pauseAutoPlay();
          goToNext();
        }}
        disabled={!canGoNext}
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Controls container */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
        {/* Dot navigation */}
        {showDots && (
          <nav aria-label="Slide navigation" className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                onClick={() => {
                  pauseAutoPlay();
                  goToSlide(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : undefined}
              />
            ))}
          </nav>
        )}

        {/* Play/Pause button */}
        {showPlayPause && autoPlay && slides.length > 1 && (
          <button
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
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