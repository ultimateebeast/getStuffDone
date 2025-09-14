import React, { useRef } from "react";

function MediaUpload({ onUpload }) {
  const fileInput = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onUpload({ name: file.name, url: ev.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <input
        type="file"
        accept="image/*,video/*"
        ref={fileInput}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        style={{
          padding: "8px 16px",
          borderRadius: 8,
          background: "#1976d2",
          color: "#fff",
          border: "none",
          fontWeight: 600,
        }}
        onClick={() => fileInput.current.click()}>
        Upload Media
      </button>
    </div>
  );
}

export default MediaUpload;
