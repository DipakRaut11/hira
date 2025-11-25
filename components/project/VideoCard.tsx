"use client";
import React, { useEffect, useRef } from "react";

export default function VideoCard({
  project,
  isPlaying,
  onHoverStart,
  onHoverEnd,
  onClick,
}: {
  project: any;
  isPlaying: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // When isPlaying toggles, play or pause accordingly.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isPlaying) {
      // try play (muted autoplay required)
      v.muted = true;
      const playPromise = v.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((e) => {
          // autoplay might be blocked; keep muted and try again
          v.muted = true;
        });
      }
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [isPlaying]);

  // If user hovers, call onHoverStart / onHoverEnd (parent will set playingId)
  return (
    <div
      className="relative group rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-gray-700 cursor-pointer"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onClick={onClick}
      aria-label={`Open ${project.name}`}
    >
      {/* video player (muted, no controls in grid) */}
      {project.video ? (
        <video
          ref={videoRef}
          src={project.video}
          poster={project.image && project.image.length ? project.image[0] : undefined}
          playsInline
          muted
          loop
          className="w-full h-56 object-cover transition group-hover:brightness-75"
          // don't show controls here — detail panel has controls
        />
      ) : (
        // fallback: show first image if no video (optional)
        project.image && project.image.length ? (
          <img
            src={project.image[0]}
            alt={project.name}
            className="w-full h-56 object-cover transition group-hover:brightness-75"
          />
        ) : (
          <div className="w-full h-56 flex items-center justify-center text-gray-400">
            No media
          </div>
        )
      )}

      <div className="p-3 space-y-1">
        <h3 className="text-white text-lg font-semibold truncate">{project.name}</h3>
        <p className="text-gray-300 text-sm truncate">Client: {project.client}</p>
      </div>
    </div>
  );
}
