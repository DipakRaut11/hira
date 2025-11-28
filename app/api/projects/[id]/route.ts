export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

// GET single project
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = Number(params.id);
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        province: {
          select: { name: true },
        },
        district: {
          select: { name: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// UPDATE PROJECT (PUT)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = Number(id);
    const formData = await request.formData();

    // Fetch existing project
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Extract fields
    const name = formData.get("name") as string | null;
    const client = formData.get("client") as string | null;
    const provinceId = formData.get("provinceId") ? Number(formData.get("provinceId")) : null;
    const districtId = formData.get("districtId") ? Number(formData.get("districtId")) : null;
    const startDateStr = formData.get("startDate") as string | null;
    const completedDateStr = formData.get("completedDate") as string | null;
    const status = formData.get("status") as string | null;
    const description = formData.get("description") as string | null;

    const newImages = formData.getAll("images") as File[];
    const existingImages = formData.getAll("existingImages") as string[];
    const newVideo = formData.get("video") as File | null;

    const uploadDir = path.join(process.cwd(), "public", "uploads/projects");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const saveFile = async (file: File): Promise<string> => {
      const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadDir, safeName);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      return `/uploads/projects/${safeName}`;
    };

    let finalImageUrls = project.image;
    let finalVideoUrl = project.video;

    // Handle images - only delete old images if new ones are uploaded
    if (newImages.length > 0) {
      // Save new images
      const newImageUrls: string[] = [];
      for (const file of newImages) {
        const url = await saveFile(file);
        newImageUrls.push(url);
      }

      // Combine existing and new images
      finalImageUrls = [...existingImages, ...newImageUrls];
    } else {
      // Only keep existing images that are specified
      finalImageUrls = existingImages;
    }

    // Handle video
    if (newVideo) {
      // Delete old video if exists
      if (project.video) {
        const fullVideoPath = path.join(process.cwd(), "public", project.video);
        if (fs.existsSync(fullVideoPath)) fs.unlinkSync(fullVideoPath);
      }
      finalVideoUrl = await saveFile(newVideo);
    }

    // Update DB
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: name ?? project.name,
        client: client ?? project.client,
        provinceId: provinceId ?? project.provinceId,
        districtId: districtId ?? project.districtId,
        startDate: startDateStr ? new Date(startDateStr) : project.startDate,
        completedDate: completedDateStr ? new Date(completedDateStr) : project.completedDate,
        status: status ?? project.status,
        description: description ?? project.description,
        image: finalImageUrls,
        video: finalVideoUrl,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE PROJECT
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = Number(id);
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    
    if (!project) {
      return NextResponse.json({ error: "Project not found"}, { status: 404 });
    }

    // Delete files from server
    project.image.forEach((filePath) => {
      const fullPath = path.join(process.cwd(), "public", filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    if (project.video) {
      const fullVideoPath = path.join(process.cwd(), "public", project.video);
      if (fs.existsSync(fullVideoPath)) {
        fs.unlinkSync(fullVideoPath);
      }
    }

    // Delete from DB
    await prisma.project.delete({ where: { id: projectId } });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}