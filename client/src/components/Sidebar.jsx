import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔥 remove JWT
    navigate("/"); // go back to login
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>StudentOS</h2>

      <nav style={styles.nav}>
        <Link style={styles.link} to="/dashboard">Dashboard</Link>
        <Link style={styles.link} to="/subjects">Subjects</Link>
        <Link style={styles.link} to="/checklist">Checklist</Link>
        <Link style={styles.link} to="/exams">Exams</Link>
        <Link style={styles.link} to="/goals">Goals</Link>
      </nav>

      {/* Logout Button */}
      <button style={styles.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "230px",
    background: "#111827",
    color: "white",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100vh"
  },
  logo: {
    fontSize: "20px"
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "15px"
  },
  logoutBtn: {
    background: "#ef4444",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer"
  }
};

export default Sidebar;