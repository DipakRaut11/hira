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

  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/provinces")
      .then((res) => res.json())
      .then(setProvinces);
  }, []);

  useEffect(() => {
    if (!provinceId) {
      setDistricts([]);
      setDistrictId("");
      return;
    }
    fetch(`/api/districts/${provinceId}`)
      .then((res) => res.json())
      .then(setDistricts);
  }, [provinceId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !client || !provinceId || !districtId || !startDate || !status || !description || images.length === 0) {
      return alert("Please fill all required fields");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("client", client);
    formData.append("provinceId", provinceId);
    formData.append("districtId", districtId);
    formData.append("startDate", startDate);
    formData.append("completedDate", completedDate);
    formData.append("status", status);
    formData.append("description", description);

    images.forEach((file) => formData.append("images", file));
    if (video) formData.append("video", video);

    const res = await fetch("/api/projects", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Project Added Successfully!");
      setName(""); 
      setClient(""); 
      setProvinceId(""); 
      setDistrictId("");
      setStartDate(""); 
      setCompletedDate(""); 
      setStatus(""); 
      setDescription("");
      setImages([]); 
      setVideo(null);
    } else {
      alert("Error: Failed to add project.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:max-w-xl md:max-w-3xl p-6 md:p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <h1 className="text-xl sm:text-2xl font-bold text-center text-slate-800 mb-4">
          Add New Project
        </h1>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Project Name" value={name} onChange={setName} />
          <Input label="Client Name" value={client} onChange={setClient} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Dropdown label="Province" options={provinces} value={provinceId} onChange={setProvinceId} />
          <Dropdown label="District" options={districts} value={districtId} onChange={setDistrictId} disabled={!provinceId} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input type="date" label="Start Date" value={startDate} onChange={setStartDate} />
          <Input type="date" label="Completed Date" value={completedDate} onChange={setCompletedDate} />
        </div>

        <Input label="Status" value={status} onChange={setStatus} />

        <div>
          <label className="text-slate-700 font-semibold mb-1 block">Description</label>
          <textarea
            className="border border-gray-300 p-3 w-full rounded bg-white text-slate-700 min-h-[120px]"
            placeholder="Enter project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="text-slate-700 font-semibold mb-1 block">Project Images (Multiple)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="border border-gray-300 p-3 w-full rounded bg-white text-slate-700"
            onChange={handleImageChange}
          />

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                className="aspect-square w-full object-cover rounded-md border"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-slate-700 font-semibold mb-1 block">Video (Optional)</label>
          <input
            type="file"
            accept="video/*"
            className="border border-gray-300 p-3 w-full rounded bg-white text-slate-700"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded-md hover:bg-blue-700 transition text-lg"
        >
          Save Project
        </button>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="text-slate-700 font-semibold mb-1 block">{label}</label>
      <input
        type={type}
        className="border border-gray-300 p-3 w-full rounded bg-white text-slate-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Dropdown({ label, options, value, onChange, disabled = false }: any) {
  return (
    <div>
      <label className="text-slate-700 font-semibold mb-1 block">{label}</label>
      <select
        disabled={disabled}
        className="border border-gray-300 p-3 w-full rounded bg-white text-slate-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select {label}</option>
        {options.map((o: any) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}
