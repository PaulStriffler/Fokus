import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/nav/AppShell";

export const metadata: Metadata = {
  title: "Fokus",
  description: "Dein persönliches Betriebssystem — Trading, Finanzen, Gym, Ernährung, Weiterbildung.",
  applicationName: "Fokus",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Fokus" },
};

export const viewport: Viewport = {
  themeColor: "#08090c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

// Set theme before first paint to avoid a flash of the wrong theme.
const themeInit = `
(function(){try{
  var t = localStorage.getItem('fokus-theme');
  if(!t){ t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; }
  document.documentElement.setAttribute('data-theme', t);
}catch(e){}})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
