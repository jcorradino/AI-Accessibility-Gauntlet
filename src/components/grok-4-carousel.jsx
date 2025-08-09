import React, { useState, useEffect, useRef } from "react";

export default function Grok4Carousel(props) {
  const slides = props.slides ?? [];
  const ariaLabel = props.ariaLabel;
  const loop = props.loop ?? true;
  const autoPlay = props.autoPlay ?? false;
  const intervalProp = props.interval ?? 5000;
  const effectiveInterval = Math.max(intervalProp, 2000);
  const initialIndex = props.initialIndex ?? 0;
  const showDots = props.showDots ?? true;
  const showPlayPause = props.showPlayPause ?? true;
  const className = props.className ?? "";
  const onIndexChange = props.onIndexChange;

  const [currentIndex, setCurrentIndex] = useState(() => {
    return Math.max(0, Math.min(initialIndex, slides.length - 1));
  });
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [delta, setDelta] = useState(0);
  const startPosRef = useRef(0);
  const wrapperRef = useRef(null);

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (loop) return (prev + 1) % slides.length;
          return prev < slides.length - 1 ? prev + 1 : prev;
        });
      }, effectiveInterval);
    }
    return () => clearInterval(timer);
  }, [isPlaying, effectiveInterval, loop, slides.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const newIdx = loop
        ? (prev + 1) % slides.length
        : Math.min(prev + 1, slides.length - 1);
      return newIdx;
    });
    if (isPlaying) setIsPlaying(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => {
      const newIdx = loop
        ? (prev - 1 + slides.length) % slides.length
        : Math.max(prev - 1, 0);
      return newIdx;
    });
    if (isPlaying) setIsPlaying(false);
  };

  const goTo = (i) => {
    setCurrentIndex(i);
    if (isPlaying) setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handlePointerDown = (e) => {
    if (e.target.closest("button")) return;
    if (!wrapperRef.current) return;
    wrapperRef.current.setPointerCapture(e.pointerId);
    setIsDragging(true);
    startPosRef.current = e.clientX;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setDelta(e.clientX - startPosRef.current);
  };

  const handlePointerUp = (e) => {
    if (!isDragging || !wrapperRef.current) return;
    wrapperRef.current.releasePointerCapture(e.pointerId);
    const threshold = wrapperRef.current.clientWidth / 4 || 100;
    let newIndex = currentIndex;
    if (delta < -threshold) {
      newIndex = loop
        ? (currentIndex + 1) % slides.length
        : Math.min(currentIndex + 1, slides.length - 1);
    } else if (delta > threshold) {
      newIndex = loop
        ? (currentIndex - 1 + slides.length) % slides.length
        : Math.max(currentIndex - 1, 0);
    }
    if (newIndex !== currentIndex && isPlaying) setIsPlaying(false);
    setCurrentIndex(newIndex);
    setDelta(0);
    setIsDragging(false);
  };

  if (slides.length === 0) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="h-96 flex items-center justify-center text-gray-500">
          No slides available
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden ${className}`}
      role="region"
      aria-label={ariaLabel || "Carousel"}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className={`flex ${
          isDragging ? "" : "transition-transform duration-300 ease-in-out"
        }`}
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${delta}px))`,
        }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="flex-none w-full">
            <img
              src={slide.image}
              alt={slide.description}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handlePrev}
        disabled={!loop && currentIndex === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white px-4 py-2 disabled:opacity-50"
        aria-label="Previous slide"
      >
        &lt;
      </button>
      <button
        onClick={handleNext}
        disabled={!loop && currentIndex === slides.length - 1}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white px-4 py-2 disabled:opacity-50"
        aria-label="Next slide"
      >
        &gt;
      </button>
      {showDots && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-3 h-3 rounded-full ${
                i === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
      {showPlayPause && (
        <button
          onClick={togglePlay}
          className="absolute bottom-4 right-4 bg-black/50 text-white p-2"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
      )}
    </div>
  );
}
