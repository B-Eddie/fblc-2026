import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="h-screen bg-black text-white font-mono flex overflow-hidden selection:bg-white selection:text-black">
        <Sidebar />
        <main className="flex-1 h-full overflow-hidden bg-black/50 backdrop-blur-sm">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
