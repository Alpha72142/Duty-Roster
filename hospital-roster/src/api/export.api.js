import client from "./client";

export const exportRosterTemplate = async (month, year) => {
  const response = await client.get(
    `/export/roster-template?month=${month}&year=${year}`,
    { responseType: "blob" },
  );

  // ✅ auto download the file
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `roster-${month}-${year}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
