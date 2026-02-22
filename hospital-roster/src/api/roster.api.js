import client from "./client";

export const copyRoster = async (payload) => {
  const { data } = await client.post("/roster/copy", payload);
  return data;
};
