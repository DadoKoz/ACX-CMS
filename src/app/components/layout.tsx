import Sidebar from "@/app/components/sidebar/side-bar";
import StatusBar from "@/app/components/statusbar/status-bar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      {/* StatusBar na vrhu */}
      <StatusBar />

      {/* Horizontalni bar ispod StatusBar-a */}
      <Sidebar />

      {/* Main content ispod oba */}
      <main className="flex-1 overflow-auto bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-4">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
