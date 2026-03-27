"use client";

import { useToast } from "@/components/ui/Toast";

interface AdminDashboardClientProps {
  totalUsers: number;
  mrr: number;
  paidUsers: number;
  churnRate: string;
}

// 過去6ヶ月のモック売上データ
const revenueData = [
  { month: "10月", value: 12800 },
  { month: "11月", value: 18600 },
  { month: "12月", value: 24200 },
  { month: "1月", value: 31400 },
  { month: "2月", value: 38900 },
  { month: "3月", value: 42600 },
];

export default function AdminDashboardClient({
  totalUsers,
  mrr,
  paidUsers,
  churnRate,
}: AdminDashboardClientProps) {
  const { showToast } = useToast();

  const handleExportReport = () => {
    showToast("レポートをCSVで出力します（デモ）", "info");
  };

  // SVG折れ線グラフ計算
  const maxValue = Math.max(...revenueData.map((d) => d.value));
  const minValue = Math.min(...revenueData.map((d) => d.value));
  const chartW = 540;
  const chartH = 200;
  const padX = 40;
  const padY = 20;
  const plotW = chartW - padX * 2;
  const plotH = chartH - padY * 2;

  const points = revenueData.map((d, i) => {
    const x = padX + (i / (revenueData.length - 1)) * plotW;
    const y = padY + plotH - ((d.value - minValue) / (maxValue - minValue || 1)) * plotH;
    return { x, y, ...d };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  // グラデーションエリア用のパス
  const areaPath = `M${points[0].x},${points[0].y} ${points.map((p) => `L${p.x},${p.y}`).join(" ")} L${points[points.length - 1].x},${padY + plotH} L${points[0].x},${padY + plotH} Z`;

  const kpiCards = [
    {
      label: "総ユーザー",
      value: totalUsers.toLocaleString(),
      suffix: "人",
      color: "text-text-muted",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
        </svg>
      ),
    },
    {
      label: "MRR",
      value: `¥${mrr.toLocaleString()}`,
      suffix: "",
      color: "text-text-muted",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
    },
    {
      label: "有料会員",
      value: paidUsers.toLocaleString(),
      suffix: "人",
      color: "text-text-muted",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "解約率",
      value: churnRate,
      suffix: "%",
      color: "text-text-muted",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-8 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-text-primary sm:text-2xl">
            管理ダッシュボード
          </h1>
          <p className="mt-1 text-sm text-text-muted">サービスの概況を確認</p>
        </div>
        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 self-start rounded-lg border border-border px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-text-muted hover:text-text-primary"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          レポート出力
        </button>
      </div>

      {/* KPIカード */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className={kpi.color}>{kpi.icon}</span>
              <span className="text-xs text-text-muted">{kpi.label}</span>
            </div>
            <p className="font-mono text-lg font-semibold text-text-primary sm:text-xl">
              {kpi.value}
              {kpi.suffix && <span className="ml-0.5 text-sm text-text-muted">{kpi.suffix}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* 売上推移チャート */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
        <h2 className="mb-4 font-display text-base font-semibold text-text-primary">
          売上推移（過去6ヶ月）
        </h2>
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartW} ${chartH + 30}`}
            className="w-full min-w-[400px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* グリッド線 */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padY + plotH - ratio * plotH;
              const val = Math.round(minValue + ratio * (maxValue - minValue));
              return (
                <g key={ratio}>
                  <line
                    x1={padX}
                    y1={y}
                    x2={padX + plotW}
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padX - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill="#5a5a72"
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                  >
                    ¥{(val / 1000).toFixed(0)}k
                  </text>
                </g>
              );
            })}

            {/* エリア（塗りつぶし） */}
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff0054" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ff0054" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#areaGrad)" />

            {/* 折れ線 */}
            <polyline
              points={polyline}
              fill="none"
              stroke="#ff0054"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* データポイント */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="4" fill="#0a0a0f" stroke="#ff0054" strokeWidth="2" />
                <text
                  x={p.x}
                  y={padY + plotH + 20}
                  textAnchor="middle"
                  fill="#8b8ba3"
                  fontSize="11"
                  fontFamily="Noto Sans JP"
                >
                  {p.month}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
