import dayjs from "dayjs";

export const getMonthDates = (month, year) => {
  const start = dayjs(`${year}-${month}-01`);
  const daysInMonth = start.daysInMonth();

  const dates = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const d = start.date(i);

    dates.push({
      date: d.format("YYYY-MM-DD"),
      day: d.format("DD"),
      weekday: d.format("ddd"),
      isSunday: d.day() === 0,
    });
  }

  return dates;
};
