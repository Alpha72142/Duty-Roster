import { pool } from "../../config/db.js";

export const getMonthAssignments = async (month, year) => {
  const { rows } = await pool.query(
    `
    SELECT
      worker_id,
      duty_code_id,
      TO_CHAR(date, 'YYYY-MM-DD') as date
    FROM assignments
    WHERE EXTRACT(MONTH FROM date)=$1
    AND EXTRACT(YEAR FROM date)=$2
    AND status='assigned'
    `,
    [month, year],
  );
  return rows;
};

export const createAssignment = async (data) => {
  await pool.query(
    `
    INSERT INTO assignments
    (id, worker_id, duty_code_id, date)
    VALUES (uuid_generate_v4(), $1, $2, $3)
    `,
    [data.workerId, data.dutyCodeId, data.date],
  );
};
