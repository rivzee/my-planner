import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import XPToast from "@/components/XPToast";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Rivanzee — Personal Planner",
  description: "Aplikasi perencanaan pribadi — rencanakan hari, minggu, bulan, dan tahun lebih efektif dengan bantuan AI.",
  manifest: "/manifest.json",
  appleWebApp: { title: "Rivanzee", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#16A34A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body suppressHydrationWarning className="min-h-screen">
        <script
          dangerouslySetInnerHTML={{
             __html: `if ('serviceWorker' in navigator) {
               window.addEventListener('load', function() {
                 navigator.serviceWorker.register('/sw.js').then(function() {
                   console.log('SW Registered');
                 });
               });
             }`
          }}
        />
        {/* forcedTheme="dark" locks theme permanently */}
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <AuthProvider>
            {children}
            <XPToast />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
