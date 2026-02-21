import { getSQL } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sql = getSQL();
  const { id } = await params;
  const result = await sql`
    UPDATE issues SET upvotes = upvotes + 1, updated_at = NOW() WHERE id = ${id} RETURNING upvotes
  `;
  if (result.length === 0) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }
  return NextResponse.json({ upvotes: result[0].upvotes });
}
