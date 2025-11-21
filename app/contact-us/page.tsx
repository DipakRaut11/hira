import ContactInfo from "@/components/ContactInfo";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="pt-24 p-6">
      <h1 className="text-4xl font-bold text-center mb-10">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <ContactInfo />
        <ContactForm />
      </div>
    </main>
  );
}
