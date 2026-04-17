import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "American Dream Mall Interactive Sales Deck",
  description: "Cinematic entry experience for a premium interactive sales deck.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
