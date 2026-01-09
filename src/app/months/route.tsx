import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getCurrentYearCalendar } from "@/lib/calendar";
import React from "react";

export const runtime = "edge";
export const maxDuration = 10; // Reduced for faster response
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
  const { searchParams } = new URL(req.url);
    const width = Math.max(800, Math.min(3000, Number(searchParams.get("width")) || 1320));
    const height = Math.max(1200, Math.min(4000, Number(searchParams.get("height")) || 2868));

  const calendar = getCurrentYearCalendar();
    const padding = 60;
    const contentWidth = width - padding * 2;
    const contentHeight = height - padding * 2;

    // Calculate grid dimensions: 3 columns, 4 rows
    const monthGap = 20;
    const monthWidth = (contentWidth - monthGap * 2) / 3;
    const monthHeight = (contentHeight - monthGap * 3) / 4;
    const daySize = Math.min(monthHeight / 7, monthWidth / 8);
    const dayGap = 4;

    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          flexDirection: "column",
            padding: `${padding}px`,
            background: "#000000",
            color: "#ffffff",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
              marginBottom: 30,
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: 8 }}>
              {calendar.year}
            </div>
            <div style={{ fontSize: 18, opacity: 0.8 }}>
              {calendar.daysLeft} days left
            </div>
          </div>

          {/* Calendar Grid - 3x4 */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: monthGap,
            flex: 1,
          }}
        >
            {calendar.months.map((monthBlock, monthIdx) => {
              // Calculate first weekday once per month
              const firstWeekday = monthBlock.days.length > 0 
                ? new Date(calendar.year, monthBlock.month, 1).getDay()
                : 0;
              const boxes: React.ReactNode[] = [];

              // Empty cells for days before month starts
            for (let i = 0; i < firstWeekday; i++) {
              boxes.push(
                  <div key={`empty-${monthBlock.month}-${i}`} style={{ width: daySize, height: daySize }} />
                );
              }

              // Days of the month
            for (const d of monthBlock.days) {
              const isToday = d.isToday;
              boxes.push(
                <div
                  key={d.date.toISOString()}
                  style={{
                    width: daySize,
                    height: daySize,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                      fontSize: daySize * 0.4,
                      fontWeight: isToday ? 700 : 400,
                      color: isToday ? "#000000" : d.isPast ? "#666666" : "#ffffff",
                      background: isToday ? "#ffffff" : "transparent",
                      borderRadius: 4,
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
                  flexDirection: "column",
                  width: monthWidth,
                  height: monthHeight,
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#ffffff", letterSpacing: 1 }}>
                  {monthNames[monthBlock.month]}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    width: monthWidth,
                    gap: dayGap,
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

    // Aggressive caching for performance
    const headers = new Headers(imageResponse.headers);
    headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    headers.set("CDN-Cache-Control", "public, s-maxage=60");

    return new Response(imageResponse.body, {
      status: imageResponse.status,
      statusText: imageResponse.statusText,
      headers,
    });
  } catch (error) {
    console.error("Error generating calendar:", error);
    return new Response(JSON.stringify({ error: "Failed to generate calendar" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
