import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex pt-16">
        <Sidebar variant="admin" />
        <main className="min-h-[calc(100vh-4rem)] flex-1">{children}</main>
      </div>
    </>
  );
}
