export default function DateHeader({ d }) {
  return (
    <div
      style={{
        width: "var(--cell-w)",
        flexShrink: 0,
        borderRight: "1px solid var(--border)",
        textAlign: "center",
        padding: "6px 0",
        background: d.isSunday
          ? "color-mix(in srgb, var(--danger-subtle) 60%, transparent)"
          : "var(--bg-surface)",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "13px",
          color: d.isSunday ? "var(--danger)" : "var(--text-primary)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {d.day}
      </div>
      <div
        style={{
          fontSize: "10px",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {d.weekday}
      </div>
    </div>
  );
}
