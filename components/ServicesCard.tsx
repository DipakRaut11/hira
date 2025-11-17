export default function ServicesCard({ service }: { service: any }) {
  return (
    <div className="relative group rounded-xl overflow-hidden shadow-lg cursor-pointer transition transform hover:scale-[1.03]">
      <img
        src={service.imageUrl}
        alt={service.name}
        className="w-full h-64 object-cover transition group-hover:brightness-75"
      />

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
        <h3 className="text-white text-xl font-semibold tracking-wide">
          {service.name}
        </h3>
      </div>
    </div>
  );
}
