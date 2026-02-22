import { useEffect } from "react";
import { useRosterStore } from "../store/roster.store";

export default function useRosterKeyboard(matrix, dates) {
  const { focusedCell, setFocusedCell } = useRosterStore();

  useEffect(() => {
    const handler = (e) => {
      if (!focusedCell) return;

      const rowIndex = matrix.findIndex(
        (r) => r.worker.id === focusedCell.worker.id,
      );

      const colIndex = dates.findIndex((d) => d.date === focusedCell.date);

      let nextRow = rowIndex;
      let nextCol = colIndex;

      if (e.key === "ArrowDown") nextRow++;
      if (e.key === "ArrowUp") nextRow--;
      if (e.key === "ArrowRight") nextCol++;
      if (e.key === "ArrowLeft") nextCol--;

      if (
        nextRow >= 0 &&
        nextRow < matrix.length &&
        nextCol >= 0 &&
        nextCol < dates.length
      ) {
        setFocusedCell({
          worker: matrix[nextRow].worker,
          date: dates[nextCol].date,
        });
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusedCell, matrix, dates, setFocusedCell]);
}
