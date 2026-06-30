import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Return empty list by default, as state is primarily client-side (Zustand LocalStorage)
  return NextResponse.json({ conversations: [] });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true });
}
