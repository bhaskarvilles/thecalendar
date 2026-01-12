import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  title: "Calendar Wallpaper Generator | Auto-Updating iOS Lock Screens",
  description: "Generate minimal, auto-updating calendar wallpapers for iPhone and iPad. Perfect for iOS lock screens with Shortcuts automation. Choose from multiple layouts and themes.",
  keywords: ["calendar wallpaper", "iOS lock screen", "iPhone wallpaper", "iPad wallpaper", "auto-updating calendar", "minimal calendar", "shortcuts automation"],
  authors: [{ name: "Calendar Wallpaper Generator" }],
  openGraph: {
    title: "Calendar Wallpaper Generator",
    description: "Create beautiful, minimal calendar wallpapers that auto-update daily",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calendar Wallpaper Generator",
    description: "Generate minimal, auto-updating calendar wallpapers for iOS",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
