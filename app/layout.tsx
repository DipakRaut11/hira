import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { Navbar } from "../components/Navbar";
import ContactInfo from "@/components/footer/ContactInfo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js Project",
  description: "Basic folder structure demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Navbar />
        {/* main must be flex-grow so footer sits at bottom */}
        <main className="flex-grow">
          {children}
        </main>

        {/* footer (ContactInfo) lives outside main so it's always after content) */}
        <ContactInfo />
      </body>
    </html>
  );
}
