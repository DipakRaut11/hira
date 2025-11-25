"use client";
import React, { useEffect, useRef, useState } from "react";
import ImageCarousel from "./ImageCarousel";

export default function ProjectDetailPanel({
  project,
  projects,
  onClose,
  onSelectProject,
}: {
  project: any;
  projects: any[];
  onClose: () => void;
  onSelectProject: (p: any) => void;
}) {
  const [current, setCurrent] = useState<any>(project);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // When current changes, play it automatically (with controls) and scroll to top of panel
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => {
      // autoplay might be blocked by browser — user can click to play
    });
  }, [current]);

  // Keep panel in view
  useEffect(() => {
    const el = document.getElementById("project-detail-panel");
    if (el) el.scrollTo({ top: 0, behavior: "smooth" });
  }, [current]);

  return (
    <div
      id="project-detail-panel"
      className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center p-6 overflow-auto"
      onClick={(e) => {
        // close when clicking backdrop (but not when clicking inside content)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-6xl bg-slate-900 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left: Player + images + details */}
          <div className="lg:w-2/3 w-full bg-black">
            <div className="relative">
              {current.video ? (
                <video
                  ref={videoRef}
                  src={current.video}
                  controls
                  className="w-full h-96 object-cover bg-black"
                />
              ) : current.image && current.image.length ? (
                <img src={current.image[0]} className="w-full h-96 object-cover" alt={current.name} />
              ) : (
                <div className="w-full h-96 flex items-center justify-center text-gray-400">
                  No media
                </div>
              )}
            </div>

            {/* Images carousel below player */}
            <div className="p-4 bg-slate-800">
              <ImageCarousel images={current.image || []} />
            </div>

            {/* Project details */}
            <div className="p-4 text-slate-200 space-y-2">
              <h2 className="text-2xl font-semibold">{current.name}</h2>
              <p className="text-sm text-slate-300">Client: {current.client}</p>
              <p className="text-sm text-slate-300">
                Province: {current.province?.name || "N/A"} • District: {current.district?.name || "N/A"}
              </p>
              <p className="text-sm text-slate-300">Status: {current.status}</p>
              <p className="text-sm text-slate-300">
                Start: {current.startDate ? new Date(current.startDate).toLocaleDateString() : "N/A"}
              </p>
              {current.completedDate && (
                <p className="text-sm text-slate-300">
                  Completed: {new Date(current.completedDate).toLocaleDateString()}
                </p>
              )}
              <div className="pt-2 text-slate-200">{current.description}</div>
            </div>
          </div>

          {/* Right: list of other projects */}
          <div className="lg:w-1/3 w-full border-l border-slate-700 bg-slate-900 p-4 overflow-auto max-h-[80vh]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Other Projects</h3>
              <button
                className="text-sm text-slate-300 hover:text-white"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className={`flex gap-3 p-2 rounded hover:bg-slate-800 cursor-pointer ${
                    p.id === current.id ? "bg-slate-800" : ""
                  }`}
                  onClick={() => {
                    setCurrent(p);
                    // scroll small list to top to show selection
                    const container = document.getElementById("project-detail-panel");
                    if (container) container.scrollTo({ top: 0, behavior: "smooth" });
                    onSelectProject(p);
                  }}
                >
                  <div className="w-28 h-16 bg-black flex-shrink-0">
                    {p.video ? (
                      <video src={p.video} className="w-full h-full object-cover" muted />
                    ) : p.image && p.image.length ? (
                      <img src={p.image[0]} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium truncate">{p.name}</div>
                    <div className="text-slate-300 text-sm truncate">Client: {p.client}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
