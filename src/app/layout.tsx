import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans, Dancing_Script, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AnimationProvider from "@/components/providers/AnimationProvider";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${syne.variable} ${plusJakartaSans.variable} ${dancingScript.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
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
