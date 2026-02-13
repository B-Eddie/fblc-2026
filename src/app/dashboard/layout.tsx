import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-black text-white font-mono flex overflow-hidden">
      <Sidebar />
      <main className="ml-64 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
