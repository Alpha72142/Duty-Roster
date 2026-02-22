import {
  buildAssignmentIndex,
  normalizeAssignments,
  getAssignmentKey,
} from "../../utils/assignment.utils";
import { normalizeArray } from "../../utils/apiNormalize";

export const buildRosterMatrix = (workersInput, dates, assignmentsInput) => {
  const workers = normalizeArray(workersInput, ["workers"]);
  const assignments = normalizeAssignments(assignmentsInput);
  const index = buildAssignmentIndex(assignments);

  return workers.map((worker) => {
    const cells = {};
    dates.forEach((d) => {
      const key = getAssignmentKey(worker.id, d.date);
      cells[d.date] = index[key] || null;
    });
    return { worker, cells };
  });
};
