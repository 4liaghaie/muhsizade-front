"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import OverlayModal from "@/components/OverlayModal";
import ReferencesList from "@/components/ReferencesList";

import styles from "./[category]/page.module.css";
async function getReferencesData() {
  const res = await fetch(
    "https://api.muhsinzade.com/api/references?populate=*",
    { cache: "no-store" } // Disable caching to always get fresh data
  );
  if (!res.ok) {
    throw new Error("Failed to fetch references");
  }
  return res.json();
}
export default function Home() {
  const [references, setReferences] = useState([]);
  const [refError, setRefError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "https://api.muhsinzade.com/api/references?populate=*",
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch references");
        const json = await res.json();
        setReferences(json.data); // ← save only what you need
      } catch (err) {
        setRefError(err);
      }
    }
    load();
  }, []);
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 25; // adjust if needed

  // ──────────────────────────────────────────────────────────
  // Fetch only images where `home === true`
  // ──────────────────────────────────────────────────────────
  async function fetchImages(pageNumber) {
    if (!hasMore) return;
    setIsFetching(true);
    const qs = new URLSearchParams({
      populate: "*",
      "filters[home][$eq]": "true", // ← only “home: true” items
      "pagination[page]": pageNumber,
      "pagination[pageSize]": pageSize,
    });

    try {
      const res = await fetch(`https://api.muhsinzade.com/api/images?${qs}`);
      const json = await res.json();

      // Filter by `home` flag (supports either flat or attributes-based shape)
      const homeOnly = json.data.filter(
        (item) => item.home === true || item.attributes?.home === true
      );

      // Sort images by `position` (fallback to id)
      const sorted = homeOnly.sort(
        (a, b) => (a.position || 0) - (b.position || 0)
      );

      // Map to include intrinsic dimensions
      const mapped = sorted.map((item) => {
        const { width, height } = item.image || {};
        return {
          ...item,
          originalWidth: width,
          originalHeight: height,
        };
      });

      // If API returns fewer than pageSize, we assume no more pages
      if (json.data.length < pageSize) setHasMore(false);

      // Append filtered+sorted list
      setImages((prev) => [...prev, ...mapped]);
    } catch (err) {
      console.error("Error fetching images", err);
    } finally {
      setIsFetching(false);
    }
  }

  // Initial + paginated loads -------------------------------------------
  useEffect(() => {
    fetchImages(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Infinite scroll loader ----------------------------------------------
  useEffect(() => {
    function handleScroll() {
      if (isFetching || !hasMore) return;
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 100
      ) {
        setPage((p) => p + 1);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore]);

  // Modal keyboard navigation -------------------------------------------
  useEffect(() => {
    function handleKey(e) {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowLeft") {
        setSelectedImageIndex((idx) =>
          idx === 0 ? images.length - 1 : idx - 1
        );
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex((idx) =>
          idx === images.length - 1 ? 0 : idx + 1
        );
      } else if (e.key === "Escape") {
        setSelectedImageIndex(null);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedImageIndex, images.length]);

  // Helpers --------------------------------------------------------------
  const openModal = (index) => setSelectedImageIndex(index);
  const closeModal = () => setSelectedImageIndex(null);
  const showPrev = () =>
    setSelectedImageIndex((idx) => (idx === 0 ? images.length - 1 : idx - 1));
  const showNext = () =>
    setSelectedImageIndex((idx) => (idx === images.length - 1 ? 0 : idx + 1));

  const currentImage =
    selectedImageIndex !== null ? images[selectedImageIndex] : null;

  // ──────────────────────────────────────────────────────────
  // JSX
  // ──────────────────────────────────────────────────────────

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {images.map((item, index) => {
          const { id, Title, alt, image, originalWidth, originalHeight, BW } =
            item;

          const imageUrl = image?.url
            ? image.url.startsWith("http")
              ? image.url
              : `https://api.muhsinzade.com${image.url}`
            : null;

          const fixedWidth = 600;
          const dynamicHeight =
            originalWidth && originalHeight
              ? (originalHeight / originalWidth) * fixedWidth
              : 400;

          const randomX = Math.floor(Math.random() * 200 - 100);
          const randomY = Math.floor(Math.random() * 200 - 100);

          return (
            <motion.div
              key={id}
              className="m-3 mb-10 overflow-hidden cursor-pointer"
              onClick={() => openModal(index)}
              initial={{ opacity: 0, x: randomX, y: randomY }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: index * 0.05,
              }}
            >
              {imageUrl ? (
                <Image
                  className={BW ? styles.galleryImage : styles.imageHover}
                  src={imageUrl}
                  alt={alt || Title || "Gallery Image"}
                  width={fixedWidth}
                  height={dynamicHeight}
                  layout="responsive"
                />
              ) : (
                <div className="p-4">No image available</div>
              )}
            </motion.div>
          );
        })}
      </div>

      {isFetching && (
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <OverlayModal
        isOpen={currentImage !== null}
        onClose={closeModal}
        onPrev={currentImage ? showPrev : null}
        onNext={currentImage ? showNext : null}
      >
        {currentImage && (
          <div className="relative inline-block">
            <Image
              src={
                currentImage.image.url.startsWith("http")
                  ? currentImage.image.url
                  : `https://api.muhsinzade.com${currentImage.image.url}`
              }
              alt={currentImage.alt || currentImage.Title || "Gallery Image"}
              layout="intrinsic"
              width={currentImage.originalWidth || 800}
              height={currentImage.originalHeight || 600}
              style={{ maxHeight: "90vh", width: "auto" }}
            />
          </div>
        )}
      </OverlayModal>
      <ReferencesList references={references} />
    </div>
  );
}
