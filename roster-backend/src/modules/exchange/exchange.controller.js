import * as service from "./exchange.service.js";

export const createRequest = async (req, res) => {
  try {
    const result = await service.requestExchange(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const accept = async (req, res) => {
  try {
    const result = await service.acceptExchange(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const reject = async (req, res) => {
  try {
    const result = await service.rejectExchange(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export const swapNow = async (req, res) => {
  try {
    const result = await service.swapNow(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
