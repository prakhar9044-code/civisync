import { getSQL } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sql = getSQL();
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const priority = searchParams.get("priority");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") || "desc";

  let query = `SELECT * FROM issues WHERE 1=1`;
  const params: unknown[] = [];
  let paramIndex = 1;

  if (status && status !== "all") {
    query += ` AND status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }
  if (category && category !== "all") {
    query += ` AND category = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }
  if (priority && priority !== "all") {
    query += ` AND priority = $${paramIndex}`;
    params.push(priority);
    paramIndex++;
  }
  if (search) {
    query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR address ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  const allowedSorts = ["created_at", "upvotes", "priority", "status"];
  const safeSort = allowedSorts.includes(sort) ? sort : "created_at";
  const safeOrder = order === "asc" ? "ASC" : "DESC";
  query += ` ORDER BY ${safeSort} ${safeOrder}`;

  const issues = await sql(query, params);
  return NextResponse.json(issues);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    title,
    description,
    category,
    priority,
    reporter_name,
    reporter_email,
    reporter_phone,
    latitude,
    longitude,
    address,
  } = body;

  if (!title || !description || !reporter_name || !category) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const sql = getSQL();
  const department = getDepartment(category);

  const result = await sql`
    INSERT INTO issues (title, description, category, priority, reporter_name, reporter_email, reporter_phone, latitude, longitude, address, department)
    VALUES (${title}, ${description}, ${category}, ${priority || "medium"}, ${reporter_name}, ${reporter_email || null}, ${reporter_phone || null}, ${latitude || null}, ${longitude || null}, ${address || null}, ${department})
    RETURNING *
  `;

  return NextResponse.json(result[0], { status: 201 });
}

function getDepartment(category: string): string {
  const map: Record<string, string> = {
    pothole: "Roads & Infrastructure",
    water_leak: "Water Supply",
    streetlight: "Electrical",
    drainage: "Drainage & Sewage",
    garbage: "Sanitation",
    road_damage: "Roads & Infrastructure",
    sewage: "Drainage & Sewage",
    other: "General",
  };
  return map[category] || "General";
}
