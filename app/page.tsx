import Image from "next/image";
import HeroImageCarousel from "@/components/HeroImageCarousel";
import AboutSection from "@/components/AboutSection";
import ServiceList from "@/components/ServicesList";
import ContactInfo from "@/components/footer/ContactInfo";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroImageCarousel />
         <AboutSection /> 
         <ServiceList />


    </main>
  );
}

