import Sidebar from "../components/Sidebar";

function MainLayout({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: 30, background: "#f3f4f6" }}>
        {children}
      </div>
    </div>
  );
}

export default MainLayout;
