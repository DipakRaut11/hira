"use client";
import React, { useEffect, useState, useRef } from "react";

export default function ImageCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    // auto-advance every 3s
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [images]);

  if (!images || images.length === 0) {
    return <div className="w-full h-48 flex items-center justify-center text-gray-400">No images</div>;
  }

  return (
    <div>
      <div className="w-full h-64 mb-3 overflow-hidden rounded">
        <img src={images[index]} className="w-full h-full object-cover" alt={`slide-${index}`} />
      </div>

      {/* thumbnails */}
      <div className="flex gap-2 overflow-x-auto py-1">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`flex-shrink-0 w-20 h-12 rounded overflow-hidden border ${i === index ? "ring-2 ring-offset-1 ring-blue-500" : "border-slate-700"}`}
          >
            <img src={src} className="w-full h-full object-cover" alt={`thumb-${i}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
