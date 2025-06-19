import { db } from "@/db/drizzle";
import { topics, subjects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  const subjectId = parseInt(id);

  if (isNaN(subjectId)) {
    return NextResponse.json({ error: "Ugyldigt ID" }, { status: 400 });
  }

  const [subject] = await db
    .select({ name: subjects.name })
    .from(subjects)
    .where(eq(subjects.id, subjectId));

  if (!subject) {
    return NextResponse.json({ error: "Fag ikke fundet" }, { status: 404 });
  }

  const topicList = await db
    .select()
    .from(topics)
    .where(eq(topics.subjectId, subjectId));

  return NextResponse.json({
    name: subject.name,
    topics: topicList,
  });
}