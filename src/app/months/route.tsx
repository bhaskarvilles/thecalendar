import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getCurrentYearCalendar } from "@/lib/calendar";
import { THEMES, Theme, ThemeConfig } from "@/lib/themes";
import React from "react";

export const runtime = "edge";

type Layout = "months-3x4" | "months-list" | "year" | "weeks" | "days-left" | "daily-quote";

// Device-specific safe areas for iPhone lock screens
function getDeviceSafeArea(width: number, height: number) {
  const isIPhone = height > width && height > 2000;
  const isIPad = width > 1400;

  // iPhone safe areas (top notch, bottom home indicator)
  if (isIPhone) {
    const topSafe = Math.max(44, height * 0.05); // Notch area
    const bottomSafe = Math.max(34, height * 0.04); // Home indicator
    const sideSafe = Math.max(20, width * 0.02); // Side margins
    return { top: topSafe, bottom: bottomSafe, left: sideSafe, right: sideSafe };
  }

  // iPad safe areas
  if (isIPad) {
    return { top: 20, bottom: 20, left: 40, right: 40 };
  }

  // Default
  return { top: 0, bottom: 0, left: 0, right: 0 };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const widthParam = searchParams.get("width");
  const heightParam = searchParams.get("height");
  const densityParam = searchParams.get("density");
  const layoutParam = searchParams.get("layout");

  const width = Math.max(800, Math.min(3000, Number(widthParam) || 1320));
  const height = Math.max(1200, Math.min(4000, Number(heightParam) || 2868));
  const density = densityParam === "compact" ? "compact" : "cozy";
  const layout: Layout =
    layoutParam === "year" ||
      layoutParam === "weeks" ||
      layoutParam === "days-left" ||
      layoutParam === "months-list" ||
      layoutParam === "daily-quote"
      ? layoutParam
      : "months-3x4";

  const theme: Theme = "minimal-black";

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
      monthNames
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
      monthNames
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
      themeConfig
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
      themeConfig
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
      themeConfig
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
      themeConfig
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
  monthNames: string[]
) {
  // Optimized: Use 10% top, 60% middle, 30% bottom layout
  const topSection = height * 0.1;
  const middleSection = height * 0.6;
  const bottomSection = height * 0.3;

  const monthGap = density === "compact" ? 20 : 28;
  const monthHeight = (middleSection - monthGap * 3) / 4;
  const monthWidth = (contentWidth - monthGap * 2) / 3;
  const daySize = Math.min(monthWidth / 7.5, monthHeight / 6.5) * 1.12; // Increase by 12%
  const dayGap = density === "compact" ? 6 : 8;
  const fontSize = Math.max(daySize * 0.65, 24) * 1.1; // Increase by 10%

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

  const yearTextStyle = {
    display: "flex" as const,
    fontSize: Math.max(width * 0.045, 52) * 1.1, // Increase by 10%
    fontWeight: 600,
    color: theme.textColor,
    letterSpacing: 4,
  };

  const daysLeftStyle = {
    display: "flex" as const,
    fontSize: Math.max(width * 0.018 * 1.3, 22) * 1.1, // Increase by 10%
    fontWeight: 500,
    color: "#ff0000",
    letterSpacing: 1,
  };

  const percentageStyle = {
    display: "flex" as const,
    fontSize: Math.max(width * 0.016, 20) * 1.1, // Increase by 10%
    fontWeight: 500,
    color: theme.textColor,
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
              fontSize: Math.max(fontSize * 0.8, 20) * 1.1, // Increase by 10%
              fontWeight: 600,
              color: theme.textColor,
              letterSpacing: 2,
              padding: "4px 12px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
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
  monthNames: string[]
) {
  // 10% top, 60% middle, 30% bottom layout
  const topSection = height * 0.1;
  const middleSection = height * 0.6;
  const bottomSection = height * 0.3;

  const monthGap = density === "compact" ? 8 : 12;
  const monthHeight = (middleSection - monthGap * 11) / 12;
  const daySize = (monthHeight / 6) * 1.12; // Increase by 12%
  const dayGap = density === "compact" ? daySize * 0.1 : daySize * 0.15;


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
  theme: ThemeConfig
) {
  // 10% top, 60% middle, 30% bottom layout
  const topSection = height * 0.1;
  const middleSection = height * 0.6;
  const bottomSection = height * 0.3;


  // Calculate percentage
  const percentageCompleted = Math.round((calendar.daysGone / calendar.totalDays) * 100);
  const percentageRemaining = Math.round((calendar.daysLeft / calendar.totalDays) * 100);

  const daySize = Math.min(middleSection / 53, contentWidth / 53) * 1.12; // Increase by 12%
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
  theme: ThemeConfig
) {
  // 10% top, 60% middle, 30% bottom layout
  const topSection = height * 0.1;
  const middleSection = height * 0.6;
  const bottomSection = height * 0.3;


  // Calculate percentage
  const percentageCompleted = Math.round((calendar.daysGone / calendar.totalDays) * 100);
  const percentageRemaining = Math.round((calendar.daysLeft / calendar.totalDays) * 100);

  const weekGap = density === "compact" ? 3 : 4;
  const weekHeight = (middleSection - weekGap * (calendar.weeks.length - 1)) / calendar.weeks.length;
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
  theme: ThemeConfig
) {
  // 10% top, 60% middle, 30% bottom layout
  const topSection = height * 0.1;
  const middleSection = height * 0.6;
  const bottomSection = height * 0.3;


  // Calculate percentage
  const percentageCompleted = Math.round((calendar.daysGone / calendar.totalDays) * 100);
  const percentageRemaining = Math.round((calendar.daysLeft / calendar.totalDays) * 100);

  const remainingDays = calendar.months
    .flatMap((m) => m.days)
    .filter((d) => !d.isPast && !d.isToday);

  const daySize = Math.min(
    Math.sqrt((middleSection * contentWidth) / remainingDays.length) * 0.9,
    40
  );
  const gap = density === "compact" ? 4 : 6;

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
  theme: ThemeConfig
) {
  // 15% top, 55% middle, 30% bottom layout
  const topSection = height * 0.15;
  const middleSection = height * 0.55;
  const bottomSection = height * 0.3;

  // Calculate percentage
  const percentageCompleted = Math.round((calendar.daysGone / calendar.totalDays) * 100);
  const percentageRemaining = Math.round((calendar.daysLeft / calendar.totalDays) * 100);

  // Fetch quote
  const quote = await getRandomQuote();

  // Responsive font sizing
  const quoteSize = Math.max(width * 0.028, 32) * 1.1; // Increase by 10%
  const authorSize = Math.max(width * 0.02, 24) * 1.1; // Increase by 10%

  const quoteContainerStyle = {
    display: "flex" as const,
    flexDirection: "column" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    width: "100%",
    height: `${middleSection}px`,
    position: "absolute" as const,
    top: `${topSection}px`,
    left: 0,
    padding: `0 ${paddingX * 2}px`,
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
        {/* Quote in middle 55% */}
        <div style={quoteContainerStyle}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            maxWidth: "90%",
            textAlign: "center",
          }}>
            <div style={{
              display: "flex",
              fontSize: quoteSize,
              fontWeight: 400,
              color: theme.textColor,
              lineHeight: 1.5,
              letterSpacing: 0.5,
            }}>
              "{quote.text}"
            </div>
            <div style={{
              display: "flex",
              fontSize: authorSize,
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.7)",
              fontStyle: "italic",
              letterSpacing: 1,
            }}>
              — {quote.author}
            </div>
          </div>
        </div>

        {/* Footer with year, days left, and percentage */}
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
