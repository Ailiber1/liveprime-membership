import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AdminMobileNav from "./admin-mobile-nav";

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
        <div className="flex-1">
          <AdminMobileNav />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
      </div>
    </>
  );
}
