export default function MemberLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* 画面上部のプログレスバー */}
      <div className="fixed left-0 right-0 top-0 z-[9999] h-[3px] overflow-hidden">
        <div className="loading-bar h-full w-full bg-primary" />
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* ヘッダースケルトン */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-7 w-40 animate-pulse rounded-lg bg-border" />
            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-border" />
          </div>
          <div className="h-9 w-24 animate-pulse rounded-lg bg-border" />
        </div>

        {/* KPIカードスケルトン */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4"
            >
              <div className="mb-2 h-4 w-16 animate-pulse rounded bg-border" />
              <div className="h-6 w-20 animate-pulse rounded bg-border" />
            </div>
          ))}
        </div>

        {/* メインコンテンツスケルトン */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* カードスケルトン */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
              <div className="h-4 w-24 animate-pulse rounded bg-border" />
              <div className="mt-3 h-6 w-32 animate-pulse rounded bg-border" />
            </div>
            {/* 動画グリッドスケルトン */}
            <div>
              <div className="mb-4 h-5 w-28 animate-pulse rounded bg-border" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)]"
                  >
                    <div className="aspect-video animate-pulse bg-border" />
                    <div className="p-3">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
                      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-border" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* サイドバースケルトン */}
          <div className="space-y-6">
            <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
              <div className="mb-4 h-5 w-28 animate-pulse rounded bg-border" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-6 w-6 animate-pulse rounded-full bg-border" />
                    <div className="flex-1">
                      <div className="h-4 w-full animate-pulse rounded bg-border" />
                      <div className="mt-1 h-3 w-1/3 animate-pulse rounded bg-border" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
