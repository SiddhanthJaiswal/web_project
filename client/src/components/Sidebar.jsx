import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">StudentOS</h2>
        <span className="sidebar-tagline">Your semester command center</span>
      </div>

      <nav className="sidebar-nav">
        <Link className="sidebar-link" to="/dashboard">
          <span className="sidebar-link-icon" />
          <span>Dashboard</span>
        </Link>
        <Link className="sidebar-link" to="/subjects">
          <span className="sidebar-link-icon" />
          <span>Subjects</span>
        </Link>
        <Link className="sidebar-link" to="/exams">
          <span className="sidebar-link-icon" />
          <span>Exams</span>
        </Link>
        <Link className="sidebar-link" to="/goals">
          <span className="sidebar-link-icon" />
          <span>Goals</span>
        </Link>
        <Link className="sidebar-link" to="/important-links">
          <span className="sidebar-link-icon" />
          <span>Important Links</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link className="sidebar-link" to="/profile">
          <span className="sidebar-link-icon" />
          <span>Profile</span>
        </Link>
        <button className="btn btn-ghost" onClick={handleLogout}>
          Logout
        </button>
        <span className="sidebar-muted">Logged in as student</span>
      </div>
    </aside>
  );
}

export default Sidebar;