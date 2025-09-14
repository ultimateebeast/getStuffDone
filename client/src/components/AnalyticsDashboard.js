import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

function AnalyticsDashboard() {
  const [completion, setCompletion] = useState({});
  const [timetracking, setTimetracking] = useState({});
  const [dashboard, setDashboard] = useState({});
  const [filter, setFilter] = useState("week");

  useEffect(() => {
    axios
      .get("/api/analytics/completion")
      .then((res) => setCompletion(res.data));
    axios
      .get("/api/analytics/timetracking")
      .then((res) => setTimetracking(res.data));
    axios.get("/api/analytics/dashboard").then((res) => setDashboard(res.data));
  }, [filter]);

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        background: "#222",
        borderRadius: 16,
        padding: 32,
        color: "#fff",
        boxShadow: "0 8px 32px #0006",
      }}>
      <h2
        style={{
          color: "#ffd700",
          textAlign: "center",
          fontSize: 36,
          fontWeight: 800,
        }}>
        Real Analytics & Insights
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          margin: "24px 0",
        }}>
        <button
          onClick={() => setFilter("week")}
          style={{
            background: filter === "week" ? "#ffd700" : "#333",
            color: filter === "week" ? "#222" : "#ffd700",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontWeight: 700,
            fontSize: 18,
            cursor: "pointer",
          }}>
          Weekly
        </button>
        <button
          onClick={() => setFilter("month")}
          style={{
            background: filter === "month" ? "#ffd700" : "#333",
            color: filter === "month" ? "#222" : "#ffd700",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontWeight: 700,
            fontSize: 18,
            cursor: "pointer",
          }}>
          Monthly
        </button>
      </div>
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ color: "#ffd700", fontSize: 24 }}>
          Task Completion Trends
        </h3>
        {completion && completion.trends && completion.trends.length > 0 ? (
          <Bar
            data={{
              labels: completion.trends.map((trend) => trend.week),
              datasets: [
                {
                  label: "Completed Tasks",
                  data: completion.trends.map((trend) => trend.completed),
                  backgroundColor: "#ffd700",
                },
              ],
            }}
            options={{
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: "#fff" } },
                y: { ticks: { color: "#fff" } },
              },
            }}
            height={80}
          />
        ) : (
          <div style={{ color: "#ffd700", fontWeight: 600 }}>
            No completion data available.
          </div>
        )}
      </div>
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ color: "#ffd700", fontSize: 24 }}>Time Tracking</h3>
        {timetracking && Object.keys(timetracking).length > 0 ? (
          <Pie
            data={{
              labels: [
                "Overdue",
                "Completed Late",
                "Avg Completion Time (hrs)",
              ],
              datasets: [
                {
                  data: [
                    timetracking.overdue,
                    timetracking.completedLate,
                    timetracking.avgCompletionTime,
                  ],
                  backgroundColor: ["#e53935", "#ffa726", "#ffd700"],
                },
              ],
            }}
            options={{ plugins: { legend: { labels: { color: "#fff" } } } }}
            height={80}
          />
        ) : (
          <div style={{ color: "#ffd700", fontWeight: 600 }}>
            No time tracking data available.
          </div>
        )}
      </div>
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ color: "#ffd700", fontSize: 24 }}>Dashboard Stats</h3>
        {dashboard && Object.keys(dashboard).length > 0 ? (
          <Line
            data={{
              labels: ["Total", "Completed", "Active", "Overdue"],
              datasets: [
                {
                  label: "Tasks",
                  data: [
                    dashboard.total,
                    dashboard.completed,
                    dashboard.active,
                    dashboard.overdue,
                  ],
                  borderColor: "#ffd700",
                  backgroundColor: "rgba(255,215,0,0.2)",
                  tension: 0.4,
                },
              ],
            }}
            options={{
              plugins: { legend: { labels: { color: "#fff" } } },
              scales: {
                x: { ticks: { color: "#fff" } },
                y: { ticks: { color: "#fff" } },
              },
            }}
            height={80}
          />
        ) : (
          <div style={{ color: "#ffd700", fontWeight: 600 }}>
            No dashboard stats available.
          </div>
        )}
      </div>
      );
    </div>
  );
}

export default AnalyticsDashboard;
