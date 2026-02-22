import { normalizeArray } from "./apiNormalize";

export const normalizeAssignments = (input) => {
  const raw = normalizeArray(input, ["assignments"]);

  return raw.map((a) => ({
    ...a,
    workerId: a.workerId ?? a.worker_id,
    dutyCodeId: a.dutyCodeId ?? a.duty_code_id,
    date: a.date?.split("T")[0],
  }));
};

export const buildAssignmentIndex = (assignmentsInput) => {
  const assignments = normalizeAssignments(assignmentsInput);
  const index = {};

  assignments.forEach((a) => {
    const key = `${a.workerId}_${a.date}`;
    index[key] = a;
  });

  return index;
};

export const getAssignmentKey = (workerId, date) => {
  return `${workerId}_${date}`;
};
