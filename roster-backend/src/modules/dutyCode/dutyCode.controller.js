import * as service from "./dutyCode.service.js";

export const getAll = async (req, res) => {
  const data = await service.getDutyCodes();
  res.json(data);
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { daily_limit } = req.body;
    const updated = await service.updateDutyCode(id, { daily_limit });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
