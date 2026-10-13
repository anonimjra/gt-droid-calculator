import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "⚡ GT DROID BOT & PASSIVE VEND CALCULATOR • ANIME COMIC EDITION ⚡",
  description:
    "Growtopia Droid Bot Harvest & Break Simulator + Passive Income Vend & HoG Massing Profit Calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:ital,wght@0,700;1,700&family=Mochiy+Pop+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-[#ffde00] selection:text-[#111116]">
        {children}
      </body>
    </html>
  );
}
