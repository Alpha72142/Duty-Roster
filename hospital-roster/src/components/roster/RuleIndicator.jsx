export default function RuleIndicator({ type, reason }) {
  if (!type) return null;

  const config = {
    night: { color: "#7c3aed", bg: "#f5f3ff", label: "N" },
    unavailable: {
      color: "var(--danger)",
      bg: "var(--danger-subtle)",
      label: "!",
    },
    locked: { color: "var(--text-muted)", bg: "var(--bg-sunken)", label: "🔒" },
  };

  const c = config[type];
  if (!c) return null;

  return (
    <div
      title={reason || type}
      style={{
        position: "absolute",
        top: "2px",
        right: "2px",
        width: "14px",
        height: "14px",
        borderRadius: "50%",
        background: c.bg,
        color: c.color,
        fontSize: "8px",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {c.label}
    </div>
  );
}
