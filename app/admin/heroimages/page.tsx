"use client";

import { useEffect, useState } from "react";
import ImageUploadForm from "@/components/HeroImageUploadForm";

export default function AdminImagesPage() {
  const [images, setImages] = useState<any[]>([]);

  const fetchImages = async () => {
    const res = await fetch("/api/heroimages");
    const data = await res.json();
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const deleteImage = async (id: number) => {
    try {
     // const res = await fetch(`/api/heroimages/${id}`, { method: "DELETE" });
      const res = await fetch(`/api/heroimages/${id}`, { method: "DELETE" });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to delete image:", data);
        alert("Failed to delete image: " + data.error);
        return;
      }

      console.log("Deleted image successfully:", data);
      await fetchImages(); // Refresh UI
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Error deleting image");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Home Page Images</h1>

      <ImageUploadForm onUpload={fetchImages} />

      <div className="grid grid-cols-3 gap-4 mt-6">
        {images.map((img) => (
          <div key={img.id} className="relative">
            <img
              src={img.url}
              alt="Uploaded"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
            <button
              onClick={() => deleteImage(img.id)}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
