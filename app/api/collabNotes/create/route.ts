
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { collabNotes } from "@/db/schema";
import { randomBytes } from "crypto";
import * as Y from "yjs";
import { Buffer } from "buffer";

export async function POST(req: NextRequest) {
  try {
    const { title, createdByUserId } = await req.json();

    if (!title || !createdByUserId) {
      return NextResponse.json(
        { error: "Missing title or user ID" },
        { status: 400 }
      );
    }

    // Generate unique roomId (8 chars alphanumeric)
    const roomId = randomBytes(4).toString("hex");

    // Initialize empty Y.Doc with proper prosemirror structure
    const ydoc = new Y.Doc();
    const prosemirrorFragment = ydoc.getXmlFragment("prosemirror");

    // Create root <doc> node
    const docNode = new Y.XmlElement("doc");

    // Create a <paragraph> node inside <doc>
    const paragraphNode = new Y.XmlElement("paragraph");
    docNode.push([paragraphNode]);

    // Insert root doc node into prosemirror fragment
    prosemirrorFragment.push([docNode]);

    // Serialize Y.Doc to Uint8Array and convert to Buffer for DB
    const ydocStateUint8 = Y.encodeStateAsUpdate(ydoc);
    const ydocStateBuffer = Buffer.from(ydocStateUint8);

    // Insert new collaborative note into DB
    const result = await db
      .insert(collabNotes)
      .values({
        title,
        createdByUserId,
        roomId,
        ydocState: ydocStateBuffer,
        collaborators: JSON.stringify([]), // empty collaborators list
      })
      .returning();

    return NextResponse.json({ success: true, note: result[0] });
  } catch (error) {
    console.error("Create collab note error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
