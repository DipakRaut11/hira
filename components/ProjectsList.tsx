"use client";
import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectsList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400 py-8">Loading projects...</p>;
  }

  if (!projects.length) {
    return <p className="text-center text-gray-500 py-8">No projects available yet.</p>;
  }

  return (
    <div className="mt-10 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center text-white mb-8">Our Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
