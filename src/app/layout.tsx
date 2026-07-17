import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AnimationProvider from "@/components/providers/AnimationProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CureLogics — Engineering the Logic Behind Automation",
  description: "CureLogics designs and ships the software, systems, and intelligent automation that let ambitious teams move faster.",
  metadataBase: new URL("https://curelogics.com"), // fallback placeholder
  openGraph: {
    title: "CureLogics — Engineering the Logic Behind Automation",
    description: "CureLogics designs and ships the software, systems, and intelligent automation that let ambitious teams move faster.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-black text-[#eaf1fb] antialiased" suppressHydrationWarning>
        <AnimationProvider>
          {children}
        </AnimationProvider>
      </body>
    </html>
  );
}
