import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getCurrentYearCalendar } from "@/lib/calendar";
import { THEMES, Theme, ThemeConfig } from "@/lib/themes";
import React from "react";

export const runtime = "edge";

type Layout = "months-3x4" | "months-list" | "year" | "weeks" | "days-left";

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
    layoutParam === "months-list"
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
  const headerHeight = density === "compact" ? 60 : 80;
  const monthGap = density === "compact" ? 24 : 32;
  const availableHeight = contentHeight - headerHeight;
  const monthHeight = (availableHeight - monthGap * 3) / 4;
  const monthWidth = (contentWidth - monthGap * 2) / 3;
  const daySize = Math.min(monthWidth / 8, monthHeight / 7);
  const dayGap = density === "compact" ? 4 : 6;
  const fontSize = Math.max(daySize * 0.5, 16); // Much larger font size

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          flexDirection: "column",
          padding: `${paddingY}px ${paddingX}px ${paddingBottom}px ${paddingX}px`,
          background: theme.background,
          color: theme.textColor,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* Minimal Header - Text Only */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 32,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                display: "flex",
                fontSize: 36,
                fontWeight: 400,
                color: theme.textColor,
                letterSpacing: 2,
              }}
            >
              {calendar.year}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 16,
                fontWeight: 400,
                color: theme.textColor,
              }}
            >
              {calendar.daysLeft} days left
            </div>
          </div>
        </div>

        {/* 3x4 Grid - Text Only */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: monthGap,
            flex: 1,
          }}
        >
          {calendar.months.map((monthBlock) => {
            const firstWeekday = new Date(
              calendar.year,
              monthBlock.month,
              1
            ).getDay();

            const boxes: React.ReactNode[] = [];
            
            // Empty boxes for days before month starts
            for (let i = 0; i < firstWeekday; i++) {
              boxes.push(
                <div
                  key={`empty-${monthBlock.month}-${i}`}
                  style={{
                    width: daySize,
                    height: daySize,
                  }}
                />
              );
            }

            // Day boxes
            for (const d of monthBlock.days) {
              const isToday = d.isToday;
              boxes.push(
                <div
                  key={d.date.toISOString()}
                  style={{
                    display: "flex",
                    width: daySize,
                    height: daySize,
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: fontSize,
                    fontWeight: isToday ? 600 : 400,
                    color: theme.textColor,
                  }}
                >
                  {isToday ? `${d.day}*` : d.day}
                </div>
              );
            }

            // Group into weeks (7 days per row)
            const weekRows: React.ReactNode[][] = [];
            for (let i = 0; i < boxes.length; i += 7) {
              weekRows.push(boxes.slice(i, i + 7));
            }

            return (
              <div
                key={monthBlock.month}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: monthWidth,
                  height: monthHeight,
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: Math.max(fontSize * 0.7, 14),
                    fontWeight: 500,
                    color: theme.textColor,
                    letterSpacing: 1,
                  }}
                >
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
  const headerHeight = density === "compact" ? 80 : 96;
  const monthGap = density === "compact" ? 10 : 16;
  const monthHeight = (contentHeight - headerHeight - monthGap * 11) / 12;
  const daySize = monthHeight / 6;
  const dayGap = density === "compact" ? daySize * 0.12 : daySize * 0.2;

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          flexDirection: "column",
          padding: `${paddingY}px ${paddingX}px ${paddingBottom}px ${paddingX}px`,
          background: theme.background,
          color: theme.textColor,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 8,
              }}
            >
              {calendar.year}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                opacity: 0.7,
              }}
            >
              {calendar.today.toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                weekday: "short",
              })}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
              fontSize: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                fontWeight: 600,
              }}
            >
              {calendar.daysLeft} days left
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 16,
                opacity: 0.7,
              }}
            >
              {calendar.daysGone} gone · {calendar.totalDays} total
            </div>
            <div
              style={{
                display: "flex",
                width: 220,
                height: 6,
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
                marginTop: 4,
              }}
            >
              <div
                style={{
                  width: `${(calendar.daysGone / calendar.totalDays) * 100}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #22c55e, #a3e635, #fde047)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Months list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: monthGap,
            flex: 1,
          }}
        >
          {calendar.months.map((monthBlock) => {
            const firstWeekday = new Date(
              calendar.year,
              monthBlock.month,
              1
            ).getDay();

            const boxes: React.ReactNode[] = [];
            for (let i = 0; i < firstWeekday; i++) {
              boxes.push(
                <div
                  key={`empty-${monthBlock.month}-${i}`}
                  style={{
                    width: daySize,
                    height: daySize,
                  }}
                />
              );
            }

            for (const d of monthBlock.days) {
              const baseOpacity = d.isPast ? 0.18 : 0.45;
              const isToday = d.isToday;

              boxes.push(
                <div
                  key={d.date.toISOString()}
                  style={{
                    width: daySize,
                    height: daySize,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: daySize * 0.4,
                    fontWeight: isToday ? 700 : 500,
                    background: isToday
                      ? "linear-gradient(135deg, #22c55e, #a3e635)"
                      : `rgba(255,255,255,${baseOpacity})`,
                    color: isToday ? "#020617" : "rgba(15,23,42,0.9)",
                    boxShadow: isToday
                      ? "0 0 0 2px rgba(34,197,94,0.4), 0 18px 45px rgba(34,197,94,0.45)"
                      : "none",
                  }}
                >
                  {d.day}
                </div>
              );
            }

            return (
              <div
                key={monthBlock.month}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 24,
                  height: monthHeight,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 120,
                    fontSize: 18,
                    fontWeight: 600,
                    opacity: 0.8,
                  }}
                >
                  {monthNames[monthBlock.month].toUpperCase()}
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
  const headerHeight = density === "compact" ? 100 : 120;
  const availableHeight = contentHeight - headerHeight;
  const daySize = Math.min(availableHeight / 53, contentWidth / 53); // 53 weeks max
  const gap = density === "compact" ? 2 : 3;

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          flexDirection: "column",
          padding: `${paddingY}px ${paddingX}px ${paddingBottom}px ${paddingX}px`,
          background: theme.background,
          color: theme.textColor,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: 12,
              }}
            >
              {calendar.year}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                opacity: 0.7,
              }}
            >
              Year Overview
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
              fontSize: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                fontWeight: 600,
              }}
            >
              {calendar.daysLeft} days left
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                opacity: 0.7,
              }}
            >
              {calendar.daysGone} gone · {calendar.totalDays} total
            </div>
          </div>
        </div>

        {/* Year grid - all days */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap,
            justifyContent: "center",
            flex: 1,
          }}
        >
          {calendar.months.flatMap((m) => m.days).map((d) => {
            const baseOpacity = d.isPast ? 0.15 : 0.4;
            const isToday = d.isToday;

            return (
              <div
                key={d.date.toISOString()}
                style={{
                  width: daySize,
                  height: daySize,
                  borderRadius: 3,
                  display: "flex",
                  background: isToday
                    ? "linear-gradient(135deg, #22c55e, #a3e635)"
                    : `rgba(255,255,255,${baseOpacity})`,
                  boxShadow: isToday
                    ? "0 0 0 2px rgba(34,197,94,0.5), 0 4px 12px rgba(34,197,94,0.4)"
                    : "none",
                }}
              />
            );
          })}
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
  const headerHeight = density === "compact" ? 80 : 96;
  const weekGap = density === "compact" ? 4 : 6;
  const availableHeight = contentHeight - headerHeight;
  const weekHeight = (availableHeight - weekGap * (calendar.weeks.length - 1)) / calendar.weeks.length;
  const dayWidth = (contentWidth - weekGap * 6) / 7;

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          flexDirection: "column",
          padding: `${paddingY}px ${paddingX}px ${paddingBottom}px ${paddingX}px`,
          background: theme.background,
          color: theme.textColor,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: 8,
              }}
            >
              {calendar.year} - Weeks
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                opacity: 0.7,
              }}
            >
              {calendar.weeks.length} weeks
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
              fontSize: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                fontWeight: 600,
              }}
            >
              {calendar.daysLeft} days left
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                opacity: 0.7,
              }}
            >
              Week {Math.floor(calendar.daysGone / 7) + 1}
            </div>
          </div>
        </div>

        {/* Weeks */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: weekGap,
            flex: 1,
            overflow: "hidden",
          }}
        >
          {calendar.weeks.map((week, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: weekGap,
                height: weekHeight,
              }}
            >
              {week.days.map((d) => {
                const baseOpacity = d.isPast ? 0.18 : 0.45;
                const isToday = d.isToday;

                return (
                  <div
                    key={d.date.toISOString()}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: dayWidth,
                      height: weekHeight,
                      borderRadius: 4,
                      background: isToday
                        ? "linear-gradient(135deg, #22c55e, #a3e635)"
                        : `rgba(255,255,255,${baseOpacity})`,
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: weekHeight * 0.25,
                      fontWeight: isToday ? 700 : 500,
                      color: isToday ? "#020617" : "rgba(255,255,255,0.9)",
                      boxShadow: isToday
                        ? "0 0 0 2px rgba(34,197,94,0.4), 0 4px 12px rgba(34,197,94,0.3)"
                        : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        fontSize: weekHeight * 0.15,
                        opacity: 0.7,
                        marginBottom: 2,
                      }}
                    >
                      {d.date.toLocaleDateString(undefined, { weekday: "short" }).toUpperCase()}
                    </div>
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      {d.day}
                    </div>
                  </div>
                );
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
  const headerHeight = density === "compact" ? 120 : 140;
  const availableHeight = contentHeight - headerHeight;
  const remainingDays = calendar.months
    .flatMap((m) => m.days)
    .filter((d) => !d.isPast && !d.isToday);
  
  const daySize = Math.min(
    Math.sqrt((availableHeight * contentWidth) / remainingDays.length) * 0.9,
    40
  );
  const gap = density === "compact" ? 4 : 6;

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          flexDirection: "column",
          padding: `${paddingY}px ${paddingX}px ${paddingBottom}px ${paddingX}px`,
          background: theme.background,
          color: theme.textColor,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 24,
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: 12,
            }}
          >
            {calendar.daysLeft}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 600,
              opacity: 0.9,
            }}
          >
            DAYS LEFT IN {calendar.year}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              opacity: 0.7,
            }}
            >
            {calendar.today.toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </div>
          <div
            style={{
              display: "flex",
              width: Math.min(contentWidth * 0.6, 400),
              height: 8,
              borderRadius: 999,
              background: "rgba(255,255,255,0.1)",
              overflow: "hidden",
              marginTop: 8,
            }}
          >
            <div
              style={{
                width: `${(calendar.daysGone / calendar.totalDays) * 100}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, #22c55e, #a3e635, #fde047)",
              }}
            />
          </div>
        </div>

        {/* Remaining days grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap,
            justifyContent: "center",
            flex: 1,
          }}
        >
          {remainingDays.map((d) => {
            const daysUntil = Math.ceil(
              (d.date.getTime() - calendar.today.getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={d.date.toISOString()}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: daySize,
                  height: daySize,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.12)",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: daySize * 0.35,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: daySize * 0.2,
                    opacity: 0.6,
                    marginBottom: 2,
                  }}
                >
                  {d.month + 1}/{d.day}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: daySize * 0.15,
                    opacity: 0.5,
                  }}
                >
                  {daysUntil > 0 ? `+${daysUntil}` : ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),
    { width, height }
  );
}