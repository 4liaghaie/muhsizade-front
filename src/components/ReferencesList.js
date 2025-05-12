"use client";

import React, { useState } from "react";
import Image from "next/image";

// Helper to build a complete image URL.
function buildUrl(imageData) {
  const path = imageData?.formats?.medium?.url || imageData?.url;
  if (!path) return null;
  return path.startsWith("/") ? "https://api.muhsinzade.com" + path : path;
}

// Modal component for image gallery
function ReferenceModal({ reference, images, isLoading, onClose }) {
  const lightLogoUrl = buildUrl(reference.logo_light);
  const darkLogoUrl = buildUrl(reference.logo_dark);

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

        {/* Logo: light/dark swap via CSS */}
        <div className="flex justify-center mb-4">
          <div className="relative w-24 h-24">
            {lightLogoUrl && (
              <Image
                src={lightLogoUrl}
                alt={`${reference.title} logo`}
                fill
                style={{ objectFit: "contain" }}
                className="block dark:hidden"
                unoptimized
              />
            )}
            {darkLogoUrl && (
              <Image
                src={darkLogoUrl}
                alt={`${reference.title} logo dark`}
                fill
                style={{ objectFit: "contain" }}
                className="hidden dark:block absolute inset-0"
                unoptimized
              />
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 text-center">
          {reference.title}
        </h2>

        {reference.description && (
          <p className="mb-4 text-center text-gray-700 dark:text-gray-300">
            {reference.description}
          </p>
        )}

        {isLoading ? (
          <p className="text-center">Loading images...</p>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((imgData) => {
              const url = buildUrl(imgData.image);
              return (
                <div key={imgData.id} className="relative w-full h-48">
                  {url && (
                    <Image
                      src={url}
                      alt={imgData.image?.alt || "Reference image"}
                      fill
                      style={{ objectFit: "contain" }}
                      unoptimized
                    />
                  )}
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
  const [selected, setSelected] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = async (ref) => {
    setSelected(ref);
    if (ref.images?.length) {
      setLoading(true);
      try {
        const res = await Promise.all(
          ref.images.map((img) =>
            fetch(
              `https://api.muhsinzade.com/api/images/${img.documentId}?populate=*`
            ).then((r) => r.json())
          )
        );
        setImages(res.map((r) => r.data));
      } catch {
        setImages([]);
      } finally {
        setLoading(false);
      }
    } else {
      setImages([]);
    }
  };

  const closeModal = () => setSelected(null);

  return (
    <div className="text-white min-h-screen px-8 lg:px-60 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {references.map((ref) => {
          const lightUrl = buildUrl(ref.logo_light);
          const darkUrl = buildUrl(ref.logo_dark);

          return (
            <div
              key={ref.id}
              className="flex items-center justify-center cursor-pointer hover:opacity-80"
              onClick={() => handleClick(ref)}
            >
              <div className="relative w-40 h-40 flex-shrink-0">
                {lightUrl && (
                  <Image
                    src={lightUrl}
                    alt={`${ref.title} logo`}
                    fill
                    style={{ objectFit: "contain" }}
                    className="block dark:hidden"
                    unoptimized
                  />
                )}
                {darkUrl && (
                  <Image
                    src={darkUrl}
                    alt={`${ref.title} logo dark`}
                    fill
                    style={{ objectFit: "contain" }}
                    className="hidden dark:block absolute inset-0"
                    unoptimized
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <ReferenceModal
          reference={selected}
          images={images}
          isLoading={loading}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
