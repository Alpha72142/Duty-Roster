import * as repo from "./shift.repository.js";

export const listShifts = async () => repo.getShifts();

export const findShiftByCode = async (code) =>
  repo.getShiftByCode(code);