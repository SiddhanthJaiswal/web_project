import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="app-main-inner">{children}</div>
      </main>
    </div>
  );
}

export default MainLayout;
