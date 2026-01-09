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
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  const todayTime = new Date(todayYear, todayMonth, todayDate).getTime();

  const days: CalendarDay[] = [];
  const cursor = new Date(year, 0, 1);

  // Pre-allocate months array for better performance
  const months: { month: number; days: CalendarDay[] }[] = Array.from({ length: 12 }, (_, i) => ({
    month: i,
    days: [],
  }));

  while (cursor.getFullYear() === year) {
    const currentTime = cursor.getTime();
    const isToday =
      cursor.getFullYear() === todayYear &&
      cursor.getMonth() === todayMonth &&
      cursor.getDate() === todayDate;
    const isPast = currentTime < todayTime;

    const day: CalendarDay = {
      date: new Date(cursor),
      year: cursor.getFullYear(),
      month: cursor.getMonth(),
      day: cursor.getDate(),
      isToday,
      isPast,
    };

    days.push(day);
    months[cursor.getMonth()].days.push(day);

    cursor.setDate(cursor.getDate() + 1);
  }

  const totalDays = days.length;
  const daysGone = days.filter((d) => d.isPast || d.isToday).length;
  const daysLeft = totalDays - daysGone;

  return {
    year,
    today,
    daysLeft,
    totalDays,
    daysGone,
    months,
    weeks: [], // Not used in minimal version
  };
}

