// app/about/page.js

import Image from "next/image";
import styles from "./page.module.css";

// 1. Async function to fetch the about data
async function getAboutData() {
  // Replace with your actual endpoint
  const res = await fetch("https://api.muhsinzade.com/api/about?populate=*");

  if (!res.ok) {
    throw new Error("Failed to fetch About data");
  }

  // Return the JSON response
  return res.json();
}

// 2. This is a Server Component that fetches and renders about text
export default async function About() {
  // 3. Fetch data from your API
  const data = await getAboutData();

  // 4. Extract the relevant content. Adjust based on your API response shape.
  const aboutContent = data?.data.About_text || "No content found.";

  return (
    <>
      {/* Desktop Layout: visible on md and larger screens */}
      <div className="hidden md:flex">
        <main className={styles.container}>
          <h1
            className="ml-10 text-5xl mb-10"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.6)" }}
          >
            About Us
          </h1>
          <div
            className="ml-10"
            dangerouslySetInnerHTML={{ __html: aboutContent }}
          />
        </main>
        <div className={styles.stickyImage}>
          <Image
            src="/static-image.jpg"
            alt="Static image"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Mobile Layout: visible on smaller screens */}
      <div className="relative w-full h-screen md:hidden">
        <Image
          src="/static-image.jpg"
          alt="Static image"
          fill
          style={{ objectFit: "cover" }}
        />
        {/* Overlay for text with a slight dark tint and text shadow */}
        <div className="absolute inset-0 flex flex-col justify-center p-4 bg-black bg-opacity-30">
          <h1
            className="text-4xl font-bold text-white mb-6"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.6)" }}
          >
            About Us
          </h1>
          <div
            className="text-white"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.6)" }}
            dangerouslySetInnerHTML={{ __html: aboutContent }}
          />
        </div>
      </div>
    </>
  );
}
