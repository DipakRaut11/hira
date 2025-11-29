"use client";

import { useEffect, useState, useRef } from "react";

export default function HeroImageCarousel() {
  const [images, setImages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<any>(null);

  // Fetch images
  useEffect(() => {
    async function fetchImages() {
      const res = await fetch("/api/heroimages");
      const data = await res.json();
      setImages(data);
    }
    fetchImages();
  }, []);

  // Auto scroll logic
  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [images]);

  const startAutoScroll = () => {
    stopAutoScroll(); // Clear old interval first
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Manual button handlers
  const goNext = () => {
    stopAutoScroll();
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(startAutoScroll, 5000);
  };

  const goPrev = () => {
    stopAutoScroll();
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
    setTimeout(startAutoScroll, 5000);
  };

  if (images.length === 0) {
    return <p className="text-center mt-20 text-gray-500">Loading images...</p>;
  }

  return (
    <div
      className="
        relative w-full 
        h-[30vh] 
        sm:h-[45vh] 
        md:h-[60vh] 
        lg:h-[80vh] 
        xl:h-[90vh] 
        overflow-hidden
      "
    >
      {/* Images */}
      {images.map((img, index) => (
        <img
          key={img.id}
          src={img.url}
          alt="Carousel Image"
          className={`
            absolute inset-0 
            w-full h-full 
            object-cover 
            transition-opacity duration-700 
            ${index === currentIndex ? "opacity-100" : "opacity-0"}
          `}
        />
      ))}

      {/* Left Button */}
      <button
        onClick={goPrev}
        className="
          absolute top-1/2 -translate-y-1/2 left-4 
          bg-black/50 text-white p-3 rounded-full 
          hover:bg-black/80 transition
        "
      >
        ❮
      </button>

      {/* Right Button */}
      <button
        onClick={goNext}
        className="
          absolute top-1/2 -translate-y-1/2 right-4 
          bg-black/50 text-white p-3 rounded-full 
          hover:bg-black/80 transition
        "
      >
        ❯
      </button>
    </div>
  );
}
