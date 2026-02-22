import * as service from "./worker.service.js";

export const createWorker = async (req, res) => {
  try {
    const worker = await service.addWorker(req.body);
    res.status(201).json(worker);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getWorkers = async (req, res) => {
  try {
    const workers = await service.listWorkers();
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateWorker = async (req, res) => {
  try {
    const worker = await service.editWorker(req.params.id, req.body);
    if (!worker) return res.status(404).json({ message: "Worker not found" });
    res.json(worker);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteWorker = async (req, res) => {
  try {
    const worker = await service.removeWorker(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const hardDeleteWorker = async (req, res) => {
  try {
    const worker = await service.deleteWorker(req.params.id);
    if (!worker) return res.status(404).json({ message: "Worker not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
