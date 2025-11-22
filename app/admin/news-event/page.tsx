"use client";
import { useState, useEffect } from "react";

export default function AdminNewsPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    author: "",
    source: "",
    isPublished: false,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);

  useEffect(() => {
    async function loadNews() {
      const res = await fetch("/api/news-event");
      setNewsList(await res.json());
    }
    loadNews();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description || files.length === 0) return alert("All required fields must be filled");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v.toString()));
    files.forEach((f) => fd.append("images", f));

    const res = await fetch("/api/news-event", { method: "POST", body: fd });
    if (res.ok) {
      const newItem = await res.json();
      setNewsList([newItem, ...newsList]);
      setForm({ title: "", description: "", content: "", author: "", source: "", isPublished: false });
      setFiles([]);
      alert("News added!");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this news?")) return;
    await fetch(`/api/news/${id}`, { method: "DELETE" });
    setNewsList(newsList.filter((n) => n.id !== id));
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin News Management</h1>

      <form className="space-y-3" onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <input
            key={key}
            type={key === "isPublished" ? "checkbox" : "text"}
            placeholder={key}
            className="border p-2 w-full"
            checked={key === "isPublished" ? form.isPublished : undefined}
            value={key !== "isPublished" ? (form as any)[key] : undefined}
            onChange={(e) =>
              key === "isPublished"
                ? setForm({ ...form, isPublished: e.target.checked })
                : setForm({ ...form, [key]: e.target.value })
            }
          />
        ))}
        <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
        <button className="bg-green-600 text-white w-full py-2 rounded">Save</button>
      </form>

      <div className="space-y-3 mt-6">
        {newsList.map((n) => (
          <div key={n.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <h2 className="font-bold">{n.title}</h2>
              <p className="text-sm text-gray-600">{n.description}</p>
            </div>
            <button className="bg-red-500 px-3 py-1 text-white rounded" onClick={() => handleDelete(n.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
