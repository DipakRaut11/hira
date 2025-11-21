"use client";

export default function ProjectCard({ project }: { project: any }) {
  return (
    <div className="relative group rounded-xl overflow-hidden shadow-lg bg-gray-900 border border-gray-700 transition transform hover:scale-[1.02]">
      {/* Image */}
      {project.image && (
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-56 object-cover transition group-hover:brightness-75"
        />
      )}

      {/* Video (optional) */}
      {project.video && (
        <video
          src={project.video}
          controls
          className="w-full h-56 object-cover mt-2"
        />
      )}

      <div className="p-4 space-y-2">
        <h3 className="text-white text-xl font-semibold">{project.name}</h3>
        <p className="text-gray-300 text-sm">Client: {project.client}</p>
        <p className="text-gray-300 text-sm">
          Province: {project.province?.name || "N/A"}
        </p>
        <p className="text-gray-300 text-sm">
          District: {project.district?.name || "N/A"}
        </p>
        <p className="text-gray-300 text-sm">
          Status: {project.status}
        </p>
        <p className="text-gray-300 text-sm">
          Start: {new Date(project.startDate).toLocaleDateString()}
        </p>
        {project.completedDate && (
          <p className="text-gray-300 text-sm">
            Completed: {new Date(project.completedDate).toLocaleDateString()}
          </p>
        )}
        <p className="text-gray-300 text-sm">{project.description}</p>
      </div>
    </div>
  );
}
