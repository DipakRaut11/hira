"use client";
import React, { useEffect, useState } from "react";
import VideoGrid from "./VideoGrid";
import ProjectDetailPanel from "./ProjectDetailPanel";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null); // which video is currently playing (hover)
  const [selectedProject, setSelectedProject] = useState<any | null>(null); // clicked project for detail panel

  useEffect(() => {
    async function load() {
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
    load();
  }, []);

  return (
    <div className="px-4 md:px-8 py-8">
      <h2 className="text-3xl font-bold text-center text-white mb-8">Our Projects</h2>

      {loading ? (
        <p className="text-center text-gray-400 py-8">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No projects available yet.</p>
      ) : (
        <>
          <VideoGrid
            projects={projects}
            playingId={playingId}
            setPlayingId={setPlayingId}
            onOpenProject={(p) => setSelectedProject(p)}
          />
        </>
      )}

      {/* Detail panel overlay — open when selectedProject !== null */}
      {selectedProject && (
        <ProjectDetailPanel
          project={selectedProject}
          projects={projects}
          onClose={() => setSelectedProject(null)}
          onSelectProject={(p) => setSelectedProject(p)}
        />
      )}
    </div>
  );
}
