import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  publishRoster,
  lockRoster,
  unlockRoster,
} from "../../api/rosterPeriod.api";
import { exportRosterTemplate } from "../../api/export.api";
import { copyRoster } from "../../api/roster.api";
import { useRosterStore } from "../../store/roster.store";
import { useTheme } from "../../providers/ThemeProvider";
import WorkerModal from "../worker/WorkerModal";
import CopyModal from "./CopyModal";
import {
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Copy,
  Globe,
  Lock,
  Unlock,
  ArrowLeftRight,
  Layers,
  Download,
  Sun,
  Moon,
} from "lucide-react";
import { SlidersHorizontal } from "lucide-react";
import DutyLimitsModal from "./DutyLimitsModal";

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

export default function RosterToolbar({ period }) {
  const [openWorker, setOpenWorker] = useState(false);
  const [openCopy, setOpenCopy] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const [openDutyLimits, setOpenDutyLimits] = useState(false);

  const {
    month,
    year,
    setMonthYear,
    exchangeMode,
    startExchangeMode,
    stopExchangeMode,
    bulkMode,
    toggleBulkMode,
  } = useRosterStore();

  const queryClient = useQueryClient();

  const publishMut = useMutation({
    mutationFn: publishRoster,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["period"] }),
  });

  const lockMut = useMutation({
    mutationFn: lockRoster,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["period"] }),
  });

  const unlockMut = useMutation({
    mutationFn: unlockRoster,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["period"] }),
  });

  const handleExport = async () => {
    try {
      setExporting(true);
      await exportRosterTemplate(month, year);
    } finally {
      setExporting(false);
    }
  };

  const prev = () => {
    if (month === 1) setMonthYear(12, year - 1);
    else setMonthYear(month - 1, year);
  };

  const next = () => {
    if (month === 12) setMonthYear(1, year + 1);
    else setMonthYear(month + 1, year);
  };

  const status = period?.status || "draft";

  const statusConfig = {
    draft: { label: "Draft", cls: "status-draft" },
    published: { label: "Published", cls: "status-published" },
    locked: { label: "Locked", cls: "status-locked" },
  };

  return (
    <>
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* LEFT — Month Navigator */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button className="btn btn-default btn-sm" onClick={prev}>
            <ChevronLeft size={14} />
          </button>

          <div
            style={{
              padding: "4px 16px",
              fontWeight: 600,
              fontSize: "15px",
              color: "var(--text-primary)",
              minWidth: "160px",
              textAlign: "center",
              letterSpacing: "-0.01em",
            }}
          >
            {MONTH_NAMES[month - 1]} {year}
          </div>

          <button className="btn btn-default btn-sm" onClick={next}>
            <ChevronRight size={14} />
          </button>

          {/* Status badge */}
          <span
            className={`duty-badge ${statusConfig[status].cls}`}
            style={{ marginLeft: "8px", textTransform: "capitalize" }}
          >
            {statusConfig[status].label}
          </span>
        </div>

        {/* RIGHT — Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn btn-default btn-sm"
            onClick={() => setOpenWorker(true)}
            title="Add Worker"
          >
            <UserPlus size={14} />
            Add Worker
          </button>
          <button
            className="btn btn-default btn-sm"
            onClick={() => setOpenDutyLimits(true)}
            title="Duty Limits"
          >
            <SlidersHorizontal size={14} />
            Duty Limits
          </button>
          <button
            className="btn btn-default btn-sm"
            onClick={() => setOpenCopy(true)}
            title="Copy Roster"
          >
            <Copy size={14} />
            Copy
          </button>

          {/* Period controls */}
          <div
            style={{
              width: "1px",
              height: "20px",
              background: "var(--border)",
              margin: "0 2px",
            }}
          />

          <button
            className="btn btn-default btn-sm"
            onClick={() => publishMut.mutate({ month, year })}
            disabled={publishMut.isPending || status === "locked"}
            title="Publish Roster"
          >
            <Globe size={14} />
            Publish
          </button>

          <button
            className="btn btn-default btn-sm"
            onClick={() => lockMut.mutate({ month, year })}
            disabled={lockMut.isPending || status === "locked"}
            title="Lock Roster"
          >
            <Lock size={14} />
            Lock
          </button>

          <button
            className="btn btn-default btn-sm"
            onClick={() => unlockMut.mutate({ month, year })}
            disabled={unlockMut.isPending || status !== "locked"}
            title="Unlock Roster"
          >
            <Unlock size={14} />
            Unlock
          </button>

          <div
            style={{
              width: "1px",
              height: "20px",
              background: "var(--border)",
              margin: "0 2px",
            }}
          />

          {/* Mode toggles */}
          <button
            className={`btn btn-sm ${exchangeMode ? "btn-active" : "btn-default"}`}
            onClick={() =>
              exchangeMode ? stopExchangeMode() : startExchangeMode()
            }
            title="Exchange Mode"
          >
            <ArrowLeftRight size={14} />
            Exchange
          </button>

          <button
            className={`btn btn-sm ${bulkMode ? "btn-active" : "btn-default"}`}
            onClick={toggleBulkMode}
            title="Bulk Assign Mode"
          >
            <Layers size={14} />
            Bulk
          </button>

          <button
            className="btn btn-default btn-sm"
            onClick={handleExport}
            disabled={exporting}
            title="Export to Excel"
          >
            <Download size={14} />
            {exporting ? "Exporting…" : "Export"}
          </button>

          <div
            style={{
              width: "1px",
              height: "20px",
              background: "var(--border)",
              margin: "0 2px",
            }}
          />

          {/* Theme toggle */}
          <button
            className="btn btn-default btn-sm"
            onClick={toggleTheme}
            title="Toggle theme"
            style={{ padding: "4px 8px" }}
          >
            {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
      </div>
      <DutyLimitsModal
        open={openDutyLimits}
        onClose={() => setOpenDutyLimits(false)}
      />
      <WorkerModal open={openWorker} onClose={() => setOpenWorker(false)} />
      <CopyModal open={openCopy} onClose={() => setOpenCopy(false)} />
    </>
  );
}
