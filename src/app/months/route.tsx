import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getCurrentYearCalendar } from "@/lib/calendar";
import { THEMES, Theme, ThemeConfig } from "@/lib/themes";
import React from "react";

export const runtime = "edge";
export const revalidate = 3600; // Cache for 1 hour

type Layout = "months-3x4" | "months-list" | "year" | "weeks" | "days-left" | "daily-quote" | "minimal-date";

// Enhanced device-specific safe areas for optimal wallpaper display
function getDeviceSafeArea(width: number, height: number) {
  const aspectRatio = height / width;
  const isIPhone = height > width && height > 2000;
  const isIPad = width > 1400;

  // iPhone with notch/Dynamic Island (X, XS, 11 Pro, 12-17 series)
  if (isIPhone) {
    // More aggressive safe areas for notched iPhones
    const topSafe = Math.max(59, height * 0.06); // Notch/Dynamic Island area
    const bottomSafe = Math.max(34, height * 0.045); // Home indicator area
    const sideSafe = Math.max(24, width * 0.025); // Side margins with rounded corners

    return {
      top: topSafe,
      bottom: bottomSafe,
      left: sideSafe,
      right: sideSafe
    };
  }

  // iPad - different safe areas based on size
  if (isIPad) {
    // Larger iPads need more padding
    const isPadPro = width >= 2000; // iPad Pro 12.9"

    if (isPadPro) {
      return { top: 40, bottom: 40, left: 60, right: 60 };
    } else {
      return { top: 30, bottom: 30, left: 50, right: 50 };
    }
  }

  // Default safe areas for other devices
  return { top: 20, bottom: 20, left: 20, right: 20 };
}

// Enhanced typography system with dynamic scaling and constraints
function getTypographySystem(height: number, density: string, width?: number) {
  const baseFontSize = height / 100;
  const densityMultiplier = density === "compact" ? 0.88 : 1.0;

  // Device-specific adjustments
  const isSmallDevice = height < 2400;
  const isLargeDevice = height > 2700;
  const deviceMultiplier = isSmallDevice ? 1.05 : isLargeDevice ? 0.95 : 1.0;

  // Helper function to constrain font sizes
  const constrain = (size: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, size));
  };

  const baseSize = baseFontSize * densityMultiplier * deviceMultiplier;

  return {
    title: constrain(baseSize * 3.8, 48, 120),        // Large titles (48-120px)
    header: constrain(baseSize * 2.4, 32, 72),        // Month headers (32-72px)
    subheader: constrain(baseSize * 1.8, 24, 56),     // Sub headers (24-56px)
    body: constrain(baseSize * 1.5, 20, 48),          // Body text (20-48px)
    small: constrain(baseSize * 1.2, 16, 36),         // Small text (16-36px)
    tiny: constrain(baseSize * 0.95, 14, 28)          // Tiny text (14-28px)
  };
}

// Visual hierarchy system
function getVisualHierarchy() {
  return {
    primary: { opacity: 1.0, fontWeight: 700 },
    secondary: { opacity: 0.9, fontWeight: 600 },
    tertiary: { opacity: 0.7, fontWeight: 400 },
    quaternary: { opacity: 0.5, fontWeight: 300 }
  };
}

