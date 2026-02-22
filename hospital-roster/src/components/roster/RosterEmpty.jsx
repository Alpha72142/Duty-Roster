import { useState } from "react";
import WorkerModal from "../worker/WorkerModal";
import { UserPlus, Calendar } from "lucide-react";

export default function RosterEmpty() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "60px 40px",
        textAlign: "center",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "14px",
          background: "var(--accent-subtle)",
          border: "1px solid var(--accent-subtle-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}
      >
        <Calendar size={24} style={{ color: "var(--accent)" }} />
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: "18px",
          color: "var(--text-primary)",
          marginBottom: "8px",
        }}
      >
        No staff members yet
      </div>
      <div
        style={{
          color: "var(--text-muted)",
          fontSize: "13px",
          maxWidth: "300px",
          margin: "0 auto 24px",
        }}
      >
        Add your first staff member to start building the duty roster.
      </div>

      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        <UserPlus size={15} />
        Add First Staff Member
      </button>

      <WorkerModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
