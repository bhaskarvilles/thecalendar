 "use client";

import { useMemo, useState } from "react";
import { DEVICE_PRESETS } from "@/lib/devices";

type Density = "cozy" | "compact";
type Layout = "months-3x4" | "months-list" | "year" | "weeks" | "days-left";

export default function Home() {
  const [origin] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "https://your-domain.com";
  });
  const [deviceId, setDeviceId] = useState<string>("iphone-16-pro-max");
  const [density, setDensity] = useState<Density>("cozy");
  const [layout, setLayout] = useState<Layout>("months-3x4");
  const [copied, setCopied] = useState(false);

  const device = useMemo(
    () => DEVICE_PRESETS.find((d) => d.id === deviceId) ?? DEVICE_PRESETS[0],
    [deviceId]
  );

  const wallpaperUrl = useMemo(() => {
    const search = new URLSearchParams({
      width: String(device.width),
      height: String(device.height),
      density,
      layout,
    });
    return `${origin}/months?${search.toString()}`;
  }, [origin, device, density, layout]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallpaperUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const iphones = DEVICE_PRESETS.filter((d) => d.family === "iphone");
  const ipads = DEVICE_PRESETS.filter((d) => d.family === "ipad");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#020617] to-black text-white">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 md:px-8 md:py-10">
        <header className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              YEARLY LOCKSCREEN CALENDAR
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Minimal calendar wallpaper
            </h1>
            <p className="max-w-xl text-sm text-white/60 md:text-base">
              Pitch black background with text-only calendar. Pick your device and get the URL for your iOS Shortcuts automation.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70">
            <p className="font-semibold tracking-wide">
              Minimal text-only design
            </p>
            <p className="mt-1 text-[11px] text-white/50">
              Pitch black background with white text
            </p>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* Left: builder controls */}
          <div className="space-y-5 rounded-2xl border border-white/10 bg-[#050816]/80 p-4 shadow-[0_22px_60px_rgba(0,0,0,0.75)] backdrop-blur">
            <h2 className="text-base font-semibold md:text-lg">
              1. Choose your device & layout
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.16em] text-white/50">
                  Device model
                </label>
                <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/40 p-2 text-sm">
                  <select
                    className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-sm outline-none ring-0 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                  >
                    <optgroup label="iPhone (X → 17 Pro Max)">
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
                  <p className="text-[11px] text-white/50">
                    These are portrait wallpaper sizes. You can still tweak{" "}
                    <code>width</code> and <code>height</code> in the URL if you
                    like.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.16em] text-white/50">
                  Layout style
                </label>
                <select
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2.5 text-sm outline-none ring-0 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/50"
                  value={layout}
                  onChange={(e) => setLayout(e.target.value as Layout)}
                >
                  <option value="months-3x4">
                    Months 3×4 Grid (recommended) - 12 months in 3 columns, 4 rows
                  </option>
                  <option value="months-list">
                    Months List - Vertical list of all months
                  </option>
                  <option value="year">Year View - Compact overview of all days</option>
                  <option value="weeks">Weeks View - All weeks of the year</option>
                  <option value="days-left">Days Left - Focus on remaining days</option>
                </select>
                <p className="text-[11px] text-white/50">
                  {layout === "months-3x4" &&
                    "Best visibility: months arranged in a 3×4 grid for easy scanning."}
                  {layout === "months-list" &&
                    "Traditional vertical layout with all months stacked."}
                  {layout === "year" &&
                    "Compact year overview showing all 365 days as dots."}
                  {layout === "weeks" &&
                    "Weekly view showing all 52 weeks of the year."}
                  {layout === "days-left" &&
                    "Focus on remaining days with countdown visualization."}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.16em] text-white/50">
                  Density
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDensity("cozy")}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      density === "cozy"
                        ? "border-emerald-400 bg-emerald-500/15 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                        : "border-white/10 bg-black/40 text-white/70 hover:border-white/25"
                    }`}
                  >
                    Cozy
                    <span className="block text-[11px] font-normal text-white/60">
                      More breathing room
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDensity("compact")}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      density === "compact"
                        ? "border-emerald-400 bg-emerald-500/15 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                        : "border-white/10 bg-black/40 text-white/70 hover:border-white/25"
                    }`}
                  >
                    Compact
                    <span className="block text-[11px] font-normal text-white/60">
                      Fits more detail
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4">
              <h3 className="text-sm font-semibold">2. Wallpaper URL</h3>
              <p className="text-xs text-white/60">
                Paste this into the{" "}
                <span className="font-medium text-white">
                  “Get Contents of URL”
                </span>{" "}
                action inside Shortcuts.
              </p>
              <div className="flex flex-col gap-2 rounded-xl border border-white/15 bg-black/60 p-3 text-xs font-mono text-white/70 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1 truncate" suppressHydrationWarning>
                  {wallpaperUrl}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="mt-2 inline-flex items-center justify-center rounded-lg border border-emerald-400/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100 transition hover:bg-emerald-500/15 md:mt-0"
                >
                  {copied ? "Copied" : "Copy URL"}
                </button>
              </div>
            </div>
          </div>

          {/* Right: guidance */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-[#050816]/70 p-4">
            <h2 className="text-base font-semibold md:text-lg">
              3. Hook it up in Shortcuts
            </h2>
            <ol className="space-y-3 text-xs text-white/70 md:text-sm">
              <li>
                Open{" "}
                <span className="font-semibold text-white">Shortcuts</span> →
                go to the{" "}
                <span className="font-semibold text-white">Automation</span>{" "}
                tab → tap <span className="font-semibold text-white">+</span> →
                <span className="font-semibold text-white">Time of Day</span>.
              </li>
              <li>
                Choose when it should run (e.g.{" "}
                <span className="font-semibold text-white">6:00 AM</span>) →
                repeat <span className="font-semibold text-white">Daily</span> →
                enable{" "}
                <span className="font-semibold text-white">
                  Run Immediately
                </span>{" "}
                → tap{" "}
                <span className="font-semibold text-white">
                  Create New Shortcut
                </span>
                .
              </li>
              <li>
                Add{" "}
                <span className="font-semibold text-white">
                  Get Contents of URL
                </span>{" "}
                → paste the URL from the left.
              </li>
              <li>
                Add{" "}
                <span className="font-semibold text-white">
                  Set Wallpaper Photo
                </span>{" "}
                → choose{" "}
                <span className="font-semibold text-white">Lock Screen</span>.
                Tap the arrow and disable{" "}
                <span className="font-semibold text-white">
                  Crop to Subject
                </span>{" "}
                and{" "}
                <span className="font-semibold text-white">Show Preview</span>.
              </li>
            </ol>

            <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/40 p-3 text-[11px] text-white/60">
              <p className="font-semibold text-white/80">
                Optional: quick visual check
              </p>
              <p className="mt-1">
                Open the URL in Safari first. If the calendar looks slightly
                zoomed or cropped, switch between{" "}
                <span className="font-semibold text-white">Cozy</span> and{" "}
                <span className="font-semibold text-white">Compact</span> or
                tweak the <code>width</code>/<code>height</code> values.
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-gradient-to-br from-emerald-500/20 via-sky-500/10 to-transparent p-3 text-[11px] text-white/75">
              <p className="font-semibold text-white">Tip for iPad users</p>
              <p className="mt-1">
                For landscape lock screens, swap the values in the URL (
                <code>width</code> ↔ <code>height</code>) and re‑run the
                automation.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-8 flex flex-col gap-2 text-[11px] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            Once deployed (e.g. to Vercel), use the live domain in your
            Shortcuts URL and your lock screen will stay in sync with the year.
          </p>
          <p>Supports iPhone X → 17 Pro Max and modern iPads out of the box.</p>
        </footer>
      </main>
    </div>
  );
}
