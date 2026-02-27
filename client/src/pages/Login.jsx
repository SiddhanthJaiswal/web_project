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
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Log in to your StudentOS dashboard.</p>

        <input
          className="input"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary" onClick={handleLogin}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="auth-footer-text">
          Don't have an account?{" "}
          <span
            className="auth-link"
            onClick={() => (window.location.href = "/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;