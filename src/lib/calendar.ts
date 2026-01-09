export type CalendarDay = {
  date: Date;
  year: number;
  month: number; // 0-based
  day: number;
  isToday: boolean;
  isPast: boolean;
};

export type CalendarWeek = {
  weekNumber: number; // 1-52/53
  days: CalendarDay[];
};

export type CalendarYear = {
  year: number;
  today: Date;
  daysLeft: number;
  totalDays: number;
  daysGone: number;
  months: { month: number; days: CalendarDay[] }[];
  weeks: CalendarWeek[];
};

export function getCurrentYearCalendar(): CalendarYear {
  const today = new Date();
  const year = today.getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  const days: CalendarDay[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const current = new Date(cursor);
    const isToday =
      current.getFullYear() === today.getFullYear() &&
      current.getMonth() === today.getMonth() &&
      current.getDate() === today.getDate();

    const isPast = current < new Date(today.getFullYear(), today.getMonth(), today.getDate());

    days.push({
      date: current,
      year: current.getFullYear(),
      month: current.getMonth(),
      day: current.getDate(),
      isToday,
      isPast,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  const totalDays = days.length;
  const daysGone = days.filter((d) => d.isPast || d.isToday).length;
  const daysLeft = totalDays - daysGone;

  const months = Array.from({ length: 12 }, (_, month) => ({
    month,
    days: days.filter((d) => d.month === month),
  }));

  // Calculate weeks (simple grouping by 7 days)
  const weeks: CalendarWeek[] = [];
  for (let i = 0; i < days.length; i += 7) {
    const weekDays = days.slice(i, i + 7);
    if (weekDays.length > 0) {
      weeks.push({
        weekNumber: Math.floor(i / 7) + 1,
        days: weekDays,
      });
    }
  }

  return {
    year,
    today,
    daysLeft,
    totalDays,
    daysGone,
    months,
    weeks,
  };
}

