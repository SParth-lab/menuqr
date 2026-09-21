/**
 * Deliberately dependency-free: a charting library would be the largest thing in
 * the dashboard bundle, and this renders 30 bars from plain divs.
 */
export function BarChart({
  data,
  height = 120,
}: {
  data: { day: string; views: number; qrScans: number }[];
  height?: number;
}) {
  const max = Math.max(1, ...data.map((d) => d.views));

  return (
    <div>
      <div className="flex items-end gap-[3px]" style={{ height }}>
        {data.map((d) => {
          const total = Math.round((d.views / max) * height);
          const scans = Math.round((d.qrScans / max) * height);
          return (
            <div
              key={d.day}
              className="group relative flex-1"
              style={{ height }}
              title={`${d.day}: ${d.views} views, ${d.qrScans} scans`}
            >
              <div className="absolute bottom-0 w-full rounded-t bg-orange-200" style={{ height: Math.max(total, d.views > 0 ? 2 : 0) }} />
              <div className="absolute bottom-0 w-full rounded-t bg-orange-600" style={{ height: Math.max(scans, d.qrScans > 0 ? 2 : 0) }} />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
        <span>{data[0]?.day}</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-orange-200" /> views</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-orange-600" /> QR scans</span>
        </span>
        <span>{data[data.length - 1]?.day}</span>
      </div>
    </div>
  );
}
