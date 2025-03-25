"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import OverlayModal from "../../components/OverlayModal";
import styles from "./page.module.css";

export default function CategoryGallery() {
  const { category } = useParams();
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Fetch images when the category changes
  useEffect(() => {
    if (!category) return;

    async function fetchImages() {
      const res = await fetch(
        `https://api.muhsinzade.com/api/images?populate=*&filters[categories][Title][$eq]=${encodeURIComponent(
          category
        )}`
      );
      const json = await res.json();

      // Optional: sort by id
      const sortedImages = json.data.sort(
        (a, b) => (a.position || 0) - (b.position || 0)
      );

      // Map to include original dimensions for intrinsic layout
      const mappedImages = sortedImages.map((item) => {
        const { width, height } = item?.image || {};
        return {
          ...item,
          originalWidth: width,
          originalHeight: height,
        };
      });

      setImages(mappedImages);
    }

    fetchImages();
  }, [category]);

  // Optional: Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex !== null) {
        if (e.key === "ArrowLeft") {
          showPrev();
        } else if (e.key === "ArrowRight") {
          showNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, images]);

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
    <div className="container mx-auto p-4">
      {/* Masonry layout for images */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 3xl:columns-5 gap-6">
        {images.map((item, index) => {
          const { id, Title, alt, image, originalWidth, originalHeight, BW } =
            item;
          const imageUrl = image?.url
            ? image.url.startsWith("http")
              ? image.url
              : `https://api.muhsinzade.com${image.url}`
            : null;

          // Use a fixed width and compute height based on aspect ratio
          const fixedWidth = 600;
          const dynamicHeight =
            originalWidth && originalHeight
              ? (originalHeight / originalWidth) * fixedWidth
              : 400;

          return (
            <div
              key={id}
              className="m-3 mb-10 overflow-hidden shadow-lg cursor-pointer"
              onClick={() => openModal(index)}
            >
              {imageUrl ? (
                <Image
                  // Only apply the galleryImage class when BW is true
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

      {/* Overlay Modal: Pass navigation callbacks and the current image */}
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
