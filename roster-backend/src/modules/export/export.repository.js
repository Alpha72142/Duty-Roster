import { pool } from "../../config/db.js";

export const getRosterMonth = async (month, year) => {
  const { rows } = await pool.query(
    `
    SELECT
      TO_CHAR(a.date, 'YYYY-MM-DD') as date,
      w.name,
      w.department,
      d.code
    FROM assignments a
    JOIN workers w ON w.id = a.worker_id
    JOIN duty_codes d ON d.id = a.duty_code_id
    WHERE EXTRACT(MONTH FROM a.date)=$1
    AND EXTRACT(YEAR FROM a.date)=$2
    AND a.status='assigned'
    `,
    [month, year],
  );
  return rows;
};
