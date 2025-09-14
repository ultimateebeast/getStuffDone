import React, { useState } from "react";
import TodoApp from "./components/TodoApp";
import KanbanBoard from "./components/KanbanBoard";
import CalendarView from "./components/CalendarView";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

const TABS = [
  { key: "todo", label: "To-Do List" },
  { key: "kanban", label: "Kanban Board" },
  { key: "calendar", label: "Calendar" },
  { key: "analytics", label: "Analytics" },
];

function App() {
  const [tab, setTab] = useState("todo");
  return (
    <div style={{ background: "#181818", minHeight: "100vh" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          padding: "24px 0",
          background: "#222",
          borderBottom: "2px solid #ffd700",
        }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "12px 32px",
              borderRadius: 12,
              background: tab === t.key ? "#ffd700" : "#333",
              color: tab === t.key ? "#222" : "#fff",
              border: "none",
              fontWeight: 700,
              fontSize: 18,
              boxShadow: tab === t.key ? "0 2px 8px #ffd70044" : "none",
              cursor: "pointer",
            }}>
            {t.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "32px 0" }}>
        {tab === "todo" && <TodoApp />}
        {tab === "kanban" && <KanbanBoard />}
        {tab === "calendar" && <CalendarView />}
        {tab === "analytics" && <AnalyticsDashboard />}
      </div>
    </div>
  );
}

export default App;
