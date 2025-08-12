// Carousel.js
import { useState, useEffect, useRef } from "react";

export default function Carousel({
  slides,
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
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState(null);
  const carouselRef = useRef(null);

  const clampInterval = Math.max(interval, 2000);

  useEffect(() => {
    let timerId;
    if (isPlaying) {
      timerId = setInterval(() => {
        if (loop) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        } else if (currentIndex < slides.length - 1) {
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }
      }, clampInterval);
    }
    return () => {
      clearInterval(timerId);
    };
  }, [isPlaying, loop, slides.length, currentIndex, clampInterval]);

  const handleTouchStart = (event) => {
    setTouchStart(event.touches[0].clientX);
  };

  const handleTouchMove = (event) => {
    if (touchStart !== null) {
      const diff = event.touches[0].clientX - touchStart;
      if (Math.abs(diff) > 50) {
        if (diff < 0) {
          if (loop) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
          } else if (currentIndex < slides.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
          }
        } else {
          if (loop) {
            setCurrentIndex(
              (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
            );
          } else if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
          }
        }
        setTouchStart(null);
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const handlePrevClick = () => {
    if (loop) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
      );
    } else if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
    setIsPlaying(false);
  };

  const handleNextClick = () => {
    if (loop) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    } else if (currentIndex < slides.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
    setIsPlaying(false);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const handlePlayPauseClick = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, onIndexChange]);

  return (
    <div
      className={`relative ${className}`}
      aria-label={ariaLabel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={carouselRef}
        className="flex overflow-hidden"
        style={{
          "--translate-x": `-${currentIndex * 100}%`,
        }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img
              src={slide.image}
              alt={slide.description}
              className="block w-full h-auto"
            />
          </div>
        ))}
      </div>
      {showDots && (
        <div className="flex justify-center mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`mx-2 ${
                currentIndex === index ? "bg-blue-500" : "bg-gray-300"
              } w-4 h-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      )}
      {showPlayPause && (
        <button
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handlePlayPauseClick}
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
                d="M10 9v6m3-3v6m-9-9h2m4-6a9 9 0 11-18 0 9 9 0 0118 0z"
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
                d="M14.752 11.168l-3.197-2.132A1 1 0 0021 9.87v14.134a1 1 0 01-1.732.982l-5.233-4.293a14.161 14.161 0 00-6.724 0L3.982 20.293a1 1 0 01-1.306.978V9.867a1 1 0 011.168-1.004l3.197 2.132z"
              />
            </svg>
          )}
        </button>
      )}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-blue-500 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handlePrevClick}
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
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-blue-500 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleNextClick}
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
      {slides.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">No slides available</p>
        </div>
      )}
    </div>
  );
}
