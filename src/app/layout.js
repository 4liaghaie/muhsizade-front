// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // adjust path if needed
import Footer from "@/components/Footer"; // import the Footer component
import { Providers } from "./providers"; // ← import the client wrapper
import Head from "next/head";

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
    "https://api.muhsinzade.com/api/categories?populate=*",
    { next: { revalidate: 10 } }
  );
  const json = await res.json();
  const categories = json.data;
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* Google Font preload/link */}
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;500&family=Geist+Mono&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased min-h-screen flex flex-col font-geist-sans">
        <Providers>
          <Navbar categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
