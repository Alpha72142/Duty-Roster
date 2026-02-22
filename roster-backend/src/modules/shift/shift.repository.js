import { pool } from "../../config/db.js";

export const getShifts = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM shifts ORDER BY start_time`
  );
  return rows;
};

export const getShiftByCode = async (code) => {
  const { rows } = await pool.query(
    `SELECT * FROM shifts WHERE code=$1`,
    [code]
  );
  return rows[0];
};