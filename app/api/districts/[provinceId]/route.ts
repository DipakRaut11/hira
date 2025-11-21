export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ provinceId: string }> }) {
  const { provinceId } = await params; // <-- FIX

  try {
    const districts = await prisma.district.findMany({
      where: { provinceId: Number(provinceId) },
      orderBy: { name: "asc" },
    });

    return Response.json(districts);
  } catch (err) {
    console.error(err);
    return new Response("Server Error", { status: 500 });
  }
}

