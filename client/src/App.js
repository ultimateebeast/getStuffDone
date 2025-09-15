import React, { useState, useEffect } from "react";
import "./apple-theme.css";
import TodoApp from "./components/TodoApp";
import KanbanBoard from "./components/KanbanBoard";
import CalendarView from "./components/CalendarView";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ProfileAnalytics from "./components/ProfileAnalytics";

const TABS = [
  { key: "todo", label: "To-Do List" },
  { key: "kanban", label: "Kanban Board" },
  { key: "calendar", label: "Calendar" },
  { key: "profile", label: "Profile" },
  { key: "signin", label: "Sign In" },
  { key: "signup", label: "Sign Up" },
];

function App() {
  const [tab, setTab] = useState("todo");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleSignIn = () => {
    setIsAuthenticated(true);
    setTab("todo");
  };
  const handleSignUp = () => {
    setTab("signin");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setTab("signin");
  };
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div
      className={`apple-gradient${theme === "dark" ? " dark-mode" : ""}`}
      style={{ minHeight: "100vh" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          padding: "24px 0",
          background:
            theme === "dark" ? "rgba(34,34,38,0.85)" : "rgba(255,255,255,0.85)",
          borderBottom:
            theme === "dark" ? "1px solid #222" : "1px solid #e5e5e7",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          backdropFilter: "blur(8px)",
        }}>
        <button
          onClick={toggleTheme}
          className="btn apple-transition"
          style={{
            fontWeight: 700,
            fontSize: 16,
            background:
              theme === "dark"
                ? "var(--apple-primary)"
                : "var(--apple-secondary)",
            color: theme === "dark" ? "#fff" : "var(--apple-dark)",
            marginRight: 16,
          }}>
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        {isAuthenticated ? (
          <>
            {TABS.filter((t) => t.key !== "signin" && t.key !== "signup").map(
              (t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`btn apple-transition${
                    tab === t.key ? " apple-shadow" : ""
                  }`}
                  style={{
                    fontWeight: 700,
                    fontSize: 20,
                    background:
                      tab === t.key
                        ? theme === "dark"
                          ? "#222"
                          : "#fff"
                        : "var(--apple-secondary)",
                    color:
                      tab === t.key
                        ? "var(--apple-primary)"
                        : "var(--apple-dark)",
                    border:
                      tab === t.key ? "2px solid var(--apple-primary)" : "none",
                  }}>
                  {t.label}
                </button>
              )
            )}
            <button
              onClick={handleLogout}
              className="btn apple-transition"
              style={{
                fontWeight: 700,
                fontSize: 18,
                background: "var(--apple-danger)",
                color: "#fff",
                marginLeft: 16,
              }}>
              Log Out
            </button>
          </>
        ) : (
          TABS.filter((t) => t.key === "signin" || t.key === "signup").map(
            (t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="btn apple-transition"
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  background:
                    tab === t.key
                      ? "var(--apple-primary)"
                      : "var(--apple-secondary)",
                  color: tab === t.key ? "#fff" : "var(--apple-dark)",
                }}>
                {t.label}
              </button>
            )
          )
        )}
      </nav>
      <div style={{ padding: "32px 0" }}>
        {tab === "todo" && isAuthenticated && <TodoApp />}
        {tab === "kanban" && isAuthenticated && <KanbanBoard />}
        {tab === "calendar" && isAuthenticated && <CalendarView />}
        {tab === "profile" && isAuthenticated && <ProfileAnalytics />}
        {tab === "signin" && <SignIn onSignIn={handleSignIn} />}
        {tab === "signup" && <SignUp onSignUp={handleSignUp} />}
        {!isAuthenticated && !["signin", "signup"].includes(tab) && (
          <SignIn onSignIn={handleSignIn} />
        )}
      </div>
    </div>
  );
}

export default App;
