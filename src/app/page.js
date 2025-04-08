"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import OverlayModal from "@/components/OverlayModal";
import styles from "./[category]/page.module.css";

export default function Home() {
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 25; // adjust if needed

  // Function to fetch images for a given page
  async function fetchImages(pageNumber) {
    setIsFetching(true);
    try {
      const res = await fetch(
        `https://api.muhsinzade.com/api/images?populate=*&pagination[page]=${pageNumber}&pagination[pageSize]=${pageSize}`
      );
      const json = await res.json();

      // Sort images by position (or id)
      const sortedImages = json.data.sort(
        (a, b) => (a.position || 0) - (b.position || 0)
      );

      // Map to include intrinsic dimensions
      const mappedImages = sortedImages.map((item) => {
        const { width, height } = item.image || {};
        return {
          ...item,
          originalWidth: width,
          originalHeight: height,
        };
      });

      // If fewer images than pageSize are returned, we've reached the end.
      if (sortedImages.length < pageSize) {
        setHasMore(false);
      }

      // Append new images to the existing array
      setImages((prev) => [...prev, ...mappedImages]);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsFetching(false);
    }
  }

  // Initial load and load on page change
  useEffect(() => {
    fetchImages(page);
  }, [page]);

  // Auto scroll: load next page when near bottom of the page.
  useEffect(() => {
    function handleScroll() {
      if (isFetching || !hasMore) return;
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 100
      ) {
        setPage((prev) => prev + 1);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore]);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex !== null) {
        if (e.key === "ArrowLeft") {
          setSelectedImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
          );
        } else if (e.key === "ArrowRight") {
          setSelectedImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
          );
        } else if (e.key === "Escape") {
          setSelectedImageIndex(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, images.length]);

  const openModal = (index) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const showPrev = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const showNext = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentImage =
    selectedImageIndex !== null ? images[selectedImageIndex] : null;

  return (
    <div className="w-full p-4">
      {/* Responsive grid that expands to fill the screen */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {images.map((item, index) => {
          const { id, Title, alt, image, originalWidth, originalHeight, BW } =
            item;
          const imageUrl = image?.url
            ? image.url.startsWith("http")
              ? image.url
              : `https://api.muhsinzade.com${image.url}`
            : null;

          // Fixed width for grid items; compute dynamic height based on aspect ratio
          const fixedWidth = 600;
          const dynamicHeight =
            originalWidth && originalHeight
              ? (originalHeight / originalWidth) * fixedWidth
              : 400;

          return (
            <div
              key={id}
              className="m-3 mb-10 overflow-hidden cursor-pointer"
              onClick={() => openModal(index)}
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
            </div>
          );
        })}
      </div>

      {/* Loading spinner */}
      {isFetching && (
        <div className="flex justify-center my-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
              style={{
                maxHeight: "90vh",
                width: "auto",
              }}
            />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center p-2">
              {currentImage.Title}
            </div>
          </div>
        )}
      </OverlayModal>
    </div>
  );
}
