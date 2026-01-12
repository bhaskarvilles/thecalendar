"use client";

import { useMemo, useState } from "react";
import { DEVICE_PRESETS } from "@/lib/devices";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Copy, Check, Smartphone, Tablet, Settings, HelpCircle, ExternalLink, Sparkles, Calendar, Zap, BookOpen, Moon, Sun, QrCode, Download } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Density = "cozy" | "compact";
type Layout = "months-3x4" | "months-list" | "year" | "weeks" | "days-left" | "daily-quote" | "minimal-date";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [origin, setOrigin] = useState<string>("");

  const [deviceId, setDeviceId] = useState<string>("iphone-16-pro-max");
  const [density, setDensity] = useState<Density>("cozy");
  const [layout, setLayout] = useState<Layout>("months-3x4");
  const [wallpaperTheme, setWallpaperTheme] = useState<"minimal-black" | "dark-gray" | "navy-blue">("minimal-black");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    setOrigin(window.location.origin);
  }, []);

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
      theme: wallpaperTheme,
    });
    return `${origin}/months?${search.toString()}`;
  }, [origin, device, density, layout, wallpaperTheme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + C to copy URL
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !e.shiftKey) {
        const selection = window.getSelection()?.toString();
        if (!selection) {
          e.preventDefault();
          handleCopy();
        }
      }
      // Ctrl/Cmd + D to download
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        handleDownload();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [wallpaperUrl]);

  // Reset preview loading when URL changes
  useEffect(() => {
    setPreviewLoading(true);
  }, [wallpaperUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallpaperUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch(wallpaperUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendar-wallpaper-${device.label.replace(/\s+/g, '-').toLowerCase()}-${layout}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  // Quick device presets
  const quickPresets = [
    { id: "iphone-16-pro-max", label: "iPhone 16 Pro Max" },
    { id: "iphone-15-pro", label: "iPhone 15 Pro" },
    { id: "iphone-14-pro", label: "iPhone 14 Pro" },
  ];

  const iphones = DEVICE_PRESETS.filter((d) => d.family === "iphone");
  const ipads = DEVICE_PRESETS.filter((d) => d.family === "ipad");

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
        {/* Header with Badges */}
        <header className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 md:mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 flex-wrap animate-in fade-in slide-in-from-bottom-2 duration-700">
                <Badge variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500/70 transition-all duration-300 hover:scale-105 cursor-default">
                  <Sparkles className="size-3 mr-1 animate-pulse" />
                  Auto-Update Daily
                </Badge>
                <Badge variant="secondary" className="bg-red-500/10 text-red-300 border-red-500/20 hover:bg-red-500/15 hover:border-red-500/30 transition-all duration-300 hover:scale-105 cursor-default">
                  <Calendar className="size-3 mr-1" />
                  {new Date().getFullYear()} Calendar
                </Badge>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-2 bg-gradient-to-r from-foreground via-foreground to-red-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-3 duration-700">
                  Minimal Calendar Wallpaper
                </h1>
                <p className="text-base text-muted-foreground max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                  Generate a pitch-black calendar wallpaper that updates daily. Perfect for iOS lock screens with Shortcuts automation.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {mounted && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="border-border"
                    >
                      {theme === "dark" ? (
                        <Sun className="size-4" />
                      ) : (
                        <Moon className="size-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Switch to {theme === "dark" ? "light" : "dark"} theme</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/calendar-wallpaper.shortcut';
                      link.download = 'calendar-wallpaper.shortcut';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="size-4 mr-2" />
                    Shortcut
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download iOS Shortcut file for easy setup</p>
                </TooltipContent>
              </Tooltip>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                    <BookOpen className="size-4 mr-2" />
                    Setup Guide
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-2xl bg-background border-border overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-foreground">
                      <HelpCircle className="size-5" />
                      Complete Setup Guide
                    </SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                      Step-by-step instructions to set up your calendar wallpaper with iOS Shortcuts
                    </SheetDescription>
                  </SheetHeader>

                  <div className="mt-6 space-y-6">
                    {/* Wallpaper URL Section */}
                    <Card className="border-border bg-card">
                      <CardHeader>
                        <CardTitle className="text-base text-foreground">Your Wallpaper URL</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Copy this URL to use in Shortcuts
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            value={wallpaperUrl}
                            readOnly
                            className="font-mono text-xs bg-background border-border text-foreground"
                            suppressHydrationWarning
                          />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopy}
                                className="border-red-400/60 hover:bg-red-500/15"
                              >
                                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copied ? "Copied!" : "Copy URL"}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {device.width} × {device.height}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {layout}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {density}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Separator className="bg-border" />

                    {/* Setup Steps */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Setup Instructions</h3>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="step1">
                          <AccordionTrigger className="text-foreground">Step 1: Create Automation</AccordionTrigger>
                          <AccordionContent>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                              <li>Open <strong className="text-foreground">Shortcuts</strong> app on your iPhone/iPad</li>
                              <li>Navigate to the <strong className="text-foreground">Automation</strong> tab at the bottom</li>
                              <li>Tap the <strong className="text-foreground">+</strong> button in the top right corner</li>
                              <li>Select <strong className="text-foreground">Time of Day</strong> from the trigger options</li>
                            </ol>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="step2">
                          <AccordionTrigger className="text-foreground">Step 2: Configure Schedule</AccordionTrigger>
                          <AccordionContent>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                              <li>Choose when the automation should run (e.g., <strong className="text-foreground">6:00 AM</strong>)</li>
                              <li>Set the repeat frequency to <strong className="text-foreground">Daily</strong></li>
                              <li>Enable the <strong className="text-foreground">Run Immediately</strong> toggle</li>
                              <li>Tap <strong className="text-foreground">Create New Shortcut</strong> to proceed</li>
                            </ol>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="step3">
                          <AccordionTrigger className="text-foreground">Step 3: Add URL Action</AccordionTrigger>
                          <AccordionContent>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                              <li>In the shortcut editor, tap <strong className="text-foreground">+</strong> to add an action</li>
                              <li>Search for and add <strong className="text-foreground">Get Contents of URL</strong> action</li>
                              <li>Paste the URL from above into the URL field</li>
                              <li>Ensure the method is set to <strong className="text-foreground">GET</strong> (should be default)</li>
                              <li>Verify the URL is correct and tap <strong className="text-foreground">Done</strong></li>
                            </ol>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="step4">
                          <AccordionTrigger className="text-foreground">Step 4: Set Wallpaper</AccordionTrigger>
                          <AccordionContent>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                              <li>Add another action: <strong className="text-foreground">Set Wallpaper Photo</strong></li>
                              <li>Choose <strong className="text-foreground">Lock Screen</strong> as the target</li>
                              <li>Tap the arrow next to the action to expand options</li>
                              <li>Disable <strong className="text-foreground">Crop to Subject</strong> toggle</li>
                              <li>Disable <strong className="text-foreground">Show Preview</strong> toggle</li>
                              <li>Tap <strong className="text-foreground">Done</strong> to save the automation</li>
                            </ol>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    <Separator className="bg-border" />

                    {/* Tips and Notes */}
                    <div className="space-y-4">
                      <Alert className="border-dashed border-border bg-muted">
                        <AlertTitle className="text-sm text-foreground">Quick Visual Check</AlertTitle>
                        <AlertDescription className="text-xs mt-2 text-muted-foreground">
                          Before setting up the automation, open the URL in Safari first to preview the calendar.
                          If it looks slightly zoomed or cropped, try switching between <strong className="text-foreground">Cozy</strong> and
                          <strong className="text-foreground"> Compact</strong> density, or manually adjust the
                          <code className="mx-1 px-1 bg-muted rounded text-foreground">width</code> and
                          <code className="mx-1 px-1 bg-muted rounded text-foreground">height</code> values in the URL.
                        </AlertDescription>
                      </Alert>

                      <Alert className="border-red-500/20 bg-red-500/5">
                        <Tablet className="size-4 text-red-400" />
                        <AlertTitle className="text-red-300 text-sm">iPad Users</AlertTitle>
                        <AlertDescription className="text-red-200/80 text-xs mt-2">
                          For landscape lock screens, swap the <code className="mx-1 px-1 bg-red-500/20 rounded text-foreground">width</code> ↔
                          <code className="mx-1 px-1 bg-red-500/20 rounded text-foreground">height</code> values in the URL and re-run the automation.
                        </AlertDescription>
                      </Alert>

                      <Alert className="border-border bg-muted">
                        <Zap className="size-4 text-muted-foreground" />
                        <AlertTitle className="text-sm text-foreground">Pro Tips</AlertTitle>
                        <AlertDescription className="text-xs mt-2 text-muted-foreground space-y-1">
                          <p>• The wallpaper updates automatically every day at your chosen time</p>
                          <p>• Make sure your device is connected to the internet for the automation to work</p>
                          <p>• You can test the automation manually by running it from the Shortcuts app</p>
                          <p>• The calendar shows dots for all dates, with only today's date in a red circle</p>
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <Alert className="border-red-500/20 bg-red-500/5 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-300">
            <Zap className="size-4 text-red-400" />
            <AlertTitle className="text-red-300">Minimal Design</AlertTitle>
            <AlertDescription className="text-red-200/80">
              Pitch black background with white text. Only today's date is highlighted in red.
            </AlertDescription>
          </Alert>
        </header>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="builder" className="w-full animate-in fade-in duration-700 delay-500">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-4 sm:mb-6 bg-muted border-border">
            <TabsTrigger value="builder" className="gap-2 data-[state=active]:bg-red-500/10 data-[state=active]:text-red-400 transition-all duration-300">
              <Settings className="size-4" />
              Builder & Guide
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2 data-[state=active]:bg-red-500/10 data-[state=active]:text-red-400 transition-all duration-300">
              <ExternalLink className="size-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Main Configuration */}
              <div className="space-y-6">
                <Card className="border-border bg-card backdrop-blur hover:border-red-500/20 transition-all duration-500 hover:shadow-lg hover:shadow-red-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="size-5 text-red-400" />
                      Configuration
                    </CardTitle>
                    <CardDescription>
                      Customize your calendar wallpaper settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Device Selection */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="device" className="text-sm font-semibold flex items-center gap-2">
                          <Smartphone className="size-4" />
                          Device Model
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {device.family === "iphone" ? "iPhone" : "iPad"}
                        </Badge>
                      </div>
                      <Select value={deviceId} onValueChange={setDeviceId}>
                        <SelectTrigger id="device" className="w-full bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border text-popover-foreground">
                          <SelectGroup>
                            <SelectLabel className="flex items-center gap-2 text-muted-foreground font-semibold">
                              <Smartphone className="size-4" />
                              iPhone (X → 17 Pro Max)
                            </SelectLabel>
                            {iphones.map((d) => (
                              <SelectItem key={d.id} value={d.id} className="text-foreground hover:bg-accent focus:bg-accent">
                                {d.label} ({d.width}×{d.height})
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel className="flex items-center gap-2 text-muted-foreground font-semibold">
                              <Tablet className="size-4" />
                              iPad
                            </SelectLabel>
                            {ipads.map((d) => (
                              <SelectItem key={d.id} value={d.id} className="text-foreground hover:bg-accent focus:bg-accent">
                                {d.label} ({d.width}×{d.height})
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="size-3 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Portrait wallpaper dimensions. Adjust width/height in URL if needed.</p>
                          </TooltipContent>
                        </Tooltip>
                        Portrait dimensions optimized for lock screen
                      </p>

                      {/* Quick Device Switcher */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Label className="text-xs text-muted-foreground w-full">Quick Select:</Label>
                        {quickPresets.map((preset) => (
                          <Button
                            key={preset.id}
                            variant={deviceId === preset.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setDeviceId(preset.id)}
                            className={`text-xs h-7 transition-all duration-300 ${deviceId === preset.id
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400"
                              }`}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-border" />

                    {/* Layout Selection */}
                    <div className="space-y-3">
                      <Label htmlFor="layout" className="text-sm font-semibold">
                        Layout Style
                      </Label>
                      <Select value={layout} onValueChange={(value) => setLayout(value as Layout)}>
                        <SelectTrigger id="layout" className="w-full bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border text-popover-foreground">
                          <SelectItem value="months-3x4" className="text-foreground hover:bg-accent focus:bg-accent">
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">Months 3×4 Grid</span>
                              <span className="text-xs text-muted-foreground">Recommended - Best visibility</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="months-list" className="text-foreground hover:bg-accent focus:bg-accent">
                            Months List - Vertical layout
                          </SelectItem>
                          <SelectItem value="year" className="text-foreground hover:bg-accent focus:bg-accent">
                            Year View - Compact overview
                          </SelectItem>
                          <SelectItem value="weeks" className="text-foreground hover:bg-accent focus:bg-accent">
                            Weeks View - All 52 weeks
                          </SelectItem>
                          <SelectItem value="days-left" className="text-foreground hover:bg-accent focus:bg-accent">
                            Days Left - Countdown focus
                          </SelectItem>
                          <SelectItem value="daily-quote" className="text-foreground hover:bg-accent focus:bg-accent">
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">Daily Quote</span>
                              <span className="text-xs text-muted-foreground">Random inspirational quote</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="minimal-date" className="text-foreground hover:bg-accent focus:bg-accent">
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">Minimal Date</span>
                              <span className="text-xs text-muted-foreground">Just today's date in large typography</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Alert className="border-blue-500/20 bg-blue-500/5">
                        <AlertDescription className="text-xs">
                          {layout === "months-3x4" && "Best visibility: months in a 3×4 grid for easy scanning."}
                          {layout === "months-list" && "Traditional vertical layout with all months stacked."}
                          {layout === "year" && "Compact year overview showing all 365 days as dots."}
                          {layout === "weeks" && "Weekly view showing all 52 weeks of the year."}
                          {layout === "days-left" && "Focus on remaining days with countdown visualization."}
                          {layout === "daily-quote" && "Random inspirational quote that changes each time, perfect for daily motivation."}
                          {layout === "minimal-date" && "Ultra-minimal design showing only today's date in beautiful typography."}
                        </AlertDescription>
                      </Alert>
                    </div>

                    <Separator className="bg-border" />

                    {/* Density Selection with Radio Group */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Density</Label>
                      <RadioGroup value={density} onValueChange={(value) => setDensity(value as Density)} className="grid grid-cols-2 gap-3">
                        <div>
                          <RadioGroupItem value="cozy" id="cozy" className="peer sr-only" />
                          <Label
                            htmlFor="cozy"
                            className={`flex flex-col items-center justify-center rounded-lg border-2 p-3 sm:p-4 cursor-pointer transition-all ${density === "cozy"
                              ? "border-red-500 bg-red-500/15 shadow-[0_0_30px_rgba(255,0,0,0.4)]"
                              : "border-border bg-muted hover:border-border/80"
                              }`}
                          >
                            <span className="text-sm font-medium mb-1">Cozy</span>
                            <span className="text-xs text-muted-foreground text-center">More breathing room</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="compact" id="compact" className="peer sr-only" />
                          <Label
                            htmlFor="compact"
                            className={`flex flex-col items-center justify-center rounded-lg border-2 p-3 sm:p-4 cursor-pointer transition-all ${density === "compact"
                              ? "border-red-500 bg-red-500/15 shadow-[0_0_30px_rgba(255,0,0,0.4)]"
                              : "border-border bg-muted hover:border-border/80"
                              }`}
                          >
                            <span className="text-sm font-medium mb-1">Compact</span>
                            <span className="text-xs text-muted-foreground text-center">Fits more detail</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator className="bg-border" />

                    {/* Theme Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Wallpaper Theme</Label>
                      <RadioGroup value={wallpaperTheme} onValueChange={(value) => setWallpaperTheme(value as typeof wallpaperTheme)} className="grid grid-cols-3 gap-2">
                        <div>
                          <RadioGroupItem value="minimal-black" id="minimal-black" className="peer sr-only" />
                          <Label
                            htmlFor="minimal-black"
                            className={`flex flex-col items-center justify-center rounded-lg border-2 p-3 cursor-pointer transition-all ${wallpaperTheme === "minimal-black"
                              ? "border-red-500 bg-red-500/15 shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                              : "border-border bg-muted hover:border-border/80"
                              }`}
                          >
                            <div className="size-8 rounded-full bg-black border-2 border-white/20 mb-2"></div>
                            <span className="text-xs font-medium text-center">Pitch Black</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="dark-gray" id="dark-gray" className="peer sr-only" />
                          <Label
                            htmlFor="dark-gray"
                            className={`flex flex-col items-center justify-center rounded-lg border-2 p-3 cursor-pointer transition-all ${wallpaperTheme === "dark-gray"
                              ? "border-red-500 bg-red-500/15 shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                              : "border-border bg-muted hover:border-border/80"
                              }`}
                          >
                            <div className="size-8 rounded-full bg-[#0a0a0a] border-2 border-white/20 mb-2"></div>
                            <span className="text-xs font-medium text-center">Dark Gray</span>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem value="navy-blue" id="navy-blue" className="peer sr-only" />
                          <Label
                            htmlFor="navy-blue"
                            className={`flex flex-col items-center justify-center rounded-lg border-2 p-3 cursor-pointer transition-all ${wallpaperTheme === "navy-blue"
                              ? "border-blue-500 bg-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                              : "border-border bg-muted hover:border-border/80"
                              }`}
                          >
                            <div className="size-8 rounded-full bg-[#0f172a] border-2 border-blue-500/30 mb-2"></div>
                            <span className="text-xs font-medium text-center">Navy Blue</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>

                {/* URL Output */}
                <Card className="border-border bg-card/50 hover:border-red-500/20 transition-all duration-500 hover:shadow-lg hover:shadow-red-500/5">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Copy className="size-4 text-red-400" />
                      Wallpaper URL
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Copy this URL for your Shortcuts automation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Generated URL</Label>
                      <div className="flex gap-2">
                        <Input
                          value={wallpaperUrl}
                          readOnly
                          className="font-mono text-xs bg-background border-border"
                          suppressHydrationWarning
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={handleCopy}
                              className="border-red-400/60 hover:bg-red-500/15 transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              {copied ? <Check className="size-4 text-green-500 animate-in zoom-in duration-300" /> : <Copy className="size-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copied ? "Copied!" : "Copy URL"}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Resolution</span>
                        <Badge variant="secondary">
                          {device.width} × {device.height}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Layout</span>
                        <Badge variant="outline">{layout}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Density</span>
                        <Badge variant="outline">{density}</Badge>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* QR Code Dialog */}
                      <Dialog open={showQR} onOpenChange={setShowQR}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 group"
                          >
                            <QrCode className="size-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                            QR Code
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <QrCode className="size-5 text-red-400" />
                              Scan QR Code
                            </DialogTitle>
                            <DialogDescription>
                              Scan this QR code with your phone to quickly access the wallpaper URL
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center justify-center p-6 bg-white rounded-lg">
                            <QRCodeSVG
                              value={wallpaperUrl}
                              size={256}
                              level="H"
                              includeMargin={true}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => setShowQR(false)}
                            >
                              Close
                            </Button>
                            <Button
                              variant="default"
                              className="flex-1 bg-red-500 hover:bg-red-600"
                              onClick={handleCopy}
                            >
                              {copied ? <Check className="size-4 mr-2" /> : <Copy className="size-4 mr-2" />}
                              {copied ? "Copied!" : "Copy URL"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Download Button */}
                      <Button
                        variant="outline"
                        onClick={handleDownload}
                        disabled={downloading}
                        className="hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 group"
                      >
                        <Download className={`size-4 mr-2 ${downloading ? 'animate-bounce' : 'group-hover:scale-110'} transition-transform duration-300`} />
                        {downloading ? "Downloading..." : "Download"}
                      </Button>
                    </div>

                    <Button
                      className="w-full hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 group"
                      onClick={() => window.open(wallpaperUrl, "_blank")}
                      variant="outline"
                    >
                      <ExternalLink className="size-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      Preview in New Tab
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Live Preview - Desktop Only (hidden on mobile/tablet) */}
              <div className="hidden lg:block space-y-6">
                <Card className="border-border bg-card sticky top-6 hover:border-red-500/20 transition-all duration-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <ExternalLink className="size-4 text-red-400" />
                      Live Preview
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Real-time preview of your wallpaper
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* iPhone Device Frame */}
                    <div className="relative mx-auto" style={{ width: '280px' }}>
                      {/* Device outer frame */}
                      <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl">
                        {/* Device screen bezel */}
                        <div className="relative bg-black rounded-[2.5rem] overflow-hidden">
                          {/* Notch */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-40 h-7 bg-black rounded-b-3xl flex items-center justify-center">
                            <div className="w-16 h-1.5 bg-gray-900 rounded-full"></div>
                          </div>

                          {/* Screen content */}
                          <div className="relative aspect-[9/19.5] bg-black overflow-hidden">
                            {previewLoading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                                <div className="flex flex-col items-center gap-3">
                                  <div className="size-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                  <p className="text-xs text-muted-foreground">Loading preview...</p>
                                </div>
                              </div>
                            )}
                            <div className="w-full h-full" style={{
                              transform: `scale(${280 / device.width})`,
                              transformOrigin: 'top left',
                              width: `${device.width}px`,
                              height: `${device.height}px`,
                            }}>
                              <iframe
                                key={wallpaperUrl}
                                src={wallpaperUrl}
                                className="w-full h-full border-0"
                                title="Calendar Preview"
                                onLoad={() => setPreviewLoading(false)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Side buttons */}
                        <div className="absolute -left-1 top-24 w-1 h-8 bg-gray-700 rounded-l"></div>
                        <div className="absolute -left-1 top-36 w-1 h-12 bg-gray-700 rounded-l"></div>
                        <div className="absolute -left-1 top-52 w-1 h-12 bg-gray-700 rounded-l"></div>
                        <div className="absolute -right-1 top-32 w-1 h-16 bg-gray-700 rounded-r"></div>
                      </div>

                      {/* Device label */}
                      <div className="text-center mt-3 text-xs text-muted-foreground">
                        {device.label}
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        onClick={() => window.open(wallpaperUrl, "_blank")}
                        variant="outline"
                        className="w-full hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 group"
                        size="sm"
                      >
                        <ExternalLink className="size-3 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                        Open Full Size
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="size-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  View your calendar wallpaper in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* iPhone Device Frame */}
                <div className="relative mx-auto" style={{ width: '280px' }}>
                  {/* Device outer frame */}
                  <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl">
                    {/* Device screen bezel */}
                    <div className="relative bg-black rounded-[2.5rem] overflow-hidden">
                      {/* Notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-40 h-7 bg-black rounded-b-3xl flex items-center justify-center">
                        <div className="w-16 h-1.5 bg-gray-900 rounded-full"></div>
                      </div>

                      {/* Screen content */}
                      <div className="relative aspect-[9/19.5] bg-black overflow-hidden">
                        <div className="w-full h-full" style={{
                          transform: `scale(${280 / device.width})`,
                          transformOrigin: 'top left',
                          width: `${device.width}px`,
                          height: `${device.height}px`,
                        }}>
                          <iframe
                            src={wallpaperUrl}
                            className="w-full h-full border-0"
                            title="Calendar Preview"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Side buttons */}
                    <div className="absolute -left-1 top-24 w-1 h-8 bg-gray-700 rounded-l"></div>
                    <div className="absolute -left-1 top-36 w-1 h-12 bg-gray-700 rounded-l"></div>
                    <div className="absolute -left-1 top-52 w-1 h-12 bg-gray-700 rounded-l"></div>
                    <div className="absolute -right-1 top-32 w-1 h-16 bg-gray-700 rounded-r"></div>
                  </div>

                  {/* Device label */}
                  <div className="text-center mt-3 text-xs text-muted-foreground">
                    {device.label}
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <Button
                    onClick={() => window.open(wallpaperUrl, "_blank")}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <ExternalLink className="size-4 mr-2" />
                    Open Full Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guide Tab - Now integrated into Builder */}
          <TabsContent value="guide" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="size-5" />
                  Setup Guide
                </CardTitle>
                <CardDescription>
                  The setup guide is now available in the Builder tab for easier access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>
                    The setup guide has been moved to the Builder tab. Please use the Builder tab to see the complete guide alongside your configuration.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Once deployed (e.g. to Vercel), use the live domain in your Shortcuts URL
                and your lock screen will stay in sync with the year.
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  <Smartphone className="size-3 mr-1" />
                  iPhone X → 17 Pro Max
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Tablet className="size-3 mr-1" />
                  Modern iPads
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href={wallpaperUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                <ExternalLink className="size-4" />
                Test URL
              </a>
            </Button>
          </div>
        </footer>
      </main>
    </div>
  );
}
