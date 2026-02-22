import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAvailability } from "../../api/availability.api";
import {
  createAssignment,
  editAssignment,
  removeAssignment,
} from "../../api/assignment.api";
import { normalizeArray } from "../../utils/apiNormalize";
import { Trash2 } from "lucide-react";

const TYPE_CLASS = {
  shift: "duty-shift",
  leave: "duty-leave",
  off: "duty-off",
  special: "duty-special",
};

export default function DutyDropdown({
  worker,
  date,
  assignment,
  close,
  anchorRef,
}) {
  const queryClient = useQueryClient();
  const ref = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [error, setError] = useState(null);

  /* Position */
  useEffect(() => {
    if (anchorRef?.current) {
      const r = anchorRef.current.getBoundingClientRect();
      const left = r.left + 200 > window.innerWidth ? r.right - 200 : r.left;
      const top =
        r.bottom + 320 > window.innerHeight ? r.top - 320 : r.bottom + 4;
      setPos({ top, left });
    }
  }, [anchorRef]);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [close]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [close]);

  const availabilityQuery = useQuery({
    queryKey: ["availability", worker.id, date],
    queryFn: () => getAvailability(date, worker.id),
    retry: false,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["roster"] });

  const createMut = useMutation({
    mutationFn: createAssignment,
    onSuccess: () => {
      invalidate();
      close();
    },
    onError: (err) => setError(err.message),
  });

  const editMut = useMutation({
    mutationFn: ({ id, payload }) => editAssignment(id, payload),
    onSuccess: () => {
      invalidate();
      close();
    },
    onError: (err) => setError(err.message),
  });

  const removeMut = useMutation({
    mutationFn: removeAssignment,
    onSuccess: () => {
      invalidate();
      close();
    },
    onError: (err) => setError(err.message),
  });

  const handleSelect = (dutyCodeId) => {
    setError(null);
    if (!assignment) {
      createMut.mutate({ workerId: worker.id, dutyCodeId, date });
    } else {
      editMut.mutate({
        id: assignment.id,
        payload: { workerId: worker.id, dutyCodeId, date },
      });
    }
  };

  const handleRemove = () => {
    if (!assignment) return;
    setError(null);
    removeMut.mutate(assignment.id);
  };

  const isPending =
    createMut.isPending || editMut.isPending || removeMut.isPending;

  const options = normalizeArray(availabilityQuery.data, [
    "options",
    "dutyCodes",
  ]);

  const available = options.filter((o) => o.available);
  const unavailable = options.filter((o) => !o.available);

  const OptionButton = ({ opt }) => (
    <button
      key={opt.id}
      disabled={!opt.available}
      onClick={() => handleSelect(opt.id)}
      title={opt.description || opt.code}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "5px 8px",
        borderRadius: "6px",
        border: "none",
        background: "transparent",
        cursor: opt.available ? "pointer" : "not-allowed",
        opacity: opt.available ? 1 : 0.45,
        fontSize: "13px",
        transition: "background 0.1s",
        textAlign: "left",
        gap: "6px",
      }}
      onMouseEnter={(e) => {
        if (opt.available)
          e.currentTarget.style.background = "var(--bg-sunken)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          minWidth: 0,
        }}
      >
        <span className={`duty-badge ${TYPE_CLASS[opt.type] || "duty-off"}`}>
          {opt.code}
        </span>
        <span
          style={{
            fontSize: "11px",
            color: opt.available
              ? "var(--text-secondary)"
              : "var(--text-muted)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {opt.description || ""}
        </span>
      </div>
      {!opt.available && opt.reason && (
        <span
          style={{ fontSize: "9px", color: "var(--text-muted)", flexShrink: 0 }}
        >
          {opt.reason === "Night fatigue rule" ? "🌙" : "⚠"}
        </span>
      )}
    </button>
  );

  const SectionLabel = ({ label }) => (
    <div
      style={{
        padding: "4px 8px 2px",
        fontSize: "10px",
        fontWeight: 700,
        color: "var(--text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {label}
    </div>
  );

  const content = (
    <div
      ref={ref}
      onMouseDown={(e) => e.stopPropagation()}
      className="animate-fade-in"
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 9999,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        boxShadow: "var(--shadow-dropdown)",
        width: "200px",
        maxHeight: "320px",
        overflowY: "auto",
        padding: "6px",
      }}
    >
      {/* Worker + date header */}
      <div
        style={{
          padding: "6px 8px 8px",
          borderBottom: "1px solid var(--border)",
          marginBottom: "4px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          {worker.name}
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {date}
        </div>
      </div>

      {availabilityQuery.isLoading && (
        <div
          style={{
            padding: "12px 8px",
            fontSize: "12px",
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          Loading…
        </div>
      )}

      {availabilityQuery.isError && (
        <div
          style={{ padding: "8px", fontSize: "12px", color: "var(--danger)" }}
        >
          Failed to load availability
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "6px 8px",
            fontSize: "11px",
            color: "var(--danger)",
            background: "var(--danger-subtle)",
            borderRadius: "6px",
            marginBottom: "4px",
          }}
        >
          {error}
        </div>
      )}

      {isPending && (
        <div
          style={{
            padding: "12px 8px",
            fontSize: "12px",
            color: "var(--text-muted)",
            textAlign: "center",
          }}
        >
          Saving…
        </div>
      )}

      {!availabilityQuery.isLoading &&
        !availabilityQuery.isError &&
        !isPending && (
          <>
            {/* Available options */}
            {available.length > 0 && (
              <>
                <SectionLabel label="Available" />
                {available.map((opt) => (
                  <OptionButton key={opt.id} opt={opt} />
                ))}
              </>
            )}

            {/* Unavailable options */}
            {unavailable.length > 0 && (
              <>
                <div
                  style={{
                    height: "1px",
                    background: "var(--border)",
                    margin: "4px 0",
                  }}
                />
                <SectionLabel label="Restricted" />
                {unavailable.map((opt) => (
                  <OptionButton key={opt.id} opt={opt} />
                ))}
              </>
            )}
          </>
        )}

      {/* Remove assignment */}
      {assignment && !isPending && (
        <>
          <div
            style={{
              height: "1px",
              background: "var(--border)",
              margin: "4px 0",
            }}
          />
          <button
            onClick={handleRemove}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              width: "100%",
              padding: "5px 8px",
              borderRadius: "6px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--danger)",
              fontSize: "12px",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--danger-subtle)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Trash2 size={12} />
            Remove assignment
          </button>
        </>
      )}
    </div>
  );

  return createPortal(content, document.body);
}
