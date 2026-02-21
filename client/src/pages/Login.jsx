import { useState } from "react";
import { loginUser } from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({ email, password });

      if (data.message === "Invalid credentials") {
        alert("Invalid email or password");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";

    } catch (error) {
      alert("Server error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to your Student Dashboard</p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button} onClick={handleLogin}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p style={{ fontSize: 14 }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#4f46e5", cursor: "pointer" }}
            onClick={() => (window.location.href = "/register")}
          >
            Register
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
    width: "350px",
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

export default Login;