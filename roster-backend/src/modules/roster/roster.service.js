import * as repo from "./roster.repository.js";

const pad = (n) => String(n).padStart(2, "0");

const getWeekday = (dateStr) => new Date(dateStr).getDay();

export const copyMonth = async (srcMonth, srcYear, targetMonth, targetYear) => {
  const source = await repo.getMonthAssignments(srcMonth, srcYear);

  const sourceByWeekday = {};

  source.forEach((a) => {
    const weekday = getWeekday(a.date);
    if (!sourceByWeekday[weekday]) sourceByWeekday[weekday] = [];
    sourceByWeekday[weekday].push(a);
  });

  const daysInTarget = new Date(targetYear, targetMonth, 0).getDate();

  for (let d = 1; d <= daysInTarget; d++) {
    // ✅ use plain string date instead of JS Date object
    const dateStr = `${targetYear}-${pad(targetMonth)}-${pad(d)}`;
    const weekday = new Date(dateStr).getDay();
    const template = sourceByWeekday[weekday] || [];

    for (const a of template) {
      await repo.createAssignment({
        workerId: a.worker_id,
        dutyCodeId: a.duty_code_id,
        date: dateStr,
      });
    }
  }
};
