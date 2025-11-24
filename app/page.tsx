import Image from "next/image";
import HeroImageCarousel from "@/components/HeroImageCarousel";
import AboutSection from "@/components/AboutSection";
import ServiceList from "@/components/ServicesList";

export default function Home() {
  return (
    // remove h-screen; keep normal flow so page grows with content
    <main className="flex flex-col">
      <HeroImageCarousel />

      {/* center and constrain width for inner sections */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <AboutSection />
        <ServiceList />
      </div>
    </main>
  );
}
