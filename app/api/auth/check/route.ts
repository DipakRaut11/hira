import { NextRequest, NextResponse } from 'next/server';

const allowedIPs = ["192.168.18.83"];

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") ?? "";
  
  const isAdmin = allowedIPs.includes(ip);
  
  return NextResponse.json({ isAdmin });
}