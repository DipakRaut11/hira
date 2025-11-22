"use client";
import { useState, useEffect } from "react";
import NewsCard from "./NewsEventCard";

export default function NewsEventList() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/news-event");
      setNews(await res.json());
    }
    load();
  }, []);

  if (!news.length) return <p className="text-center text-gray-500 py-8">No news available.</p>;

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold text-center mb-8">Latest News</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
        {news.map((n) => <NewsCard key={n.id} news={n} />)}
      </div>
    </div>
  );
}
