import { pool } from "../../config/db.js";

export const createAssignment = async (data) => {
  const { rows } = await pool.query(
    `
    INSERT INTO assignments
    (id, worker_id, duty_code_id, date)
    VALUES (uuid_generate_v4(), $1, $2, $3)
    RETURNING *
    `,
    [data.workerId, data.dutyCodeId, data.date],
  );
  return rows[0];
};

export const updateAssignment = async (id, data) => {
  const { rows } = await pool.query(
    `
    UPDATE assignments
    SET worker_id=$1, duty_code_id=$2, date=$3
    WHERE id=$4
    RETURNING *
    `,
    [data.workerId, data.dutyCodeId, data.date, id],
  );
  return rows[0];
};

export const removeAssignment = async (id) => {
  const { rows } = await pool.query(
    `UPDATE assignments SET status='removed' WHERE id=$1 RETURNING *`,
    [id],
  );
  return rows[0];
};

export const getRosterMonth = async (month, year) => {
  const { rows } = await pool.query(
    `
    SELECT
      a.id,
      a.worker_id as "workerId",
      a.duty_code_id as "dutyCodeId",
      TO_CHAR(a.date, 'YYYY-MM-DD') as date
    FROM assignments a
    WHERE EXTRACT(MONTH FROM a.date)=$1
    AND EXTRACT(YEAR FROM a.date)=$2
    AND a.status='assigned'
    `,
    [month, year],
  );
  return rows;
};

export const getWorkerLastAssignments = async (workerId, date) => {
  const { rows } = await pool.query(
    `
    SELECT a.date, d.code
    FROM assignments a
    LEFT JOIN duty_codes d ON d.id=a.duty_code_id
    WHERE a.worker_id=$1
    AND a.date < $2
    AND a.status='assigned'
    ORDER BY a.date DESC
    LIMIT 2
    `,
    [workerId, date],
  );
  return rows;
};

export const countDutyUsageForDate = async (dutyCodeId, date) => {
  const { rows } = await pool.query(
    `
    SELECT COUNT(*)::int as count
    FROM assignments
    WHERE duty_code_id=$1
    AND date=$2
    AND status='assigned'
    `,
    [dutyCodeId, date],
  );
  return rows[0].count;
};
export const deleteWorkerAssignments = async (workerId) => {
  await pool.query(`DELETE FROM assignments WHERE worker_id = $1`, [workerId]);
};
