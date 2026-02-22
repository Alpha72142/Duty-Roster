import { useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDutyCodes, updateDutyCode } from "../../api/dutyCode.api";
import { X } from "lucide-react";

const TYPE_CLASS = {
  shift: "duty-shift",
  leave: "duty-leave",
  off: "duty-off",
  special: "duty-special",
};

export default function DutyLimitsModal({ open, onClose }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState({});
  const [saved, setSaved] = useState(null);

  const { data: codes = [], isLoading } = useQuery({
    queryKey: ["duty-codes"],
    queryFn: getDutyCodes,
    enabled: open,
  });

  const mut = useMutation({
    mutationFn: ({ id, daily_limit }) => updateDutyCode(id, { daily_limit }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["duty-codes"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      setSaved(updated.id);
      setTimeout(() => setSaved(null), 2000);
    },
  });

  const handleSave = (id) => {
    const raw = editing[id];
    const daily_limit = raw === "" ? null : Number(raw);
    mut.mutate({ id, daily_limit });
  };

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
          maxWidth: "560px",
          maxHeight: "80vh",
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
            flexShrink: 0,
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
              Duty Code Limits
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "2px",
              }}
            >
              Set how many staff can be assigned each duty per day. Leave blank
              for no limit. Off-type duties cannot be restricted.
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
        <div style={{ overflowY: "auto", padding: "12px 20px", flex: 1 }}>
          {isLoading && (
            <div
              style={{
                padding: "24px",
                textAlign: "center",
                fontSize: "13px",
                color: "var(--text-muted)",
              }}
            >
              Loading…
            </div>
          )}

          {!isLoading && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {codes.map((c) => {
                const isOff = c.type === "off";
                const currentVal =
                  editing[c.id] !== undefined
                    ? editing[c.id]
                    : (c.daily_limit ?? "");
                const isSaving = mut.isPending && mut.variables?.id === c.id;
                const justSaved = saved === c.id;
                const unchanged =
                  String(currentVal) === String(c.daily_limit ?? "");

                return (
                  <div
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--border)",
                      background: isOff
                        ? "var(--bg-surface)"
                        : "var(--bg-surface)",
                      gap: "12px",
                      opacity: isOff ? 0.6 : 1,
                    }}
                  >
                    {/* Badge + description */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <span
                        className={`duty-badge ${TYPE_CLASS[c.type] || "duty-off"}`}
                        style={{ flexShrink: 0 }}
                      >
                        {c.code}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "var(--text-primary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.description || c.code}
                      </span>
                    </div>

                    {/* Controls */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexShrink: 0,
                      }}
                    >
                      {isOff ? (
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--text-muted)",
                            fontStyle: "italic",
                          }}
                        >
                          Unrestricted
                        </span>
                      ) : (
                        <>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--text-muted)",
                            }}
                          >
                            Daily limit
                          </span>
                          <input
                            type="number"
                            min={1}
                            placeholder="∞"
                            value={currentVal}
                            onChange={(e) =>
                              setEditing((prev) => ({
                                ...prev,
                                [c.id]: e.target.value,
                              }))
                            }
                            style={{
                              width: "60px",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid var(--border)",
                              background: "var(--bg-elevated)",
                              color: "var(--text-primary)",
                              fontSize: "13px",
                              textAlign: "center",
                            }}
                          />
                          <button
                            onClick={() => handleSave(c.id)}
                            disabled={isSaving || unchanged}
                            className="btn btn-sm"
                            style={{
                              background: justSaved
                                ? "var(--success)"
                                : "var(--accent)",
                              color: "#fff",
                              border: "none",
                              minWidth: "56px",
                              opacity: unchanged ? 0.4 : 1,
                            }}
                          >
                            {isSaving ? "…" : justSaved ? "Saved ✓" : "Save"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
