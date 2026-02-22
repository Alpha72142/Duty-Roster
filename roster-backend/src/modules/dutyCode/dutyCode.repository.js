import { pool } from "../../config/db.js";

export const getDutyCodes = async () => {
  const { rows } = await pool.query(
    `SELECT id, code, description, type, daily_limit FROM duty_codes ORDER BY code`,
  );
  return rows;
};

export const updateDutyCode = async (id, { daily_limit }) => {
  const { rows } = await pool.query(
    `UPDATE duty_codes SET daily_limit = $1 WHERE id = $2 RETURNING id, code, description, type, daily_limit`,
    [daily_limit, id],
  );
  if (!rows[0]) throw new Error("Duty code not found");
  return rows[0];
};
