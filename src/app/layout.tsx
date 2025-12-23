import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SDIT Share",
  description: "A simple and secure platform to upload and share files for SDIT College.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
