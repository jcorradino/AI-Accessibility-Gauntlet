import { useState, useEffect, useRef } from 'react';

export default function Claude4OpusCarousel(props) {
  const {
    slides = [],
    ariaLabel,
    loop = true,
    autoPlay = false,
    interval = 5000,
    initialIndex = 0,
    showDots = true,
    showPlayPause = true,
    className = '',
    onIndexChange
  } = props;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const clampedInterval = Math.max(interval, 2000);

  useEffect(() => {
    if (isPlaying && slides.length > 1) {
      intervalRef.current = setInterval(() => {
        goToNext();
      }, clampedInterval);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentIndex, clampedInterval, slides.length]);

  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, onIndexChange]);

  const stopAutoPlay = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const goToSlide = (index) => {
    stopAutoPlay();
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    stopAutoPlay();
    if (loop) {
      setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (loop) {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    } else if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    setDragStart(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    setDragOffset(clientX - dragStart);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
    setDragOffset(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!slides || slides.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-500">No slides available</p>
      </div>
    );
  }

  const canGoPrev = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < slides.length - 1;

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-black ${className}`}
      aria-label={ariaLabel}
      ref={containerRef}
    >
      <div
        className="relative w-full"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img
                src={slide.image}
                alt={slide.description}
                className="w-full h-auto object-cover select-none"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={goToPrev}
        disabled={!canGoPrev}
        className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full transition-opacity ${
          canGoPrev ? 'hover:bg-black/70' : 'opacity-30 cursor-not-allowed'
        }`}
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => {
          stopAutoPlay();
          goToNext();
        }}
        disabled={!canGoNext}
        className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full transition-opacity ${
          canGoNext ? 'hover:bg-black/70' : 'opacity-30 cursor-not-allowed'
        }`}
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {showPlayPause && slides.length > 1 && (
        <button
          onClick={togglePlayPause}
          className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
      )}

      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}