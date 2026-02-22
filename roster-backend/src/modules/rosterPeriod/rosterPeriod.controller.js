import * as service from "./rosterPeriod.service.js";

export const publish = async (req, res) => {
  try {
    const { month, year } = req.body;
    const result = await service.publishRoster(month, year);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const lock = async (req, res) => {
  try {
    const { month, year } = req.body;
    const result = await service.lockRoster(month, year);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const unlock = async (req, res) => {
  try {
    const { month, year } = req.body;
    const result = await service.unlockRoster(month, year);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getStatus = async (req, res) => {
  try {
    const { month, year } = req.query;
    const result = await service.getPeriodStatus(month, year);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
