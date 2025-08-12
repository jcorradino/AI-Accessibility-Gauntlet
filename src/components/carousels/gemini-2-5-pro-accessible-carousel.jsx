import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useId,
  } from "react";
  
  /**
   * An accessible, touch-friendly, and customizable React carousel component.
   *
   * @param {object} props - The component props.
   * @param {Array<{image: string, description: string}>} props.slides - Array of slide objects.
   * @param {string} [props.ariaLabel='Image carousel'] - ARIA label for the carousel region.
   * @param {boolean} [props.loop=true] - Whether the carousel should loop.
   * @param {boolean} [props.autoPlay=false] - Whether the carousel should autoplay.
   * @param {number} [props.interval=5000] - Autoplay interval in ms (min 2000).
   * @param {number} [props.initialIndex=0] - The starting slide index.
   * @param {boolean} [props.showDots=true] - Whether to show dot navigation.
   * @param {boolean} [props.showPlayPause=true] - Whether to show the play/pause button.
   * @param {string} [props.className] - Additional classes for the root element.
   * @param {function(number): void} [props.onIndexChange] - Callback when the index changes.
   */
  export default function AccessibleCarousel({
    slides,
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
    const getValidIndex = useCallback(
      (index) => {
        if (!slides || slides.length === 0) return 0;
        if (loop) {
          return (index + slides.length) % slides.length;
        }
        return Math.max(0, Math.min(slides.length - 1, index));
      },
      [slides, loop],
    );
  
    const [currentIndex, setCurrentIndex] = useState(
      getValidIndex(initialIndex),
    );
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isInteracting, setIsInteracting] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
  
    const timerRef = useRef(null);
    const dragStartRef = useRef(0);
    const trackRef = useRef(null);
    const carouselId = useId();
  
    const clampedInterval = Math.max(2000, interval);
  
    const goToIndex = useCallback(
      (index) => {
        const newIndex = getValidIndex(index);
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
          onIndexChange?.(newIndex);
        }
      },
      [currentIndex, getValidIndex, onIndexChange],
    );
  
    const goToNext = useCallback(() => {
      goToIndex(currentIndex + 1);
    }, [currentIndex, goToIndex]);
  
    const goToPrev = useCallback(() => {
      goToIndex(currentIndex - 1);
    }, [currentIndex, goToIndex]);
  
    const pause = useCallback(() => {
      if (autoPlay) {
        setIsPlaying(false);
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, [autoPlay]);
  
    useEffect(() => {
      if (isPlaying) {
        timerRef.current = setTimeout(goToNext, clampedInterval);
      }
      return () => clearTimeout(timerRef.current);
    }, [isPlaying, currentIndex, goToNext, clampedInterval]);
  
    const handlePointerDown = (e) => {
      if (e.button !== 0) return;
      pause();
      setIsInteracting(true);
      dragStartRef.current = e.clientX;
      e.currentTarget.style.cursor = "grabbing";
    };
  
    const handlePointerMove = (e) => {
      if (!isInteracting) return;
      setDragOffset(e.clientX - dragStartRef.current);
    };
  
    const handlePointerUp = () => {
      if (!isInteracting) return;
      const dragThreshold = 50;
      if (Math.abs(dragOffset) > dragThreshold) {
        if (dragOffset < 0) goToNext();
        else goToPrev();
      }
      setIsInteracting(false);
      setDragOffset(0);
      if (trackRef.current) trackRef.current.style.cursor = "grab";
    };
  
    const handleDotKeyDown = (e) => {
      const dots = Array.from(e.currentTarget.parentElement.children);
      const currentDotIndex = dots.indexOf(e.currentTarget);
  
      let nextDotIndex = -1;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextDotIndex = (currentDotIndex + 1) % slides.length;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        nextDotIndex = (currentDotIndex - 1 + slides.length) % slides.length;
      }
  
      if (nextDotIndex !== -1) {
        dots[nextDotIndex].focus();
      }
    };
  
    if (!slides || slides.length === 0) {
      return (
        <div
          className={`flex items-center justify-center w-full h-64 bg-gray-200 rounded-lg ${className}`}
        >
          <p className="text-gray-500">No slides to display.</p>
        </div>
      );
    }
  
    return (
      <div
        className={`relative w-full ${className}`}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        onMouseEnter={pause}
        onFocus={pause}
      >
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {`Slide ${currentIndex + 1} of ${slides.length}: ${
            slides[currentIndex].description
          }`}
        </div>
  
        <div
          className="overflow-hidden rounded-lg"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div
            ref={trackRef}
            className="flex"
            style={{
              transform: `translateX(calc(-${
                currentIndex * 100
              }% + ${dragOffset}px))`,
              transition: isInteracting ? "none" : "transform 0.5s ease-in-out",
              cursor: isInteracting ? "grabbing" : "grab",
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                id={`${carouselId}-slide-${index}`}
                className="w-full flex-shrink-0"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}`}
                aria-hidden={index !== currentIndex}
              >
                <img
                  src={slide.image}
                  alt={slide.description}
                  className="block w-full h-auto object-cover"
                  draggable="false"
                />
              </div>
            ))}
          </div>
        </div>
  
        <div className="absolute inset-0 flex items-center justify-between p-2 pointer-events-none">
          <button
            onClick={goToPrev}
            disabled={!loop && currentIndex === 0}
            className="pointer-events-auto bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous Slide"
            aria-controls={`${carouselId}-slide-${currentIndex}`}
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
            onClick={goToNext}
            disabled={!loop && currentIndex === slides.length - 1}
            className="pointer-events-auto bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next Slide"
            aria-controls={`${carouselId}-slide-${currentIndex}`}
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
        </div>
  
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center p-4 space-x-4">
          {autoPlay && showPlayPause && (
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-label={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 6a1 1 0 011-1h2a1 1 0 110 2H6a1 1 0 01-1-1zm4 0a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6.3 5.17a1 1 0 00-1.3.83v8a1 1 0 001.3.83l6-4a1 1 0 000-1.66l-6-4z" />
                </svg>
              )}
            </button>
          )}
  
          {showDots && (
            <div
              className="flex items-center space-x-2"
              role="tablist"
              aria-label="Slide navigation"
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  onKeyDown={handleDotKeyDown}
                  role="tab"
                  aria-selected={currentIndex === index}
                  aria-controls={`${carouselId}-slide-${index}`}
                  tabIndex={currentIndex === index ? 0 : -1}
                  className="w-3 h-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  style={{
                    backgroundColor:
                      currentIndex === index
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.4)",
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }