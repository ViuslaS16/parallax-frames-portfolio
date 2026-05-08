import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Parallax Frames | EDM Event Photography",
  description: "An interactive archive of nightlife culture. Immersive event photography capturing the chaos and energy of the dancefloor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground lg:cursor-none">
        <CustomCursor />
        <SmoothScrolling>
          <Navigation />
          {children}
          <Footer />
        </SmoothScrolling>
      </body>
    </html>
  );
}
