import React, { useEffect, useState } from "react";
import axios from "axios";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

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

  if (error) return <div className="auth-error">{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div className="auth-container">
      <h2>User Profile</h2>
      <div>
        <strong>Username:</strong> {profile.username}
      </div>
    </div>
  );
}

export default UserProfile;
