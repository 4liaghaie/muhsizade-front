"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import OverlayModal from "@/components/OverlayModal";
import styles from "./[category]/page.module.css";
export default function Home() {
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Fetch and sort images on mount
  useEffect(() => {
    async function fetchImages() {
      const res = await fetch(
        "http://api.muhsinzade.com/api/images?populate=*"
      );
      const json = await res.json();

      // Sort images by ID (if desired)
      const sortedImages = json.data.sort((a, b) => a.id - b.id);

      // Extract width & height from each image so we can use them for the modal
      const mappedImages = sortedImages.map((item) => {
        const { width, height } = item.image || {};
        return {
          ...item,
          originalWidth: width,
          originalHeight: height,
        };
      });

      setImages(mappedImages);
    }
    fetchImages();
  }, []);

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
  // The currently selected image
  const currentImage =
    selectedImageIndex !== null ? images[selectedImageIndex] : null;

  return (
    <div className="container mx-auto p-4">
      {/* Masonry-like columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 3xl:columns-5 gap-6">
        {images.map((item, index) => {
          const { id, Title, alt, image, originalWidth, originalHeight, BW } =
            item;
          const imageUrl = image?.url
            ? image.url.startsWith("http")
              ? image.url
              : `http://api.muhsinzade.com${image.url}`
            : null;

          // Fixed width in the grid; compute height by aspect ratio (if available)
          const fixedWidth = 600;
          const dynamicHeight =
            originalWidth && originalHeight
              ? (originalHeight / originalWidth) * fixedWidth
              : 400; // fallback

          return (
            <div
              key={id}
              className="m-3 mb-10 overflow-hidden shadow-lg cursor-pointer"
              onClick={() => openModal(index)}
            >
              {imageUrl ? (
                <Image
                  className={BW ? styles.galleryImage : ""}
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
                  : `http://api.muhsinzade.com${currentImage.image.url}`
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
