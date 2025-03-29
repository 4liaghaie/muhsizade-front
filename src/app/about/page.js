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
      <div className={styles.aboutContainer}>
        <main className={styles.container}>
          <h1 className="ml-10 text-5xl mb-10">About Us</h1>
          <div
            className="ml-10"
            dangerouslySetInnerHTML={{ __html: aboutContent }}
          />
        </main>
        <div className={styles.stickyImage}>
          <div className={styles.circleWrapper}>
            <Image
              src="/static-image.jpg"
              alt="Static image"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout: visible on smaller screens */}
    </>
  );
}
