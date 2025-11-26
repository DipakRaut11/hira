import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { Navbar } from "../components/Navbar";
import ContactInfo from "@/components/footer/ContactInfo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <ContactInfo />
      </body>
    </html>
  );
}