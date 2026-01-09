"use client";

import { useMemo, useState } from "react";
import { DEVICE_PRESETS } from "@/lib/devices";

export default function Home() {
  const [origin] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "https://your-domain.com";
  });
  const [deviceId, setDeviceId] = useState<string>("iphone-16-pro-max");
  const [copied, setCopied] = useState(false);

  const device = useMemo(
    () => DEVICE_PRESETS.find((d) => d.id === deviceId) ?? DEVICE_PRESETS[0],
    [deviceId]
  );

  const wallpaperUrl = useMemo(() => {
    const search = new URLSearchParams({
      width: String(device.width),
      height: String(device.height),
    });
    return `${origin}/months?${search.toString()}`;
  }, [origin, device]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallpaperUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const iphones = DEVICE_PRESETS.filter((d) => d.family === "iphone");
  const ipads = DEVICE_PRESETS.filter((d) => d.family === "ipad");

  return (
    <div style={{ minHeight: "100vh", background: "#000000", color: "#ffffff" }}>
      <main
        style={{
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          maxWidth: "768px",
          padding: "48px 16px",
        }}
      >
        <header style={{ marginBottom: "48px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: 700, marginBottom: "16px" }}>
            Calendar Wallpaper
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "18px" }}>
            Minimal black calendar wallpaper for your lock screen. Today is highlighted in white.
          </p>
        </header>

        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
                Device Model
              </label>
              <select
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "#000000",
                  padding: "12px 16px",
                  color: "#ffffff",
                  outline: "none",
                  fontSize: "14px",
                }}
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
              >
                <optgroup label="iPhone">
                  {iphones.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label} ({d.width}×{d.height})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="iPad">
                  {ipads.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label} ({d.width}×{d.height})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <label style={{ fontSize: "14px", fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
                Wallpaper URL
              </label>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginBottom: "8px" }}>
                Copy this URL and use it in Shortcuts app with "Get Contents of URL" action.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  readOnly
                  value={wallpaperUrl}
                  style={{
                    flex: 1,
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "#000000",
                    padding: "8px 16px",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.9)",
                    fontFamily: "monospace",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    padding: "8px 24px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: copied ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "background 0.2s",
                  }}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              padding: "24px",
            }}
          >
            <h3 style={{ fontWeight: 600, marginBottom: "12px" }}>Setup Instructions</h3>
            <ol
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "14px",
                color: "rgba(255,255,255,0.7)",
                paddingLeft: "20px",
              }}
            >
              <li>Open Shortcuts app → Automation tab → Create new automation</li>
              <li>Choose "Time of Day" → Set to run daily (e.g., 6:00 AM)</li>
              <li>Add "Get Contents of URL" action → Paste the URL above</li>
              <li>Add "Set Wallpaper" action → Choose Lock Screen</li>
            </ol>
          </div>
        </section>

        <footer style={{ marginTop: "48px", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
          <p>Calendar updates automatically. Today is highlighted in white.</p>
        </footer>
      </main>
    </div>
  );
}
