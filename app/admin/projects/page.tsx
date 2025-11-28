"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type ProjectType = {
  id: number;
  name: string;
  client: string;
  province?: { name: string };
  district?: { name: string };
  status?: string;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

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

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this project?")) return;
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

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          <Link
            href="/admin/projects/form"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add New Project
          </Link>
        </div>

        {loading ? (
          <div className="p-6 bg-white rounded shadow text-center">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-6 bg-white rounded shadow text-center">No projects available yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-3">S.N</th>
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
                    <td className="p-3 align-top hidden sm:table-cell">{p.province?.name}</td>
                    <td className="p-3 align-top hidden sm:table-cell">{p.district?.name}</td>
                    <td className="p-3 align-top">{p.status}</td>
                    <td className="p-3 align-top flex gap-2">
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        className="px-3 py-1 rounded bg-yellow-400 text-white hover:brightness-90"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 rounded bg-red-500 text-white hover:brightness-90"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
