import { db } from "@/db/drizzle";
import { topics } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const topicId = parseInt(params.id);

  if (isNaN(topicId)) {
    return NextResponse.json({ error: "Ugyldigt ID" }, { status: 400 });
  }

  const [topic] = await db
    .select({
      id: topics.id,
      name: topics.name,
      note: topics.note,
    })
    .from(topics)
    .where(eq(topics.id, topicId));

  if (!topic) {
    return NextResponse.json({ error: "Emne ikke fundet" }, { status: 404 });
  }

  return NextResponse.json(topic);
}