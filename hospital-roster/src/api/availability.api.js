import client from "./client";

export const getAvailability = async (date, workerId) => {
  const { data } = await client.get(
    `/availability?date=${date}&workerId=${workerId}`,
  );
  return data;
};
