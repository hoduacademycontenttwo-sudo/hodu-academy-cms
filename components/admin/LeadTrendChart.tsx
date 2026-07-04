'use client'

interface LeadTrendChartProps {
  // 14 daily counts, oldest first
  data: { day: string; count: number }[]
}

export default function LeadTrendChart({ data }: LeadTrendChartProps) {
  const W = 560, H = 160, PAD = 24
  const max = Math.max(1, ...data.map(d => d.count))
  const stepX = data.length > 1 ? (W - PAD * 2) / (data.length - 1) : 0

  const points = data.map((d, i) => ({
    x: PAD + i * stepX,
    y: H - PAD - (d.count / max) * (H - PAD * 2),
  }))

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${line} L${points[points.length - 1]?.x ?? PAD},${H - PAD} L${PAD},${H - PAD} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Lead trend, last 14 days">
      <defs>
        <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7E0D0D" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7E0D0D" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Baseline */}
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#F3DCDC" strokeWidth="1" />

      {data.length > 0 && (
        <>
          <path d={area} fill="url(#leadFill)" />
          <path d={line} fill="none" stroke="#7E0D0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3" fill="#7E0D0D" />
              {data[i].count > 0 && (
                <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="9" fill="#1B2A44" fontWeight="700">
                  {data[i].count}
                </text>
              )}
            </g>
          ))}
          {/* X labels — every other day to avoid crowding */}
          {data.map((d, i) => (
            i % 2 === 0 && (
              <text key={d.day} x={points[i].x} y={H - PAD + 14} textAnchor="middle" fontSize="8" fill="#C9C8CB">
                {d.day}
              </text>
            )
          ))}
        </>
      )}
    </svg>
  )
}