// Enhanced safe area with better margins
function getEnhancedSafeArea(width: number, height: number, baseSafeArea: ReturnType<typeof getDeviceSafeArea>) {
  return {
    top: Math.max(baseSafeArea.top, height * 0.08),
    bottom: Math.max(baseSafeArea.bottom, height * 0.06),
    left: Math.max(baseSafeArea.left, width * 0.05),
    right: Math.max(baseSafeArea.right, width * 0.05)
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const widthParam = searchParams.get("width");
  const heightParam = searchParams.get("height");
  const densityParam = searchParams.get("density");
  const layoutParam = searchParams.get("layout");
  const themeParam = searchParams.get("theme");

  const width = Math.max(800, Math.min(3000, Number(widthParam) || 1320));
  const height = Math.max(1200, Math.min(4000, Number(heightParam) || 2868));
  const density = densityParam === "compact" ? "compact" : "cozy";
  const layout: Layout =
    layoutParam === "year" ||
      layoutParam === "weeks" ||
      layoutParam === "days-left" ||
      layoutParam === "months-list" ||
      layoutParam === "daily-quote" ||
      layoutParam === "minimal-date"
      ? layoutParam
      : "months-3x4";

  const theme: Theme =
    themeParam === "dark-gray" || themeParam === "navy-blue"
      ? themeParam
      : "minimal-black";

  const calendar = getCurrentYearCalendar();
  const themeConfig = THEMES[theme];
  const safeArea = getDeviceSafeArea(width, height);

  // Device-centered padding with safe areas
  const paddingX = Math.max(
    density === "compact" ? 40 : 64,
    safeArea.left
  );
  const paddingY = Math.max(
    density === "compact" ? 40 : 64,
    safeArea.top
  );
  const paddingBottom = Math.max(paddingY, safeArea.bottom);
  const contentWidth = width - paddingX * 2;
  const contentHeight = height - paddingY - paddingBottom;

  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  // Render based on layout
  if (layout === "months-3x4") {
    return renderMonths3x4(
      calendar,
      width,
      height,
      paddingX,
      paddingY,
      paddingBottom,
      contentWidth,
      contentHeight,
      density,
      themeConfig,
      monthNames,
      safeArea
    );
  } else if (layout === "months-list") {
    return renderMonthsList(
      calendar,
      width,
      height,
      paddingX,
      paddingY,
      paddingBottom,
      contentWidth,
      contentHeight,
      density,
      themeConfig,
      monthNames,
      safeArea
    );
  } else if (layout === "year") {
    return renderYearView(
      calendar,
      width,
      height,
      paddingX,
      paddingY,
      paddingBottom,
      contentWidth,
      contentHeight,
      density,
      themeConfig,
      safeArea
    );
  } else if (layout === "weeks") {
    return renderWeeksView(
      calendar,
      width,
      height,
      paddingX,
      paddingY,
      paddingBottom,
      contentWidth,
      contentHeight,
      density,
      themeConfig,
      safeArea
    );
  } else if (layout === "daily-quote") {
    return renderDailyQuote(
      calendar,
      width,
      height,
      paddingX,
      paddingY,
      paddingBottom,
      contentWidth,
      contentHeight,
      density,
      themeConfig,
      safeArea
    );
  } else if (layout === "minimal-date") {
    return renderMinimalDate(
      calendar,
      width,
      height,
      paddingX,
      paddingY,
      paddingBottom,
      contentWidth,
      contentHeight,
      density,
      themeConfig,
      safeArea
    );
  } else {
    return renderDaysLeftView(
      calendar,
      width,
      height,
      paddingX,
      paddingY,
      paddingBottom,
      contentWidth,
      contentHeight,
      density,
      themeConfig,
      safeArea
    );
  }
}

function renderMonths3x4(
  calendar: ReturnType<typeof getCurrentYearCalendar>,
  width: number,
  height: number,
  paddingX: number,
  paddingY: number,
  paddingBottom: number,
  contentWidth: number,
  contentHeight: number,
  density: string,
  theme: ThemeConfig,
  monthNames: string[],
  safeArea: ReturnType<typeof getDeviceSafeArea>
) {
  // Enhanced typography system
  const typography = getTypographySystem(height, density, width);
  const hierarchy = getVisualHierarchy();

  // Optimized layout: 8% top, 62% middle, 30% bottom for better balance
  const topSection = height * 0.08;
  const middleSection = height * 0.62;
  const bottomSection = height * 0.30;

  // Improved spacing calculations with safe area consideration
  const effectiveWidth = contentWidth - (safeArea.left + safeArea.right) * 0.3;
  const effectiveHeight = middleSection - (safeArea.top + safeArea.bottom) * 0.2;

  const monthGap = density === "compact" ? 20 : 28;
  const monthHeight = (effectiveHeight - monthGap * 3) / 4;
  const monthWidth = (effectiveWidth - monthGap * 2) / 3;

  // Optimized day size calculation with better constraints
  const maxDaySize = Math.min(monthWidth / 7.5, monthHeight / 6.5) * 1.2;
  const daySize = Math.max(Math.min(maxDaySize, 65), 28); // Constrain between 28-65px
  const dayGap = density === "compact" ? 6 : 8;
  const fontSize = Math.max(daySize * 0.7, 24);

  // Optimized: Use solid background instead of gradient for faster rendering
  const bgColor = theme.background;

  // Calculate percentage
  const percentageCompleted = Math.round((calendar.daysGone / calendar.totalDays) * 100);
  const percentageRemaining = Math.round((calendar.daysLeft / calendar.totalDays) * 100);

  // Pre-calculate styles to avoid repeated calculations
  const monthsGridStyle = {
    display: "flex" as const,
    flexWrap: "wrap" as const,
    gap: monthGap,
    justifyContent: "center" as const,
    alignItems: "flex-start" as const,
    position: "absolute" as const,
    top: `${topSection + safeArea.top * 0.5}px`,
    left: `${paddingX}px`,
    width: `${contentWidth}px`,
    height: `${middleSection}px`,
  };

  const footerStyle = {
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    width: "100%",
    height: `${bottomSection}px`,
    position: "absolute" as const,
    top: `${topSection + middleSection}px`,
    left: 0,
  };

  const footerBoxStyle = {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,
    alignItems: "center" as const,
    padding: "20px 32px",
    background: "rgba(0, 0, 0, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const yearTextStyle = {
    display: "flex" as const,
    fontSize: typography.title,
    fontWeight: hierarchy.primary.fontWeight,
    color: theme.textColor,
    opacity: hierarchy.primary.opacity,
    letterSpacing: 5,
    textShadow: "0 2px 12px rgba(255, 59, 48, 0.3)",
  };

  const daysLeftStyle = {
    display: "flex" as const,
    fontSize: typography.subheader,
    fontWeight: hierarchy.secondary.fontWeight,
    color: "#ff3b30",
    opacity: hierarchy.secondary.opacity,
    letterSpacing: 1.2,
    textShadow: "0 1px 8px rgba(255, 59, 48, 0.4)",
  };

  const percentageStyle = {
    display: "flex" as const,
    fontSize: typography.body,
    fontWeight: hierarchy.tertiary.fontWeight,
    color: theme.textColor,
    opacity: hierarchy.tertiary.opacity,
    letterSpacing: 1,
  };

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          position: "relative",
          background: bgColor,
          color: theme.textColor,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Months grid in middle 50% */}
        <div style={monthsGridStyle}>
          {calendar.months.map((monthBlock, monthIdx) => {
            const firstWeekday = new Date(
              calendar.year,
              monthBlock.month,
              1
            ).getDay();

            // Pre-calculate styles for this month
            const monthContainerStyle = {
              display: "flex" as const,
              flexDirection: "column" as const,
              width: monthWidth,
              height: monthHeight,
              gap: 10,
              padding: "12px",
              background: "rgba(0, 0, 0, 0.4)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            };

            const monthLabelStyle = {
              display: "flex" as const,
              fontSize: typography.header,
              fontWeight: hierarchy.primary.fontWeight,
              color: theme.textColor,
              opacity: hierarchy.primary.opacity,
              letterSpacing: 2.5,
              padding: "6px 14px",
              background: "rgba(255, 59, 48, 0.12)",
              borderRadius: "10px",
              border: "1px solid rgba(255, 59, 48, 0.25)",
              boxShadow: "0 2px 8px rgba(255, 59, 48, 0.15)",
            };

            const boxes: React.ReactNode[] = [];

            // Optimized: Empty boxes
            for (let i = 0; i < firstWeekday; i++) {
              boxes.push(
                <div
                  key={`e-${monthIdx}-${i}`}
                  style={{ width: daySize, height: daySize }}
                />
              );
            }

            // Optimized: Day boxes - simplified styling
            for (const d of monthBlock.days) {
              const isToday = d.isToday;
              const dayKey = `d-${monthIdx}-${d.day}`;

              if (isToday) {
                boxes.push(
                  <div
                    key={dayKey}
                    style={{
                      display: "flex",
                      width: daySize,
                      height: daySize,
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: fontSize * 1.3 * 1.1, // Increase by 10%
                      fontWeight: 700,
                      color: "#ffffff",
                      background: "#ff0000",
                      borderRadius: "50%",
                      border: "2px solid #ff0000",
                    }}
                  >
                    {d.day}
                  </div>
                );
              } else {
                boxes.push(
                  <div
                    key={dayKey}
                    style={{
                      display: "flex",
                      width: daySize,
                      height: daySize,
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: fontSize * 0.75 * 1.1, // Increase by 10%
                      fontWeight: 400,
                      color: "#a1a1aa",
                      borderRadius: "50%",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    •
                  </div>
                );
              }
            }

            // Group into weeks (7 days per row)
            const weekRows: React.ReactNode[][] = [];
            for (let i = 0; i < boxes.length; i += 7) {
              weekRows.push(boxes.slice(i, i + 7));
            }

            return (
              <div
                key={monthBlock.month}
                style={monthContainerStyle}
              >
                <div style={monthLabelStyle}>
                  {monthNames[monthBlock.month]}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: dayGap,
                    flexWrap: "wrap",
                  }}
                >
                  {weekRows.map((week, weekIdx) => (
                    <div
                      key={weekIdx}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: dayGap,
                      }}
                    >
                      {week}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with year, days left, and percentage below months */}
        <div style={footerStyle}>
          <div style={footerBoxStyle}>
            <div style={yearTextStyle}>
              {calendar.year}
            </div>
            <div style={daysLeftStyle}>
              {calendar.daysLeft} days remaining
            </div>
            <div style={percentageStyle}>
              {percentageCompleted}% completed • {percentageRemaining}% remaining
            </div>
          </div>
        </div>
      </div>
    ),
    { width, height }
  );
}

function renderMonthsList(
  calendar: ReturnType<typeof getCurrentYearCalendar>,
  width: number,
  height: number,
  paddingX: number,
  paddingY: number,
  paddingBottom: number,
  contentWidth: number,
  contentHeight: number,
  density: string,
  theme: ThemeConfig,
  monthNames: string[],
  safeArea: ReturnType<typeof getDeviceSafeArea>
) {
  // Enhanced typography for list layout
  const typography = getTypographySystem(height, density, width);
  const hierarchy = getVisualHierarchy();

  // Optimized layout: 8% top, 64% middle, 28% bottom
  const topSection = height * 0.08;
  const middleSection = height * 0.64;
  const bottomSection = height * 0.28;

  // Improved spacing with safe area consideration
  const effectiveHeight = middleSection - (safeArea.top + safeArea.bottom) * 0.15;

  const monthGap = density === "compact" ? 6 : 10;
  const monthHeight = (effectiveHeight - monthGap * 11) / 12;
  const daySize = Math.max((monthHeight / 6) * 1.15, 22); // Minimum 22px
  const dayGap = density === "compact" ? daySize * 0.08 : daySize * 0.12;


  // Calculate percentage
  const percentageCompleted = Math.round((calendar.daysGone / calendar.totalDays) * 100);
  const percentageRemaining = Math.round((calendar.daysLeft / calendar.totalDays) * 100);

  // Pre-calculate styles
  const monthsListStyle = {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: monthGap,
    position: "absolute" as const,
    top: `${topSection}px`,
    left: `${paddingX}px`,
    width: `${contentWidth}px`,
    height: `${middleSection}px`,
  };

  const footerStyle = {
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    width: "100%",
    height: `${bottomSection}px`,
    position: "absolute" as const,
    top: `${topSection + middleSection}px`,
    left: 0,
  };

  const footerBoxStyle = {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,
    alignItems: "center" as const,
    padding: "20px 32px",
    background: "rgba(0, 0, 0, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          position: "relative",
          background: theme.background,
          color: theme.textColor,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Months list in middle 60% */}
        <div style={monthsListStyle}>
          {calendar.months.map((monthBlock, monthIdx) => {
            const firstWeekday = new Date(
              calendar.year,
              monthBlock.month,
              1
            ).getDay();

            const boxes: React.ReactNode[] = [];
            for (let i = 0; i < firstWeekday; i++) {
              boxes.push(
                <div key={`e-${monthIdx}-${i}`} style={{ width: daySize, height: daySize }} />
              );
            }

            for (const d of monthBlock.days) {
              const isToday = d.isToday;
              const dayKey = `d-${monthIdx}-${d.day}`;

              if (isToday) {
                boxes.push(
                  <div
                    key={dayKey}
                    style={{
                      width: daySize,
                      height: daySize,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: daySize * 0.5 * 1.1, // Increase by 10%
                      fontWeight: 700,
                      color: "#ffffff",
                      background: "#ff0000",
                      border: "2px solid #ff0000",
                    }}
                  >
                    {d.day}
                  </div>
                );
              } else {
                boxes.push(
                  <div
                    key={dayKey}
                    style={{
                      width: daySize,
                      height: daySize,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: daySize * 0.4 * 1.1, // Increase by 10%
                      fontWeight: 400,
                      color: "#a1a1aa",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    •
                  </div>
                );
              }
            }

            return (
              <div
                key={monthBlock.month}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 20,
                  height: monthHeight,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 100,
                    fontSize: 16 * 1.1, // Increase by 10%
                    fontWeight: 600,
                    color: theme.textColor,
                  }}
                >
                  {monthNames[monthBlock.month]}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    width: 7 * daySize + 6 * dayGap,
                    rowGap: dayGap,
                    columnGap: dayGap,
                  }}
                >
                  {boxes}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with year, days left, and percentage below months */}
        <div style={footerStyle}>
          <div style={footerBoxStyle}>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.045, 52) * 1.1, fontWeight: 600, color: theme.textColor, letterSpacing: 4 }}>
              {calendar.year}
            </div>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.018 * 1.3, 22) * 1.1, fontWeight: 500, color: "#ff0000", letterSpacing: 1 }}>
              {calendar.daysLeft} days remaining
            </div>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.016, 20) * 1.1, fontWeight: 500, color: theme.textColor, letterSpacing: 1 }}>
              {percentageCompleted}% completed • {percentageRemaining}% remaining
            </div>
          </div>
        </div>
      </div>
    ),
    { width, height }
  );
}

