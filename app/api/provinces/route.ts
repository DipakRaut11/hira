export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const provinces = await prisma.province.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(provinces);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch provinces" }, { status: 500 });
  }
}
