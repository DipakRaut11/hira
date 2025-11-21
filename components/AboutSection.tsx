"use client";

import { useEffect, useState } from "react";

export default function AboutSection() {
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/companyInfo");
        const json = await res.json();
        setDescription(json?.description || "");
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div className="px-10 py-20 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 items-start">
        {/* Logo */}
        <div className="flex justify-center md:justify-start">
          <img src="/logo.png" alt="Logo" className="w-64 object-contain" />
        </div>

        {/* Description */}
        <div className="text-lg text-gray-700 leading-relaxed">
          {description || "No description provided yet."}
        </div>
      </div>
    </div>
  );
}
  