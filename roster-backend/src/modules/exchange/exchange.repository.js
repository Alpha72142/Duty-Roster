import { pool } from "../../config/db.js";

export const createRequest = async (data) => {
  const query = `
    INSERT INTO exchange_requests
    (id, from_assignment_id, to_assignment_id, type)
    VALUES (uuid_generate_v4(), $1, $2, $3)
    RETURNING *
  `;
  const { rows } = await pool.query(query, [
    data.fromAssignmentId,
    data.toAssignmentId,
    data.type,
  ]);
  return rows[0];
};

export const getRequest = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM exchange_requests WHERE id=$1`,
    [id],
  );
  return rows[0];
};

export const updateRequestStatus = async (id, status) => {
  const { rows } = await pool.query(
    `UPDATE exchange_requests SET status=$1 WHERE id=$2 RETURNING *`,
    [status, id],
  );
  return rows[0];
};

export const swapAssignments = async (a1, a2) => {
  await pool.query("BEGIN");

  const { rows: first } = await pool.query(
    `SELECT worker_id FROM assignments WHERE id=$1`,
    [a1],
  );
  const { rows: second } = await pool.query(
    `SELECT worker_id FROM assignments WHERE id=$1`,
    [a2],
  );

  await pool.query(`UPDATE assignments SET worker_id=$1 WHERE id=$2`, [
    second[0].worker_id,
    a1,
  ]);
  await pool.query(`UPDATE assignments SET worker_id=$1 WHERE id=$2`, [
    first[0].worker_id,
    a2,
  ]);

  await pool.query("COMMIT");
};

// ✅ new helper to get worker from assignment
export const getAssignmentWorker = async (assignmentId) => {
  return pool.query(`SELECT worker_id FROM assignments WHERE id=$1`, [
    assignmentId,
  ]);
};

export const transferAssignment = async (assignmentId, newWorkerId) => {
  const { rows } = await pool.query(
    `UPDATE assignments SET worker_id=$1 WHERE id=$2 RETURNING *`,
    [newWorkerId, assignmentId],
  );
  return rows[0];
};

export const deleteExchangeRequestsByWorker = async (workerId) => {
  await pool.query(
    `DELETE FROM exchange_requests
     WHERE from_assignment_id IN (
       SELECT id FROM assignments WHERE worker_id = $1
     )
     OR to_assignment_id IN (
       SELECT id FROM assignments WHERE worker_id = $1
     )`,
    [workerId],
  );
};
