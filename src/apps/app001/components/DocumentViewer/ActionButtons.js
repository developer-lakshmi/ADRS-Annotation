import React from "react";
import { RotateCw, CheckCircle2, Download } from "lucide-react";

const ActionButtons = ({ onProcess, onApprove, onDownload }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 16,
      padding: "12px 24px 0 24px",
      background: "transparent",
      zIndex: 2,
    }}
  >
    <button
      onClick={onProcess}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#374151", // Gray 700
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "8px 20px",
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        boxShadow: "0 2px 8px #37415122",
        transition: "background 0.2s",
      }}
      title="Reprocess"
    >
      <RotateCw size={18} style={{ marginRight: 4 }} />
      Reprocess
    </button>
    <button
      onClick={onApprove}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#0d9488", // Teal 600
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "8px 20px",
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        boxShadow: "0 2px 8px #0d948822",
        transition: "background 0.2s",
      }}
      title="Approve"
    >
      <CheckCircle2 size={18} style={{ marginRight: 4 }} />
      Approve
    </button>
    <button
      onClick={onDownload}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#6366f1", // Indigo 500
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "8px 20px",
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        boxShadow: "0 2px 8px #6366f122",
        transition: "background 0.2s",
      }}
      title="Download"
    >
      <Download size={18} style={{ marginRight: 4 }} />
      Download
    </button>
  </div>
);

export default ActionButtons;