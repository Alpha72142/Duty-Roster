export default function RosterSkeleton({ dates }) {
  return (
    <div className="roster-grid-container">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border)",
            animationDelay: `${i * 0.06}s`,
          }}
        >
          <div
            className="skeleton"
            style={{
              width: "220px",
              height: "40px",
              flexShrink: 0,
              borderRight: "1px solid var(--border)",
            }}
          />
          {dates.map((d) => (
            <div
              key={d.date}
              className="skeleton"
              style={{
                width: "52px",
                height: "40px",
                flexShrink: 0,
                borderRight: "1px solid var(--border)",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
