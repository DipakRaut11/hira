"use client";

import { useState } from "react";

export default function ImageUploadForm({ onUpload }: { onUpload: () => void }) {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/heroimages",
       { method: "POST",
        
        body: formData });
    setFile(null);
    onUpload();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>
    </form>
  );
}
