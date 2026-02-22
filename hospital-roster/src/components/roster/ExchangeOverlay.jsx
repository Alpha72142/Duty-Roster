export default function ExchangeOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        border: "2px solid var(--warning)",
        borderRadius: "3px",
        pointerEvents: "none",
        zIndex: 3,
      }}
    />
  );
}
