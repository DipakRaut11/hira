import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/companyInfo
export async function GET() {
  try {
    const data = await prisma.companyInfo.findUnique({ where: { id: 1 } });
    console.log("GET /companyInfo result:", data);
    return NextResponse.json(data || {});
  } catch (err: any) {
    console.error("GET /companyInfo error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/companyInfo
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const description = body.description ?? "";

    const exists = await prisma.companyInfo.findUnique({ where: { id: 1 } });

    if (exists) {
      const updated = await prisma.companyInfo.update({
        where: { id: 1 },
        data: { description },
      });
      console.log("POST /companyInfo updated:", updated);
      return NextResponse.json(updated);
    } else {
      const created = await prisma.companyInfo.create({
        data: { id: 1, description },
      });
      console.log("POST /companyInfo created:", created);
      return NextResponse.json(created);
    }
  } catch (err: any) {
    console.error("POST /companyInfo error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
