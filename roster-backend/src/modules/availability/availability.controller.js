import * as service from "../../services/availability.service.js";

export const getAvailability = async (req, res) => {
  const { date, workerId } = req.query;

  const data = await service.getAvailability(date, workerId);

  res.json(data);
};