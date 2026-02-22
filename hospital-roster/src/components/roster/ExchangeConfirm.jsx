import { createPortal } from "react-dom";
import { ArrowLeftRight, X } from "lucide-react";

const TYPE_CLASS = {
  shift: "duty-shift",
  leave: "duty-leave",
  off: "duty-off",
  special: "duty-special",
};

function AssignmentCard({ label, worker, date, assignment, dutyCodes }) {
  const duty = dutyCodes?.find(
    (d) => d.id === assignment?.dutyCodeId || d.id === assignment?.duty_code_id,
  );

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        padding: "12px 14px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontWeight: 600,
          fontSize: "13px",
          color: "var(--text-primary)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {worker?.name}
      </div>
      <div
        style={{
          fontSize: "11px",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          marginBottom: "8px",
          marginTop: "2px",
        }}
      >
        {date}
      </div>
      {duty ? (
        <span className={`duty-badge ${TYPE_CLASS[duty.type] || "duty-off"}`}>
          {duty.code}
        </span>
      ) : (
        <span style={{ fontSize: "12px", color: "var(--border-strong)" }}>
          —
        </span>
      )}
    </div>
  );
}

export default function ExchangeConfirm({
  open,
  source,
  target,
  dutyCodes,
  onCancel,
  onConfirm,
  isPending,
}) {
  if (!open) return null;

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
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          boxShadow: "var(--shadow-dropdown)",
          width: "100%",
          maxWidth: "440px",
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
              Confirm Swap
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "2px",
              }}
            >
              These two assignments will be swapped immediately
            </div>
          </div>
          <button
            className="btn btn-default btn-sm"
            onClick={onCancel}
            style={{ padding: "4px 8px" }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Cards */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AssignmentCard
              label="From"
              worker={source?.worker}
              date={source?.date}
              assignment={source?.assignment}
              dutyCodes={dutyCodes}
            />
            <div
              style={{
                flexShrink: 0,
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)",
              }}
            >
              <ArrowLeftRight size={14} />
            </div>
            <AssignmentCard
              label="To"
              worker={target?.worker}
              date={target?.date}
              assignment={target?.assignment}
              dutyCodes={dutyCodes}
            />
          </div>
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
          <button className="btn btn-default btn-sm" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-sm"
            onClick={onConfirm}
            disabled={isPending}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
            }}
          >
            <ArrowLeftRight size={13} />
            {isPending ? "Swapping…" : "Confirm Swap"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
