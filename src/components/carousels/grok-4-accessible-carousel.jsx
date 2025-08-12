import React, { useState, useEffect, useRef } from "react";

export default function Carousel({
  slides = [],
  ariaLabel = "Carousel",
  loop = true,
  autoPlay = false,
  interval = 5000,
  initialIndex = 0,
  showDots = true,
  showPlayPause = true,
  className = "",
  onIndexChange,
}) {
  const totalSlides = slides.length;
  if (totalSlides === 0) {
    return (
      <div className={`text-center p-4 ${className}`}>No slides available</div>
    );
  }

  const effectiveInterval = Math.max(interval, 2000);
  const effectiveInitial = Math.max(0, Math.min(initialIndex, totalSlides - 1));
  const [currentIndex, setCurrentIndex] = useState(effectiveInitial);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const timerRef = useRef(null);
  const viewportRef = useRef(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    if (onIndexChange) onIndexChange(currentIndex);
  }, [currentIndex, onIndexChange]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        next();
      }, effectiveInterval);
      return () => clearInterval(timerRef.current);
    }
  }, [isPlaying]);

  const prev = () => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : loop ? totalSlides - 1 : 0));
    setIsPlaying(false);
  };

  const next = () => {
    setCurrentIndex((i) =>
      i < totalSlides - 1 ? i + 1 : loop ? 0 : totalSlides - 1
    );
    setIsPlaying(false);
  };

  const goTo = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    touchStartX.current = e.pageX;
    setDragOffset(0);
    if (isPlaying) setIsPlaying(false);
    clearInterval(timerRef.current);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const delta = touchStartX.current - e.pageX;
    setDragOffset(delta);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = viewportRef.current.offsetWidth * 0.3;
    if (dragOffset > threshold) {
      next();
    } else if (dragOffset < -threshold) {
      prev();
    }
    setDragOffset(0);
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  return (
    <div
      className={`relative ${className}`}
      role="region"
      aria-label={ariaLabel}
    >
      <div
        ref={viewportRef}
        className="overflow-hidden"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <ul
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(calc(-${
              currentIndex * 100
            }% - ${dragOffset}px))`,
          }}
        >
          {slides.map((slide, i) => (
            <li
              key={i}
              id={`slide-${i}`}
              role="tabpanel"
              aria-labelledby={`tab-${i}`}
              aria-hidden={i !== currentIndex}
              className="flex-shrink-0 w-full"
            >
              <img
                src={slide.image}
                alt={slide.description}
                className="block w-full h-auto"
                draggable="false"
              />
            </li>
          ))}
        </ul>
      </div>
      <button
        aria-label="Previous slide"
        onClick={prev}
        disabled={!loop && currentIndex === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 disabled:opacity-50"
      >
        Prev
      </button>
      <button
        aria-label="Next slide"
        onClick={next}
        disabled={!loop && currentIndex === totalSlides - 1}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 disabled:opacity-50"
      >
        Next
      </button>
      {showDots && (
        <div
          className="absolute bottom-0 left-0 right-0 flex justify-center p-2"
          role="tablist"
          aria-label="Slides"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              id={`tab-${i}`}
              role="tab"
              aria-selected={i === currentIndex}
              aria-controls={`slide-${i}`}
              tabIndex={i === currentIndex ? 0 : -1}
              onClick={() => goTo(i)}
              className={`w-3 h-3 mx-1 rounded-full ${
                i === currentIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
      {autoPlay && showPlayPause && (
        <button
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          className="absolute bottom-2 right-2 bg-black/50 text-white p-1"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
      )}
      <div aria-live="polite" className="sr-only">
        Showing slide {currentIndex + 1} of {totalSlides}:{" "}
        {slides[currentIndex].description}
      </div>
    </div>
  );
}
