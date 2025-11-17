"use client";

import { useEffect, useState } from "react";
import ServicesCard from "./ServicesCard";

export default function ServicesList() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    }

    load();
  }, []);

  if (!services.length) {
    return (
      <p className="text-center text-gray-500 py-8">
        No services available yet.
      </p>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
        {services.map((service) => (
          <ServicesCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
