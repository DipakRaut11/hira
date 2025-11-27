"use client";

import { useEffect, useState, useRef } from "react";

export default function AdminCompanyInfoPage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/companyInfo");
        const json = await res.json();
        setDescription(json?.description || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [description]);

  async function handleSave() {
    try {
      await fetch("/api/companyInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      alert("Company information updated successfully!");
    } catch (err) {
      alert("Failed to update. Try again.");
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500">
        Loading company info...
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-white pt-[4.5rem] lg:pt-[6rem] px-4 lg:px-6">
      <h1 className="text-3xl font-bold text-[#8B5E3C] mb-4 border-b border-[#C3A68A]/50 pb-2">
        Company Information
      </h1>

      {/* Auto-resizing textarea */}
      <textarea
        ref={textareaRef}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Write about the company..."
        className="w-full p-4 border-4 border-gray-400 rounded-lg resize-none text-gray-900
          focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/60 focus:border-[#8B5E3C] overflow-hidden"
      />

      {/* Buttons */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSave}
          className="bg-[#8B5E3C] hover:bg-[#6E472C] text-white font-semibold px-6 py-3 rounded-lg transition-all"
        >
          Save Changes
        </button>

        <button
          onClick={() => setDescription("")}
          className="border border-gray-500 hover:bg-gray-100 px-6 py-3 rounded-lg text-gray-700 transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
