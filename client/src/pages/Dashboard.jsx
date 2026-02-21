import MainLayout from "../layout/MainLayout";

function Dashboard() {
  return (
    <MainLayout>
      <div style={styles.container}>
        <h1 style={styles.title}>Dashboard Overview</h1>

        {/* Stats Section */}
        <div style={styles.statsGrid}>
          <div style={styles.card}>
            <h3>Total Subjects</h3>
            <p style={styles.bigNumber}>5</p>
          </div>

          <div style={styles.card}>
            <h3>Upcoming Exams</h3>
            <p style={styles.bigNumber}>2</p>
          </div>

          <div style={styles.card}>
            <h3>Pending Tasks</h3>
            <p style={styles.bigNumber}>4</p>
          </div>

          <div style={styles.card}>
            <h3>Current CGPA</h3>
            <p style={styles.bigNumber}>8.2</p>
          </div>
        </div>

        {/* CGPA Progress */}
        <div style={styles.section}>
          <h2>CGPA Target</h2>
          <div style={styles.progressBarContainer}>
            <div style={styles.progressBarFill}></div>
          </div>
          <p>Target: 8.5 this semester</p>
        </div>

        {/* Today's Checklist Preview */}
        <div style={styles.section}>
          <h2>Today's Tasks</h2>
          <ul>
            <li>Revise Data Structures</li>
            <li>Complete DBMS assignment</li>
            <li>Prepare for OS quiz</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "30px"
  },
  title: {
    marginBottom: "10px"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
  },
  bigNumber: {
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "10px"
  },
  section: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
  },
  progressBarContainer: {
    height: "10px",
    background: "#e5e7eb",
    borderRadius: "6px",
    marginTop: "10px",
    marginBottom: "10px"
  },
  progressBarFill: {
    width: "80%",
    height: "100%",
    background: "#4f46e5",
    borderRadius: "6px"
  }
};

export default Dashboard;