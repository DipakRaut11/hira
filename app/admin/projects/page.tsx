"use client";
import { useEffect, useState } from "react";

export default function AdminProjectsPage() {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [completedDate, setCompletedDate] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    async function loadProvinces() {
      const res = await fetch("/api/provinces");
      const data = await res.json();
      setProvinces(data);
    }
    loadProvinces();
  }, []);

  useEffect(() => {
    if (!provinceId) {
      setDistricts([]);
      setDistrictId("");
      return;
    }
    async function loadDistricts() {
      const res = await fetch(`/api/districts/${provinceId}`);
      const data = await res.json();
      setDistricts(data);
    }
    loadDistricts();
  }, [provinceId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !client || !provinceId || !districtId || !startDate || !status || !description || !image)
      return alert("Please fill all required fields");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("client", client);
    formData.append("provinceId", provinceId);
    formData.append("districtId", districtId);
    formData.append("startDate", startDate);
    formData.append("completedDate", completedDate);
    formData.append("status", status);
    formData.append("description", description);
    formData.append("image", image);
    if (video) formData.append("video", video);

    const res = await fetch("/api/projects", { method: "POST", body: formData });

    if (res.ok) {
      alert("Project Added Successfully!");
      setName(""); setClient(""); setProvinceId(""); setDistrictId("");
      setStartDate(""); setCompletedDate(""); setStatus(""); setDescription("");
      setImage(null); setVideo(null);
    } else {
      alert("Error: Failed to add project.");
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-xl p-6 space-y-4 bg-gray-900 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center text-white mb-6">Add New Project</h1>

        {/** Project Name */}
        <div>
          <label className="text-white font-semibold mb-1 block">Project Name</label>
          <input
            className="border border-gray-600 p-3 w-full rounded bg-black text-white"
            placeholder="Enter project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/** Client Name */}
        <div>
          <label className="text-white font-semibold mb-1 block">Client Name</label>
          <input
            className="border border-gray-600 p-3 w-full rounded bg-black text-white"
            placeholder="Enter client name"
            value={client}
            onChange={(e) => setClient(e.target.value)}
          />
        </div>

        {/** Province */}
        <div>
          <label className="text-white font-semibold mb-1 block">Province</label>
          <select
            className="border border-gray-600 p-3 w-full rounded bg-black text-white"
            value={provinceId}
            onChange={(e) => setProvinceId(e.target.value)}
          >
            <option value="">Select Province</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/** District */}
        <div>
          <label className="text-white font-semibold mb-1 block">District</label>
          <select
            className="border border-gray-600 p-3 w-full rounded bg-black text-white"
            value={districtId}
            onChange={(e) => setDistrictId(e.target.value)}
            disabled={!provinceId}
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/** Start Date */}
        <div>
          <label className="text-white font-semibold mb-1 block">Start Date</label>
          <input
            type="date"
            className="border border-gray-600 p-3 w-full rounded bg-black text-white"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/** Completed Date */}
        <div>
          <label className="text-white font-semibold mb-1 block">Completed Date</label>
          <input
            type="date"
            className="border border-gray-600 p-3 w-full rounded bg-black text-white"
            value={completedDate}
            onChange={(e) => setCompletedDate(e.target.value)}
          />
        </div>

        {/** Status */}
        <div>
          <label className="text-white font-semibold mb-1 block">Status</label>
          <input
            className="border border-gray-600 p-3 w-full rounded bg-black text-white"
            placeholder="Enter project status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>

        {/** Description */}
        <div>
          <label className="text-white font-semibold mb-1 block">Description</label>
          <textarea
            className="border border-gray-600 p-3 w-full rounded bg-black text-white"
            placeholder="Enter project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/** Image */}
        <div>
          <label className="text-white font-semibold mb-1 block">Image</label>
          <input
            type="file"
            accept="image/*"
            className="border border-gray-600 p-3 w-full rounded bg-black text-white"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>

        {/** Video */}
        <div>
          <label className="text-white font-semibold mb-1 block">Video</label>
          <input
            type="file"
            accept="video/*"
            className="border border-gray-600 p-3 w-full rounded bg-black text-white"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-3 rounded hover:bg-green-700 transition"
        >
          Save Project
        </button>
      </form>
    </div>
  );
}
