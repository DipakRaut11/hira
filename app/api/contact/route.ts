import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: { name, email, phone, subject, message },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