function renderYearView(
  calendar: ReturnType<typeof getCurrentYearCalendar>,
  width: number,
  height: number,
  paddingX: number,
  paddingY: number,
  paddingBottom: number,
  contentWidth: number,
  contentHeight: number,
  density: string,
  theme: ThemeConfig,
  safeArea: ReturnType<typeof getDeviceSafeArea>
) {
  // Enhanced typography for year view
  const typography = getTypographySystem(height, density, width);
  const hierarchy = getVisualHierarchy();

  // Optimized layout: 10% top, 62% middle, 28% bottom
  const topSection = height * 0.10;
  const middleSection = height * 0.62;
  const bottomSection = height * 0.28;

  // Calculate percentage
  const percentageCompleted = Math.round((calendar.daysGone / calendar.totalDays) * 100);
  const percentageRemaining = Math.round((calendar.daysLeft / calendar.totalDays) * 100);

  // Improved dot sizing with safe area consideration
  const effectiveArea = Math.min(middleSection - safeArea.top * 0.3, contentWidth - safeArea.left * 0.3);
  const daySize = Math.max(Math.min(effectiveArea / 53, 18) * 1.18, 8); // Constrain between 8-21px
  const gap = density === "compact" ? 2 : 3;

  const headerStyle = {
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    width: "100%",
    height: `${topSection}px`,
    position: "absolute" as const,
    top: 0,
    left: 0,
  };

  const headerBoxStyle = {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,
    alignItems: "center" as const,
    padding: "20px 32px",
    background: "rgba(0, 0, 0, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const yearGridStyle = {
    display: "flex" as const,
    flexWrap: "wrap" as const,
    gap,
    justifyContent: "center" as const,
    position: "absolute" as const,
    top: `${topSection}px`,
    left: `${paddingX}px`,
    width: `${contentWidth}px`,
    height: `${middleSection}px`,
  };

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          position: "relative",
          background: theme.background,
          color: theme.textColor,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header in top 30% */}
        <div style={headerStyle}>
          <div style={headerBoxStyle}>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.045, 52), fontWeight: 600, color: theme.textColor, letterSpacing: 4 }}>
              {calendar.year}
            </div>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.018 * 1.3, 22), fontWeight: 500, color: "#ff0000", letterSpacing: 1 }}>
              {calendar.daysLeft} days left
            </div>
          </div>
        </div>

        {/* Year grid in middle 40% */}
        <div style={yearGridStyle}>
          {calendar.months.flatMap((m, mIdx) => m.days.map((d, dIdx) => {
            const isToday = d.isToday;
            const dayKey = `y-${mIdx}-${dIdx}`;

            if (isToday) {
              return (
                <div
                  key={dayKey}
                  style={{
                    width: daySize,
                    height: daySize,
                    borderRadius: "50%",
                    background: "#ff0000",
                    border: "2px solid #ff0000",
                  }}
                />
              );
            } else {
              return (
                <div
                  key={dayKey}
                  style={{
                    width: daySize,
                    height: daySize,
                    borderRadius: "50%",
                    background: d.isPast ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                />
              );
            }
          }))}
        </div>
      </div>
    ),
    { width, height }
  );
}

