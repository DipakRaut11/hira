import ServicesCard from "@/components/ServicesCard";

async function getServices() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/services`);
  return res.json();
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-12">
      {services.map((service: any) => (
        <ServicesCard key={service.id} service={service} />
      ))}
    </div>
  );
}
