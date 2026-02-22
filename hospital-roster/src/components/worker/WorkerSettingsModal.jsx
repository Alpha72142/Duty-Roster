import { useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorker, deleteWorker } from "../../api/worker.api";
import { X, Trash2, AlertTriangle, Save } from "lucide-react";

export default function WorkerSettingsModal({ worker, onClose }) {
  const queryClient = useQueryClient();

  // ✅ ALL hooks must be called before any conditional return
  const [name, setName] = useState(worker?.name || "");
  const [phone, setPhone] = useState(worker?.phone || "");
  const [color, setColor] = useState(worker?.color || "#2563eb");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["workers"] });
    queryClient.invalidateQueries({ queryKey: ["roster"] });
  };

  const editMut = useMutation({
    mutationFn: ({ id, data }) => updateWorker(id, data),
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteWorker,
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  // ✅ Conditional return AFTER all hooks
  if (!worker) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    editMut.mutate({ id: worker.id, data: { name, phone, color } });
  };

  const handleDelete = () => {
    deleteMut.mutate(worker.id);
  };

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
          maxWidth: "400px",
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
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "var(--text-primary)",
                }}
              >
                {worker.name}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginTop: "1px",
                }}
              >
                Worker settings
              </div>
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

        {/* Body — edit form */}
        {!confirmDelete ? (
          <div
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                }}
              >
                Name <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  outline: "none",
                  width: "100%",
                }}
              />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                }}
              >
                Phone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  outline: "none",
                  width: "100%",
                }}
              />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                }}
              >
                Colour
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-surface)",
                }}
              >
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={{
                    width: "28px",
                    height: "28px",
                    border: "none",
                    borderRadius: "6px",
                    background: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {color}
                </span>
                <div
                  style={{
                    marginLeft: "auto",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0,
                  }}
                />
              </div>
            </div>

            {editMut.isError && (
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "var(--danger-subtle)",
                  color: "var(--danger)",
                  fontSize: "12px",
                }}
              >
                {editMut.error?.message || "Failed to update worker."}
              </div>
            )}
          </div>
        ) : (
          /* Confirm delete view */
          <div
            style={{
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "var(--danger-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangle size={20} color="var(--danger)" />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "var(--text-primary)",
                }}
              >
                Delete {worker.name}?
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                }}
              >
                This will permanently remove the worker and all their
                assignments. This cannot be undone.
              </div>
            </div>
            {deleteMut.isError && (
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "var(--danger-subtle)",
                  color: "var(--danger)",
                  fontSize: "12px",
                  width: "100%",
                }}
              >
                {deleteMut.error?.message || "Failed to delete worker."}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            borderTop: "1px solid var(--border)",
          }}
        >
          {!confirmDelete ? (
            <>
              <button
                className="btn btn-sm"
                onClick={() => setConfirmDelete(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--danger-subtle)",
                  color: "var(--danger)",
                  border: "none",
                }}
              >
                <Trash2 size={13} />
                Delete
              </button>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="btn btn-default btn-sm" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className="btn btn-sm"
                  onClick={handleSave}
                  disabled={!name.trim() || editMut.isPending}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "var(--accent)",
                    color: "#fff",
                    border: "none",
                    opacity: !name.trim() ? 0.5 : 1,
                  }}
                >
                  <Save size={13} />
                  {editMut.isPending ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                className="btn btn-default btn-sm"
                onClick={() => setConfirmDelete(false)}
              >
                Go Back
              </button>
              <button
                className="btn btn-sm"
                onClick={handleDelete}
                disabled={deleteMut.isPending}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "var(--danger)",
                  color: "#fff",
                  border: "none",
                }}
              >
                <Trash2 size={13} />
                {deleteMut.isPending ? "Deleting…" : "Yes, Delete"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
