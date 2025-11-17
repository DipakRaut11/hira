"use client";

import { useEffect, useState } from "react";

export default function HeroImageCarousel() {
  const [images, setImages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchImages() {
      const res = await fetch("/api/heroimages");
      const data = await res.json();
      setImages(data);
    }
    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) {
    return <p className="text-center mt-20 text-gray-500">No images available</p>;
  }

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {images.map((img, index) => (
        <img
          key={img.id}
          src={img.url}
          alt="Carousel"
          className={`absolute w-full h-full object-cover transition-all duration-700 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
