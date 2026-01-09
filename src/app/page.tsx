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
import { Copy, Check, Smartphone, Tablet, Settings, HelpCircle, ExternalLink, Sparkles, Calendar, Zap, BookOpen, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Density = "cozy" | "compact";
type Layout = "months-3x4" | "months-list" | "year" | "weeks" | "days-left";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
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

  useEffect(() => {
    setMounted(true);
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
        {/* Header with Badges */}
        <header className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 md:mb-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="border-red-500/50 text-red-400">
                  <Sparkles className="size-3 mr-1" />
                  Auto-Update Daily
                </Badge>
                <Badge variant="secondary" className="bg-red-500/10 text-red-300 border-red-500/20">
                  <Calendar className="size-3 mr-1" />
                  {new Date().getFullYear()} Calendar
                </Badge>
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-foreground mb-2">
                  Minimal Calendar Wallpaper
          </h1>
                <p className="text-base text-muted-foreground max-w-2xl">
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
          
          <Alert className="border-red-500/20 bg-red-500/5">
            <Zap className="size-4 text-red-400" />
            <AlertTitle className="text-red-300">Minimal Design</AlertTitle>
            <AlertDescription className="text-red-200/80">
              Pitch black background with white text. Only today's date is highlighted in red.
            </AlertDescription>
          </Alert>
        </header>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-4 sm:mb-6 bg-muted border-border">
            <TabsTrigger value="builder" className="gap-2">
              <Settings className="size-4" />
              Builder & Guide
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <ExternalLink className="size-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Builder Tab */}
          <TabsContent value="builder" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Configuration */}
              <div className="lg:col-span-2 space-y-6">
              <Card className="border-border bg-card backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="size-5" />
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
                      </SelectContent>
                    </Select>
                    <Alert className="border-blue-500/20 bg-blue-500/5">
                      <AlertDescription className="text-xs">
                        {layout === "months-3x4" && "Best visibility: months in a 3×4 grid for easy scanning."}
                        {layout === "months-list" && "Traditional vertical layout with all months stacked."}
                        {layout === "year" && "Compact year overview showing all 365 days as dots."}
                        {layout === "weeks" && "Weekly view showing all 52 weeks of the year."}
                        {layout === "days-left" && "Focus on remaining days with countdown visualization."}
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
                          className={`flex flex-col items-center justify-center rounded-lg border-2 p-3 sm:p-4 cursor-pointer transition-all ${
                            density === "cozy"
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
                          className={`flex flex-col items-center justify-center rounded-lg border-2 p-3 sm:p-4 cursor-pointer transition-all ${
                            density === "compact"
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
                </CardContent>
              </Card>

              {/* URL Output */}
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base">Wallpaper URL</CardTitle>
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
                  <Button
                    className="w-full"
                    onClick={() => window.open(wallpaperUrl, "_blank")}
                    variant="outline"
                  >
                    <ExternalLink className="size-4 mr-2" />
                    Preview in New Tab
                  </Button>
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
                <div className="relative aspect-[9/19.5] w-full max-w-[280px] sm:max-w-sm mx-auto bg-background rounded-2xl overflow-hidden border-4 border-border shadow-2xl">
                  <iframe
                    src={wallpaperUrl}
                    className="w-full h-full border-0"
                    title="Calendar Preview"
                  />
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
