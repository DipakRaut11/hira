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
    <div className="flex items-center justify-center px-10 py-20 gap-10 bg-gray-100">
      <div className="w-1/2 flex justify-center">
        <img src="/logo.png" alt="Logo" className="w-64 object-contain" />
      </div>

      <div className="w-1/2 text-lg text-gray-700 leading-relaxed">
        {description || "No description provided yet."}
      </div>
    </div>
  );
}
