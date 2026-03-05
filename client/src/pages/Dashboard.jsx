javascript
import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";

function Dashboard() {
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [profile, setProfile] = useState(null);

  const [examCount, setExamCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);

  /* ================= TASKS ================= */

  const fetchTasks = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/checklist", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) return;

      const data = await res.json();
      setTasks(data);
    } catch {
      // ignore dashboard checklist errors
    }
  };

  /* ================= PROFILE ================= */

  const fetchProfile = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) return;

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Dashboard profile fetch error", err);
    }
  };

  /* ================= SUBJECT COUNT ================= */

  const fetchSubjects = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/subjects", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) return;

      const data = await res.json();
      setSubjectCount(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error("Dashboard subject fetch error", err);
    }
  };

  /* ================= EXAM COUNT ================= */

  const fetchExams = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/exam", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) return;

      const data = await res.json();
      setExamCount(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error("Dashboard exam fetch error", err);
    }
  };

  /* ================= LOAD DASHBOARD ================= */

  useEffect(() => {
    fetchTasks();
    fetchProfile();
    fetchSubjects();
    fetchExams();
  }, [token]);

  /* ================= TASK ACTIONS ================= */

  const addTask = async () => {
    if (!text || !token) return;

    await fetch("http://localhost:5000/api/checklist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });

    setText("");
    fetchTasks();
  };

  const toggleTask = async (id) => {
    if (!token) return;

    await fetch(`http://localhost:5000/api/checklist/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchTasks();
  };

  const deleteTask = async (id) => {
    if (!token) return;

    await fetch(`http://localhost:5000/api/checklist/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchTasks();
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <MainLayout>
      <section className="page-section">
        <div className="page-section-header">
          <div>
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">
              Quick snapshot of your semester and tasks.
            </p>
          </div>
        </div>

        <div className="card-grid">
          <div className="card">
            <h3 className="card-title">Total Subjects</h3>
            <p className="card-meta">Currently tracked</p>
            <p style={{ fontSize: 28, fontWeight: 700, marginTop: 10 }}>
              {subjectCount}
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">Upcoming Exams</h3>
            <p className="card-meta">Next 30 days</p>
            <p style={{ fontSize: 28, fontWeight: 700, marginTop: 10 }}>
              {examCount}
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">Pending Tasks</h3>
            <p className="card-meta">From today’s checklist</p>
            <p style={{ fontSize: 28, fontWeight: 700, marginTop: 10 }}>
              {pendingCount < 0 ? 0 : pendingCount}
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">Current CGPA</h3>
            <p className="card-meta">Self reported</p>
            <p style={{ fontSize: 28, fontWeight: 700, marginTop: 10 }}>
              {profile?.currentCGPA ?? "--"}
            </p>
          </div>
        </div>
      </section>

      <section className="page-section mt-md">
        <h2 className="page-title" style={{ fontSize: 18 }}>
          CGPA Target
        </h2>

        <div className="mt-sm">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: "80%" }} />
          </div>

          <p className="page-subtitle" style={{ marginTop: 6 }}>
            Target: 8.5 this semester
          </p>
        </div>
      </section>

      <section className="page-section mt-md">
        <div className="checklist-header">
          <div className="page-section-header">
            <div>
              <h2 className="page-title" style={{ fontSize: 20 }}>
                Today's Checklist
              </h2>

              <p className="page-subtitle">
                Capture everything you need to get done today.
              </p>
            </div>

            <div className="stat-pill">
              <span className="stat-pill-dot" />
              <span>
                {completedCount} / {tasks.length || 0} complete
              </span>
            </div>
          </div>

          <div className="checklist-row">
            <input
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a task (e.g. revise DBMS, finish assignment)…"
            />

            <button className="btn btn-primary" onClick={addTask}>
              Add task
            </button>
          </div>

          <div className="checklist-stats">
            <span>
              {tasks.length === 0
                ? "No tasks yet – start with your most important one."
                : `${completedCount} completed, ${tasks.length - completedCount} remaining`}
            </span>
          </div>
        </div>

        <div className="checklist-list">
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <label className="task-card-main">
                <input
                  className="task-checkbox"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id)}
                />

                <span
                  className={
                    "task-text" + (task.completed ? " completed" : "")
                  }
                >
                  {task.text}
                </span>
              </label>

              <button
                className="btn btn-danger task-delete-btn"
                onClick={() => deleteTask(task._id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

export default Dashboard;
