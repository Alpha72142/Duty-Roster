import { getDutyCodes } from "../modules/dutyCode/dutyCode.repository.js";
import {
  getWorkerLastAssignments,
  countDutyUsageForDate,
} from "../modules/assignment/assignment.repository.js";

const NIGHT_CODE = "N";
const ALWAYS_AVAILABLE = ["OFF", "DOF", "AB", "AL", "CL", "ML", "SL", "SPL"]; // never restricted by any rule

const hasNightRestriction = async (workerId, date) => {
  if (!workerId) return false;

  const last = await getWorkerLastAssignments(workerId, date);
  if (last.length < 2) return false;

  return last[0].code === NIGHT_CODE && last[1].code === NIGHT_CODE;
};

export const getAvailability = async (date, workerId) => {
  const codes = await getDutyCodes();

  const restricted = await hasNightRestriction(workerId, date);

  const result = [];

  for (const c of codes) {
    const base = {
      id: c.id,
      code: c.code,
      type: c.type,
      description: c.description || c.code, // ⭐ always included
    };

    // ⭐ ALWAYS AVAILABLE — OFF and DOF bypass all rules
    if (ALWAYS_AVAILABLE.includes(c.code)) {
      result.push({ ...base, available: true });
      continue;
    }

    // ⭐ NIGHT RULE — blocks everything except ALWAYS_AVAILABLE
    if (restricted) {
      result.push({ ...base, available: false, reason: "Night fatigue rule" });
      continue;
    }

    // ⭐ DAILY LIMIT CHECK
    let limitReached = false;

    if (c.daily_limit !== null && c.daily_limit !== undefined) {
      const used = await countDutyUsageForDate(c.id, date);
      if (used >= c.daily_limit) {
        limitReached = true;
      }
    }

    // ⭐ CAPACITY RULE
    if (limitReached) {
      result.push({ ...base, available: false, reason: "Daily limit reached" });
      continue;
    }

    result.push({ ...base, available: true });
  }

  return result;
};
