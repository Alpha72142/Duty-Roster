import client from "./client";

export const createWorker = async (data) => {
  const { data: res } = await client.post("/workers", data);
  return res;
};

export const getWorkers = async () => {
  const { data } = await client.get("/workers");
  return data;
};

export const updateWorker = async (id, data) => {
  const { data: res } = await client.put(`/workers/${id}`, data);
  return res;
};

export const deleteWorker = async (id) => {
  const { data } = await client.delete(`/workers/${id}`);
  return data;
};
