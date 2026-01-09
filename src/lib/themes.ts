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
    backgroundGradient: ["#000000", "#000000", "#000000"],
    textColor: "#ffffff",
    textSecondary: "#a1a1aa",
    dayPast: "#ffffff",
    dayFuture: "#ffffff",
    dayToday: "#ff0000",
    dayTodayGradient: ["#ff0000", "#cc0000"],
    headerBg: "#000000",
    glassEffect: false,
    blurIntensity: 0,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "rgba(255, 0, 0, 0.3)",
  },
};
