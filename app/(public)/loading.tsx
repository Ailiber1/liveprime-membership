export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-bg-deep">
      {/* 画面上部のプログレスバー */}
      <div className="fixed left-0 right-0 top-0 z-[9999] h-[3px] overflow-hidden">
        <div className="loading-bar h-full w-full bg-primary" />
      </div>

      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-xs text-text-muted">読み込み中...</p>
        </div>
      </div>
    </div>
  );
}
