import { useState } from "react";
import { registerUser } from "../services/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    semester: "",
    phone: "",
    currentCGPA: "",
    currentCredits: "",
    subjects: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.semester) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      const dataToSend = {
        ...form,
        currentCGPA: form.currentCGPA ? parseFloat(form.currentCGPA) : undefined,
        currentCredits: form.currentCredits ? parseInt(form.currentCredits) : undefined,
        subjects: form.subjects ? form.subjects.split(",").map(s => s.trim()).filter(s => s) : []
      };

      const data = await registerUser(dataToSend);

      if (data.message === "User already exists") {
        alert("User already exists");
        setLoading(false);
        return;
      }

      alert("Account created successfully 🎉");
      window.location.href = "/";

    } catch (error) {
      alert("Server error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join your Student Dashboard</p>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="semester"
          type="number"
          placeholder="Current Semester"
          value={form.semester}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="phone"
          type="tel"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="currentCGPA"
          type="number"
          step="0.01"
          min="0"
          max="4"
          placeholder="Current CGPA (optional)"
          value={form.currentCGPA}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="currentCredits"
          type="number"
          placeholder="Current Credits (optional)"
          value={form.currentCredits}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="subjects"
          placeholder="Subjects (comma-separated, optional)"
          value={form.subjects}
          onChange={handleChange}
          style={styles.input}
        />

        <button style={styles.button} onClick={handleRegister}>
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p style={{ fontSize: 14 }}>
          Already have an account?{" "}
          <span
            style={{ color: "#4f46e5", cursor: "pointer" }}
            onClick={() => (window.location.href = "/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4f46e5, #6366f1)"
  },
  card: {
    width: "380px",
    padding: "40px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "600"
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "10px"
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px"
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#4f46e5",
    color: "white",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer"
  }
};

export default Register;