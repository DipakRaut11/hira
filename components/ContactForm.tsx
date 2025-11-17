"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  async function submitForm(e: any) {
    e.preventDefault();
    setStatus("Sending...");

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setStatus("Message sent successfully! 🎉");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } else {
      setStatus("❌ Failed to send message");
    }
  }

  return (
    <form onSubmit={submitForm} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold">Get In Touch</h2>

      <input
        type="text"
        placeholder="Full Name"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full p-2 border rounded"
      />

      <input
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full p-2 border rounded"
      />

      <input
        type="tel"
        placeholder="Phone Number"
        required
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Subject"
        required
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
        className="w-full p-2 border rounded"
      />

      <textarea
        rows={4}
        placeholder="Your Message"
        required
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full p-2 border rounded"
      ></textarea>

      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Send Message
      </button>

      {status && <p className="text-center pt-2 text-gray-600">{status}</p>}
    </form>
  );
}
