import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { id: "desc" } });

  return (
    <main className="w-screen min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-[#8B5E3C]">Messages Inbox</h1>

      <div className="flex flex-col gap-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className="w-full bg-white shadow-md rounded-lg p-6 flex flex-col gap-2"
          >
            <h2 className="font-bold text-lg">{m.name}</h2>

            {/* Email on next line */}
            <a
              href={`mailto:${m.email}`}
              className="text-blue-600 hover:underline break-all"
            >
              {m.email}
            </a>

            {/* WhatsApp link for phone */}
            <a
              href={`https://wa.me/${m.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              📞 {m.phone}
            </a>

            <p className="font-semibold mt-2">Subject: {m.subject}</p>
            <p className="mt-1">{m.message}</p>

            <p className="text-sm text-gray-500 mt-2">
              {new Date(m.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
