"use client";
import { useState, useEffect, useRef } from "react";
import NewsCard from "./NewsEventCard";
import NewsDetails from "./NewsDetail";

export default function NewsList() {
  const [news, setNews] = useState<any[]>([]);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/news-event");
        const data = await res.json();
        setNews(data);
        if (data.length > 0) setSelectedNews(data[0]);
      } catch (err) {
        console.error(err);
      }
    }
    loadNews();
  }, []);

  // Scroll to news details when selected
  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedNews]);

  // Show back-to-top button on scroll
  useEffect(() => {
    const handleScroll = () => setShowTopButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!news.length) return <p className="text-center text-gray-500 py-10">No news available.</p>;

  return (
    <div className="mt-6 px-4 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: News List */}
        <div className="space-y-3 max-h-[80vh] overflow-auto border p-4 rounded-lg">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} onSelect={setSelectedNews} />
          ))}
        </div>

        {/* RIGHT: News Details */}
        <div className="lg:col-span-2">
          <div ref={detailsRef}>
            <NewsDetails news={selectedNews} />
          </div>
        </div>
      </div>

      {/* Back to top button */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
          title="Back to Top"
        >
          ↑
        </button>
      )}
    </div>
  );
}
