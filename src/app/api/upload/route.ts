import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Simulate small random delay for uploading
    await new Promise((resolve) => setTimeout(resolve, 800));

    const fileId = Math.random().toString(36).substring(2, 15);
    const mockUrl = `/uploads/${encodeURIComponent(file.name)}`;

    return NextResponse.json({
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      url: mockUrl,
      progress: 100,
      status: "completed",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
