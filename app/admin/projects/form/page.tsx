"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProjectType = {
  id?: number;
  name: string;
  client: string;
  provinceId: number | "";
  districtId: number | "";
  startDate: string;
  completedDate: string;
  status: string;
  description: string;
  image: string[];
  video: string | null;
};

export default function AdminProjectFormPage({ projectId }: { projectId?: string }) {
  const router = useRouter();

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

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/provinces")
      .then((r) => r.json())
      .then((d) => setProvinces(d || []));
  }, []);

  useEffect(() => {
    if (!provinceId) {
      setDistricts([]);
      setDistrictId("");
      return;
    }
    fetch(`/api/districts/${provinceId}`)
      .then((r) => r.json())
      .then((d) => setDistricts(d || []));
  }, [provinceId]);

  // Load project data if editing
  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/projects/${projectId}`)
      .then((r) => r.json())
      .then((p) => {
        setName(p.name);
        setClient(p.client);
        setProvinceId(p.provinceId || "");
        setDistrictId(p.districtId || "");
        setStartDate(p.startDate?.split("T")[0] || "");
        setCompletedDate(p.completedDate?.split("T")[0] || "");
        setStatus(p.status || "");
        setDescription(p.description || "");
      });
  }, [projectId]);

  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  useEffect(() => {
    if (video) {
      const url = URL.createObjectURL(video);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoPreview(null);
    }
  }, [video]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("client", client);
    formData.append("provinceId", provinceId);
    formData.append("districtId", districtId);
    formData.append("startDate", startDate);
    formData.append("completedDate", completedDate);
    formData.append("status", status);
    formData.append("description", description);
    images.forEach((f) => formData.append("images", f));
    if (video) formData.append("video", video);

    try {
      const res = await fetch(projectId ? `/api/projects/${projectId}` : "/api/projects", {
        method: projectId ? "PUT" : "POST",
        body: formData,
      });

      if (res.ok) {
        alert(projectId ? "Project updated" : "Project created");
        router.push("/admin/projects");
      } else {
        alert("Failed to save project");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save project");
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-slate-100 flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl p-6 bg-white rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-bold text-center">{projectId ? "Edit Project" : "Add Project"}</h1>

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
            className="border border-gray-300 p-3 w-full rounded bg-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Project Images</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files || []))} />
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {imagePreviews.map((u, idx) => (
                <img key={idx} src={u} className="w-full aspect-square object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        <div>
          <label>Video</label>
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] || null)} />
          {videoPreview && <video src={videoPreview} className="w-full max-h-48 mt-2" controls />}
        </div>

        <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          {projectId ? "Update Project" : "Save Project"}
        </button>
      </form>
    </div>
  );
}

/* ----- Small presentational inputs ----- */
function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="text-slate-700 mb-1 block">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="border p-2 w-full rounded" />
    </div>
  );
}

function Dropdown({ label, options, value, onChange, disabled = false }: any) {
  return (
    <div>
      <label className="text-slate-700 mb-1 block">{label}</label>
      <select disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)} className="border p-2 w-full rounded">
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
