import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";

function Checklist() {
  const token = localStorage.getItem("token");
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  /* ============================
     FETCH TASKS
  ============================ */

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/checklist", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ============================
     ADD TASK
  ============================ */

  const addTask = async () => {
    if (!text) return;

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

  /* ============================
     TOGGLE TASK
  ============================ */

  const toggleTask = async (id) => {
    await fetch(`http://localhost:5000/api/checklist/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchTasks();
  };

  /* ============================
     DELETE TASK
  ============================ */

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/checklist/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchTasks();
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <MainLayout>
      <section className="page-section">
        <div className="checklist-header">
          <div className="page-section-header">
            <div>
              <h1 className="page-title">Today&apos;s Checklist</h1>
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
                aria-label="Delete task"
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
export default Checklist;