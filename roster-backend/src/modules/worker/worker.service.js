import * as repo from "./worker.repository.js";
import { deleteWorkerAssignments } from "../assignment/assignment.repository.js";
import { deleteExchangeRequestsByWorker } from "../exchange/exchange.repository.js";

export const addWorker = async (data) => {
  return repo.createWorker(data);
};

export const listWorkers = async () => {
  return repo.getWorkers();
};

export const editWorker = async (id, data) => {
  return repo.updateWorker(id, data);
};

export const removeWorker = async (id) => {
  return repo.deactivateWorker(id);
};

export const deleteWorker = async (id) => {
  // 1 — delete exchange requests linked to this worker's assignments
  await deleteExchangeRequestsByWorker(id);

  // 2 — delete all assignments for this worker
  await deleteWorkerAssignments(id);

  // 3 — now safe to hard delete the worker
  return repo.deleteWorker(id);
};
