import { useEffect, useState } from "react";
import axios from "axios";
//hi bro 
//hi siddhanth
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

  // 🔥 Fetch Goals
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

  // 🔥 Add Goal
  const addGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    try {
      await api.post("/goals", { title: newGoal });
      setNewGoal("");
      fetchGoals();
    } catch (error) {
      console.error("Error adding goal", error);
    }
  };

  // 🔥 Toggle Complete
  const toggleGoal = async (id, completed) => {
    try {
      await api.put(`/goals/${id}`, { completed: !completed });
      fetchGoals();
    } catch (error) {
      console.error("Error updating goal", error);
    }
  };

  // 🔥 Delete Goal
  const deleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      fetchGoals();
    } catch (error) {
      console.error("Error deleting goal", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🎯 My Goals</h2>

      <form onSubmit={addGoal} style={styles.form}>
        <input
          type="text"
          placeholder="Enter new goal..."
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.addBtn}>
          Add
        </button>
      </form>

      <ul style={styles.list}>
        {goals.map((goal) => (
          <li key={goal._id} style={styles.item}>
            <span
              onClick={() => toggleGoal(goal._id, goal.completed)}
              style={{
                textDecoration: goal.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {goal.title}
            </span>

            <button
              onClick={() => deleteGoal(goal._id)}
              style={styles.deleteBtn}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    maxWidth: "600px",
    margin: "auto",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
  },
  addBtn: {
    padding: "10px 15px",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Goals;