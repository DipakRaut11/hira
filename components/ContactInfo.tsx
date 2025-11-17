"use client";

export default function ContactInfo() {
  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold">Contact Information</h2>

      <div className="space-y-4">
        <p>
          📞 <a href="tel:+9779800000000" className="text-blue-600 hover:underline">
            +977 9800000000
          </a>
        </p>

        <p>
          💬 <a href="https://wa.me/9800000000" target="_blank" className="text-green-600 hover:underline">
            WhatsApp Chat
          </a>
        </p>

        <p>
          📧 <a href="mailto:info@mywebsite.com" className="text-blue-700 hover:underline">
            info@mywebsite.com
          </a>
        </p>

        <p>
          📍 <a href="https://maps.google.com/?q=Kathmandu Nepal" target="_blank" className="text-red-600 hover:underline">
            Kathmandu, Nepal
          </a>
        </p>
      </div>
    </div>
  );
}
