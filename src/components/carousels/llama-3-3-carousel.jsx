import { useState, useEffect, useRef } from "react";

export default function Llama33Carousel(props) {
  const {
    slides,
    ariaLabel,
    loop = true,
    autoPlay = false,
    interval = 5000,
    initialIndex = 0,
    showDots = true,
    showPlayPause = true,
    className,
    onIndexChange,
  } = props;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState(null);
  const carouselRef = useRef(null);
  const timerRef = useRef(null);

  const clampInterval = Math.max(interval, 2000);

  useEffect(() => {
    if (autoPlay) {
      startPlaying();
    }
    return () => {
      stopPlaying();
    };
  }, [autoPlay]);

  const handleTouchStart = (event) => {
    setTouchStart({ x: event.touches[0].clientX, y: event.touches[0].clientY });
  };

  const handleTouchMove = (event) => {
    if (touchStart) {
      const deltaX = event.touches[0].clientX - touchStart.x;
      const deltaY = event.touches[0].clientY - touchStart.y;
      if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
        event.preventDefault();
        if (deltaX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
        setTouchStart(null);
      }
    }
  };

  const handleMouseDown = (event) => {
    setTouchStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event) => {
    if (touchStart) {
      const deltaX = event.clientX - touchStart.x;
      const deltaY = event.clientY - touchStart.y;
      if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
        event.preventDefault();
        if (deltaX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
        setTouchStart(null);
      }
    }
  };

  const handleMouseUp = () => {
    setTouchStart(null);
  };

  const startPlaying = () => {
    setIsPlaying(true);
    timerRef.current = setInterval(() => {
      handleNext();
    }, clampInterval);
  };

  const stopPlaying = () => {
    setIsPlaying(false);
    clearInterval(timerRef.current);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopPlaying();
    } else {
      startPlaying();
    }
  };

  const handleNext = () => {
    if (loop || currentIndex < slides.length - 1) {
      setCurrentIndex((prevIndex) =>
        loop ? (prevIndex + 1) % slides.length : prevIndex + 1
      );
    }
  };

  const handlePrev = () => {
    if (loop || currentIndex > 0) {
      setCurrentIndex((prevIndex) =>
        loop ? (prevIndex - 1 + slides.length) % slides.length : prevIndex - 1
      );
    }
  };

  const handleDotClick = (index) => {
    stopPlaying();
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, onIndexChange]);

  if (slides.length === 0) {
    return (
      <div
        className={`flex justify-center items-center ${className} h-64 w-full bg-gray-200`}
        aria-label={ariaLabel}
      >
        No slides available
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col ${className}`}
      aria-label={ariaLabel}
      ref={carouselRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="flex overflow-hidden"
        style={{
          "--carousel-width": `${100 * slides.length}%`,
          "--carousel-translate": `-${(100 / slides.length) * currentIndex}%`,
        }}
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
      {showDots && (
        <div className="flex justify-center mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`mx-2 w-2 h-2 rounded-full ${
                currentIndex === index ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      )}
      {showPlayPause && (
        <button
          className="absolute top-1/2 -translate-y-1/2 left-4 z-10 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
          onClick={handlePrev}
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
      {showPlayPause && (
        <button
          className="absolute top-1/2 -translate-y-1/2 right-4 z-10 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
          onClick={handleNext}
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
      {showPlayPause && (
        <button
          className="absolute top-1/2 -translate-y-1/2 right-16 z-10 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
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
                d="M10 9v6m4-6v6m7-9v12a2 2 0 11-4 0V4"
              />
            </svg>
          ) : (
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
                d="M14.752 11.168l-3.197-3.197m21.864 0A2 2 0 0021 7h-2a2 2 0 00-1.303.293l-2.83 2.83m-4.8 0a2 2 0 011.303-2.293l11.47 11.47"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
