import { exportRosterFromTemplate } from "./export.service.js";

export const exportMonth = async (req, res) => {
  try {
    const { month, year } = req.query;
    const workbook = await exportRosterFromTemplate(month, year);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=roster-${month}-${year}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
