import { useState } from "react";
import { Settings } from "lucide-react";
import WorkerSettingsModal from "../worker/WorkerSettingsModal";

export default function WorkerColumn({ worker }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="worker-col"
        style={{ cursor: "pointer", position: "relative" }}
        onClick={() => setOpen(true)}
        title="Worker settings"
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: worker.color || "#94a3b8",
            flexShrink: 0,
          }}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {worker.name}
          </div>
          {worker.department && (
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {worker.department}
            </div>
          )}
        </div>

        {/* Settings icon — shows on hover via CSS */}
        <Settings
          size={12}
          className="worker-col-settings-icon"
          style={{
            flexShrink: 0,
            color: "var(--text-muted)",
            opacity: 0,
            transition: "opacity 0.15s",
          }}
        />
      </div>

      {open && (
        <WorkerSettingsModal worker={worker} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
