"use client";
import { useEffect, useState } from "react";

type ProjectType = {
  id: number;
  name: string;
  client: string;
  provinceId: number | null;
  districtId: number | null;
  startDate: string | null;
  completedDate: string | null;
  status: string | null;
  description: string | null;
  image: string[]; // stored urls like /uploads/projects/...
  video: string | null;
  createdAt?: string;
};

export default function AdminProjectsPage() {
  // form state (used for both create and update)
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [completedDate, setCompletedDate] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");

  // files
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  // preview of new/local files
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // lists
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);

  // edit mode
  const [editingId, setEditingId] = useState<number | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]); // urls from DB
  const [existingVideo, setExistingVideo] = useState<string | null>(null);

  // fetch provinces and projects on mount
  useEffect(() => {
    fetch("/api/provinces")
      .then((r) => r.json())
      .then((d) => setProvinces(d || []))
      .catch((e) => console.error(e));

    loadProjects();
  }, []);

  // fetch districts when province changes
  useEffect(() => {
    if (!provinceId) {
      setDistricts([]);
      setDistrictId("");
      return;
    }
    fetch(`/api/districts/${provinceId}`)
      .then((r) => r.json())
      .then((d) => setDistricts(d || []))
      .catch((e) => console.error(e));
  }, [provinceId]);

  // update image previews when images state changes (local file selection)
  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);

    // cleanup object urls on unmount/when images change
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
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

  // load projects from server
  async function loadProjects() {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data || []);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  }

  // handle selection of local image files
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
    // when selecting new images in edit mode, we will replace existing images on server
    // so clear existingImages previews only visually (but keep them stored until save)
  };

  // handle create or update submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // required validation (same as your original)
    if (!name || !client || !provinceId || !districtId || !startDate || !status || !description || (images.length === 0 && !editingId && existingImages.length === 0)) {
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

    // For create: images must be appended (your POST expects them)
    // For update: appending images will replace old ones (your PUT deletes old images if new images present).
    images.forEach((file) => formData.append("images", file));
    if (video) formData.append("video", video);

    try {
      let res: Response;
      if (editingId) {
        // update
        res = await fetch(`/api/projects/${editingId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // create
        res = await fetch("/api/projects", {
          method: "POST",
          body: formData,
        });
      }

      if (res.ok) {
        if (editingId) {
          alert("Project updated successfully!");
        } else {
          alert("Project Added Successfully!");
        }
        // reset form and reload list
        resetForm();
        await loadProjects();
      } else {
        const errText = await res.text();
        console.error("Server error:", errText);
        alert("Error: Failed to save project.");
      }
    } catch (err) {
      console.error(err);
      alert("Error: Failed to save project.");
    }
  };

  // reset form state (keep provinces/districts)
  function resetForm() {
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
    setImagePreviews([]);
    setVideoPreview(null);

    setEditingId(null);
    setExistingImages([]);
    setExistingVideo(null);
  }

  // start editing a given project (prefill form)
  function startEdit(project: ProjectType) {
    setEditingId(project.id);
    setName(project.name);
    setClient(project.client);
    setProvinceId(project.provinceId ? String(project.provinceId) : "");
    setDistrictId(project.districtId ? String(project.districtId) : "");
    setStartDate(project.startDate ? project.startDate.split("T")[0] : "");
    setCompletedDate(project.completedDate ? project.completedDate.split("T")[0] : "");
    setStatus(project.status ?? "");
    setDescription(project.description ?? "");
    setExistingImages(project.image || []);
    setExistingVideo(project.video ?? null);

    // clear any selected local files (unless admin wants to change)
    setImages([]);
    setVideo(null);
  }

  // delete project
  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Project deleted successfully");
        await loadProjects();
      } else {
        alert("Failed to delete project");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete project");
    }
  }

  // remove a single existing image visually (won't affect server until you submit update):
  function removeExistingImage(idx: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="w-full p-6 md:p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-center text-slate-800 mb-4">
            {editingId ? "Edit Project" : "Add New Project"}
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
            <label className="text-slate-700 font-semibold mb-1 block">
              Project Images (Multiple) {editingId ? <span className="text-sm text-gray-500">(Leave blank to keep existing)</span> : null}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="border border-gray-300 p-3 w-full rounded bg-white text-slate-700"
              onChange={handleImageChange}
            />

            {/* show existing images (from DB) when editing */}
            {editingId && existingImages.length > 0 && (
              <div className="mt-3">
                <div className="text-sm text-slate-600 mb-2">Existing Images (will be replaced if you upload new ones):</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {existingImages.map((src, idx) => (
                    <div key={idx} className="relative">
                      <img src={src} className="aspect-square w-full object-cover rounded-md border" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute top-1 right-1 bg-white/90 text-red-600 px-2 py-1 rounded text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* local previews for newly-selected images */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                {imagePreviews.map((u, idx) => (
                  <img key={idx} src={u} className="aspect-square w-full object-cover rounded-md border" />
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-slate-700 font-semibold mb-1 block">
              Video (Optional) {editingId ? <span className="text-sm text-gray-500">(Leave blank to keep existing)</span> : null}
            </label>
            <input
              type="file"
              accept="video/*"
              className="border border-gray-300 p-3 w-full rounded bg-white text-slate-700"
              onChange={(e) => setVideo(e.target.files?.[0] || null)}
            />

            {/* existing video preview */}
            {editingId && existingVideo && !videoPreview && (
              <div className="mt-3">
                <div className="text-sm text-slate-600 mb-2">Existing Video (will be replaced if you upload new one):</div>
                <video src={existingVideo} className="w-full max-h-48 rounded" controls />
              </div>
            )}

            {/* local video preview */}
            {videoPreview && (
              <div className="mt-3">
                <video src={videoPreview} className="w-full max-h-48 rounded" controls />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition text-lg flex-1"
            >
              {editingId ? "Update Project" : "Save Project"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-slate-700 py-3 rounded-md hover:bg-gray-300 transition text-lg px-4"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* ---------- PROJECT LIST ---------- */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Projects</h2>

          {loading ? (
            <div className="p-6 bg-white rounded shadow text-center">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="p-6 bg-white rounded shadow text-center">No projects available yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded shadow-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-3">#</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Client</th>
                    <th className="p-3 hidden sm:table-cell">Province</th>
                    <th className="p-3 hidden sm:table-cell">District</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p, idx) => (
                    <tr key={p.id} className="border-b">
                      <td className="p-3 align-top">{idx + 1}</td>
                      <td className="p-3 align-top">{p.name}</td>
                      <td className="p-3 align-top">{p.client}</td>
                      <td className="p-3 align-top hidden sm:table-cell">{/* province name available via include? */}{/* If your API returns province.name, use p.province?.name */}</td>
                      <td className="p-3 align-top hidden sm:table-cell">{/* same for district */}</td>
                      <td className="p-3 align-top">{p.status}</td>
                      <td className="p-3 align-top">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(p)}
                            className="px-3 py-1 rounded bg-yellow-400 text-white hover:brightness-90"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="px-3 py-1 rounded bg-red-500 text-white hover:brightness-90"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              // quick view open: prefill editing form in view-only if desired
                              startEdit(p);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="px-3 py-1 rounded bg-slate-200 text-slate-800"
                          >
                            Open
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   Small presentational inputs
   --------------------------- */
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