function renderWeeksView(
  calendar: ReturnType<typeof getCurrentYearCalendar>,
  width: number,
  height: number,
  paddingX: number,
  paddingY: number,
  paddingBottom: number,
  contentWidth: number,
  contentHeight: number,
  density: string,
  theme: ThemeConfig,
  safeArea: ReturnType<typeof getDeviceSafeArea>
) {
  // Enhanced typography for weeks view
  const typography = getTypographySystem(height, density, width);
  const hierarchy = getVisualHierarchy();

  // Optimized layout: 10% top, 64% middle, 26% bottom
  const topSection = height * 0.10;
  const middleSection = height * 0.64;
  const bottomSection = height * 0.26;

  // Calculate percentage
  const percentageCompleted = Math.round((calendar.daysGone / calendar.totalDays) * 100);
  const percentageRemaining = Math.round((calendar.daysLeft / calendar.totalDays) * 100);

  // Improved spacing with safe area consideration
  const effectiveHeight = middleSection - (safeArea.top + safeArea.bottom) * 0.2;
  const weekGap = density === "compact" ? 2 : 3;
  const weekHeight = Math.max((effectiveHeight - weekGap * (calendar.weeks.length - 1)) / calendar.weeks.length, 30);
  const dayWidth = (contentWidth - weekGap * 6) / 7;

  const headerStyle = {
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    width: "100%",
    height: `${topSection}px`,
    position: "absolute" as const,
    top: 0,
    left: 0,
  };

  const headerBoxStyle = {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,
    alignItems: "center" as const,
    padding: "20px 32px",
    background: "rgba(0, 0, 0, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const weeksListStyle = {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: weekGap,
    position: "absolute" as const,
    top: `${topSection}px`,
    left: `${paddingX}px`,
    width: `${contentWidth}px`,
    height: `${middleSection}px`,
    overflow: "hidden" as const,
  };

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          position: "relative",
          background: theme.background,
          color: theme.textColor,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header in top 30% */}
        <div style={headerStyle}>
          <div style={headerBoxStyle}>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.045, 52), fontWeight: 600, color: theme.textColor, letterSpacing: 4 }}>
              {calendar.year}
            </div>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.018 * 1.3, 22), fontWeight: 500, color: "#ff0000", letterSpacing: 1 }}>
              {calendar.daysLeft} days left
            </div>
          </div>
        </div>

        {/* Weeks in middle 40% */}
        <div style={weeksListStyle}>
          {calendar.weeks.map((week, weekIdx) => (
            <div
              key={weekIdx}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: weekGap,
                height: weekHeight,
              }}
            >
              {week.days.map((d, dayIdx) => {
                const isToday = d.isToday;
                const dayKey = `w-${weekIdx}-${dayIdx}`;

                if (isToday) {
                  return (
                    <div
                      key={dayKey}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: dayWidth,
                        height: weekHeight,
                        borderRadius: "8px",
                        background: "#ff0000",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: weekHeight * 0.3 * 1.1, // Increase by 10%
                        fontWeight: 700,
                        color: "#ffffff",
                        border: "2px solid #ff0000",
                      }}
                    >
                      {d.day}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={dayKey}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: dayWidth,
                        height: weekHeight,
                        borderRadius: "8px",
                        background: d.isPast ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.45)",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: weekHeight * 0.25 * 1.1, // Increase by 10%
                        fontWeight: 500,
                        color: "#ffffff",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      {d.day}
                    </div>
                  );
                }
              })}
            </div>
          ))}
        </div>
      </div>
    ),
    { width, height }
  );
}

