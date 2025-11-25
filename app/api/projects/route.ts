export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        province: {
          select: { name: true },
        },
        district: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST a new project
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Required fields
    const name = formData.get("name") as string;
    const client = formData.get("client") as string;
    const provinceId = Number(formData.get("provinceId"));
    const districtId = Number(formData.get("districtId"));
    const startDateStr = formData.get("startDate") as string;
    const completedDateStr = formData.get("completedDate") as string | null;
    const status = formData.get("status") as string;
    const description = formData.get("description") as string;

    const imageFile = formData.getAll("images") as File[];
    const videoFile = formData.get("video") as File | null;

    if (!name || !client || !provinceId || !districtId || !startDateStr || !status || !description || !imageFile) {
      return NextResponse.json({ error: "All required fields are missing" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads/projects");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Async function to save a file
    const saveFile = async (file: File): Promise<string> => {
      const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadDir, safeName);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      return `/uploads/projects/${safeName}`;
    };

    // Save files
    const imageUrls: string[] = [];
    for (const file of imageFile) {
      const url = await saveFile(file);
      imageUrls.push(url);
    }

    const videoUrl = videoFile ? await saveFile(videoFile) : null;

    // Create project in DB
    const newProject = await prisma.project.create({
      data: {
        name,
        client,
        provinceId,
        districtId,
        startDate: new Date(startDateStr),
        completedDate: completedDateStr ? new Date(completedDateStr) : null,
        status,
        description,
        image: imageUrls,
        video: videoUrl,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
