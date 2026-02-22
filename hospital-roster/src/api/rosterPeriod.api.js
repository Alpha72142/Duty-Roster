import client from "./client";

export const getRosterPeriodStatus = async (month, year) => {
  const { data } = await client.get(
    `/roster-period/status?month=${month}&year=${year}`,
  );
  return data;
};

export const publishRoster = async (payload) => {
  const { data } = await client.post("/roster-period/publish", payload);
  return data;
};

export const lockRoster = async (payload) => {
  const { data } = await client.post("/roster-period/lock", payload);
  return data;
};

export const unlockRoster = async (payload) => {
  const { data } = await client.post("/roster-period/unlock", payload);
  return data;
};
