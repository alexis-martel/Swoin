import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <TopBar />
      <main className="lg:ml-64 pt-16 min-h-screen pb-32 lg:pb-12">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
