import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAssignment } from "../../api/assignment.api";
import { useRosterStore } from "../../store/roster.store";
import { Layers, X, Check } from "lucide-react";

const TYPE_CLASS = {
  shift: "duty-shift",
  leave: "duty-leave",
  off: "duty-off",
  special: "duty-special",
};

export default function BulkAssignPanel({ dutyCodes }) {
  const { bulkMode, bulkCells, clearBulk, toggleBulkMode } = useRosterStore();
  const queryClient = useQueryClient();

  const createMut = useMutation({
    mutationFn: createAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roster"] }),
  });

  if (!bulkMode) return null;

  const handleAssign = (dutyCodeId) => {
    bulkCells.forEach((c) => {
      createMut.mutate({ workerId: c.worker.id, dutyCodeId, date: c.date });
    });
    clearBulk();
  };

  const handleCancel = () => {
    clearBulk();
    toggleBulkMode();
  };

  return (
    <div
      className="animate-slide-down"
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        boxShadow: "var(--shadow-lg)",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        zIndex: 50,
        maxWidth: "90vw",
        flexWrap: "wrap",
      }}
    >
      {/* Info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <Layers size={16} style={{ color: "var(--accent)" }} />
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          Bulk Assign
        </span>
        {bulkCells.length > 0 && (
          <span
            style={{
              background: "var(--accent)",
              color: "white",
              borderRadius: "20px",
              padding: "1px 8px",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            {bulkCells.length} cells
          </span>
        )}
      </div>

      <div
        style={{
          width: "1px",
          height: "24px",
          background: "var(--border)",
          flexShrink: 0,
        }}
      />

      {/* Duty buttons */}
      {bulkCells.length === 0 ? (
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          Click cells to select them
        </span>
      ) : (
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {dutyCodes.map((d) => (
            <button
              key={d.id}
              onClick={() => handleAssign(d.id)}
              className={`duty-badge ${TYPE_CLASS[d.type] || "duty-off"}`}
              style={{
                cursor: "pointer",
                border: "1px solid transparent",
                transition: "transform 0.1s",
                padding: "4px 10px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {d.code}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          width: "1px",
          height: "24px",
          background: "var(--border)",
          flexShrink: 0,
        }}
      />

      {/* Cancel */}
      <button
        className="btn btn-default btn-sm"
        onClick={handleCancel}
        style={{ flexShrink: 0 }}
      >
        <X size={12} />
        Cancel
      </button>
    </div>
  );
}
