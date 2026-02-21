"use client";

export function DepartmentTable({
  data,
  isLoading,
}: {
  data:
    | { department: string; count: number; resolved_count: number }[]
    | undefined;
  isLoading: boolean;
}) {
  if (isLoading || !data) {
    return (
      <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Department Performance
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-3 pr-4 font-semibold text-muted-foreground">
                Department
              </th>
              <th className="pb-3 pr-4 text-right font-semibold text-muted-foreground">
                Total
              </th>
              <th className="pb-3 pr-4 text-right font-semibold text-muted-foreground">
                Resolved
              </th>
              <th className="pb-3 text-right font-semibold text-muted-foreground">
                Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((dept) => {
              const total = Number(dept.count);
              const resolved = Number(dept.resolved_count);
              const rate = total > 0 ? ((resolved / total) * 100).toFixed(0) : 0;
              return (
                <tr
                  key={dept.department}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-3 pr-4 font-medium text-foreground">
                    {dept.department}
                  </td>
                  <td className="py-3 pr-4 text-right text-muted-foreground">
                    {total}
                  </td>
                  <td className="py-3 pr-4 text-right text-emerald-600">
                    {resolved}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
