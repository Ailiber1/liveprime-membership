export default function MemberLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="fixed left-0 right-0 top-0 z-[9999] h-[3px] overflow-hidden">
        <div className="loading-bar h-full w-full bg-primary" />
      </div>
      <div className="flex items-center justify-center p-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    </div>
  );
}
