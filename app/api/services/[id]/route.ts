import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

  return NextResponse.json(service);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const body = await request.json();
  if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const updated = await prisma.service.update({
    where: { id },
    data: { name: body.name },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    // Remove file
    const filePath = path.join(process.cwd(), "public", service.imageUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.service.delete({ where: { id } });

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
