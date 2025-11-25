"use client";
import React from "react";
import VideoCard from "./VideoCard";

export default function VideoGrid({
  projects,
  playingId,
  setPlayingId,
  onOpenProject,
}: {
  projects: any[];
  playingId: number | null;
  setPlayingId: (id: number | null) => void;
  onOpenProject: (project: any) => void;
}) {
  // Filter projects to those that have a video OR fallback images (you can decide)
  // If you only want to show projects that have `video`, filter by p.video truthy
  const videoOnlyProjects = projects.filter((p) => p.video); // change if you want to include image-only

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videoOnlyProjects.map((project: any) => (
        <VideoCard
          key={project.id}
          project={project}
          isPlaying={playingId === project.id}
          onHoverStart={() => setPlayingId(project.id)}
          onHoverEnd={() => setPlayingId(null)}
          onClick={() => onOpenProject(project)}
        />
      ))}
    </div>
  );
}
