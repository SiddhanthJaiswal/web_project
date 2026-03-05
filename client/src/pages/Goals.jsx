import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import axios from "axios";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchGoals = async () => {
    try {
      const res = await api.get("/goals");
      setGoals(res.data);
    } catch (error) {
      console.error("Error fetching goals", error);
    }
  };

useEffect(() => {
  fetchGoals();
}, []);

const addGoal = async (e) => {
  e.preventDefault();
  if (!newGoal.trim()) return;

  try {
    const res = await api.post("/goals", { title: newGoal });

    // add new goal directly to state
    setGoals([...goals, res.data]);

    setNewGoal("");
  } catch (error) {
    console.error("Error adding goal", error);
  }
};

  const toggleGoal = async (id, completed) => {
    try {
      await api.put(`/goals/${id}`, { completed: !completed });
      fetchGoals();
    } catch (error) {
      console.error("Error updating goal", error);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      fetchGoals();
    } catch (error) {
      console.error("Error deleting goal", error);
    }
  };

  return (
    <MainLayout>
      <section className="page-section">
        <div className="page-section-header">
          <div>
            <h1 className="page-title">Goals</h1>
            <p className="page-subtitle">
              Track your personal and academic goals.
            </p>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-dot" />
            <span>
              {goals.length} goal{goals.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Add goal</h2>
          <p className="card-meta">Set something you want to achieve.</p>

          <form onSubmit={addGoal} className="mt-md field-row">
            <input
              className="input"
              type="text"
              placeholder="Enter new goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Add
            </button>
          </form>
        </div>
      </section>

      <section className="page-section mt-md">
        <h2 className="page-title" style={{ fontSize: 18 }}>
          Your goals
        </h2>
        <p className="page-subtitle">
          Click a goal to mark it complete.
        </p>

        <div className="checklist-list mt-sm">
          {goals.length === 0 && (
            <p className="page-subtitle">
              No goals yet. Add your first one above.
            </p>
          )}

          {goals.map((goal) => (
            <div key={goal._id} className="task-card">
              <div
                className="task-card-main"
                onClick={() => toggleGoal(goal._id, goal.completed)}
                style={{ cursor: "pointer" }}
              >
                <span
                  className="task-text"
                  style={{
                    textDecoration: goal.completed ? "line-through" : "none",
                    fontWeight: 500,
                  }}
                >
                  {goal.title}
                </span>
              </div>

              <button
                className="btn btn-danger task-delete-btn"
                onClick={() => deleteGoal(goal._id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default Goals;