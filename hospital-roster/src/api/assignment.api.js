import client from "./client";

export const createAssignment = async (payload) => {
  const { data } = await client.post("/assignments", payload);
  return data;
};

export const editAssignment = async (id, payload) => {
  const { data } = await client.put(`/assignments/${id}`, payload);
  return data;
};

export const removeAssignment = async (id) => {
  const { data } = await client.patch(`/assignments/${id}/remove`);
  return data;
};

export const getRosterMonth = async (month, year) => {
  const { data } = await client.get(
    `/assignments/roster?month=${month}&year=${year}`,
  );
  return data;
};
