import React, { useEffect, useState } from "react";
import axios from "axios";

function CalendarView() {
  const [tasks, setTasks] = useState([]);
  const [range, setRange] = useState({ start: "", end: "" });

  const fetchTasks = async () => {
    if (range.start && range.end) {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `/api/calendar?start=${range.start}&end=${range.end}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(res.data);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [range]);

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "40px auto",
        background: "#222",
        borderRadius: 16,
        padding: 24,
        color: "#fff",
      }}>
      <h2 style={{ color: "#ffd700", textAlign: "center" }}>Calendar View</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <input
          type="date"
          value={range.start}
          onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
        />
        <input
          type="date"
          value={range.end}
          onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
        />
        <button
          onClick={fetchTasks}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            background: "#ffd700",
            color: "#222",
            border: "none",
            fontWeight: 700,
          }}>
          Show
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{
              background: "#333",
              marginBottom: 12,
              padding: 16,
              borderRadius: 10,
            }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{task.text}</div>
            <div style={{ fontSize: 14, color: "#ffd700" }}>
              Due:{" "}
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
            </div>
            <div style={{ fontSize: 14 }}>Priority: {task.priority}</div>
            <div style={{ fontSize: 14 }}>
              Labels: {task.labels && task.labels.join(", ")}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CalendarView;
