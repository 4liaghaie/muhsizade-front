"use client";
import { useState } from "react";
import Image from "next/image";

// Helper to build a complete image URL.
function getImageUrl(imageData) {
  let url =
    imageData?.image?.formats?.medium?.url || imageData?.image?.url || "";
  if (url && url.startsWith("/")) {
    url = "https://api.muhsinzade.com" + url;
  }
  return url || "https://via.placeholder.com/300x200?text=No+Image";
}

// Refactored modal component with dark/light mode and reference logo.
function ReferenceModal({ reference, images, isLoading, onClose }) {
  // Build reference logo URL.
  let logoUrl =
    reference.logo?.formats?.medium?.url || reference.logo?.url || "";
  if (logoUrl && logoUrl.startsWith("/")) {
    logoUrl = "https://api.muhsinzade.com" + logoUrl;
  }

  return (
    <div className="bg-white bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 p-6 rounded max-w-3xl w-full relative overflow-y-auto max-h-full">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Reference Logo */}
        {logoUrl && (
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24">
              <Image
                src={logoUrl}
                alt={reference.title}
                fill
                style={{ objectFit: "contain" }}
                unoptimized
              />
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 text-center">
          {reference.title}
        </h2>
        {reference.description && (
          <p className="mb-4  text-center">{reference.description}</p>
        )}

        {isLoading ? (
          <p className="text-center">Loading images...</p>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((imgData) => {
              const imageUrl = getImageUrl(imgData);
              return (
                <div key={imgData.id} className="relative w-full h-48">
                  <Image
                    src={imageUrl}
                    alt={
                      imgData.image?.alt ||
                      imgData.image?.Title ||
                      "Reference image"
                    }
                    fill
                    style={{ objectFit: "contain" }}
                    unoptimized
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center">No images available</p>
        )}
      </div>
    </div>
  );
}

export default function ReferencesList({ references }) {
  const [selectedReference, setSelectedReference] = useState(null);
  const [fetchedImages, setFetchedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Async handler for when a reference is clicked.
  const handleReferenceClick = async (ref) => {
    setSelectedReference(ref);
    setFetchedImages([]);
    if (ref.images?.length) {
      setIsLoading(true);
      try {
        const results = await Promise.all(
          ref.images.map((img) =>
            fetch(
              `https://api.muhsinzade.com/api/images/${img.documentId}?populate=*`
            ).then((res) => res.json())
          )
        );
        setFetchedImages(results.map((result) => result.data));
      } catch (error) {
        console.error("Error fetching image details:", error);
        setFetchedImages([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const closeModal = () => {
    setSelectedReference(null);
    setFetchedImages([]);
  };

  return (
    <div className="text-white min-h-screen px-4 py-8">
      {/* Reference Logos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {references.map((ref) => {
          let logoUrl = ref.logo?.formats?.medium?.url || ref.logo?.url || "";
          if (logoUrl && logoUrl.startsWith("/")) {
            logoUrl = "https://api.muhsinzade.com" + logoUrl;
          }
          return (
            <div
              key={ref.id}
              className="flex items-center justify-center cursor-pointer p-4 hover:opacity-80"
              onClick={() => handleReferenceClick(ref)}
            >
              {logoUrl && (
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={logoUrl}
                    alt={ref.title}
                    fill
                    style={{ objectFit: "contain" }}
                    unoptimized
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Full-Screen Modal */}
      {selectedReference && (
        <ReferenceModal
          reference={selectedReference}
          images={fetchedImages}
          isLoading={isLoading}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
