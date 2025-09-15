import React, { useState } from "react";
import axios from "axios";

function SignIn({ onSignIn }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/auth/signin", form);
      localStorage.setItem("token", res.data.token);
      onSignIn && onSignIn();
    } catch (err) {
      setError(err.response?.data?.message || "Sign in failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f6fa 0%, #e5e9f2 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
      }}>
      <div
        style={{
          background:
            "rgba(255,255,255,0.65) linear-gradient(135deg, #f5f6fa 0%, #e5e9f2 100%)",
          borderRadius: 24,
          boxShadow:
            "0 8px 32px 0 rgba(31,38,135,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.08)",
          padding: "48px 40px",
          minWidth: 340,
          maxWidth: 400,
          width: "100%",
          color: "var(--apple-dark)",
          textAlign: "center",
          backdropFilter: "blur(16px)",
          border: "1.5px solid rgba(255,255,255,0.18)",
          transition: "box-shadow 0.3s cubic-bezier(.4,0,.2,1)",
        }}>
        <h2
          style={{
            fontWeight: 800,
            fontSize: 36,
            marginBottom: 28,
            color: "var(--apple-primary)",
            letterSpacing: 1,
            textShadow: "0 2px 8px #0071e322",
          }}>
          Sign In
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            style={{
              padding: "14px 18px",
              borderRadius: 14,
              border: "1.5px solid var(--apple-secondary)",
              fontSize: 18,
              marginBottom: 10,
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              transition: "border-color 0.3s cubic-bezier(.4,0,.2,1)",
            }}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              padding: "14px 18px",
              borderRadius: 14,
              border: "1.5px solid var(--apple-secondary)",
              fontSize: 18,
              marginBottom: 10,
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              transition: "border-color 0.3s cubic-bezier(.4,0,.2,1)",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "14px 0",
              borderRadius: 14,
              background:
                "linear-gradient(90deg, var(--apple-primary) 0%, #2997ff 100%)",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              fontSize: 20,
              boxShadow: "0 2px 12px #0071e322",
              cursor: "pointer",
              transition: "background 0.3s cubic-bezier(.4,0,.2,1)",
              marginTop: 10,
            }}>
            Sign In
          </button>
        </form>
        {error && (
          <div style={{ color: "var(--apple-danger)", marginTop: 18 }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default SignIn;
