import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {signupWithEmail, validateEmail, validatePasswordComplexity} from "../../services/authService";
import "./signup.css";

export default function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }
    if (!validatePasswordComplexity(password)) {
      setError(
        "Password must be 8+ chars, include at least 1 number and 1 special character."
      );
      return;
    }
    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      await signupWithEmail(email, password);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-page">
      <div className="auth-card">
        <h1>Sign up</h1>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Password (8+ chars, 1 number, 1 special)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label>
            Repeat password
            <input
              type="password"
              placeholder="Repeat password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
          </label>

          <button
            type="submit"
            className="btn primary auth-btn"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
