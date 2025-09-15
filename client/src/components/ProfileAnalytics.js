import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

function ProfileAnalytics() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [completion, setCompletion] = useState({});
  const [timetracking, setTimetracking] = useState({});
  const [dashboard, setDashboard] = useState({});
  const [filter, setFilter] = useState("week");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Error fetching profile")
      );
  }, []);

  useEffect(() => {
    axios
      .get("/api/analytics/completion")
      .then((res) => setCompletion(res.data));
    axios
      .get("/api/analytics/timetracking")
      .then((res) => setTimetracking(res.data));
    axios.get("/api/analytics/dashboard").then((res) => setDashboard(res.data));
  }, [filter]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    const token = localStorage.getItem("token");
    try {
      await axios.post("/api/auth/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setAvatar(URL.createObjectURL(file));
    } catch (err) {
      setError("Failed to upload avatar");
    }
    setUploading(false);
  };

  if (error)
    return <div style={{ color: "#e53935", textAlign: "center" }}>{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 16,
        padding: 32,
        color: "#222",
        boxShadow: "0 8px 32px #0002",
      }}>
      <h2
        style={{
          color: "#222",
          textAlign: "center",
          fontSize: 36,
          fontWeight: 800,
        }}>
        User Profile & Analytics
      </h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          marginBottom: 32,
        }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 16 }}>
            <img
              src={
                avatar ||
                profile.avatar ||
                "https://ui-avatars.com/api/?name=" + profile.username
              }
              alt="avatar"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
                boxShadow: "0 2px 8px #0002",
              }}
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={uploading}
            style={{ marginBottom: 8 }}
          />
          <div>
            <strong>Username:</strong> {profile.username}
          </div>
          <div>
            <strong>Email:</strong> {profile.email}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: "#222", fontSize: 24 }}>Quick Stats</h3>
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
                plugins: { legend: { labels: { color: "#222" } } },
                scales: {
                  x: { ticks: { color: "#222" } },
                  y: { ticks: { color: "#222" } },
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
      </div>
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ color: "#222", fontSize: 24 }}>Task Completion Trends</h3>
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
                x: { ticks: { color: "#222" } },
                y: { ticks: { color: "#222" } },
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
        <h3 style={{ color: "#222", fontSize: 24 }}>Time Tracking</h3>
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
            options={{ plugins: { legend: { labels: { color: "#222" } } } }}
            height={80}
          />
        ) : (
          <div style={{ color: "#ffd700", fontWeight: 600 }}>
            No time tracking data available.
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileAnalytics;
