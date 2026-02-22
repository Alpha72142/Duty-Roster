import { useRef, useEffect, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import DateHeader from "./DateHeader";
import RosterRow from "./RosterRow";

const HEADER_HEIGHT = 40; // height of the sticky date header row

export default function RosterGrid({ matrix, dates, dutyCodes, period }) {
  const containerRef = useRef(null);
  const parentRef = useRef(null);
  const [scrollHeight, setScrollHeight] = useState(window.innerHeight - 120);

  // ⭐ Measure available height dynamically so virtualizer gets a real px height
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setScrollHeight(window.innerHeight - rect.top - 8);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: matrix.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
    getItemKey: (index) => matrix[index]?.worker?.id,
  });

  const gridWidth = 220 + dates.length * 52;

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <div
        ref={parentRef}
        style={{
          height: scrollHeight, // ⭐ explicit px height — no flex guessing
          overflowX: "auto",
          overflowY: "auto",
          willChange: "transform", // ⭐ promotes to GPU layer
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ width: gridWidth, minWidth: "100%" }}>
          {/* STICKY HEADER */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              background: "var(--bg-surface)",
              borderBottom: "1px solid var(--border)",
              height: HEADER_HEIGHT,
            }}
          >
            <div style={{ display: "flex", height: "100%" }}>
              <div
                style={{
                  width: "220px",
                  flexShrink: 0,
                  borderRight: "1px solid var(--border)",
                  padding: "8px 12px",
                  position: "sticky",
                  left: 0,
                  zIndex: 30,
                  background: "var(--bg-surface)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Staff
                </span>
              </div>
              {dates.map((d) => (
                <DateHeader key={d.date} d={d} />
              ))}
            </div>
          </div>

          {/* VIRTUAL ROWS */}
          <div
            style={{
              height: rowVirtualizer.getTotalSize(),
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = matrix[virtualRow.index];
              if (!row) return null;
              return (
                <div
                  key={row.worker.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <RosterRow
                    row={row}
                    dates={dates}
                    dutyCodes={dutyCodes}
                    period={period}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
