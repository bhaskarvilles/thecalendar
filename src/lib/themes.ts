export type Theme = "minimal-black" | "dark-gray" | "navy-blue";

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
  "dark-gray": {
    name: "Dark Gray",
    background: "#0a0a0a",
    backgroundGradient: ["#0a0a0a", "#0f0f0f", "#0a0a0a"],
    textColor: "#ffffff",
    textSecondary: "#9ca3af",
    dayPast: "#ffffff",
    dayFuture: "#ffffff",
    dayToday: "#ef4444",
    dayTodayGradient: ["#ef4444", "#dc2626"],
    headerBg: "#0a0a0a",
    glassEffect: true,
    blurIntensity: 10,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "rgba(239, 68, 68, 0.3)",
  },
  "navy-blue": {
    name: "Navy Blue",
    background: "#0f172a",
    backgroundGradient: ["#0f172a", "#1e293b", "#0f172a"],
    textColor: "#f1f5f9",
    textSecondary: "#94a3b8",
    dayPast: "#f1f5f9",
    dayFuture: "#f1f5f9",
    dayToday: "#3b82f6",
    dayTodayGradient: ["#3b82f6", "#2563eb"],
    headerBg: "#0f172a",
    glassEffect: true,
    blurIntensity: 12,
    borderColor: "rgba(59, 130, 246, 0.15)",
    shadowColor: "rgba(59, 130, 246, 0.3)",
  },
};
