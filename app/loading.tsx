export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-deep">
      {/* 画面上部のプログレスバー */}
      <div className="fixed left-0 right-0 top-0 h-[3px] overflow-hidden">
        <div className="loading-bar h-full w-full bg-primary" />
      </div>
      {/* 中央のスピナー */}
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        <p className="text-xs text-text-muted">読み込み中...</p>
      </div>
    </div>
  );
}
