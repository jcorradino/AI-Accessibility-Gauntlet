import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function Carousel(props) {
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
    Math.max(0, Math.min(initialIndex, slides.length - 1))
  );
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  
  const intervalRef = useRef(null);
  const trackRef = useRef(null);
  const clampedInterval = Math.max(2000, interval);

  const goToSlide = useCallback((index) => {
    const newIndex = Math.max(0, Math.min(index, slides.length - 1));
    setCurrentIndex(newIndex);
    onIndexChange?.(newIndex);
  }, [slides.length, onIndexChange]);

  const goNext = useCallback(() => {
    if (slides.length === 0) return;
    
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    } else if (loop) {
      goToSlide(0);
    }
  }, [currentIndex, slides.length, loop, goToSlide]);

  const goPrev = useCallback(() => {
    if (slides.length === 0) return;
    
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else if (loop) {
      goToSlide(slides.length - 1);
    }
  }, [currentIndex, slides.length, loop, goToSlide]);

  const pauseAutoplay = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (!autoPlay) return;
    setIsPlaying(true);
  }, [autoPlay]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pauseAutoplay();
    } else {
      startAutoplay();
    }
  }, [isPlaying, pauseAutoplay, startAutoplay]);

  // Autoplay effect
  useEffect(() => {
    if (isPlaying && slides.length > 1) {
      intervalRef.current = setInterval(goNext, clampedInterval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, slides.length, goNext, clampedInterval]);

  // Touch/pointer handlers
  const handlePointerDown = (e) => {
    if (slides.length <= 1) return;
    
    setIsDragging(true);
    setDragStart(e.clientX || e.touches?.[0]?.clientX || 0);
    setDragOffset(0);
    pauseAutoplay();
    
    if (trackRef.current) {
      trackRef.current.style.transition = 'none';
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging || slides.length <= 1) return;
    
    const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
    const offset = currentX - dragStart;
    setDragOffset(offset);
  };

  const handlePointerUp = () => {
    if (!isDragging || slides.length <= 1) return;
    
    setIsDragging(false);
    
    if (trackRef.current) {
      trackRef.current.style.transition = '';
    }
    
    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        goPrev();
      } else {
        goNext();
      }
    }
    
    setDragOffset(0);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (slides.length <= 1) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goPrev();
        pauseAutoplay();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goNext();
        pauseAutoplay();
        break;
      case ' ':
        if (showPlayPause) {
          e.preventDefault();
          togglePlayPause();
        }
        break;
    }
  };

  if (slides.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">No slides available</p>
      </div>
    );
  }

  const canGoPrev = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < slides.length - 1;
  
  const trackTransform = isDragging
    ? `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`
    : `translateX(-${currentIndex * 100}%)`;

  return (
    <div
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}
      role="region"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Main viewport */}
      <div className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: trackTransform }}
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
              className="w-full flex-shrink-0"
              aria-hidden={index !== currentIndex}
            >
              <img
                src={slide.image}
                alt={slide.description}
                className="block w-full h-auto"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={() => { goPrev(); pauseAutoplay(); }}
          disabled={!canGoPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={() => { goNext(); pauseAutoplay(); }}
          disabled={!canGoNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-black/20">
        {/* Dots navigation */}
        {showDots && (
          <div className="flex space-x-2" role="tablist" aria-label="Slide navigation">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => { goToSlide(index); pauseAutoplay(); }}
                className={`w-2 h-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/20 ${
                  index === currentIndex
                    ? 'bg-white'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Play/Pause button */}
        {showPlayPause && autoPlay && (
          <button
            onClick={togglePlayPause}
            className="text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/20"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {slides.length}: {slides[currentIndex]?.description}
      </div>
    </div>
  );
}