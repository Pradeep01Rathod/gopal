"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMsg({ type: "error", text: "Please enter both email and password." });
      return;
    }

    setMsg({
      type: "success",
      text: isLogin
        ? `Successfully logged in as ${email}!`
        : `Account created for ${email}! You can now use the detector.`
    });
  };

  return (
    <div style={{ maxWidth: "460px", margin: "2rem auto" }}>
      <div className="card">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="brand-icon" style={{ margin: "0 auto 1rem auto", width: "48px", height: "48px", fontSize: "1.5rem" }}>
            🛡️
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "0.5rem" }}>
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {isLogin
              ? "Access ReviewGuard AI's full review scanning tools"
              : "Register to track and audit seller review health"}
          </p>
        </div>

        {msg && (
          <div style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            marginBottom: "1.25rem",
            fontSize: "0.9rem",
            background: msg.type === "error" ? "var(--danger-bg)" : "var(--success-bg)",
            color: msg.type === "error" ? "#f87171" : "#34d399",
            border: `1px solid ${msg.type === "error" ? "var(--danger)" : "var(--success)"}`
          }}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginBottom: "1rem" }}>
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          {isLogin ? "Don't have an account yet? " : "Already have an account? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setMsg(null); }}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-blue)",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link href="/" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            ← Back to Review Detector
          </Link>
        </div>
      </div>
    </div>
  );
}
