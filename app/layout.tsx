import type { Metadata } from "next";
import "./globals.css";
import { Masthead } from "@/components/layout/Masthead";

export const metadata: Metadata = {
  title: "Build Times",
  description:
    "A Next.js and Tailwind CSS recreation of Eduardo Bouças' Build Times website",
  openGraph: {
    title: "Build Times",
    description:
      "A Next.js and Tailwind CSS recreation of Eduardo Bouças' Build Times website",
    url: "https://eduardoboucas.com",
    siteName: "Build Times",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css?family=Playfair+Display:400,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Masthead />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
