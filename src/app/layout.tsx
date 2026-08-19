import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "birtravel MVP",
  description: "birtravel trip planning MVP for the Birbank ecosystem.",
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
