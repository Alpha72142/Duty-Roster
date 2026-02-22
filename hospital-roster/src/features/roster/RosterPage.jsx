import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { getWorkers } from "../../api/worker.api";
import { getDutyCodes } from "../../api/dutyCode.api";
import { getRosterMonth } from "../../api/assignment.api";
import { getRosterPeriodStatus } from "../../api/rosterPeriod.api";

import { useRosterStore } from "../../store/roster.store";

import { getMonthDates } from "../../utils/date.utils";
import { buildRosterMatrix } from "./rosterMatrix";
import { normalizeArray } from "../../utils/apiNormalize";

import useRosterKeyboard from "../../hooks/useRosterKeyboard";

import RosterGrid from "../../components/roster/RosterGrid";
import RosterToolbar from "../../components/roster/RosterToolbar";
import RosterSkeleton from "../../components/roster/RosterSkeleton";
import RosterEmpty from "../../components/roster/RosterEmpty";
import BulkAssignPanel from "../../components/roster/BulkAssignPanel";

export default function RosterPage() {
  const { month, year, bulkMode } = useRosterStore();

  const workersQuery = useQuery({ queryKey: ["workers"], queryFn: getWorkers });
  const dutyCodesQuery = useQuery({
    queryKey: ["dutyCodes"],
    queryFn: getDutyCodes,
  });
  const rosterQuery = useQuery({
    queryKey: ["roster", month, year],
    queryFn: () => getRosterMonth(month, year),
  });
  const periodQuery = useQuery({
    queryKey: ["period", month, year],
    queryFn: () => getRosterPeriodStatus(month, year),
  });

  const dates = useMemo(() => getMonthDates(month, year), [month, year]);

  const workers = normalizeArray(workersQuery.data, ["workers"]);
  const dutyCodes = normalizeArray(dutyCodesQuery.data, ["dutyCodes"]);

  const matrix = useMemo(() => {
    if (!workersQuery.data || !rosterQuery.data) return [];
    return buildRosterMatrix(workersQuery.data, dates, rosterQuery.data);
  }, [workersQuery.data, rosterQuery.data, dates]);

  useRosterKeyboard(matrix, dates);

  const isLoading = workersQuery.isLoading || rosterQuery.isLoading;
  const isEmpty = !workersQuery.isLoading && workers.length === 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh", // ⭐ full viewport height
        overflow: "hidden", // ⭐ prevent page scroll, let grid scroll internally
        padding: "16px 24px",
        gap: "12px",
        boxSizing: "border-box",
      }}
    >
      {/* Toolbar — fixed height */}
      <div style={{ flexShrink: 0 }}>
        <RosterToolbar period={periodQuery.data} />
      </div>

      {/* Bulk mode banner */}
      {bulkMode && (
        <div
          style={{ flexShrink: 0 }}
          className="text-sm bg-purple-50 border p-2 rounded"
        >
          Bulk mode active → select cells then choose duty below
        </div>
      )}

      {/* Main content — takes remaining height */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isEmpty && <RosterEmpty />}
        {!isEmpty && isLoading && <RosterSkeleton dates={dates} />}
        {!isEmpty && !isLoading && (
          <>
            <RosterGrid
              matrix={matrix}
              dates={dates}
              dutyCodes={dutyCodes}
              period={periodQuery.data}
            />
            <BulkAssignPanel dutyCodes={dutyCodes} />
          </>
        )}
      </div>
    </div>
  );
}
