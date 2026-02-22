import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { copyRoster } from "../../api/roster.api";
import { useRosterStore } from "../../store/roster.store";
import { Copy, X } from "lucide-react";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CopyModal({ open, onClose }) {
  const { month, year } = useRosterStore();
  const queryClient = useQueryClient();

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  const [srcMonth, setSrcMonth] = useState(prevMonth);
  const [srcYear, setSrcYear] = useState(prevYear);

  const copyMut = useMutation({
    mutationFn: copyRoster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roster"] });
      onClose();
    },
  });

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box" style={{ maxWidth: "400px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: "16px",
                color: "var(--text-primary)",
              }}
            >
              Copy Roster
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "2px",
              }}
            >
              Copy assignments from a previous month
            </div>
          </div>
          <button
            className="btn btn-default btn-sm"
            onClick={onClose}
            style={{ padding: "4px" }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Source */}
        <div style={{ marginBottom: "16px" }}>
          <label className="label">Copy From</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <select
              className="input"
              value={srcMonth}
              onChange={(e) => setSrcMonth(Number(e.target.value))}
            >
              {MONTH_NAMES.map((m, i) => (
                <option key={i + 1} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <input
              className="input"
              type="number"
              value={srcYear}
              onChange={(e) => setSrcYear(Number(e.target.value))}
              style={{ width: "90px" }}
            />
          </div>
        </div>

        {/* Target */}
        <div
          style={{
            background: "var(--accent-subtle)",
            border: "1px solid var(--accent-subtle-border)",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "13px",
            color: "var(--accent)",
            marginBottom: "20px",
          }}
        >
          → Copying into{" "}
          <strong>
            {MONTH_NAMES[month - 1]} {year}
          </strong>
        </div>

        {copyMut.isError && (
          <div
            style={{
              color: "var(--danger)",
              fontSize: "12px",
              marginBottom: "12px",
            }}
          >
            {copyMut.error?.message || "Copy failed"}
          </div>
        )}

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
        >
          <button className="btn btn-default" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              copyMut.mutate({
                srcMonth,
                srcYear,
                targetMonth: month,
                targetYear: year,
              })
            }
            disabled={copyMut.isPending}
          >
            <Copy size={14} />
            {copyMut.isPending ? "Copying…" : "Copy Roster"}
          </button>
        </div>
      </div>
    </div>
  );
}
