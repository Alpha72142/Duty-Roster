import * as repo from "./assignment.repository.js";
import { ensurePeriodEditable } from "../rosterPeriod/rosterPeriod.service.js";
import { getDutyCodes } from "../dutyCode/dutyCode.repository.js";

const NIGHT_CODE = "N";
const ALWAYS_AVAILABLE = ["OFF", "DOF"]; // never restricted by any rule

/* ===============================
   Night rule
=============================== */

const validateNightRestriction = async (workerId, date, dutyCode) => {
  // OFF and DOF bypass the night rule entirely
  if (ALWAYS_AVAILABLE.includes(dutyCode)) return;

  const last = await repo.getWorkerLastAssignments(workerId, date);

  if (last.length < 2) return;

  const twoNight = last[0].code === NIGHT_CODE && last[1].code === NIGHT_CODE;

  if (twoNight) {
    throw new Error(
      "Worker had 2 consecutive night shifts. Next day assignment blocked.",
    );
  }
};

/* ===============================
   Capacity rule helper
=============================== */

const validateCapacity = async (dutyCodeId, date, dutyCode) => {
  // OFF and DOF bypass the capacity rule entirely
  if (ALWAYS_AVAILABLE.includes(dutyCode)) return;

  const codes = await getDutyCodes();

  const duty = codes.find((c) => String(c.id) === String(dutyCodeId));

  if (!duty) throw new Error("Invalid duty code");

  if (duty.daily_limit != null) {
    const used = await repo.countDutyUsageForDate(duty.id, date);

    if (used >= duty.daily_limit) {
      throw new Error("Duty daily limit reached");
    }
  }
};

/* ===============================
   CREATE
=============================== */

export const createAssignment = async (data) => {
  /* 1 — required */
  if (!data.workerId || !data.dutyCodeId || !data.date) {
    throw new Error("workerId, dutyCodeId and date required");
  }

  /* 2 — resolve duty code string for rule bypass checks */
  const codes = await getDutyCodes();
  const duty = codes.find((c) => String(c.id) === String(data.dutyCodeId));
  if (!duty) throw new Error("Invalid duty code");

  /* 3 — period */
  await ensurePeriodEditable(data.date);

  /* 4 — night */
  await validateNightRestriction(data.workerId, data.date, duty.code);

  /* 5 — capacity */
  await validateCapacity(data.dutyCodeId, data.date, duty.code);

  /* 6 — insert */
  return repo.createAssignment(data);
};

/* ===============================
   EDIT
=============================== */

export const editAssignment = async (id, data) => {
  if (!id) throw new Error("Assignment id required");

  if (data.dutyCodeId && data.date) {
    const codes = await getDutyCodes();
    const duty = codes.find((c) => String(c.id) === String(data.dutyCodeId));
    if (!duty) throw new Error("Invalid duty code");

    await ensurePeriodEditable(data.date);
    await validateNightRestriction(data.workerId, data.date, duty.code);
    await validateCapacity(data.dutyCodeId, data.date, duty.code);
  }

  return repo.updateAssignment(id, data);
};

/* =============================== */

export const deleteAssignment = async (id) => repo.removeAssignment(id);

export const getMonthlyRoster = async (month, year) =>
  repo.getRosterMonth(month, year);
