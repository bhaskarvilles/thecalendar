export type Theme = "minimal-black";

export type ThemeConfig = {
  name: string;
  background: string;
  backgroundGradient?: string[];
  textColor: string;
  textSecondary: string;
  dayPast: string;
  dayFuture: string;
  dayToday: string;
  dayTodayGradient?: string[];
  headerBg?: string;
  glassEffect?: boolean;
  blurIntensity?: number;
  borderColor?: string;
  shadowColor?: string;
};

export const THEMES: Record<Theme, ThemeConfig> = {
  "minimal-black": {
    name: "Minimal Black",
    background: "#000000",
    textColor: "#ffffff",
    textSecondary: "#ffffff",
    dayPast: "#ffffff",
    dayFuture: "#ffffff",
    dayToday: "#ffffff",
  },
};
