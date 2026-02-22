import * as service from "./assignment.service.js";

export const createAssignment = async (req, res) => {
  try {
    const result = await service.createAssignment(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const result = await service.editAssignment(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const result = await service.deleteAssignment(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getRoster = async (req, res) => {
  try {
    const { month, year } = req.query;
    const result = await service.getMonthlyRoster(month, year);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
