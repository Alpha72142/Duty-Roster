import * as repo from "./dutyCode.repository.js";

export const getDutyCodes = () => repo.getDutyCodes();

export const updateDutyCode = (id, data) => repo.updateDutyCode(id, data);
