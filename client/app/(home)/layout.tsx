import type { Metadata } from "next";
import { Montserrat, Rubik } from "next/font/google";
import "@/app/globals.css";
import "@/styles/containers.css";
import "@/styles/text.css";
import "@/styles/gradients.css"
import { Footer } from "@/components/layout/footer/Footer";
import { Navbar } from "@/components/layout/navbar/Navbar";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saas",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${montserrat.variable} ${rubik.variable}`}>
      <Navbar/>
      {children}
      <Footer/>

    </div>
  );
}
