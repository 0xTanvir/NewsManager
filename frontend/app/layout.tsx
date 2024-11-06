// app/layout.tsx
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Configure Ubuntu font locally
const ubuntu = localFont({
  src: "./fonts/Ubuntu-Light.woff2",
  variable: "--font-ubuntu",
});

const ubuntuMono = localFont({
  src: "./fonts/UbuntuMono-Regular.woff2", // After converting to woff2
  variable: "--font-ubuntu-mono",
});

export const metadata: Metadata = {
  title: "YPigeon",
  description: "Cut Costs, Not Coverage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ubuntu.variable} ${ubuntuMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
