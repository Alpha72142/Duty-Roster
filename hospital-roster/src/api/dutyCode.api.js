import client from "./client";

export const getDutyCodes = async () => {
  const { data } = await client.get("/duty-codes");
  return data;
};

export const updateDutyCode = async (id, payload) => {
  const { data } = await client.put(`/duty-codes/${id}`, payload);
  return data;
};
