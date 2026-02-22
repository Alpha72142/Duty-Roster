import Excel from "exceljs";
import { getRosterMonth } from "./export.repository.js";
import path from "path";

const monthName = (m, y) =>
  new Date(y, m - 1).toLocaleString("default", { month: "long" });

const daysInMonth = (m, y) => new Date(y, m, 0).getDate();

const formatDateLabel = (y, m, d) => {
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleString("default", { day: "2-digit", month: "short" });
};

const weekdayShort = (date) =>
  date.toLocaleString("default", { weekday: "short" });

const isSunday = (date) => date.getDay() === 0;

const leaveCodes = new Set(["AL", "CL", "SL", "ML", "LOP", "AB", "SBL", "SPL"]);

export const exportRosterFromTemplate = async (month, year) => {
  const templatePath = path.resolve("src/templates/roster-template.xlsx");

  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(templatePath);

  const sheet = workbook.worksheets[0];
  const data = await getRosterMonth(month, year);

  const firstDateCol = 3;
  const dateRowIndex = 2;
  const weekdayRowIndex = 3;
  const startWorkerRow = 4;
  const totalDays = daysInMonth(month, year);

  sheet.getRow(1).getCell(1).value = `${monthName(month, year)} ${year}`;

  const dateRow = sheet.getRow(dateRowIndex);
  for (let d = 1; d <= 31; d++) {
    const cell = dateRow.getCell(firstDateCol + d - 1);
    if (d <= totalDays) {
      const date = new Date(year, month - 1, d);
      cell.value = formatDateLabel(year, month, d);
      if (isSunday(date)) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFE5E5" },
        };
      }
    } else {
      cell.value = "";
    }
  }

  const weekdayRow = sheet.getRow(weekdayRowIndex);
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month - 1, d);
    const cell = weekdayRow.getCell(firstDateCol + d - 1);
    cell.value = weekdayShort(date);
    if (isSunday(date)) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFE5E5" },
      };
    }
  }

  const workers = [...new Set(data.map((d) => d.name))];
  const workerRowMap = {};

  workers.forEach((name, i) => {
    const rowNumber = startWorkerRow + i;
    const row = sheet.getRow(rowNumber);
    row.getCell(1).value = { formula: "ROW()-3" };
    row.getCell(2).value = name;
    workerRowMap[name.toLowerCase()] = rowNumber;
  });

  const workerHistory = {};

  data.forEach((entry) => {
    const rowNumber = workerRowMap[entry.name.toLowerCase()];
    if (!rowNumber) return;

    // ✅ safe day extraction — no timezone shift
    const day = parseInt(entry.date.split("-")[2], 10);
    const colIndex = firstDateCol + day - 1;
    const cell = sheet.getRow(rowNumber).getCell(colIndex);

    cell.value = entry.code;

    if (leaveCodes.has(entry.code)) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFCCCC" },
      };
    }

    if (!workerHistory[rowNumber]) workerHistory[rowNumber] = [];
    workerHistory[rowNumber].push({ day, code: entry.code });
  });

  Object.entries(workerHistory).forEach(([rowNumber, arr]) => {
    arr.sort((a, b) => a.day - b.day);
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].code === "N" && arr[i - 1].code === "N") {
        const row = sheet.getRow(Number(rowNumber));
        [arr[i].day, arr[i - 1].day].forEach((d) => {
          row.getCell(firstDateCol + d - 1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFF2CC" },
          };
        });
      }
    }
  });

  return workbook;
};
