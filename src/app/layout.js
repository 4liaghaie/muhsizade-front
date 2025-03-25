// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // adjust path if needed
import Footer from "@/components/Footer"; // import the Footer component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Saeed Muhsinzade",
  description: "Saeed Muhsinzade Photography potfolio",
};

export default async function RootLayout({ children }) {
  // Fetch categories from Strapi
  const res = await fetch(
    "https://api.muhsinzade.com/api/categories?populate=*"
  );
  const json = await res.json();
  const categories = json.data; // Adjust this if your API structure differs

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar categories={categories} />
        {/* Main content takes up remaining space */}
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
