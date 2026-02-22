import * as service from "./roster.service.js";

export const copyRoster = async (req, res) => {
  try {
    const { srcMonth, srcYear, targetMonth, targetYear } = req.body;
    await service.copyMonth(srcMonth, srcYear, targetMonth, targetYear);
    res.json({ message: "Roster copied" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
