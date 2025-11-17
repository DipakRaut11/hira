"use client";

import { useEffect, useState } from "react";

export default function AdminCompanyInfoPage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

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

  async function handleSave() {
    try {
      await fetch("/api/companyInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      alert("Saved!");
    } catch (err) {
      alert("Failed to save");
      console.error(err);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-3">Edit Company Description</h2>

      <textarea
        className="border p-3 rounded w-full h-40"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter company description..."
      />

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
}
