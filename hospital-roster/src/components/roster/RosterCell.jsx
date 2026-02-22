import { memo, useRef, useState, useCallback } from "react";
import DutyDropdown from "./DutyDropdown";
import RuleIndicator from "./RuleIndicator";
import ExchangeOverlay from "./ExchangeOverlay";
import ExchangeConfirm from "./ExchangeConfirm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { swapAssignments } from "../../api/exchange.api";

const TYPE_CLASS = {
  shift: "duty-shift",
  leave: "duty-leave",
  off: "duty-off",
  special: "duty-special",
};

const RosterCell = memo(function RosterCell({
  worker,
  date,
  assignment,
  dutyCodes,
  period,
  isSunday,
  // ⭐ store state passed as flat props from RosterRow
  exchangeMode,
  exchangeSource,
  setExchangeSource,
  stopExchangeMode,
  bulkMode,
  bulkCells,
  addBulkCell,
  focusedCell,
  setFocusedCell,
}) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cellRef = useRef(null);
  const queryClient = useQueryClient();

  const swapMut = useMutation({
    mutationFn: swapAssignments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roster"] });
      stopExchangeMode();
      setConfirmOpen(false);
    },
  });

  const isLocked = period?.status === "locked";

  const duty = dutyCodes?.find(
    (d) => d.id === assignment?.dutyCodeId || d.id === assignment?.duty_code_id,
  );

  const isSource = exchangeSource?.assignment?.id === assignment?.id;

  const isSelected = bulkCells.some(
    (c) => c.worker.id === worker.id && c.date === date,
  );

  const isFocused =
    focusedCell?.worker.id === worker.id && focusedCell?.date === date;

  const handleClick = useCallback(() => {
    setFocusedCell({ worker, date });
    if (isLocked) return;

    if (bulkMode) {
      addBulkCell({ worker, date, assignment });
      return;
    }

    if (exchangeMode) {
      if (!exchangeSource && assignment) {
        setExchangeSource({ worker, date, assignment });
        return;
      }
      if (exchangeSource && assignment) {
        setConfirmOpen(true);
        return;
      }
      return;
    }

    setOpen(true);
  }, [
    worker,
    date,
    assignment,
    isLocked,
    bulkMode,
    exchangeMode,
    exchangeSource,
    addBulkCell,
    setExchangeSource,
    setFocusedCell,
  ]);

  const handleConfirm = useCallback(() => {
    if (!exchangeSource?.assignment || !assignment) return;
    swapMut.mutate({
      fromAssignmentId: exchangeSource.assignment.id,
      toAssignmentId: assignment.id,
    });
  }, [exchangeSource, assignment, swapMut]);

  const cellClass = [
    "roster-cell",
    isLocked ? "locked" : "",
    isSunday ? "sunday" : "",
    isFocused ? "focused" : "",
    isSelected ? "selected" : "",
    isSource ? "exchange-source" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={cellRef} className={cellClass} onClick={handleClick}>
      {duty ? (
        <span className={`duty-badge ${TYPE_CLASS[duty.type] || "duty-off"}`}>
          {duty.code}
        </span>
      ) : (
        <span style={{ color: "var(--border-strong)", fontSize: "12px" }}>
          —
        </span>
      )}

      {isSource && <ExchangeOverlay />}

      {open && !bulkMode && !exchangeMode && (
        <DutyDropdown
          worker={worker}
          date={date}
          assignment={assignment}
          close={() => setOpen(false)}
          anchorRef={cellRef}
        />
      )}

      <ExchangeConfirm
        open={confirmOpen}
        source={exchangeSource}
        target={{ worker, date, assignment }}
        dutyCodes={dutyCodes}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        isPending={swapMut.isPending}
      />

      {duty?.code === "N" && <RuleIndicator type="night" />}
      {isLocked && <RuleIndicator type="locked" />}
    </div>
  );
});

export default RosterCell;
