"use client";
import { useState } from "react";

export default function AdminServicesPage() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !file) return alert("All fields required!");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    const res = await fetch("/api/services", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Service Added ");
      setName("");
      setFile(null);
    }
  }

  return (
    <form className="max-w-xl mx-auto p-6 space-y-4" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold">Add New Service</h1>

      <input
        className="border p-3 w-full rounded"
        placeholder="Service Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        className="border p-3 w-full rounded"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        type="submit"
        className="bg-green-600 text-white w-full py-3 rounded"
      >
        Save
      </button>
    </form>
  );
}