function renderDaysLeftView(
  calendar: ReturnType<typeof getCurrentYearCalendar>,
  width: number,
  height: number,
  paddingX: number,
  paddingY: number,
  paddingBottom: number,
  contentWidth: number,
  contentHeight: number,
  density: string,
  theme: ThemeConfig,
  safeArea: ReturnType<typeof getDeviceSafeArea>
) {
  // Enhanced typography for days left view
  const typography = getTypographySystem(height, density, width);
  const hierarchy = getVisualHierarchy();

  // Optimized layout: 12% top, 62% middle, 26% bottom
  const topSection = height * 0.12;
  const middleSection = height * 0.62;
  const bottomSection = height * 0.26;

  // Calculate percentage
  const percentageCompleted = Math.round((calendar.daysGone / calendar.totalDays) * 100);
  const percentageRemaining = Math.round((calendar.daysLeft / calendar.totalDays) * 100);

  const remainingDays = calendar.months
    .flatMap((m) => m.days)
    .filter((d) => !d.isPast && !d.isToday);

  // Improved day size calculation with safe area consideration
  const effectiveArea = (middleSection - safeArea.top * 0.3) * (contentWidth - safeArea.left * 0.3);
  const daySize = Math.max(
    Math.min(
      Math.sqrt(effectiveArea / remainingDays.length) * 0.92,
      42
    ),
    24
  ); // Constrain between 24-42px
  const gap = density === "compact" ? 3 : 5;

  const headerStyle = {
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    width: "100%",
    height: `${topSection}px`,
    position: "absolute" as const,
    top: 0,
    left: 0,
  };

  const headerBoxStyle = {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,
    alignItems: "center" as const,
    padding: "20px 32px",
    background: "rgba(0, 0, 0, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const daysGridStyle = {
    display: "flex" as const,
    flexWrap: "wrap" as const,
    gap,
    justifyContent: "center" as const,
    position: "absolute" as const,
    top: `${topSection}px`,
    left: `${paddingX}px`,
    width: `${contentWidth}px`,
    height: `${middleSection}px`,
  };

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          position: "relative",
          background: theme.background,
          color: theme.textColor,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header in top 30% */}
        <div style={headerStyle}>
          <div style={headerBoxStyle}>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.08, 64), fontWeight: 700, color: "#ff0000", letterSpacing: 4 }}>
              {calendar.daysLeft}
            </div>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.025, 28), fontWeight: 600, color: theme.textColor, letterSpacing: 2 }}>
              DAYS LEFT IN {calendar.year}
            </div>
          </div>
        </div>

        {/* Remaining days grid in middle 40% */}
        <div style={daysGridStyle}>
          {remainingDays.map((d, idx) => {
            const daysUntil = Math.ceil(
              (d.date.getTime() - calendar.today.getTime()) / (1000 * 60 * 60 * 24)
            );
            const dayKey = `dl-${idx}`;

            return (
              <div
                key={dayKey}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: daySize,
                  height: daySize,
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.12)",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: daySize * 0.35 * 1.1, // Increase by 10%
                  fontWeight: 600,
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div style={{ display: "flex", fontSize: daySize * 0.25 * 1.1, opacity: 0.8 }}> {/* Increase by 10% */}
                  {d.month + 1}/{d.day}
                </div>
                {daysUntil > 0 && (
                  <div style={{ display: "flex", fontSize: daySize * 0.2 * 1.1, color: "#ff0000", opacity: 0.9 }}> {/* Increase by 10% */}
                    +{daysUntil}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ),
    { width, height }
  );
}

// Fallback quotes in case API fails
const FALLBACK_QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "You learn more from failure than from success.", author: "Unknown" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Do not wait to strike till the iron is hot, but make it hot by striking.", author: "William Butler Yeats" },
];

async function getRandomQuote(): Promise<{ text: string; author: string }> {
  try {
    const response = await fetch('https://api.quotable.io/random', {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return {
      text: data.content,
      author: data.author,
    };
  } catch (error) {
    // Return random fallback quote
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    return FALLBACK_QUOTES[randomIndex];
  }
}

async function renderDailyQuote(
  calendar: ReturnType<typeof getCurrentYearCalendar>,
  width: number,
  height: number,
  paddingX: number,
  paddingY: number,
  paddingBottom: number,
  contentWidth: number,
  contentHeight: number,
  density: string,
  theme: ThemeConfig,
  safeArea: ReturnType<typeof getDeviceSafeArea>
) {
  // Calculate percentage
  const percentageCompleted = Math.round((calendar.daysGone / calendar.totalDays) * 100);
  const percentageRemaining = Math.round((calendar.daysLeft / calendar.totalDays) * 100);

  // Fetch quote
  const quote = await getRandomQuote();

  // Enhanced typography system
  const typography = getTypographySystem(height, density, width);
  const hierarchy = getVisualHierarchy();

  // Responsive font sizing - premium quote typography with safe area consideration
  const isSmallDevice = height < 2400;
  const quoteSize = Math.max(typography.title * (isSmallDevice ? 1.0 : 1.2), 36);
  const authorSize = Math.max(typography.subheader * 0.9, 24);

  // Improved padding with safe area consideration
  const effectivePaddingX = paddingX + safeArea.left * 0.4;
  const effectivePaddingY = paddingY + safeArea.top * 0.3;

  const mainContainerStyle = {
    display: "flex" as const,
    flexDirection: "column" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    width: "100%",
    height: "100%",
    padding: `${effectivePaddingY}px ${effectivePaddingX * 1.5}px`,
    gap: 50,
  };

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          position: "relative",
          background: theme.background,
          color: theme.textColor,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Main content container - centered */}
        <div style={mainContainerStyle}>
          {/* Quote section */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            maxWidth: "88%",
            textAlign: "center",
          }}>
            <div style={{
              display: "flex",
              fontSize: quoteSize,
              fontWeight: hierarchy.secondary.fontWeight,
              color: theme.textColor,
              opacity: hierarchy.primary.opacity,
              lineHeight: 1.45,
              letterSpacing: 0.6,
              textShadow: "0 2px 16px rgba(255, 255, 255, 0.1)",
            }}>
              "{quote.text}"
            </div>
            <div style={{
              display: "flex",
              fontSize: authorSize,
              fontWeight: hierarchy.tertiary.fontWeight,
              color: theme.textColor,
              opacity: hierarchy.tertiary.opacity,
              fontStyle: "italic",
              letterSpacing: 1.2,
            }}>
              — {quote.author}
            </div>
          </div>

          {/* Year and details section - directly below quote */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
            padding: "20px 32px",
            background: "rgba(0, 0, 0, 0.8)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.045, 52), fontWeight: 600, color: theme.textColor, letterSpacing: 4 }}>
              {calendar.year}
            </div>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.018 * 1.3, 22), fontWeight: 500, color: "#ff0000", letterSpacing: 1 }}>
              {calendar.daysLeft} days remaining
            </div>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.016, 20), fontWeight: 500, color: theme.textColor, letterSpacing: 1 }}>
              {percentageCompleted}% completed • {percentageRemaining}% remaining
            </div>
          </div>
        </div>
      </div>
    ),
    { width, height }
  );
}

