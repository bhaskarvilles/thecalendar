export type DevicePreset = {
  id: string;
  label: string;
  family: "iphone" | "ipad";
  width: number;
  height: number;
};

// Note: dimensions are portrait wallpaper sizes (approximate but practical),
// users can always fine‑tune width/height in the URL if needed.
export const DEVICE_PRESETS: DevicePreset[] = [
  // iPhone X / XS / 11 Pro family
  {
    id: "iphone-x",
    label: "iPhone X / XS / 11 Pro",
    family: "iphone",
    width: 1125,
    height: 2436,
  },
  // iPhone XR / 11
  {
    id: "iphone-xr",
    label: "iPhone XR / 11",
    family: "iphone",
    width: 828,
    height: 1792,
  },
  // iPhone XS Max / 11 Pro Max
  {
    id: "iphone-xs-max",
    label: "iPhone XS Max / 11 Pro Max",
    family: "iphone",
    width: 1242,
    height: 2688,
  },
  // iPhone 12 / 12 Pro / 13 / 14
  {
    id: "iphone-12",
    label: "iPhone 12 / 12 Pro / 13 / 14",
    family: "iphone",
    width: 1170,
    height: 2532,
  },
  // iPhone 12 mini / 13 mini
  {
    id: "iphone-12-mini",
    label: "iPhone 12 mini / 13 mini",
    family: "iphone",
    width: 1080,
    height: 2340,
  },
  // iPhone 12 Pro Max / 13 Pro Max
  {
    id: "iphone-12-pro-max",
    label: "iPhone 12 Pro Max / 13 Pro Max",
    family: "iphone",
    width: 1284,
    height: 2778,
  },
  // iPhone 14 Plus / 15 Plus
  {
    id: "iphone-14-plus",
    label: "iPhone 14 Plus / 15 Plus",
    family: "iphone",
    width: 1284,
    height: 2778,
  },
  // iPhone 14 Pro
  {
    id: "iphone-14-pro",
    label: "iPhone 14 Pro",
    family: "iphone",
    width: 1179,
    height: 2556,
  },
  // iPhone 14 Pro Max / 15 Pro Max / 16 Pro Max / 17 Pro Max (future‑proof)
  {
    id: "iphone-16-pro-max",
    label: "iPhone 14 Pro Max / 15 / 16 / 17 Pro Max",
    family: "iphone",
    width: 1320,
    height: 2868,
  },
  // iPad mini 8.3"
  {
    id: "ipad-mini",
    label: "iPad mini 8.3\"",
    family: "ipad",
    width: 1488,
    height: 2266,
  },
  // iPad Air 10.9"
  {
    id: "ipad-air",
    label: "iPad Air 10.9\"",
    family: "ipad",
    width: 1640,
    height: 2360,
  },
  // iPad Pro 11"
  {
    id: "ipad-pro-11",
    label: "iPad Pro 11\"",
    family: "ipad",
    width: 1668,
    height: 2388,
  },
  // iPad Pro 12.9"
  {
    id: "ipad-pro-12-9",
    label: "iPad Pro 12.9\"",
    family: "ipad",
    width: 2048,
    height: 2732,
  },
];

