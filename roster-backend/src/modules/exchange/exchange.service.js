import * as repo from "./exchange.repository.js";

export const requestExchange = async (data) => repo.createRequest(data);

export const acceptExchange = async (id) => {
  const req = await repo.getRequest(id);
  if (!req) throw new Error("Exchange not found");

  if (req.type === "swap") {
    await repo.swapAssignments(req.from_assignment_id, req.to_assignment_id);
  }

  if (req.type === "replacement") {
    const { rows } = await repo.getAssignmentWorker(req.to_assignment_id);
    if (!rows || !rows[0]) throw new Error("Target assignment not found");
    await repo.transferAssignment(req.from_assignment_id, rows[0].worker_id);
  }

  return repo.updateRequestStatus(id, "accepted");
};

export const rejectExchange = async (id) =>
  repo.updateRequestStatus(id, "rejected");

// ⭐ Immediate swap — no approval flow, executes instantly
export const swapNow = async ({ fromAssignmentId, toAssignmentId }) => {
  if (!fromAssignmentId || !toAssignmentId) {
    throw new Error("Both assignment IDs are required");
  }
  await repo.swapAssignments(fromAssignmentId, toAssignmentId);
  return { success: true };
};
