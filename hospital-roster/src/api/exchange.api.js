import client from "./client";

export const createExchange = async (payload) => {
  const { data } = await client.post("/exchange", payload);
  return data;
};

export const acceptExchange = async (id) => {
  const { data } = await client.post(`/exchange/${id}/accept`);
  return data;
};

export const rejectExchange = async (id) => {
  const { data } = await client.post(`/exchange/${id}/reject`);
  return data;
};

// ⭐ Direct immediate swap — creates request and executes in one step
export const swapAssignments = async (payload) => {
  const { data } = await client.post("/exchange/swap", payload);
  return data;
};
