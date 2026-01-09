export type Theme = "liquid-glass" | "dark" | "light" | "neon" | "minimal" | "gradient";

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
  "liquid-glass": {
    name: "Liquid Glass (iOS 26 Style)",
    background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%)",
    backgroundGradient: ["#0a0e27", "#1a1f3a", "#0f1419"],
    textColor: "rgba(255,255,255,0.95)",
    textSecondary: "rgba(255,255,255,0.7)",
    dayPast: "rgba(255,255,255,0.12)",
    dayFuture: "rgba(255,255,255,0.35)",
    dayToday: "linear-gradient(135deg, #00d4ff, #5b8def, #a855f7)",
    dayTodayGradient: ["#00d4ff", "#5b8def", "#a855f7"],
    headerBg: "rgba(255,255,255,0.05)",
    glassEffect: true,
    blurIntensity: 20,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: "rgba(0,212,255,0.3)",
  },
  dark: {
    name: "Dark",
    background: "#050509",
    textColor: "#ffffff",
    textSecondary: "rgba(255,255,255,0.7)",
    dayPast: "rgba(255,255,255,0.18)",
    dayFuture: "rgba(255,255,255,0.45)",
    dayToday: "linear-gradient(135deg, #22c55e, #a3e635)",
    dayTodayGradient: ["#22c55e", "#a3e635"],
  },
  light: {
    name: "Light",
    background: "#f8fafc",
    textColor: "#0f172a",
    textSecondary: "rgba(15,23,42,0.7)",
    dayPast: "rgba(15,23,42,0.15)",
    dayFuture: "rgba(15,23,42,0.4)",
    dayToday: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    dayTodayGradient: ["#3b82f6", "#8b5cf6"],
  },
  neon: {
    name: "Neon",
    background: "#000000",
    textColor: "#00ff88",
    textSecondary: "rgba(0,255,136,0.7)",
    dayPast: "rgba(0,255,136,0.15)",
    dayFuture: "rgba(0,255,136,0.4)",
    dayToday: "linear-gradient(135deg, #00ff88, #00d4ff)",
    dayTodayGradient: ["#00ff88", "#00d4ff"],
    shadowColor: "rgba(0,255,136,0.5)",
  },
  minimal: {
    name: "Minimal",
    background: "#ffffff",
    textColor: "#1a1a1a",
    textSecondary: "rgba(26,26,26,0.6)",
    dayPast: "rgba(0,0,0,0.08)",
    dayFuture: "rgba(0,0,0,0.2)",
    dayToday: "#000000",
  },
  gradient: {
    name: "Gradient",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backgroundGradient: ["#667eea", "#764ba2"],
    textColor: "#ffffff",
    textSecondary: "rgba(255,255,255,0.9)",
    dayPast: "rgba(255,255,255,0.2)",
    dayFuture: "rgba(255,255,255,0.5)",
    dayToday: "linear-gradient(135deg, #f093fb, #f5576c)",
    dayTodayGradient: ["#f093fb", "#f5576c"],
  },
};
