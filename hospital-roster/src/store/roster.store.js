import { create } from "zustand";
import dayjs from "dayjs";

export const useRosterStore = create((set) => ({
  month: dayjs().month() + 1,
  year: dayjs().year(),

  focusedCell: null,

  exchangeMode: false,
  exchangeSource: null,

  bulkMode: false,
  bulkCells: [],

  setMonthYear: (month, year) => set({ month, year }),

  setFocusedCell: (cell) => set({ focusedCell: cell }),

  startExchangeMode: () => set({ exchangeMode: true, exchangeSource: null }),
  stopExchangeMode: () => set({ exchangeMode: false, exchangeSource: null }),
  setExchangeSource: (cell) => set({ exchangeSource: cell }),

  toggleBulkMode: () => set((s) => ({ bulkMode: !s.bulkMode, bulkCells: [] })),
  addBulkCell: (cell) => set((s) => ({ bulkCells: [...s.bulkCells, cell] })),
  clearBulk: () => set({ bulkCells: [] }),
}));
