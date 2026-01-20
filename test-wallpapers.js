#!/usr/bin/env node

/**
 * Wallpaper Testing Script
 * Generates test URLs for all layout/device/density/theme combinations
 */

const DEVICE_PRESETS = [
    { id: "iphone-x", label: "iPhone X", width: 1125, height: 2436 },
    { id: "iphone-12", label: "iPhone 12", width: 1170, height: 2532 },
    { id: "iphone-14-pro", label: "iPhone 14 Pro", width: 1179, height: 2556 },
    { id: "iphone-16-pro-max", label: "iPhone 16 Pro Max", width: 1320, height: 2868 },
    { id: "ipad-mini", label: "iPad mini", width: 1488, height: 2266 },
    { id: "ipad-air", label: "iPad Air", width: 1640, height: 2360 },
    { id: "ipad-pro-11", label: "iPad Pro 11\"", width: 1668, height: 2388 },
    { id: "ipad-pro-12-9", label: "iPad Pro 12.9\"", width: 2048, height: 2732 },
];

const LAYOUTS = [
    "months-3x4",
    "months-list",
    "year",
    "weeks",
    "days-left",
    "daily-quote",
    "minimal-date"
];

const DENSITIES = ["cozy", "compact"];
const THEMES = ["minimal-black", "dark-gray", "navy-blue"];

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

console.log("# Wallpaper Test URLs\n");
console.log(`Base URL: ${BASE_URL}\n`);
console.log(`Total combinations: ${DEVICE_PRESETS.length} devices × ${LAYOUTS.length} layouts × ${DENSITIES.length} densities × ${THEMES.length} themes = ${DEVICE_PRESETS.length * LAYOUTS.length * DENSITIES.length * THEMES.length} URLs\n`);

// Generate key test combinations (not all 336 combinations)
console.log("## Key Test Combinations\n");

// Test each layout with default settings on key devices
console.log("### Layout Tests (Default Settings)\n");
const keyDevices = ["iphone-16-pro-max", "iphone-12", "ipad-pro-11"];
keyDevices.forEach(deviceId => {
    const device = DEVICE_PRESETS.find(d => d.id === deviceId);
    console.log(`\n#### ${device.label}\n`);

    LAYOUTS.forEach(layout => {
        const url = `${BASE_URL}/months?width=${device.width}&height=${device.height}&density=cozy&layout=${layout}&theme=minimal-black`;
        console.log(`- **${layout}**: ${url}`);
    });
});

// Test density variations on one layout
console.log("\n\n### Density Tests (Months 3x4 Grid)\n");
keyDevices.forEach(deviceId => {
    const device = DEVICE_PRESETS.find(d => d.id === deviceId);
    console.log(`\n#### ${device.label}\n`);

    DENSITIES.forEach(density => {
        const url = `${BASE_URL}/months?width=${device.width}&height=${device.height}&density=${density}&layout=months-3x4&theme=minimal-black`;
        console.log(`- **${density}**: ${url}`);
    });
});

// Test theme variations on one layout
console.log("\n\n### Theme Tests (Months 3x4 Grid)\n");
const testDevice = DEVICE_PRESETS.find(d => d.id === "iphone-16-pro-max");
THEMES.forEach(theme => {
    const url = `${BASE_URL}/months?width=${testDevice.width}&height=${testDevice.height}&density=cozy&layout=months-3x4&theme=${theme}`;
    console.log(`- **${theme}**: ${url}`);
});

// Edge case tests
console.log("\n\n### Edge Case Tests\n");
console.log("\n#### Smallest Device (iPhone X)\n");
const smallest = DEVICE_PRESETS.find(d => d.id === "iphone-x");
LAYOUTS.forEach(layout => {
    const url = `${BASE_URL}/months?width=${smallest.width}&height=${smallest.height}&density=compact&layout=${layout}&theme=minimal-black`;
    console.log(`- **${layout}**: ${url}`);
});

console.log("\n#### Largest Device (iPad Pro 12.9\")\n");
const largest = DEVICE_PRESETS.find(d => d.id === "ipad-pro-12-9");
LAYOUTS.forEach(layout => {
    const url = `${BASE_URL}/months?width=${largest.width}&height=${largest.height}&density=cozy&layout=${layout}&theme=minimal-black`;
    console.log(`- **${layout}**: ${url}`);
});

console.log("\n\n## Quick Test Commands\n");
console.log("```bash");
console.log("# Start dev server");
console.log("npm run dev");
console.log("");
console.log("# Generate test URLs");
console.log("node test-wallpapers.js");
console.log("");
console.log("# Build for production");
console.log("npm run build");
console.log("```");
