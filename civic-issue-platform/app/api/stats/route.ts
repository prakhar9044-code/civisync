import { getSQL } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = getSQL();
  const [total] = await sql`SELECT COUNT(*) as count FROM issues`;
  const [reported] = await sql`SELECT COUNT(*) as count FROM issues WHERE status = 'reported'`;
  const [inProgress] = await sql`SELECT COUNT(*) as count FROM issues WHERE status = 'in_progress'`;
  const [resolved] = await sql`SELECT COUNT(*) as count FROM issues WHERE status = 'resolved'`;
  const [dismissed] = await sql`SELECT COUNT(*) as count FROM issues WHERE status = 'dismissed'`;
  const [critical] = await sql`SELECT COUNT(*) as count FROM issues WHERE priority = 'critical'`;

  const byCategory = await sql`
    SELECT category, COUNT(*) as count FROM issues GROUP BY category ORDER BY count DESC
  `;

  const byDepartment = await sql`
    SELECT department, COUNT(*) as count, 
           SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_count
    FROM issues GROUP BY department ORDER BY count DESC
  `;

  const recentActivity = await sql`
    SELECT iu.*, i.title as issue_title
    FROM issue_updates iu
    JOIN issues i ON iu.issue_id = i.id
    ORDER BY iu.created_at DESC
    LIMIT 10
  `;

  const avgResolutionTime = await sql`
    SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 86400) as avg_days
    FROM issues WHERE resolved_at IS NOT NULL
  `;

  return NextResponse.json({
    total: Number(total.count),
    reported: Number(reported.count),
    inProgress: Number(inProgress.count),
    resolved: Number(resolved.count),
    dismissed: Number(dismissed.count),
    critical: Number(critical.count),
    resolutionRate: Number(total.count) > 0 ? (Number(resolved.count) / Number(total.count) * 100).toFixed(1) : 0,
    avgResolutionDays: avgResolutionTime[0]?.avg_days ? Number(avgResolutionTime[0].avg_days).toFixed(1) : "N/A",
    byCategory,
    byDepartment,
    recentActivity,
  });
}
