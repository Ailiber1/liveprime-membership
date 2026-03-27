export default function AdminLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* 画面上部のプログレスバー */}
      <div className="fixed left-0 right-0 top-0 z-[9999] h-[3px] overflow-hidden">
        <div className="loading-bar h-full w-full bg-primary" />
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* ヘッダースケルトン */}
        <div className="mb-6">
          <div className="h-7 w-48 animate-pulse rounded-lg bg-border" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-border" />
        </div>

        {/* KPIカードスケルトン */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4"
            >
              <div className="mb-2 h-4 w-20 animate-pulse rounded bg-border" />
              <div className="h-8 w-24 animate-pulse rounded bg-border" />
              <div className="mt-2 h-3 w-16 animate-pulse rounded bg-border" />
            </div>
          ))}
        </div>

        {/* チャートスケルトン */}
        <div className="mb-6 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
          <div className="mb-4 h-5 w-28 animate-pulse rounded bg-border" />
          <div className="h-64 animate-pulse rounded-lg bg-border" />
        </div>

        {/* テーブルスケルトン */}
        <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
          <div className="mb-4 h-5 w-32 animate-pulse rounded bg-border" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-8 w-8 animate-pulse rounded-full bg-border" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-border" />
                <div className="h-4 w-1/6 animate-pulse rounded bg-border" />
                <div className="h-4 w-1/6 animate-pulse rounded bg-border" />
                <div className="ml-auto h-4 w-16 animate-pulse rounded bg-border" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
