import { useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorker } from "../../api/worker.api";
import { X, UserPlus } from "lucide-react";

export default function WorkerModal({ open, onClose }) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [color, setColor] = useState("#2563eb");

  const createMut = useMutation({
    mutationFn: createWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      onClose();
      setName("");
      setDepartment("");
      setColor("#2563eb");
    },
  });

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    createMut.mutate({ name, department, color });
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(2px)",
      }}
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          boxShadow: "var(--shadow-dropdown)",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: "15px",
                color: "var(--text-primary)",
              }}
            >
              Add Worker
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "2px",
              }}
            >
              Fill in the details to add a new staff member.
            </div>
          </div>
          <button
            className="btn btn-default btn-sm"
            onClick={onClose}
            style={{ padding: "4px 8px" }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              Name <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input
              placeholder="e.g. Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                fontSize: "13px",
                outline: "none",
                width: "100%",
              }}
            />
          </div>

          {/* Department */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              Department
            </label>
            <input
              placeholder="e.g. Emergency"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                fontSize: "13px",
                outline: "none",
                width: "100%",
              }}
            />
          </div>

          {/* Color */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              Colour
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--bg-surface)",
              }}
            >
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                style={{
                  width: "28px",
                  height: "28px",
                  border: "none",
                  borderRadius: "6px",
                  background: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {color}
              </span>
              {/* Live preview swatch */}
              <div
                style={{
                  marginLeft: "auto",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: color,
                  flexShrink: 0,
                }}
              />
            </div>
          </div>

          {/* Error */}
          {createMut.isError && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: "var(--danger-subtle)",
                color: "var(--danger)",
                fontSize: "12px",
              }}
            >
              {createMut.error?.message || "Something went wrong."}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            padding: "12px 20px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <button className="btn btn-default btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-sm"
            onClick={handleSubmit}
            disabled={!name.trim() || createMut.isPending}
            style={{
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              opacity: !name.trim() ? 0.5 : 1,
            }}
          >
            <UserPlus size={13} />
            {createMut.isPending ? "Creating…" : "Create Worker"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
