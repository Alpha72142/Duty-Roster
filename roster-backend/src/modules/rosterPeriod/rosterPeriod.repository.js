import { pool } from "../../config/db.js";

export const getPeriod = async (month, year) => {
  const { rows } = await pool.query(
    `SELECT * FROM roster_periods WHERE month=$1 AND year=$2`,
    [month, year],
  );
  return rows[0];
};

export const createPeriodIfMissing = async (month, year) => {
  await pool.query(
    `
    INSERT INTO roster_periods(month, year)
    VALUES($1,$2)
    ON CONFLICT (month,year) DO NOTHING
    `,
    [month, year],
  );
};

export const updateStatus = async (month, year, status) => {
  const { rows } = await pool.query(
    `
    UPDATE roster_periods
    SET status=$3
    WHERE month=$1 AND year=$2
    RETURNING *
    `,
    [month, year, status],
  );
  return rows[0];
};

export const getStatus = async (month, year) => {
  const { rows } = await pool.query(
    `SELECT month, year, status FROM roster_periods WHERE month=$1 AND year=$2`,
    [month, year],
  );

  return rows[0];
};
