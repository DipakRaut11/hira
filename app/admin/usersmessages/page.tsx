import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { id: "desc" } });

  return (
    // <main className="pt-24 p-6">
    //   <h1 className="text-3xl font-bold mb-6">Messages Inbox</h1>

    //   {messages.map((m) => (
    //     <div key={m.id} className="p-4 border rounded mb-4">
    //       <h2 className="font-bold">{m.name} ({m.email})</h2>
    //       <p>📞 {m.phone}</p>
    //       <p>Subject: {m.subject}</p>
    //       <p className="mt-2">{m.message}</p>
    //       <p className="text-sm text-gray-500 mt-2">{new Date(m.createdAt).toLocaleString()}</p>
    //     </div>
    //   ))}
    // </main>
    <h1>Inbox</h1>
  );
}
