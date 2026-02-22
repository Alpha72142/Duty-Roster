import * as repo from "./rosterPeriod.repository.js";

const ensureEditable = (status) => {
  if (status === "locked") throw new Error("Roster is locked");
};

export const ensurePeriodEditable = async (date) => {
  // ✅ safe date parsing — avoids timezone shift
  const [year, month] = date.split("T")[0].split("-").map(Number);

  await repo.createPeriodIfMissing(month, year);

  const period = await repo.getPeriod(month, year);
  ensureEditable(period.status);
};

export const publishRoster = (month, year) =>
  repo.updateStatus(month, year, "published");

export const lockRoster = (month, year) =>
  repo.updateStatus(month, year, "locked");

export const unlockRoster = (month, year) =>
  repo.updateStatus(month, year, "draft");

export const getPeriodStatus = async (month, year) => {
  await repo.createPeriodIfMissing(month, year);
  return repo.getStatus(month, year);
};
