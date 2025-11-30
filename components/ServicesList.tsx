"use client";

import { useEffect, useState, useRef } from "react";
import ServicesCard from "./ServicesCard";

export default function ServicesList() {
  const [services, setServices] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    }
    load();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth / 3, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth / 3, behavior: "smooth" });
    }
  };

  if (!services.length) {
    return (
      <p className="text-center text-gray-500 py-8">
        No services available yet.
      </p>
    );
  }

  return (
    <div className="mt-10 relative">
      <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>

      <div className="relative">
        {/* Scrollable container with padding on sides for arrows */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 px-16 scroll-smooth hide-scrollbar"
        >
          {services.map((service) => (
            <div key={service.id} className="flex-shrink-0 w-80">
              <ServicesCard service={service} />
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute top-1/2 -translate-y-1/2 left-2 bg-white/70 hover:bg-white/90 rounded-full p-2 shadow-md z-20"
        >
          &#8592;
        </button>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute top-1/2 -translate-y-1/2 right-2 bg-white/70 hover:bg-white/90 rounded-full p-2 shadow-md z-20"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
