import { memo } from "react";
import WorkerColumn from "./WorkerColumn";
import RosterCell from "./RosterCell";
import { useRosterStore } from "../../store/roster.store";

const RosterRow = memo(function RosterRow({ row, dates, dutyCodes, period }) {
  // ⭐ Pull store state HERE once per row, not once per cell
  const {
    exchangeMode,
    exchangeSource,
    setExchangeSource,
    stopExchangeMode,
    bulkMode,
    bulkCells,
    addBulkCell,
    focusedCell,
    setFocusedCell,
  } = useRosterStore();

  return (
    <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
      <WorkerColumn worker={row.worker} />
      {dates.map((d) => (
        <RosterCell
          key={d.date}
          worker={row.worker}
          date={d.date}
          assignment={row.cells[d.date]}
          dutyCodes={dutyCodes}
          period={period}
          isSunday={d.isSunday}
          // ⭐ Pass store state as flat props so cells don't need to call the store
          exchangeMode={exchangeMode}
          exchangeSource={exchangeSource}
          setExchangeSource={setExchangeSource}
          stopExchangeMode={stopExchangeMode}
          bulkMode={bulkMode}
          bulkCells={bulkCells}
          addBulkCell={addBulkCell}
          focusedCell={focusedCell}
          setFocusedCell={setFocusedCell}
        />
      ))}
    </div>
  );
});

export default RosterRow;
