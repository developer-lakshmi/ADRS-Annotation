import React from "react";

const ActionButtons = ({ onProcess, onApprove, onDownload }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 12,
      padding: "12px 24px 0 24px",
      background: "transparent",
      zIndex: 2,
    }}
  >
    <button
      onClick={onProcess}
      style={{
        background: "#1976d2",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        padding: "8px 16px",
        fontWeight: 500,
        cursor: "pointer",
        boxShadow: "0 2px 8px #1976d222",
      }}
    >
      Reprocess
    </button>
    <button
      onClick={onApprove}
      style={{
        background: "#43a047",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        padding: "8px 16px",
        fontWeight: 500,
        cursor: "pointer",
        boxShadow: "0 2px 8px #43a04722",
      }}
    >
      Approve
    </button>
    <button
      onClick={onDownload}
      style={{
        background: "#fbc02d",
        color: "#333",
        border: "none",
        borderRadius: 4,
        padding: "8px 16px",
        fontWeight: 500,
        cursor: "pointer",
        boxShadow: "0 2px 8px #fbc02d22",
      }}
    >
      Download
    </button>
  </div>
);

export default ActionButtons;