function renderMinimalDate(
  calendar: ReturnType<typeof getCurrentYearCalendar>,
  width: number,
  height: number,
  paddingX: number,
  paddingY: number,
  paddingBottom: number,
  contentWidth: number,
  contentHeight: number,
  density: string,
  theme: ThemeConfig,
  safeArea: ReturnType<typeof getDeviceSafeArea>
) {
  const today = calendar.today;
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
  const month = today.toLocaleDateString('en-US', { month: 'long' });
  const day = today.getDate();
  const year = today.getFullYear();

  const typography = getTypographySystem(height, density, width);
  const hierarchy = getVisualHierarchy();

  // Improved padding with safe area consideration
  const effectivePaddingY = paddingY + safeArea.top * 0.4;
  const effectivePaddingBottom = paddingBottom + safeArea.bottom * 0.4;
  const effectivePaddingX = paddingX + safeArea.left * 0.3;

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: theme.background,
          color: theme.textColor,
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: `${effectivePaddingY}px ${effectivePaddingX}px ${effectivePaddingBottom}px`,
        }}
      >
        {/* Day of week */}
        <div style={{
          display: "flex",
          fontSize: typography.subheader,
          fontWeight: hierarchy.tertiary.fontWeight,
          color: theme.textSecondary,
          opacity: hierarchy.tertiary.opacity,
          letterSpacing: 8,
          textTransform: "uppercase",
          marginBottom: 20,
        }}>
          {dayOfWeek}
        </div>

        {/* Day number - Large */}
        <div style={{
          display: "flex",
          fontSize: Math.min(height * 0.35, width * 0.6),
          fontWeight: 700,
          color: theme.dayToday,
          lineHeight: 1,
          marginBottom: 20,
          textShadow: `0 4px 24px ${theme.shadowColor}`,
        }}>
          {day}
        </div>

        {/* Month and Year */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}>
          <div style={{
            display: "flex",
            fontSize: typography.title,
            fontWeight: hierarchy.primary.fontWeight,
            color: theme.textColor,
            opacity: hierarchy.primary.opacity,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}>
            {month}
          </div>
          <div style={{
            display: "flex",
            fontSize: typography.header,
            fontWeight: hierarchy.secondary.fontWeight,
            color: theme.textSecondary,
            opacity: hierarchy.secondary.opacity,
            letterSpacing: 4,
          }}>
            {year}
          </div>
        </div>

        {/* Days left indicator */}
        <div style={{
          display: "flex",
          position: "absolute",
          bottom: effectivePaddingBottom + 30,
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          padding: "16px 28px",
          background: "rgba(0, 0, 0, 0.6)",
          borderRadius: "12px",
          border: `1px solid ${theme.borderColor}`,
        }}>
          <div style={{
            display: "flex",
            fontSize: typography.body,
            fontWeight: hierarchy.tertiary.fontWeight,
            color: theme.dayToday,
            opacity: hierarchy.secondary.opacity,
          }}>
            {calendar.daysLeft} days remaining
          </div>
          <div style={{
            display: "flex",
            fontSize: typography.small,
            fontWeight: hierarchy.quaternary.fontWeight,
            color: theme.textSecondary,
            opacity: hierarchy.quaternary.opacity,
          }}>
            {Math.round((calendar.daysGone / calendar.totalDays) * 100)}% of {year} complete
          </div>
        </div>
      </div>
    ),
    { width, height }
  );
}
