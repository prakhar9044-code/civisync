import { getSQL } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sql = getSQL();
  const { id } = await params;
  const issue = await sql`SELECT * FROM issues WHERE id = ${id}`;
  if (issue.length === 0) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  const updates = await sql`
    SELECT * FROM issue_updates WHERE issue_id = ${id} ORDER BY created_at DESC
  `;

  return NextResponse.json({ ...issue[0], updates });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const sql = getSQL();
  const { id } = await params;
  const body = await request.json();
  const { status, admin_notes, priority } = body;

  const existing = await sql`SELECT * FROM issues WHERE id = ${id}`;
  if (existing.length === 0) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  const oldStatus = existing[0].status;

  if (status && status !== oldStatus) {
    await sql`
      INSERT INTO issue_updates (issue_id, old_status, new_status, comment, updated_by)
      VALUES (${id}, ${oldStatus}, ${status}, ${body.comment || null}, ${body.updated_by || "Admin"})
    `;
  }

  const resolvedAt =
    status === "resolved" ? new Date().toISOString() : existing[0].resolved_at;

  const result = await sql`
    UPDATE issues
    SET status = COALESCE(${status || null}, status),
        admin_notes = COALESCE(${admin_notes || null}, admin_notes),
        priority = COALESCE(${priority || null}, priority),
        updated_at = NOW(),
        resolved_at = ${resolvedAt}
    WHERE id = ${id}
    RETURNING *
  `;

  return NextResponse.json(result[0]);
}
