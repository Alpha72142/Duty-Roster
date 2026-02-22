import * as service from "./shift.service.js";

export const getShifts = async (req, res) => {
  const shifts = await service.listShifts();
  res.json(shifts);
};