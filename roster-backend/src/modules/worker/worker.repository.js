import { pool } from "../../config/db.js";

/* CREATE */
export const createWorker = async (data) => {
  const query = `
    INSERT INTO workers (id, name, phone, color)
    VALUES (uuid_generate_v4(), $1, $2, $3)
    RETURNING *
  `;
  const { rows } = await pool.query(query, [data.name, data.phone, data.color]);
  return rows[0];
};

/* READ */
export const getWorkers = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM workers WHERE status='active' ORDER BY created_at DESC`,
  );
  return rows;
};

/* UPDATE */
export const updateWorker = async (id, data) => {
  const query = `
    UPDATE workers
    SET name=$1, phone=$2, color=$3
    WHERE id=$4
    RETURNING *
  `;
  const { rows } = await pool.query(query, [
    data.name,
    data.phone,
    data.color,
    id,
  ]);
  return rows[0];
};

/* DEACTIVATE (soft delete) */
export const deactivateWorker = async (id) => {
  const { rows } = await pool.query(
    `UPDATE workers SET status='inactive' WHERE id=$1 RETURNING *`,
    [id],
  );
  return rows[0];
};

/* DELETE (hard delete) */
export const deleteWorker = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM workers WHERE id=$1 RETURNING *`,
    [id],
  );
  return rows[0];
};
