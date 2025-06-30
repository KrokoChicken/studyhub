import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { collabNotes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { roomId, ydocStateBase64, collaborators } = await req.json();

    if (!roomId || !ydocStateBase64) {
      return NextResponse.json({ error: "Missing roomId or ydocState" }, { status: 400 });
    }

    // Convert base64 back to Buffer for storage
    const ydocStateBuffer = Buffer.from(ydocStateBase64, "base64");

    // Update the collab note in DB
    const result = await db
      .update(collabNotes)
      .set({
        ydocState: ydocStateBuffer,
        ...(collaborators ? { collaborators } : {}),
        updatedAt: new Date(),
      })
      .where(eq(collabNotes.roomId, roomId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, note: result[0] });
  } catch (error) {
    console.error("Update collab note error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}